# Independent selectable-model subagent retention

Date: 2026-09-01

## Authority

During the Harness alpha.2 migration, the user explicitly required retaining `spawn-agent` as the independent provider of a `spawn_agent` tool whose caller can select the model. This desired effect must survive retirement of `super-injector` and must be installed through the ordinary profile composition rather than an injector registry.

## Boundary

The user confirmed per-call model selection, not every current argument name, provider default, error message, description, or implementation choice. Those details remain realization evidence until separately confirmed.
