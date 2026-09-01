# @dsh-external/dsh-spawn-agent

注册 `spawn_agent` 工具：调用方显式指定 LLM provider + model，在 continuable subagent provider（默认 `spawn`）上启动一个可延续聊天的子代理。与官方 `subagent` 工具的差异只有一点——provider/model 是每次调用的**必填参数**，因此一个父代理可以并行启动多个「不同模型」的子代理，各自独立延续聊天。

## 工具参数

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `description` | 是 | 子代理的短标签（3-5 词），用于展示 |
| `prompt` | 是 | 子代理的自包含任务；它看不到父对话 |
| `provider` | 是 | LLM provider 路由；`list_models` 可用于发现，但不是 allowlist |
| `model` | 是 | 由 provider 解释的模型 id；允许不在本地目录或设置中 |

返回 `{ subagentId }`：用官方 `send_message` 按该 id 继续聊天。模型在创建时锁定，延续时保持不变（模型写进子代理 descriptor，cold resume 时读回）。

## 实现要点

- 建立在官方 `ctx.subagents.startContinuable` 之上，不修改任何官方代码。
- `provider`/`model` 只要求非空。插件不使用 `list_models`、本地模型设置或 adapter metadata 作为创建 allowlist；实际 provider/adapter 在子代理首轮调用时决定能否执行该 id。
- continuable lifecycle 在接收 child inbox 后即可返回 `{ subagentId }`。若 adapter 不支持所选 id，失败会作为该子代理的普通首轮错误返回，而不是被本插件误报成“模型无效”。
- 可配置 `Config.subagentProvider`（默认 `spawn`），cordis.yml 可改承载 provider。

## 构建与安装

```bash
DSH_CHECKOUT=<checkout> bash scripts/build.sh
cd <checkout>
DSH_HOME=<home> pnpm dsh plugin --profile web add /root/dsh-spawn-agent
```

插件自带 Bundle 层，安装后重启对应 profile 即可；不依赖 `super-injector`。
