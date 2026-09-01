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

## Target-dependent commitments

- When the target runtime supports virtual provider routes through middleware, `spawn_agent` accepts those routes without requiring a registered adapter merely for early validation.
- When the deployment has an explicit authorization allowlist for subagent model use, `spawn_agent` respects that authorization capability. A target without such a policy does not gain one from discovery or adapter configuration.
- When the target's continuable lifecycle accepts an inbox before executing its first provider call, the tool distinguishes child creation from provider success and leaves later failure visible through that lifecycle. A target that executes before returning may report the same adapter failure synchronously instead.

Exact labels, error copy and the carrier provider are not yet locked behavior and may follow the target until the user says one must remain.

## Non-goals

- Replacing the official subagent lifecycle or continuation service.
- Owning the model catalog, credentials, or provider configuration.
- Preserving the injector-based loading mechanism.
