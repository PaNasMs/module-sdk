# PaNasMs module SDK

Shared building blocks for independently installed PaNasMs modules. The SDK
provides Go module hosting, Linux identity checks and transfer helpers, plus
TypeScript declarations for the API 1 globals exposed by core 0.2.x.

## Contents

| Path | Purpose |
| --- | --- |
| [modulehost](modulehost) | Module service hosting |
| [auth](auth) | Linux identity and PAM integration |
| [transfer](transfer) | File-transfer helpers |
| [modules](modules) | Shared module definitions |
| [types](types) | Host-provided frontend API declarations |

Official modules are [Files](https://github.com/PaNasMs/module-files),
[Terminal](https://github.com/PaNasMs/module-terminal) and
[Cloud Sync](https://github.com/PaNasMs/module-cloud-sync), and
[Containers and applications](https://github.com/PaNasMs/module-containers). Their Go modules pin
SDK versions; update and test the dependency deliberately when changing contracts.

## Identity checks

`auth.Lookup` remains administrator-only for existing modules. Modules that support
ordinary panel users must explicitly use `auth.LookupPanel`, enforce Linux file
permissions and authorize each operation. Both paths read current Linux membership
and PaNasMs account access policy. Core authenticates the session before proxying
a request; module sockets must accept only the trusted core peer.

## Development

Use Linux, Go 1.26 or newer, a C compiler and PAM headers (`libpam0g-dev` on Debian).

```sh
go test -tags pam ./...
go vet -tags pam ./...
```

The TypeScript package is private and supplies declarations, not a separately
published runtime. Module bundles must use the core-provided React, router and
query client rather than bundle duplicate instances. SDK version, module package
version, core compatibility range and module API version are separate contracts;
check each when releasing a module.

See the [registry](https://github.com/PaNasMs/module-registry) for package signing
and distribution. No signing keys or installable module archives belong here.

## License

Public documentation is maintained in English. Original code uses
[PolyForm Noncommercial 1.0.0](LICENSE); see [NOTICE](NOTICE) for dependencies.

## External permissions

The `external` Go package is the backend client for the core's private Unix token
broker. `types/external.d.ts` describes the host's Google consent component and
permission metadata. See the [module permission integration guide](https://github.com/PaNasMs/panasms/blob/main/documentation/external-grants.md)
for consumer registration, identity ownership, rclone integration and lifecycle
requirements. Refresh tokens and client secrets remain in the core.

### Retaining an interactive module page

Set `keepAlive: true` in the module definition to retain its mounted component after the first visit. The shell passes `active` to the component; use it to manage focus and visibility-dependent rendering. Switching sections preserves component state and live connections. This is browser-session retention, not recovery after a reload. The component is unmounted on sign-out or loss of administrator access; release connections in effect cleanup. Terminal uses this capability to retain its tabs, shell processes and scrollback.

Modules may also register an optional `backgroundIndicator` component. The application bar mounts it alongside ongoing tasks. Return `null` when idle; the module owns its activity state, accessible labels, navigation and confirmation of stop actions.


### Shared dialogs

Use `DialogContent` from `@panasms/ui` inside a Radix Root/Portal and the shared
`dialog-overlay`. Supply explicit `header` (including Radix Title/Description),
`footer`, and body children. `variant` is `compact`, `form` or `details`; `intent`
is `edit`, `inspect` or `confirm`. Core supplies the single internal close icon:
do not add another close button to your heading or override its geometry.

Pass a controlled `dirty` boolean for forms with selection buttons or custom
editors. Native field edits are tracked as a fallback. Mark footer dismissal
buttons `data-dialog-cancel`; the shared container then asks about unsaved changes
in place. Programmatic completion via the Root's state remains available after
saving. Back/step changes are not dismissal buttons. Set `dirty={false}` for
transient selection and read-only inspection. Form submit buttons placed in the
footer must reference the body's form ID using the HTML `form` attribute.

`busy` covers unresolved submissions with the shared waiting layer. Do not keep
it true merely because an accepted background job is still running; close the
view and use Tasks. A nested picker temporarily replaces the visible parent
panel/backdrop, retaining its draft and focus return. Dialog styles belong to the
core. Test module packages against the core and SDK declarations that expose
these props before publishing; older published SDK revisions do not describe them.

Modules can register a `tasks` component for the shared task list. The UI host also exposes Radix Tabs and the policy-aware `FolderPicker` through the SDK. Server modules with long-lived read-only event subscriptions can use `ServeWithPassivePaths`; only GET subscription paths may be excluded from the activity count, never mutations or streams owning active work.
