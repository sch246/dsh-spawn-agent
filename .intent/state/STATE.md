# DSH spawn-agent

Status: draft independent capability selected for retention while `super-injector` retires. No realization lock is accepted.

## Intent

Provide a model-callable `spawn_agent` capability as an independently installed DeepSeek Harness plugin. Each spawn request can select the child model, allowing one parent to delegate to different models without depending on `super-injector`.

## Acceptance

- The plugin can be installed and removed through ordinary profile composition without `super-injector`.
- A model in a profile containing the plugin can call `spawn_agent` with an explicit model selection and receive a continuable child agent.
- Multiple calls may select different models without silently changing an existing child's model.
- Retiring `super-injector` does not remove or duplicate the capability.

## Constraints and decisions

- Model selection must resolve through the running deployment's LLM capabilities rather than a package-owned model list.
- Exact argument names beyond model selection, provider routing, descriptions, error copy, and the default child carrier are not yet user-locked presentation.
- Builds and structural checks are implementation evidence. User observation on the real profile decides semantic acceptance.

## Non-goals

- Replacing the official subagent lifecycle or continuation service.
- Owning the model catalog, credentials, or provider configuration.
- Preserving the injector-based loading mechanism.
