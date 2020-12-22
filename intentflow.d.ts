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

/**
 * Declares request and response interface between local fulfillment apps and
 * the Local Home SDK
 */
declare namespace smarthome {
  /**
   * Encapsulates all intent request and response objects.
   * @preferred
   */
  namespace IntentFlow {
    /**
     * Describes the type of scannable code printed on the device, will be used
     * by the GHA to know how to decode the scanned code.
     * @hidden
     */
    type ScanMode = 'QR_CODE'|'BAR_CODE'|'ALPHA_NUMERIC_CODE';

    // Placeholder interface. Actual implementation depends on integration.
    interface DeviceScanData {}

    interface LocalUnIdentifiedDevice extends DeviceScanData {}

    /**
     * Scan data and device IDs provided by an [[IdentifyRequest]] to the
     * application's `IDENTIFY` handler.
     */
    interface LocalIdentifiedDevice extends DeviceScanData {
      /** Device ID provided in the `SYNC` response. */
      id?: string;
      /**
       * Custom data provided in the `SYNC` response. Not present if
       * the device has `isLocalOnly` set to `true`.
       */
      customData?: unknown;
      /** @hidden Proxy data provided by `PROXY_SELECTED` response */
      proxyData?: unknown;
    }

    /**
     * Request passed to the application's `IDENTIFY` intent handler,
     * containing a [[LocalIdentifiedDevice]] detected by the local
     * scan configuration.
     *
     * See [[IdentifyHandler]] for more details.
     */
    type IdentifyRequest = RequestInterface<LocalIdentifiedDevice>;

    /**
     * Request passed to the application's `REACHABLE_DEVICES` intent handler,
     * containing a [[LocalIdentifiedDevice]] successfully identified as a proxy
     * or hub.
     *
     * See [[ReachableDevicesHandler]] for more details.
     */
    type ReachableDevicesRequest = RequestInterface<LocalIdentifiedDevice>;

    /**
     * Content of the [[IdentifyResponse]] returned by the application's
     * `IDENTIFY` intent handler.
     */
    interface IdentifyResponsePayload extends ResponsePayload {
      device: {
        /** Device ID from `IdentifyRequest` */
        id: string;
        /**
         * Local device ID. This value must match one of the `otherDeviceIds`
         * in the `SYNC` response.
         */
        verificationId?: string;
        /** @hidden Hardware type of the device */
        type?: string;
        /** @hidden Metadata describing the device */
        deviceInfo?: DeviceInfo;
        /**
         * Describes how the device will behave when sent an INDICATE intent.
         * @hidden
         */
        indicationMode?: IndicationMode;
        /**
         * If true, this device can act as a proxy for other devices, enabling
         * the `REACHABLE_DEVICES` intent.
         * This is common for hub devices.
         */
        isProxy?: boolean;
        /**
         * If true, indicates that the device can receive proxy commands from
         * other devices.
         * @hidden
         */
        commandedOverProxy?: boolean;
        /**
         * If true, this device does not appear in the `SYNC` response.
         * This is common for hub devices.
         */
        isLocalOnly?: boolean;
        /**
         * If true, indicates that the BLE device must be bonded to before
         * sending commands.
         * @hidden
         */
        requiresBonding?: boolean;
        /**
         * If true, indicates that a connection to the BLE device should
         * not be established automatically.
         * @hidden
         */
        avoidAutoconnect?: boolean;
        /**
         * If true, indicates that the device is capable of being updated via
         * commands from other devices.
         * @hidden
         */
        canBeUpdatedOverProxy?: boolean;
        /**
         * If true, indicates that the device is capable of being unprovisioned
         * via commands from other devices.
         * @hidden
         */
        canBeUnprovisionedOverProxy?: boolean;

        /**
         * Describes the type of scannable code printed on the device.
         * @hidden
         */
        scanMode?: ScanMode;
        /**
         * If true, the platform will periodically send QUERY intents for the
         * expecting JS to report state.
         */
        willReportStateViaPoll?: boolean;
      };
    }

