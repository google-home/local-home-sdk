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
 * Declares App interface and Device Manager interface. App interface allows
 * local fulfillment apps to attach handlers for various intents. Device Manager
 * interface allows local fulfillment apps to communicate with the Local Home
 * platform.
 */
declare namespace smarthome {
  namespace IntentFlow {
    interface ScanData {
      /** Contains data if this result came from a BLE scan. */
      bleScanData?: BleScanData;
      /** Contains data if this result came from an mDNS scan. */
      mdnsScanData?: MdnsScanData;
      /** Contains data if this result came from a UDP scan. */
      udpScanData?: UdpScanData;
      /** Contains data if this result came from a UPnP scan. */
      upnpScanData?: UpnpScanData;
    }

    /**
     * Results provided from a device scan on the local network.
     */
    interface DeviceScanData {
      /** List of radio interfaces used during the scan. */
      radioTypes: Constants.RadioType[];
      /** Contains data if this result came from a BLE scan. */
      bleData?: BleScanData;
      /** Contains data if this result came from an mDNS scan. */
      mdnsScanData?: MdnsScanData;
      /** Contains data if this result came from a UDP scan. */
      udpScanData?: UdpScanData;
      /** Contains data if this result came from a UPnP scan. */
      upnpScanData?: UpnpScanData;
    }
  }

  namespace DataFlow {
    /**
     * Generic command request object that can be used in function signatures
     * that work with command objects in a generic way.
     */
    type CommandRequest =
        BleRequestData|HttpRequestData|TcpRequestData|UdpRequestData;

    /**
     * Generic command response object that can be used in function signatures
     * that work with command objects in a generic way.
     */
    type CommandResponse =
        BleResponseData|HttpResponseData|TcpResponseData|UdpResponseData;
  }

  /** Generic Intent request. Used in API signatures that accept any intent. */
  type IntentRequest =
      IntentFlow.EventRequest|IntentFlow.ExecuteRequest|
      IntentFlow.IdentifyRequest|IntentFlow.IndicateRequest|
      IntentFlow.ParseNotificationRequest|IntentFlow.ProvisionRequest|
      IntentFlow.ProxySelectedRequest|IntentFlow.QueryRequest|
      IntentFlow.ReachableDevicesRequest|IntentFlow.RegisterRequest|
      IntentFlow.UnprovisionRequest|IntentFlow.UpdateRequest;

  /** Generic Intent response. Used in API signatures that accept any intent. */
  type IntentResponse =
      IntentFlow.EventResponse|IntentFlow.ExecuteResponse|
      IntentFlow.IdentifyResponse|IntentFlow.IndicateResponse|
      IntentFlow.ParseNotificationResponse|
      IntentFlow.ProvisionResponse|IntentFlow.ProxySelectedResponse|
      IntentFlow.QueryResponse|IntentFlow.ReachableDevicesResponse|
      IntentFlow.RegisterResponse|IntentFlow.UnprovisionResponse|
      IntentFlow.UpdateResponse;

  type FilterFunc = (commandResponse: DataFlow.CommandSuccess) => boolean;
  type TransformFunc = (commandResponse: DataFlow.CommandSuccess) => unknown;

  /**
   * Notification options. Either timeout or n must be specified.
   * n: Number of notifications needed by the app to complete a specific op.
   * timeout: Timeout in ms, after which the SDK will stop collecting
   * notifications.
   * filterFunc: Interested in notifications that match this filter.
   * transformFunc: Transform each notification packet and return transformed
   * object. If transformFunc is not used, the promise is resolved with
   * DataFlow.CommandSuccess.
   */
  interface NotificationOptions {
    n?: number;
    timeout?: number;
    filterFunc?: FilterFunc;
    transformFunc?: TransformFunc;
  }

  /**
   * This class provides access to the devices managed by the local home
   * platform. Applications can use this interface to send and receive commands
   * with a locally identified device using the [[send]] method.
   *
   * ```typescript
   * localHomeApp.getDeviceManager()
   *   .send(deviceCommand)
   *   .then((result) => {
   *     // Handle command success
   *   })
   *   .catch((err: IntentFlow.HandlerError) => {
   *     // Handle command error
   *   });
   * ```
   *
   */
  interface DeviceManager {
    /**
     * `send` is called by app when it needs to communicate with a device.
     * Depending upon the protocol used by the device, the app constructs a
     * [[DataFlow.CommandRequest]] object and passes it as an argument.
     * Returns a promise that resolves to [[DataFlow.CommandSuccess]]. Response
     * may return data, if it was a read request.
     *
     * See also [[BleRequestData]], [[HttpRequestData]], [[TcpRequestData]],
     * [[UdpRequestData]]
     *
     * @param command  Command to communicate with the device.
     * @param sendOptions  Options for `send` API. See [[SendOptions]].
     * @return  Promise that resolves to [[DataFlow.CommandSuccess]]
     */
    send(command: DataFlow.CommandRequest, sendOptions?: SendOptions):
        Promise<DataFlow.CommandSuccess>;
    /**
     * `sendAndWait` allows the app to wait for notification in the same
     * promise chain. But if the app uses a transformFunc, the resolved result
     * could be anything. If transformFunc is not specified, the promise will be
     * resolved with DataFlow.CommandSuccess type.
     *
     * @param command  Command to communicate with the device.
     * @param options  Options for `sendAndWait` API. See
     *     [[NotificationOptions]].
     * @return  Promise that resolves to anything. It resolves to
     *     [[DataFlow.CommandSuccess]] if transformFunc is not specified in
     * options.
     */
    sendAndWait(command: DataFlow.CommandRequest, options: NotificationOptions):
        Promise<unknown|DataFlow.CommandSuccess>;
    /**
     * `markPending` is called by the app when app is done handling an intent,
     * but the actual operation (usually EXECUTE command) is still not done.
     * This enables Google Home to respond back to the user in a timely fashion.
     * This may be useful for somewhat long running operations. Returns a
     * promise.
     * @param request  Original intent request that should be marked pending.
     * @param response  Pending response to the intent request.
     */
    markPending(request: IntentRequest, response?: IntentResponse):
        Promise<void>;
    /**
     * `getProxyInfo` is called by app to get information about the hub / bridge
     * controlling this end-device.
     * @param id  Device ID of end device that is being controlled by the hub.
     */
    getProxyInfo(id: string): ProxyInfo;
    /**
     * Returns the list of registered devices.
     */
    getRegisteredDevices(): IntentFlow.RegisteredDevice[];

