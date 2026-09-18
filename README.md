# OstojaOS module SDK

Shared Go module host, Linux identity checks, transfer helpers and TypeScript
contracts for the API 1 globals provided by OstojaOS core 0.2.x.
The frontend declarations describe host-provided APIs; do not bundle the core,
React, router or query client in extensions. Pin SDK releases in module builds.

Run `go test -tags pam ./...` on Linux with libpam0g-dev installed.
Original code: PolyForm Noncommercial 1.0.0; see NOTICE for dependencies.
