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
[Cloud Sync](https://github.com/PaNasMs/module-cloud-sync). Their Go modules pin
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