    /**
     * `reportState` is called by app to report the changed state for the
     * device. In the case of BLE Seamless Setup, it should be called whenever
     * the app receives a BLE notification in [[ParseNotificationHandler]].
     * @param state  the latest state of the device
     */
    reportState(state: ReportState.Response.Payload): undefined;
  }

  /**
   * This class is the main entry point for your app in the local home platform.
   * Use the [[App]] class to register callback handlers for [[Intents]] and
   * to listen for new events.
   *
   * ```typescript
   * import App = smarthome.App;
   *
   * const localHomeApp: App = new App("1.0.0");
   * localHomeApp
   *   .onIdentify(identifyHandler)
   *   .onExecute(executeHandler)
   *   .listen()
   *   .then(() => console.log("Ready"));
   * ```
   *
   */
  class App {
    constructor(version: string);
    /**
     * `getDeviceManager` is called by app to get the reference to the singleton
     * DeviceManager object.
     * @return [[DeviceManager]]
     */
    getDeviceManager(): DeviceManager;
    /**
     * `listen` is called by app when the app is ready to handle the intents.
     */
    listen(): Promise<void>;

    /**
     * `on` is called by app to attach the handler for generic events specified
     * in [[Constants.EventType]]
     * @param eventType  The generic event type the hanlers
     * @param handler  The handler that handles the intent.
     */
    on(eventType: Constants.EventType, handler: IntentFlow.EventHandler): this;

    /**
     * `onExecute` is called by app to attach the handler for EXECUTE intent.
     * @param handler  The handler that handles EXECUTE intent.
     */
    onExecute(handler: IntentFlow.ExecuteHandler): this;

    /**
     * `onIdentify` is called by app to attach the handler for IDENTIFY intent.
     * @param handler  The handler that handles IDENTIFY intent.
     */
    onIdentify(handler: IntentFlow.IdentifyHandler): this;

    /**
     * `onIndicate` is called by app to attach the handler for INDICATE intent.
     * @param handler  The handler that handles INDICATE intent.
     */
    onIndicate(handler: IntentFlow.IndicateHandler): this;

    /**
     * `onParseNotification` is called by app to attach the handler for
     * PARSE_NOTIFICATION intent.
     * @param handler  The handler that handles PARSE_NOTIFICATION intent.
     */
    onParseNotification(handler: IntentFlow.ParseNotificationHandler): this;

    /**
     * `onProvision` is called by app to attach the handler for PROVISION
     * intent.
     * @param handler  The handler that handles PROVISION intent.
     */
    onProvision(handler: IntentFlow.ProvisionHandler): this;

    /**
     * `onProxySelected` is called by app to attach the handler for
     * PROXY_SELECTED intent.
     * @param handler  The handler that handles PROXY_SELECTED intent.
     */
    onProxySelected(handler: IntentFlow.ProxySelectedHandler): this;

    /**
     * `onQuery` is called by app to attach the handler for QUERY intent.
     * @param handler  The handler that handles QUERY intent.
     */
    onQuery(handler: IntentFlow.QueryHandler): this;

    /**
     * `onReachableDevices` is called by app to attach the handler for
     * REACHABLE_DEVICES intent.
     * @param handler  The handler that handles REACHABLE_DEVICES intent.
     */
    onReachableDevices(handler: IntentFlow.ReachableDevicesHandler): this;

    /**
     * `onRegister` is called by app to attach the handler for REGISTER intent.
     * @param handler  The handler that handles REGISTER intent.
     */
    onRegister(handler: IntentFlow.RegisterHandler): this;

    /**
     * `onUnprovision` is called by app to attach the handler for UNPROVISION
     * intent.
     * @param handler  The handler that handles UNPROVISION intent.
     */
    onUnprovision(handler: IntentFlow.UnprovisionHandler): this;

    /**
     * `onUpdate` is called by app to attach the handler for UPDATE intent.
     * @param handler  The handler that handles UPDATE intent.
     *
     * @hidden since currently OTA is not available for developers yet
     */
    onUpdate(handler: IntentFlow.UpdateHandler): this;
  }
}
