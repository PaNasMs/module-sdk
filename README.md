# PaNasMs module SDK

This repository holds the shared code for PaNasMs (Pavlo's NAS Management System) modules, the
packages that users install separately from the core through the panel's Modules page. It has Go
packages for running a module service, checking Linux identities, transferring files, using the
host maintenance lock and requesting external permissions. It also has TypeScript declarations for
the module API 1 globals that core 0.2.x exposes to module pages. The core lives in the
[main repository](https://github.com/PaNasMs/panasms), and the [project website](https://panasms.github.io/)
has user guides and the [module catalog](https://panasms.github.io/module-registry/).

The official modules are [Files](https://github.com/PaNasMs/module-files),
[Terminal](https://github.com/PaNasMs/module-terminal),
[Cloud Sync](https://github.com/PaNasMs/module-cloud-sync) and
[Containers](https://github.com/PaNasMs/module-containers). Each pins an SDK version in its Go
module. When you change a contract here, update and test that dependency in each module.

Module pages follow the
[PaNasMs interface design standard](https://github.com/PaNasMs/panasms/blob/main/docs/ui-design-guidelines.md).

## Contents

| Path | Purpose |
| --- | --- |
| [modulehost](modulehost) | Module service hosting and the `/health` endpoint |
| [auth](auth) | Linux identity and PAM integration |
| [transfer](transfer) | File transfer helpers |
| [modules](modules) | Shared module manifest definitions |
| [userfiles](userfiles) | Default permissions for files that modules create for users |
| [maintenance](maintenance) | Shared host maintenance lock |
| [external](external) | Client for the core's external permission broker |
| [types](types) | TypeScript declarations for the host-provided frontend API |

## Development

You need Linux, Go 1.26 or newer, a C compiler and the PAM headers (`libpam0g-dev` on Debian).

```sh
go test -tags pam ./...
go vet -tags pam ./...
```

The **Test SDK** workflow runs `go test -tags pam ./...` on ARM64 for every push and pull request.

The TypeScript package `@panasms/module-sdk` is private. It supplies declarations only, with no
published runtime. Module bundles must use the React, router and query client instances that the
core provides and must not bundle their own copies. The SDK version, module package version, core
compatibility range and module API version are separate contracts. Check each one when you
release a module.

Package signing and distribution happen in the
[module registry](https://github.com/PaNasMs/module-registry). Signing keys and installable module
archives do not belong in this repository.

## Backend contracts

### Identity checks

`auth.Lookup` accepts administrators only and remains the default for existing modules. A module
that serves ordinary panel users must call `auth.LookupPanel`, enforce Linux file permissions and
authorize each operation itself. Both functions read the current Linux group membership and the
PaNasMs account access policy. The core authenticates the session before it proxies a request. A
module socket must accept connections only from the trusted core peer.

### System maintenance

`maintenance.Acquire()` holds a shared host maintenance lock until you call the release function
it returns. The module host takes the lock for synchronous requests. Every background write,
including timer-driven synchronization, must hold the lock itself for its whole duration and must
reject or defer the work if it cannot acquire the lock. Do not release the lock when you return a
job ID for a job that is still running.

The service unit that the core generates sets `PANASMS_MAINTENANCE_LOCK`. Without this variable
the helper does nothing, which allows standalone development. `/health` reports
`maintenanceVersion: 1` only when the variable is set, and that value promises that every
background writer in the module follows this contract. Core packaging creates the root-owned lock
file. Never delete or replace it while the system is running.

### Files created for users

`userfiles.DefaultUmask()` reads `UMASK` from `/etc/login.defs` and returns 022 when the setting or
the file is missing. An invalid value returns an error. Apply the mask only in a dedicated
per-user worker or child shell. Never change the process mask around concurrent requests in the
module server. Keep service state and secrets private explicitly. Ownership, setgid inheritance
and default ACLs stay with the filesystem, and a user's shell startup files can change the mask
further.

### Passive event subscriptions

Server modules with long-lived read-only event subscriptions can use
`modulehost.ServeWithPassivePaths`. Exclude only GET subscription paths from the activity count.
Never exclude writes or streams that own active work.

### External permissions

The `external` package is the backend client for the core's private Unix token broker.
`types/external.d.ts` describes the host's Google consent component and permission metadata. The
[module permission integration guide](https://github.com/PaNasMs/panasms/blob/main/documentation/external-grants.md)
covers consumer registration, identity ownership, rclone integration and lifecycle requirements.
Refresh tokens and client secrets stay in the core.

## Frontend contracts

### Keeping a module page mounted

Set `keepAlive: true` in the module definition to keep its component mounted after the first
visit. The shell passes an `active` prop, which the component uses for focus and for rendering
that depends on visibility. Switching sections keeps component state and live connections. This
lasts for the browser session only and does not survive a reload. The shell unmounts the component
on sign-out or when administrator access is lost, so release connections in effect cleanup.
Terminal uses `keepAlive` to keep its tabs, shell processes and scrollback.

A module can also register a `backgroundIndicator` component, which the application bar mounts
next to ongoing tasks. Return `null` when idle. The module owns its activity state, accessible
labels, navigation and the confirmation of stop actions.

### Shared dialogs

Use `DialogContent` from `@panasms/ui` inside a Radix Root and Portal with the shared
`dialog-overlay`. Pass an explicit `header` (including the Radix Title and Description), a
`footer` and the body as children. `variant` is `compact`, `form` or `details`. `intent` is
`edit`, `inspect` or `confirm`. The core draws the only close icon, so do not add another close
button to the heading or change its geometry.

Pass a controlled `dirty` boolean for forms with selection buttons or custom editors. The dialog
also tracks native field edits as a fallback. Mark footer buttons that dismiss the dialog with
`data-dialog-cancel`, and the shared container asks about unsaved changes in place. Closing the
dialog through the Root's state after a save still works. Back and step buttons are not dismissal
buttons. Set `dirty={false}` for short-lived selection and read-only inspection. A submit button
in the footer must reference the body's form ID through the HTML `form` attribute.

`busy` shows the shared waiting layer while a submission is unresolved. Do not keep it true while
an accepted background job is still running. Close the dialog and let Tasks show the job. A nested
picker temporarily replaces the visible parent panel and backdrop, and it keeps the parent's draft
and focus return. Dialog styles belong to the core. Before publishing, test module packages against
a core and SDK declarations that include these props, because older published SDK revisions do
not describe them.

### Tasks and other shared components

A module can register a `tasks` component for the shared task list. The host also exposes Radix
Tabs and the policy-aware `FolderPicker` through the SDK.

Modules that contribute `tasks` can also register `taskHistory` with `queryKey`,
`status(): Promise<{ canClear: boolean }>` and `clear(): Promise<unknown>`. The shell includes
these providers in its shared Clear history action, refreshes the task history status and the
given query key, and reports failures. The module backend must handle authorization and save the
change atomically. Clear only finished entries. Keep queued and running tasks and any identifiers
needed for idempotency. Modules without this optional contract keep working.

## Module descriptions

In `manifest.json`, `description` is the short summary shown in module lists. Keep it to one or
two sentences. The optional `longDescription` appears on the module details page and explains the
main capabilities, typical uses, required access and important limitations. Both fields are plain
text, with paragraphs separated by `\n\n`. The panel does not render HTML or Markdown. A detailed
description can have up to 16,000 characters per language.

Put English at the top level and translations under `translations.en`, `translations.ru` and
`translations.uk`, with the same field names. Each field falls back to English on its own. When a
module has no detailed description, the details page shows the localized short summary, so older
packages still display correctly. These fields are part of the signed module manifest. To change
them, publish a new module version. Never rewrite an existing registry release.

## License

Original code is licensed under [PolyForm Noncommercial 1.0.0](LICENSE). See [NOTICE](NOTICE) for
dependencies. Public documentation is in English.
