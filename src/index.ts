/**
 * @dsh-external/dsh-spawn-agent — 按模型启动可延续子代理。
 *
 * 注册 `spawn_agent` 工具：调用方显式指定 LLM provider + model，在同一个
 * continuable subagent provider（默认 `spawn`）上建立一个可延续聊天的子代理。
 * 与官方 `subagent` 工具的区别仅在于 provider/model 是每次调用的必填参数，
 * 因此一个父代理可以并行启动多个「不同模型」的子代理，各自独立延续。
 *
 * 实现完全建立在官方 `ctx.subagents.startContinuable` 之上：continuable 子代理
 * 的 agentOptions 会被持久化进 descriptor（agentProvider/agentModel），cold resume
 * 时读回，所以 `send_message` 延续时保持创建时锁定的模型。
 */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import z from '@deepseek-ai/schemastery'
// Type-only：让 `ctx.subagents` 的声明合并生效（SubagentRuntime 注册在 dsh-subagent）。
import type {} from '@deepseek-ai/dsh-subagent'

export const name = '@dsh-external/dsh-spawn-agent'
export const inject = ['tools', 'subagents']

export interface Config {
  /** 承载子代理的 subagent provider 名（默认 `spawn`，官方 fresh-child continuable provider）。 */
  subagentProvider: string
}

export const Config: z<Config> = z.object({
  subagentProvider: z.string().default('spawn'),
})

export function apply(ctx: Context, config: Config): void {
  ctx.effect(() => ctx.tools.register(defineTool({
    name: 'spawn_agent',
    description:
      'Spawn a background subagent that runs on a caller-chosen LLM provider + model and stays '
      + 'chat-continuable. Use it to run several children each on a DIFFERENT model in parallel; the '
      + 'returned subagent id is continued with `send_message`. `list_models` is optional discovery: '
      + 'an unlisted provider-interpreted model id may still be used.',
    parameters: {
      description: {
        type: 'string',
        required: true,
        description: 'Short display label for this child (3-5 words).',
      },
      prompt: {
        type: 'string',
        required: true,
        description: 'The self-contained task for the child; it does not see this conversation.',
      },
      provider: {
        type: 'string',
        required: true,
        description: 'LLM provider route for this child; list_models may suggest one but is not an allowlist.',
      },
      model: {
        type: 'string',
        required: true,
        description: 'Provider-interpreted model id; it may be absent from local discovery or settings.',
      },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          subagentId: { type: 'string', required: true },
        },
      },
      render: (args: { model?: string }, value: { subagentId: string }) => [{
        type: 'text',
        text: `started subagent ${value.subagentId} on model ${args.model ?? '(unknown)'}; continue it with send_message`,
      }],
    },
    async execute(args: { description: string; prompt: string; provider: string; model: string }, exec) {
      const parent = exec.agent
      if (!parent) {
        throw new Error('spawn_agent requires a calling agent (exec.agent was undefined)')
      }
      if (args.provider.trim() === '') throw new Error('spawn_agent requires a non-empty provider route')
      if (args.model.trim() === '') throw new Error('spawn_agent requires a non-empty model id')
      const started = await ctx.subagents.startContinuable({
        provider: config.subagentProvider,
        label: args.description,
        request: {
          prompt: [{ type: 'text', text: args.prompt }] as ContentBlock[],
          parent,
          agentOptions: { provider: args.provider, model: args.model },
        },
        signal: exec.signal,
      })
      return { subagentId: started.childId }
    },
  })), '@dsh-external/dsh-spawn-agent: spawn_agent tool')
}
