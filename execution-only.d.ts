/**
 * @license
 * Copyright 2019 Google LLC
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
 * Declares App interface and Device Manager interface. App interface allows
 * local fulfillment apps to attach handlers for various intents. Device Manager
 * interface allows local fulfillment apps to communicate with the Local Home
 * platform.
 */
declare namespace smarthome {
  export namespace IntentFlow {
    /**
     * Results provided from a device scan on the local network.
     * @hidden
     */
    interface DeviceScanData {
      /** List of radio interfaces used during the scan. */
      radioTypes: Constants.RadioType[];
      /** Contains data if this result came from an mDNS scan. */
      mdnsScanData?: MdnsScanData;
      /** Contains data if this result came from a UDP scan. */
      udpScanData?: UdpScanData;
      /** Contains data if this result came from a UPnP scan. */
      upnpScanData?: UpnpScanData;
    }
  }

  /**
   * Smart home intents for discovery and control of local devices.
   */
  export enum Intents {
    /**
     * Handle an execution request for a device with an established local
     * execution path. For more details, see the [[ExecuteHandler]].
     */
    EXECUTE = 'action.devices.EXECUTE',
    /**
     * Report devices discovered using your scan configuration that support
     * local fulfillment. For more details, see the [[IdentifyHandler]].
     */
    IDENTIFY = 'action.devices.IDENTIFY',
    /**
     * Report additional devices connected through a local proxy or hub.
     * For more details, see the [[ReachableDevicesHandler]].
     */
    REACHABLE_DEVICES = 'action.devices.REACHABLE_DEVICES',
  }

  export namespace DataFlow {
    /**
     * Generic options object.
     */
    export type CommandOptions = HttpOptions|TcpOptions|UdpOptions;

    /**
     * Generic command request object that can be used in function signatures
     * that work with command objects in a generic way.
     */
    export type CommandRequest = HttpRequestData|TcpRequestData|UdpRequestData;

    /**
     * Generic command response object that can be used in function signatures
     * that work with command objects in a generic way.
     */
    export type CommandResponse =
        HttpResponseData|TcpResponseData|UdpResponseData;
  }

  /** Generic Intent request. Used in API signatures that accept any intent. */
  export type IntentRequest = IntentFlow.ExecuteRequest|
                              IntentFlow.IdentifyRequest|
                              IntentFlow.ReachableDevicesRequest;


  /** Generic Intent response. Used in API signatures that accept any intent. */
  export type IntentResponse = IntentFlow.ExecuteResponse|
                               IntentFlow.IdentifyResponse|
                               IntentFlow.ReachableDevicesResponse;

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
  export interface DeviceManager {
    /**
     * `send` is called by app when it needs to communicate with a device.
     * Depending upon the protocol used by the device, the app constructs a
     * [[DataFlow.CommandRequest]] object and passes it as an argument.
     * Returns a promise that resolves to [[DataFlow.CommandSuccess]]. Response
     * may return data, if it was a read request.
     * @param command  Command to communicate with the device.
     * @return  Promise that resolves to [[DataFlow.CommandSuccess]]
     */
    send(command: DataFlow.CommandRequest): Promise<DataFlow.CommandSuccess>;
    /**
     * `markPending` is called by the app when app is done handling an intent,
     * but the actual operation (usually EXECUTE command) is still not done.
     * This enables Google Home to respond back to the user in a timely fashion.
     * This may be useful for somewhat long running operations. Returns a
     * promise.
     * @param request  Original intent request that should be marked pending.
     */
    markPending(request: IntentRequest): Promise<void>;
    /**
     * `getProxyInfo` is called by app to get information about the hub / bridge
     * controlling this end-device.
     * @param id  Device ID of end device that is being controlled by the hub.
     */
    getProxyInfo(id: string): ProxyInfo;
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
  export class App {
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
     * `onReachableDevices` is called by app to attach the handler for
     * REACHABLE_DEVICES intent.
     * @param handler  The handler that handles REACHABLE_DEVICES intent.
     */
    onReachableDevices(handler: IntentFlow.ReachableDevicesHandler): this;
  }
}
