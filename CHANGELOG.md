# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2019-11-20

### Added

- `UpnpScanData` now includes a `port` property containing the port from the
  `LOCATION` header URL.

### Changed

- `UdpScanData` is now an interface with a `data` property for the scan payload.
- Updated `MdnsScanData` properties for better alignment with **DNS-SD** specification.

### Removed

- `isSecure` flag from `HttpRequestData` and `TcpRequestData`
- Unused mDNS interfaces `ClassType` and `Record`
- Unused proxy interfaces `ProxyDevice` and `LocalProxyDevice`

## [0.1.0] - 2019-07-09

Initial developer preview release.

[0.2.0]: https://github.com/actions-on-google/local-home-sdk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/actions-on-google/local-home-sdk/releases/tag/v0.1.0