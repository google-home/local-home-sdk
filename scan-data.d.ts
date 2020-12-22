/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Declares interface to represent scan data that gets send in IDENTIFY. */
declare namespace smarthome {
  namespace IntentFlow {
    /**
     * Data payload returned with an mDNS scan result.
     * For mDNS discovery, the scan data contains fields from the SRV and TXT
     * records advertised by the local device via
     * [DNS-Based Service Discovery
     * (DNS-SD)](https://tools.ietf.org/html/rfc6763).
     *
     * ```typescript
     * const identifyHandler = (request: IntentFlow.IdentifyRequest):
     *   Promise<IntentFlow.IdentifyResponse> => {
     *
     *     // Obtain scan data from protocol defined in your scan config
     *     const device = request.inputs[0].payload.device;
     *     const scanData = device.mdnsScanData;
     *
     *     // TXT key/value pairs for this device
     *     // Extract application-specific parameters
     *     const localDeviceId = scanData.txt.myParameter;
     *     ...
     *   };
     * ```
     *
     */
    interface MdnsScanData {
      /** Fully qualified name of the discovered service. */
      serviceName: string;
      /** Instance name of the service. */
      name: string;
      /** Type of the service. */
      type: string;
      /** Protocol used by the service. Typically either `tcp` or `udp`. */
      protocol: string;
      /** Raw additional TXT data advertised by the service. */
      data: string[];
      /** Key/value pairs advertised in the TXT data of the service. */
      txt: {[key: string]: string};
    }
    /**
     * Data payload returned with a UDP scan result.
     * For UDP discovery, the scan data contains the hex-encoded packet
     * provided by the local device in response to the UDP discovery broadcast.
     *
     * ```typescript
     * const identifyHandler = (request: IntentFlow.IdentifyRequest):
     *   Promise<IntentFlow.IdentifyResponse> => {
     *
     *     // Obtain scan data from protocol defined in your scan config
     *     const device = request.inputs[0].payload.device;
     *     const scanData = device.udpScanData;
     *
     *     // data field is the hex-encoded UDP response packet
     *     const localDeviceId = Buffer.from(scanData.data, 'hex');
     *     ...
     *   };
     * ```
     *
     */
    interface UdpScanData {
      /** Hex-encoded response packet received from the device. */
      data: string;
    }
    /**
     * Data payload returned with a UPnP scan result. For UPnP discovery,
     * the platform initiates an `M-SEARCH` request according to
     * [Simple Service Discovery Protocol
     * (SSDP)](https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol)
     * and returns devices or services matching your scan configuration.
     * The scan data contains the search response from the local device.
     *
     * ```typescript
     * const identifyHandler = (request: IntentFlow.IdentifyRequest):
     *   Promise<IntentFlow.IdentifyResponse> => {
     *
     *     // Obtain scan data from protocol defined in your scan config
     *     const device = request.inputs[0].payload.device;
     *     const scanData = device.upnpScanData;
     *
     *     // UUID advertised by the device over UPnP
     *     const localDeviceId = scanData.deviceId;
     *
     *     // Path to the UPnP device description
     *     const deviceDescription = scanData.location;
     *     ...
     *   };
     * ```
     *
     */
    interface UpnpScanData {
      /**
       * Path component of the URL returned in the `LOCATION` header.
       */
      location: string;
      /**
       * UUID provided in the `USN` field of the search response.
       */
      deviceId: string;
      /**
       * Device type provided in the `ST` field of the search response.
       * Present only if the search request includes a device type.
       */
      deviceType?: string;
      /**
       * Service type provided in the `ST` field of the search response.
       * Present only if the search request includes a service type.
       */
      serviceType?: string;
      /**
       * Port component of the URL returned in the `LOCATION` header.
       */
      port: number;
    }
    /** @hidden Placeholder. Actual implementation depends on integration. */
    interface ScanData {}
  }
}
