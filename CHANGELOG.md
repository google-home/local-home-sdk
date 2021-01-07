# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.1] - 2021-01-13

### Fixed

- Bumped development dependencies.
- Fixed dtslint errors.
- Removed obsolete @hidden annotations.

## [1.4.0] - 2020-11-16

### Added

- Support for local handling for the  `QUERY` intent has been added.
- New options have been added to `DeviceManager.send`:
  - `commandTimeout`
  - `retries`
  - `delayInMilliseconds`

### Changed

- The `devices` property of `RequestInterface` has been deprecated and replaced
  with a new `DeviceManager.getRegisteredDevices` method with additional
  properties for:
  - `radioType`
  - `scanData`

## [1.1.0] - 2020-07-15

### Added

- Support for UDP responses has been added to `UdpRequestData`. Set the new
  `expectedResponsePackets` property to capture response packets in the
  `UdpResponseData` payload.

### Changed

- The `headers` string property of `HttpRequestData` has been deprecated and
  replaced with a new `additionalHeaders` property that accepts HTTP headers as
  a structured object.

## [1.0.0] - 2020-04-06

### Added

- New error types to replace use of `ErrorCode`:
  - `DeviceNotSupportedError` - Identified device should not use local fulfillment
  - `DeviceNotIdentifiedError` - Unable to identify provided device
  - `InvalidRequestError` - Unable to process incoming intent

### Changed

- Error types are now reporting in cloud logging.
  See [error logging](https://developers.google.com/assistant/smarthome/develop/error-logging)
  for more details.

### Removed

- `ErrorCode` enum is no longer visible. Use discrete error types, such as
  `InvalidRequestError` to throw errors from your app. `HandlerError` is
  still available for throwing generic fulfillment errors.

## [0.2.1] - 2019-12-09

### Changed

- Update internal typing references to better support resolution in IDEs.

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

[1.1.0]: https://github.com/actions-on-google/local-home-sdk/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/actions-on-google/local-home-sdk/compare/v0.2.1...v1.0.0
[0.2.1]: https://github.com/actions-on-google/local-home-sdk/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/actions-on-google/local-home-sdk/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/actions-on-google/local-home-sdk/releases/tag/v0.1.0