    /**
     * Content of the [[ReachableDevicesResponse]] returned by the application's
     * `REACHABLE_DEVICES` intent handler.
     */
    interface ReachableDevicesPayload extends ResponsePayload {
      /** List of device identifiers visible to the proxy device. */
      devices: Array<{
        /**
         * Local device ID. Use this value if the reachable device is
         * local-only and is not represented in the `SYNC` response.
         */
        id?: string;
        /**
         * Local device ID. Use this value if the reachable device should
         * match one of the `otherDeviceIds` in the `SYNC` response.
         */
        verificationId?: string;
      }>;
    }

    /**
     * Response returned by the application's `IDENTIFY` intent handler
     * to describe the locally discovered device.
     *
     * See [[IdentifyHandler]] for more details.
     */
    type IdentifyResponse = ResponseInterface<IdentifyResponsePayload>;
    /**
     * Response returned by the application's `REACHABLE_DEVICES` intent handler
     * to describe additional devices visible to the proxy device.
     *
     * See [[ReachableDevicesHandler]] for more details.
     */
    type ReachableDevicesResponse = ResponseInterface<ReachableDevicesPayload>;

    /**
     * Callback registered with the [[App]] via [[App.onIdentify]] to process
     * incoming device discovery requests.
     *
     * To support local fulfillment, the local home platform sends an `IDENTIFY`
     * intent to discover what devices are present locally, then uses the
     * `SYNC` intent to verify with the provider's cloud service that the
     * device is available for local fulfillment.
     *
     * To learn more about how the platform establishes a local fulfillment
     * path, see the [developer guide](/assistant/smarthome/develop/local).
     *
     * ```typescript
     * const identifyHandler = (request: IntentFlow.IdentifyRequest):
     *   IntentFlow.IdentifyResponse => {
     *
     *     // Obtain scan data from protocol defined in your scan config
     *     const device = request.inputs[0].payload.device;
     *     const scanData = device.udpScanData;
     *
     *     // Decode scan data to obtain metadata about local device
     *     const verificationId = "local-device-id";
     *
     *     // Return a response
     *     const response: IntentFlow.IdentifyResponse = {
     *       intent: Intents.IDENTIFY,
     *       requestId: request.requestId,
     *       payload: {
     *         device: {
     *           id: device.id || "",
     *           verificationId, // Must match otherDeviceIds in SYNC response
     *         },
     *       },
     *     };
     *     return response;
     *   };
     * ```
     *
     */
    interface IdentifyHandler extends
        IntentHandler<IdentifyRequest, IdentifyResponse> {}

    /**
     * Callback registered with the [[App]] via [[App.onReachableDevices]] to
     * discover additional devices connected to a proxy or hub.
     *
     * When a device that is discovered by the [[IdentifyHandler]] is a proxy
     * which enables indirect access to other devices (identified by the
     * [[IdentifyResponsePayload.device|isProxy]] flag in the
     * [[IdentifyResponse]]), the local home platform sends a
     * `REACHABLE_DEVICES` intent to discover the additional devices visible
     * to the proxy.
     *
     * To learn more about how the platform verifies reachable devices,
     * see the [developer guide](/assistant/smarthome/develop/local).
     *
     * ```typescript
     * const devicesHandler = (request: IntentFlow.ReachableDevicesRequest):
     *   IntentFlow.ReachableDevicesResponse => {
     *
     *     // Reference to the local proxy device
     *     const proxyDevice = request.inputs[0].payload.device.proxyDevice;
     *
     *     // Query local proxy device for additional visible ids
     *     // ...
     *     const reachableDevices = [
     *       // Each verificationId must match one of the otherDeviceIds
     *       // in the SYNC response
     *       { verificationId: "local-device-id-1" },
     *       { verificationId: "local-device-id-2" },
     *     ];
     *
     *     // Return a response
     *     const response: IntentFlow.ReachableDevicesResponse = {
     *       intent: Intents.REACHABLE_DEVICES,
     *       requestId: request.requestId,
     *       payload: {
     *         devices: reachableDevices,
     *       },
     *     };
     *     return response;
     *   };
     * ```
     *
     */
    interface ReachableDevicesHandler extends
        IntentHandler<ReachableDevicesRequest, ReachableDevicesResponse> {}
  }
}
