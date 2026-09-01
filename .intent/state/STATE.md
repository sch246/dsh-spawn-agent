# DSH spawn-agent

Status: draft product map for independent selectable-model delegation retained while `super-injector` retires. The current alpha.2 candidate is installed but not yet accepted through a realization lock.

## Product direction

Let a parent Agent start continuable children on caller-selected provider and model identifiers. Different calls may select different models, while each child keeps its original route for later continuation. Discovery tools may help choose identifiers but do not limit what the caller can attempt.

## Required capabilities and verification

- The plugin can be installed and removed through ordinary profile composition without `super-injector`.
- `spawn_agent` requires a self-contained child task, a short child label, and non-empty provider and model identifiers from the caller.
- The plugin does not reject a model because it is absent from `list_models`, a local model catalog or local model settings. It delegates provider/model interpretation to the runtime route used by the child.
- A successful call returns the child id accepted by the official continuable-subagent lifecycle. The parent can continue that child through the ordinary continuation tool.
- Multiple calls may select different provider/model pairs. Continuing one child retains that child's original pair and does not inherit a later call's selection.
- The caller receives ordinary lifecycle failure when admission, persistence, depth, shutdown, cancellation or child creation prevents a continuable child.
- Retiring `super-injector` does not remove or duplicate the capability.

Relevant verification uses the real composed profile to start at least two children on different routes, continue both, and inspect the provider/model actually used. It also attempts an identifier omitted from advisory discovery and distinguishes plugin acceptance from the adapter's later execution decision.

## Current alpha.2 realization map

- Build the package against the selected Harness source checkout so its declarations and runtime imports resolve the same alpha.2 subagent and tool APIs as the profile.
- Install the package checkout through `dsh plugin --profile <name> add <checkout>`. Its package manifest must contribute its own Bundle patch, and the profile must contain both the dependency and the Bundle membership.
- Restart the profile after Bundle membership changes. Confirm the composed config contains exactly one `dsh-spawn-agent` row and no `super-injector` owner for `spawn_agent`.
- Perform the real multi-model and continuation observations above before accepting a realization. Build, profile resolution and child-id creation alone do not establish end-to-end success.

## Conditional avoidance

- `list_models` and local provider model settings must not become a plugin-owned creation allowlist.
- An adapter rejection, cancellation or network failure must not be rewritten as proof that the identifier is invalid.
- The plugin does not promise that every adapter can execute every identifier. In particular, removing plugin preflight cannot make an adapter with a closed executable model set accept an unconfigured model.
- Returning a child id must not be described as proof that its first provider request succeeded; the target continuable lifecycle may accept the inbox before execution.

## Conditional decisions

- If a target runtime supports virtual provider routes through middleware, do not add a registered-adapter prerequisite merely for early validation.
- If the deployment chooses an authorization allowlist for subagent model use, that policy must be applied as an explicit authorization capability rather than inferred from discovery or adapter configuration. This package does not silently invent that policy.
- Exact labels, error copy and the carrier provider may follow the target until the user identifies them as retained behavior.

## Non-goals

- Replacing the official subagent lifecycle or continuation service.
- Owning the model catalog, credentials, or provider configuration.
- Preserving the injector-based loading mechanism.
