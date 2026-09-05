# DSH spawn-agent

Status: draft product map for independent selectable-model delegation retained while `super-injector` retires. Earlier records report an installed alpha.2 candidate; its current deployment and semantic acceptance are not established here.

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

## Installation and maintenance map

The recorded target is Harness alpha.2 at the revision in `STATE.json.resources`; it is compatibility evidence, not a permanent runtime requirement or proof of the present deployment. No realization lock is selected. Start here for current effects and operations; selected LOGs explain consequential choices, and any historical LOCK is optional recovery evidence.

### Sources, ownership and data

`src/index.ts` registers `spawn_agent` over the Host continuable-subagent service. `Config.subagentProvider` selects the carrier (currently `spawn`); caller-selected LLM provider/model live in the child descriptor. The Host owns child persistence, continuation, cancellation and execution. This repository carries no Host patch and no separate runtime data store.

The [manifest](../../package.json), [Bundle patch](../../cordis.patch.yml) and [build script](../../scripts/build.sh) own the current executable paths. Read the selected Harness checkout’s `apps/cli/reference/README.md` for profile composition and `docs/development.md` for its build prerequisites. Build against the same checkout that will run the profile, with its dependencies and required peer artifacts ready. Build scripts create local dependency links and `lib/`; these are replaceable outputs, unlike runtime data.

### Build, compose and remove

Set absolute paths and the intended profile; run the build from this plugin checkout. The commands describe installation operations, not actions performed by this document update.

```bash
export DSH_CHECKOUT=/absolute/path/to/deepseek-harness
export DSH_HOME=/absolute/path/to/dsh-home
PROFILE=web
PLUGIN=/absolute/path/to/dsh-spawn-agent
cd "$PLUGIN"
DSH_CHECKOUT="$DSH_CHECKOUT" bash scripts/build.sh
cd "$DSH_CHECKOUT"
pnpm dsh plugin --profile "$PROFILE" add "$PLUGIN"
pnpm dsh plugin --profile "$PROFILE" why @dsh-external/dsh-spawn-agent
pnpm dsh --profile "$PROFILE" --dump-config
```

For a requested removal, use the same environment and run from the Harness checkout:

```bash
pnpm dsh plugin --profile "$PROFILE" remove @dsh-external/dsh-spawn-agent
```

`dsh plugin` maintains the profile dependency, pnpm lockfile, installed resolution and `dsh.profile.bundles` together. After add/update/remove, inspect all four under `$DSH_HOME/profiles/$PROFILE` and the composed config: exactly one `dsh-spawn-agent` row when installed, none when removed. Later profile/home patches replace a row’s complete config, so preserve existing overrides. A running profile retains its startup Bundle set; activation needs an authorized restart, then a fresh-session check for duplicate tool owners, including residual `super-injector` entries. For first install or changed composition, validate a candidate with the target package set in a private Home before changing a managed profile.

### Upgrade and verification

After a Harness upgrade, inspect `startContinuable`, agent options and descriptor/resume behavior in the target before adapting `src/index.ts`. Preserve permissive routing and child identity; a new catalog API is not a reason to add a creation allowlist. If native composition supplies the same tool, choose one owner and remove the duplicate contribution. Add a locally marked, attributable Host patch only if a required effect has no usable native extension; retire it when upstream supplies that effect.

There is no package test script. The build checks TypeScript compatibility; the multi-route, continuation, cold-resume and unlisted-identifier observations above require a composed profile and real provider calls. Include an unavailable route and a cancelled/failed child; a returned id alone is not provider success.

Retain Host sessions and child descriptors. Removal disables future `spawn_agent` calls; it does not erase existing children or their ordinary continuation service.

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
