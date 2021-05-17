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

// Minimum TypeScript Version: 3.0

/**
 * Declares request and response interface between local fulfillment apps and
 * the Local Home SDK
 */
declare namespace smarthome {
  /**
   * Smart home intents for discovery and control of local devices.
   */
  enum Intents {
    /**
     * Received when a [[Constants.EventType]] event is sent from the platform.
     * Currently only available for BLE Seamless Setup projects. For more
     * details, see [[EventHandler]].
     */
    EVENT = 'action.devices.EVENT',
    /**
     * Handle an execution request for a device with an established local
     * execution path. For more details, see [[ExecuteHandler]].
     */
    EXECUTE = 'action.devices.EXECUTE',
    /**
     * Report devices discovered using your scan configuration that support
     * local fulfillment. For more details, see [[IdentifyHandler]].
     */
    IDENTIFY = 'action.devices.IDENTIFY',
    /**
     * Sent when the user selects a device on Google Home app before
     * clicking setup. The purpose is to give the user some visual indicator on
     * which device is being set up. Currently only available for BLE Seamless
     * Setup projects. For more details, see [[IndicateHandler]].
     */
    INDICATE = 'action.devices.INDICATE',
    /**
     * A BLE notification is received by the platform. Currently only available
     * for BLE Seamless Setup projects. For more details, see
     * [[ParseNotificationHandler]].
     */
    PARSE_NOTIFICATION = 'action.devices.PARSE_NOTIFICATION',
    /**
     * Sent when the user clicks setup on Google Home app to initiate device
     * setup. Currently only available for BLE Seamless Setup projects. For more
     * details, see [[ProvisionHandler]].
     */
    PROVISION = 'action.devices.PROVISION',
    /**
     * A proxy is selected for reachable devices. For more details, see
     * [[ProxySelectedHandler]].
     */
    PROXY_SELECTED = 'action.devices.PROXY_SELECTED',
    /**
     * Fetch the state of the device.
     * For more details, see [[QueryHandler]].
     */
    QUERY = 'action.devices.QUERY',
    /**
     * Report additional devices connected through a local proxy or hub.
     * For more details, see [[ReachableDevicesHandler]].
     */
    REACHABLE_DEVICES = 'action.devices.REACHABLE_DEVICES',
    /**
     * Sent after a device is provisioned to ask for types and traits
     * information. The purpose of the local intent is equivalent to the SYNC
     * intent sent to your cloud fulfillment, so the logic for locally
     * processing the intent resembles how you handle it in the cloud. Currently
     * only available for BLE Seamless Setup projects. For more details, see
     * [[RegisterHandler]].
     */
    REGISTER = 'action.devices.REGISTER',
    /**
     * Sent when the user chooses to unlink from Google Home app or factory
     * reset your device. Currently only available for BLE Seamless Setup
     * projects. For more details, see [[UnprovisionHandler]].
     */
    UNPROVISION = 'action.devices.UNPROVISION',
    /**
     * Sent when the device information has matched the OTA rules. Currently
     * only available for BLE Seamless Setup projects. For more details, see
     * [[UpdateHandler]].
     *
     * @hidden
     */
    UPDATE = 'action.devices.UPDATE',
  }

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
      /** Proxy data provided by `PROXY_SELECTED` response */
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

    /** Generally for CLOUD_SYNCED devices, verificationId is sufficient */
    interface DeviceWithVerificationId {
      /**
       * Local device ID. This value must match one of the `otherDeviceIds`
       * in the `SYNC` response.
       */
      verificationId: string;
    }

    /** For LOCAL_SYNCED devices, id is required */
    interface DeviceWithId {
      /** Device ID from `IdentifyRequest` */
      id: string;
    }

    // Other device characteristics, in addition to `id` or `verificationId`
    interface DeviceCharacteristics {
      /** Hardware type of the device */
      type?: string;
      /** Metadata describing the device */
      deviceInfo?: DeviceInfo;
      /**
       * Describes how the device will behave when sent an INDICATE intent.
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
       */
      requiresBonding?: boolean;
      /**
       * If true, indicates that a connection to the BLE device should
       * not be established automatically.
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
    }

    interface LocalDeviceInterface extends DeviceWithId,
                                           DeviceCharacteristics {}

    interface CloudSyncedDeviceInterface extends DeviceWithVerificationId,
                                                 DeviceCharacteristics {}

    /**
     * Content of the [[IdentifyResponse]] returned by the application's
     * `IDENTIFY` intent handler.
     */
    interface IdentifyResponsePayload extends ResponsePayload {
      device: CloudSyncedDeviceInterface|LocalDeviceInterface;
    }

    /**
     * Content of the [[ReachableDevicesResponse]] returned by the application's
     * `REACHABLE_DEVICES` intent handler.
     */
    interface ReachableDevicesPayload extends ResponsePayload {
      /**
       * List of device identifiers visible to the proxy device.
       *
       * Use `id` value if the reachable device is
       * local-only and is not represented in the `SYNC` response.
       *
       * Use `verificationId` value if the reachable device should
       * match one of the `otherDeviceIds` in the `SYNC` response.
       */
      devices: Array<DeviceWithId|DeviceWithVerificationId>;
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

    /** BLE Seamless Setup interfaces & classes */

    /** Reusable interfaces. */
    interface BleNotification {
      serviceUuid: string;
      characteristicUuid: string;
      value: string;
    }

    interface LocalNotifyingDevice extends DeviceScanData {
      id: string;
      customData?: unknown;
      protocol: Constants.Protocol;
      notificationData: BleNotification;
    }

