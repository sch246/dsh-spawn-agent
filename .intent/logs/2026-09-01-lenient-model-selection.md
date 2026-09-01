# Lenient model selection

Date: 2026-09-01

## User correction

The user rejected treating an immediate model-resolution failure as a desired guard. Model selection should be as permissive as possible: a caller may intentionally name a model that the provider can serve even when the model is absent from local settings or discovery data.

## Checked reality

DeepSeek Harness declares the general model catalog advisory. `LlmRuntime.resolveModelInfo()` delegates to the selected adapter's exact-model resolver rather than checking catalog membership. The DeepSeek adapter can synthesize metadata for an unlisted model, while the pi-ai adapter requires the model in its local executable model set. The current plugin catches every exact-resolution error, including cancellation and adapter-specific failure, and misreports it as an invalid provider/model before starting the child.

Continuable child creation persists the requested provider/model but does not execute the first provider call before returning the child id. Removing plugin-owned exact-model preflight therefore permits provider-interpreted identifiers but can move a genuine adapter rejection to the child's first turn. The child failure remains observable through the ordinary continuation settlement.

## Decision

`spawn-agent` does not use `list_models`, local model settings, or adapter metadata resolution as a creation allowlist. It accepts non-empty provider and model identifiers and delegates their actual interpretation to the selected runtime route. It must not label a model invalid merely because discovery or local configuration omits it.

The plugin cannot make an adapter execute an identifier that the adapter itself rejects. Changing pi-ai's executable model policy is a separate Host/provider decision, not part of this plugin repair.