    /**
     * Scan data and device IDs provided by an [[ProvisionRequest]] to the
     * application's `PROVISION` handler.
     */
    interface LocalProvisioningDevice extends DeviceScanData {
      /** Device ID provided in the `SYNC` response. */
      id?: string;
      /** @hidden WiFi SSID to be used in provisioning. */
      ssid?: string;
      /** @hidden Pin code entered by the user, when code scan fails. */
      pinCode?: string;
      /**
       * @hidden Present if the device represents a 3P device in softAP mode.
       * The length of passwordPlaceholder is equal to the length of the actual
       * WiFi credential but the value is only a placeholder (it is not the real
       * password).
       */
      passwordPlaceholder?: string;
    }

    interface LocalRegisteringDevice extends DeviceScanData {
      id?: string;
      name: string;
    }

    interface LocalRegisteredDevice extends DeviceScanData {
      id: string;
      customData?: unknown;
    }

    interface LocalEventEmitterDevice {
      id: string;
    }

    // Intent specific params.EventRequest
    interface IndicateRequestParams {
      start: boolean;
    }

    interface UpdateRequestParams {
      url: string;
    }

    /** Request Object for EVENT intent.  */
    type EventRequest = RequestInterface<LocalEventEmitterDevice>;
    /** Request Object for INDICATE intent.  */
    type IndicateRequest =
        RequestInterface<LocalIdentifiedDevice, IndicateRequestParams>;
    /** Request Object for PARSE_NOTIFICATION intent.  */
    type ParseNotificationRequest = RequestInterface<LocalNotifyingDevice>;
    /** Request Object for PROVISION intent.  */
    type ProvisionRequest = RequestInterface<LocalProvisioningDevice>;
    /** Request Object for REGISTER intent.  */
    type RegisterRequest = RequestInterface<LocalRegisteringDevice>;
    /** Request Object for UNPROVISION intent.  */
    type UnprovisionRequest = RequestInterface<LocalRegisteredDevice>;
    /** Request Object for UPDATE intent.  */
    type UpdateRequest =
        RequestInterface<LocalRegisteredDevice, UpdateRequestParams>;
    /**
     * Request passed to the application's `PROXY_SELECTED` intent handler,
     * containing a [[LocalIdentifiedDevice]] detected by the local
     * scan configuration.
     */
    type ProxySelectedRequest = RequestInterface<LocalIdentifiedDevice>;

    interface ParseNotificationResponsePayload extends ResponsePayload {}

    interface ProvisionResponsePayload extends ResponsePayload {
      structureData: object;
    }

    interface RegisterResponsePayload extends ResponsePayload {
      devices: Device[];
    }

    interface UpdateResponsePayload extends ResponsePayload {
      swVersion: string;
    }

    /**
     * Content of the [[ProxySelectedResponse]] returned by the application's
     * `PROXY_SELECTED` intent handler.
     */
    interface ProxySelectedPayload extends ResponsePayload {
      /**
       * Proxy data is a JSON similar to customData for the Bridge/Hub devices.
       * It can be retrieved from the `proxyData` field of the JSON returned by
       * [[DeviceManager.getProxyInfo]] API.
       */
      proxyData?: unknown;
    }

    /** Response Object for EVENT intent. */
    type EventResponse = ResponseInterface<ResponsePayload>;
    /** Response Object for INDICATE intent. */
    type IndicateResponse = ResponseInterface<ResponsePayload>;
    /** Response Object for PARSE_NOTIFICATION intent. */
    type ParseNotificationResponse =
        ResponseInterface<ParseNotificationResponsePayload>;
    /** Response Object for PROVISION intent. */
    type ProvisionResponse = ResponseInterface<ProvisionResponsePayload>;
    /** Response Object for REGISTER intent. */
    type RegisterResponse = ResponseInterface<RegisterResponsePayload>;
    /** Response Object for UPDATE intent. */
    type UpdateResponse = ResponseInterface<UpdateResponsePayload>;
    /** Response Object for UNPROVISION intent. */
    type UnprovisionResponse = ResponseInterface<ResponsePayload>;
    /**
     * Response returned by the application's `PROXY_SELECTED` intent handler
     * to save information about the selected proxy.
     */
    type ProxySelectedResponse = ResponseInterface<ProxySelectedPayload>;

    /** Handler type for EVENT intent.  */
    type EventHandler = IntentHandler<EventRequest, EventResponse>;
    /** Handler type for INDICATE intent.  */
    type IndicateHandler = IntentHandler<IndicateRequest, IndicateResponse>;
    /** Handler type for REGISTER intent.  */
    type RegisterHandler = IntentHandler<RegisterRequest, RegisterResponse>;
    /** Handler type for PROVISION intent.  */
    type ProvisionHandler = IntentHandler<ProvisionRequest, ProvisionResponse>;
    /** Handler type for UNPROVISION intent.  */
    type UnprovisionHandler =
        IntentHandler<UnprovisionRequest, UnprovisionResponse>;
    /** Handler type for UPDATE intent.  */
    type UpdateHandler = IntentHandler<UpdateRequest, UpdateResponse>;
    /** Handler type for PARSE_NOTIFICATION intent. */
    type ParseNotificationHandler = IntentHandler<
        ParseNotificationRequest,
        ParseNotificationResponse|ReportState.Response.Payload>;
    /**
     * Callback registered with the [[App]] via `onProxySelected()` to
     * allow app to save proxyData for the hub device.
     */
    type ProxySelectedHandler =
        IntentHandler<ProxySelectedRequest, ProxySelectedResponse>;
  }
}
