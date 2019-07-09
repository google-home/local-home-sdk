/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** Declares Execute Response builder. */
declare namespace smarthome {
  /**
   * `Execute.Response` is a namespace from which Builder class is
   * accessed.
   */
  export namespace Execute.Response {
    /**
     * `Execute.Response.Builder` allows the app to build
     * ExecuteResponse.
     */
    export class Builder {
      /** @param requestId  Request ID of the Execute intent. */
      setRequestId(requestId: string): this;
      /**
       * @param deviceId  Device ID of the device.
       * @param deviceState  If execution was successful, provide new state of
       *     the device.
       */
      setSuccessState(deviceId: string, deviceState: unknown): this;
      /**
       * @param deviceId  Device ID of the device.
       * @param errorCode  If execution failed, provide the errorCode.
       */
      setErrorState(deviceId: string, errorCode: IntentFlow.ExecuteErrors):
          this;
      /**
       * @return a new `ExecuteResponse` instance initialized with
       * the parameters set by this Builder.
       */
      build(): IntentFlow.ExecuteResponse;
    }
  }
}
/** Declares the request and response JSON for cloud intents. */
declare namespace smarthome {
  /**
   * `smarthome.IntentFlow` is a namespace that encapsulates all
   * intent request and response objects.
   */
  export namespace IntentFlow {
    /**
     * @hidden
     */
    interface CloudRequest<P> {
      requestId: string;
      inputs: Array<{intent: Intents; payload: P;}>;
    }
    /**
     * @hidden
     */
    interface DeviceMetadata {
      /** Device ID provided in the `SYNC` response */
      id: string;
      /** Custom data provided in the `SYNC` response */
      customData?: unknown;
    }
    /**
     * @hidden
     */
    interface QueryRequestPayload {
      /** List of devices to query */
      devices: DeviceMetadata[];
      /** @hidden */
      structureData: unknown;
    }
    /**
     * Request passed to the application's `QUERY` intent handler,
     * containing a list of device IDs to report state.
     */
    export type QueryRequest = CloudRequest<QueryRequestPayload>;

    /**
     * @hidden
     */
    interface ExecuteRequestExecution {
      /** Device trait to be updated */
      command: string;
      /** New state values for the trait attributes */
      params: unknown;
    }
    /**
     * @hidden
     */
    interface ExecuteRequestCommands {
      /** List of devices to update */
      devices: DeviceMetadata[];
      /** List of traits to update */
      execution: ExecuteRequestExecution[];
    }
    /**
     * @hidden
     */
    interface ExecuteRequestPayload {
      /** List of commands to execute */
      commands: ExecuteRequestCommands[];
      /** @hidden */
      structureData: unknown;
    }
    /**
     * Request passed to the application's `EXECUTE` intent handler,
     * containing a list of commands and target device IDs to be updated.
     */
    export type ExecuteRequest = CloudRequest<ExecuteRequestPayload>;

    /**
     * Response status codes for `EXECUTE` intent requests.
     */
    export type ExecuteStatus =
        'SUCCESS'|'PENDING'|'OFFLINE'|'ERROR'|'EXCEPTIONS';

    /**
     * For a list of the supported `EXECUTE` error codes, see
     * https://developers.google.com/actions/reference/smarthome/errors-exceptions
     */
    type ExecuteErrors = string;
    /**
     * @hidden
     */
    interface CloudResponse<P> {
      requestId: string;
      payload: P;
    }
    /**
     * Content of the [[QueryResponse]] returned by the application's
     * `QUERY` intent handler.
     * @hidden
     */
    interface QueryPayload {
      devices: unknown;
    }
    /**
     * Response returned by the application's `QUERY` intent handler.
     */
    export type QueryResponse = CloudResponse<QueryPayload>;

    /**
     * @hidden
     */
    interface ExecuteResponseCommands {
      /** List of affected device ids. */
      ids: string[];
      /** Response status code of the commands sent to these devices. */
      status: ExecuteStatus;
      /**
       * If status is set to `ERROR` or `EXCEPTIONS`,
       * the cause of the error.
       */
      errorCode?: ExecuteErrors;
      /**
       * If status is set to `ERROR` or `EXCEPTIONS`,
       * a human readable description of the error.
       */
      debugString?: string;
      /** Per-trait state values after execution is complete. */
      states?: unknown;
    }
    /**
     * Content of the [[ExecuteResponse]] returned by the application's
     * `EXECUTE` intent handler.
     * @hidden
     */
    interface ExecutePayload {
      /** List of command response details */
      commands: ExecuteResponseCommands[];
      /** Error code for the entire command transaction */
      errorCode?: ExecuteErrors;
      /** Human readable description of any errors present */
      debugString?: string;
    }
    /**
     * Response returned by the application's `EXECUTE` intent handler
     * to report success or failure of the requested command executions.
     */
    export type ExecuteResponse = CloudResponse<ExecutePayload>;

    /**
     * Callback registered with the [[App]] via `onQuery()` to
     * process requests for current device state.
     */
    export type QueryHandler = IntentHandler<QueryRequest, QueryResponse>;
    /**
     * Callback registered with the [[App]] via `onExecute()` to
     * process requests to update device state.
     */
    export type ExecuteHandler = IntentHandler<ExecuteRequest, ExecuteResponse>;
  }
}
/**
 * Declares DataFlow namespace that provides interface to send commands to
 * platform using DeviceManager send API.
 */
declare namespace smarthome {
  /**
   * `smarthome.DataFlow` is a namespace that encapsulates request and response
   * interface for communication with smart home devices over TCP, UDP and HTTP.
   */
  export namespace DataFlow {
    /** @hidden */
    interface HttpOptions {
      /** HTTP Content-Type header */
      dataType: string;
      /** List of HTTP headers for the request */
      headers: string;
      /** True to send using HTTPS, false for HTTP */
      isSecure: boolean;
      /** HTTP method to perform */
      method: Constants.HttpOperation;
      /** URI path on the target device */
      path: string;
      /** Port number on the target device */
      port: number;
    }
    /** @hidden */
    interface HttpResponse {
      /** HTTP response code */
      statusCode: number;
      /** Content of the HTTP response */
      body: unknown;
    }
    /** @hidden */
    interface TcpOptions {
      /** True to enable TLS for this request */
      isSecure: boolean;
      /** Port number on the target device */
      port: number;
      /** TCP operation to perform */
      operation: Constants.TcpOperation;
      /** Hostname on the target device */
      hostname?: string;
      /** For read requests, number of expected bytes */
      bytesToRead?: number;
    }
    /** @hidden */
    interface TcpResponse {
      /** Content of the TCP response */
      data: string;
    }
    /** @hidden */
    interface UdpOptions {
      /** Port number on the target device */
      port: number;
    }
    /** @hidden */
    interface UdpResponse {}
    /** @hidden */
    interface CommandBase {
      /** Request ID from the associated `EXECUTE` intent.  */
      requestId: string;
      /** Device ID of the target device. */
      deviceId: string;
      /** Protocol to use when sending this command */
      protocol: Constants.Protocol;
    }
    /** @hidden */
    interface Command extends CommandBase {
      /** Payload sent to the target device */
      data: string;
    }

    interface HttpRequestData extends Command, HttpOptions {}
    interface TcpRequestData extends Command, TcpOptions {}
    interface UdpRequestData extends Command, UdpOptions {}

    /** For sending HTTP/S commands using DeviceManager.send API. */
    export class HttpRequestData implements HttpRequestData {}
    /** For sending TCP commands using DeviceManager.send API. */
    export class TcpRequestData implements TcpRequestData {}
    /** For sending UDP commands using DeviceManager.send API. */
    export class UdpRequestData implements UdpRequestData {}

    /**
     * Successful response to a [[DeviceManager]] command
     */
    interface CommandSuccess extends CommandBase {}
    /** Type for HTTP command response. */
    export interface HttpResponseData extends CommandSuccess {
      /** Response to an HTTP request */
      httpResponse: HttpResponse;
    }
    /** Type for TCP command response. */
    export interface TcpResponseData extends CommandSuccess {
      /** Response to a TCP request */
      tcpResponse: TcpResponse;
    }
    /** Type for UDP command response. */
    export interface UdpResponseData extends CommandSuccess {}

    /**
     * Response to a [[DeviceManager]] command that resulted
     * in an error.
     */
    export interface CommandFailure extends CommandBase {
      /** The cause for this error */
      errorCode: string;
      /** Human readable description of this error */
      debugString?: string;
    }
  }
}
/**
 * Declares App interface and Device Manager interface. App interface allows
 * local execution apps to attach handlers for various intents. Device Manager interface
 * allows local execution apps to communicate with the Local Home platform.
 */
declare namespace smarthome {
  export namespace IntentFlow {
    /** @hidden */
    interface DeviceScanData {
      /** List of radio interfaces used during the scan */
      radioTypes: Constants.RadioType[];
      /** Contains data if this result came from an mDNS scan. */
      mdnsScanData?: MdnsScanData;
      /** Contains data if this result came from a UDP scan */
      udpScanData?: UdpScanData;
      /** Contains data if this result came from a UPnP scan */
      upnpScanData?: UpnpScanData;
    }
  }

  /** Smart home Intents. */
  export enum Intents {
    EXECUTE = 'action.devices.EXECUTE',
    IDENTIFY = 'action.devices.IDENTIFY',
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

  /** Device Manager interface. */
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
   * App interface.
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
/** Declares generic intent request and response JSONs. */
declare namespace smarthome {
  /**
   * `smarthome.IntentFlow` is a namespace that encapsulates all
   * intent request and response objects.
   */
  export namespace IntentFlow {
    /** Allows apps to choose the indication mode for their devices. */
    export enum IndicationMode {BLINK = 'BLINK'}

    /** Error codes that can be used in intent responses. */
    export enum ErrorCode {
      /** Returned when the intent is not supported by the application. */
      NOT_SUPPORTED = 'NOT_SUPPORTED',

      /** Returned when the request is not valid. */
      INVALID_REQUEST = 'INVALID_REQUEST',

      /** Returned when the request is cancelled. */
      INTENT_CANCELLED = 'INTENT_CANCELLED',

      /** Unspecified error occurred. */
      GENERIC_ERROR = 'GENERIC_ERROR',
    }

    /**
     * Captures metadata about the device.
     */
    export interface DeviceInfo {
      /** Device manufacturer name */
      manufacturer: string;
      /** Device model name */
      model: string;
      /** Hardware version name */
      hwVersion: string;
      /** Software/Firmware version name */
      swVersion: string;
    }

    /**
     * @hidden
     */
    interface DeviceNames {
      /** Primary name of the device */
      name: string;
      /** Additional names provided by the developer */
      defaultNames?: string[];
      /** Additional names provided by the user */
      nicknames?: string[];
    }
    /**
     * Properties for a given device as provided in the `SYNC` response.
     * @hidden
     */
    interface Device {
      /** Attributes provided in the `SYNC` response */
      attributes?: object;
      /** Custom data provided in the `SYNC` response */
      customData?: object;
      /** Metadata describing the device */
      deviceInfo?: DeviceInfo;
      /** Unique device identifier */
      id: string;
      /** Names of this device */
      name: DeviceNames;
      /** Current room of the device within the home */
      roomHint?: string;
      /** List of traits this device supports */
      traits: string[];
      /** Hardware type of the device */
      type: string;
      /** True if this device publishes state updates in real time */
      willReportState: boolean;
    }
    /**
     * @hidden
     */
    interface DeviceMap {
      id: string;
      customData?: unknown;
    }
    /**
     * @hidden Generic intent request interface.
     */
    interface Params {}

    /**
     * @hidden
     */
    interface Payload<D, T = {}> {
      device: D;
      structureData: unknown;
      params: T;
    }
    /**
     * @hidden
     */
    interface Input<D, T = {}> {
      intent: Intents;
      payload: Payload<D, T>;
    }
    /**
     * @hidden
     */
    interface RequestInterface<D, T = {}> {
      requestId: string;
      inputs: Array<Input<D, T>>;
      devices: DeviceMap[];
    }
    /**
     * @hidden Generic intent response interface.
     */
    interface ResponsePayload {
      errorCode?: string;
      debugString?: string;
    }
    /**
     * @hidden
     */
    interface ResponseInterface<P> {
      requestId: string;
      // Needed for Report State / Parse Notification.
      agentUserId?: string;
      intent: Intents;
      payload: P;
    }
    /**
     * @hidden Generic intent handler.
     */
    interface IntentHandler<REQ, RES> {
      (request: REQ): Promise<RES>|RES;
    }

    /** Error class, can be used to reject promise from an intent handler. */
    export class HandlerError extends Error {
      /** Request ID from the associated `EXECUTE` intent. */
      requestId: string;
      /** The cause for this error */
      errorCode: string;
      /** Human readable description of this error */
      debugString?: string;
      /**
       * @param requestId Request ID from the associated `EXECUTE` intent.
       * @param errorCode The cause for this error
       * @param debugString Human readable description of this error
       */
      constructor(requestId: string, errorCode: string, debugString?: string);
    }
  }
}
/** Declares request and response interface between local execution apps and SDK */
declare namespace smarthome {
  /**
   * `smarthome.Constants` is a namespace that encapsulates a few
   * common enums.
   */
  export namespace Constants {
    /** Radio types, useful for apps in deciding the transport to use. */
    export enum RadioType {
      /** @hidden */
      BLE = 'BLE',
      WIFI = 'WIFI',
    }

    /** Protocol, to be used in commands while communicating with the SDK. */
    export enum Protocol {
      /** @hidden */
      BLE = 'BLE',
      HTTP = 'HTTP',
      TCP = 'TCP',
      UDP = 'UDP',
      /** @hidden */
      BLE_MESH = 'BLE_MESH'
    }

    /**
     * Supported operations by BLE transport.
     * @hidden
     */
    export enum BleOperation {
      CREATE_BOND = 'CREATE_BOND',
      READ = 'READ',
      REGISTER_FOR_NOTIFICATIONS = 'REGISTER_FOR_NOTIFICATIONS',
      REMOVE_BOND = 'REMOVE_BOND',
      WRITE = 'WRITE',
      WRITE_WITHOUT_RESPONSE = 'WRITE_WITHOUT_RESPONSE',
      DISCONNECT = 'DISCONNECT',
    }

    /** Supported methods by HTTP transport. */
    export enum HttpOperation {
      GET = 'GET',
      POST = 'POST',
      PUT = 'PUT',
    }

    /** Supported methods by TCP transport. */
    export enum TcpOperation {
      READ = 'READ',
      WRITE = 'WRITE',
    }
  }
}
/** Declares request and response interface between local execution apps and SDK */
declare namespace smarthome {
  /**
   * <code>IntentFlow</code> is a namespace that encapsulates all intent request
   * and response objects.
   * @preferred
   */
  export namespace IntentFlow {

    /**
     * @hidden
     */
    interface LocalUnIdentifiedDevice extends DeviceScanData {}

    /**
     * Scan result provided by an [[IdentifyRequest]] to the
     * application's `IDENTIFY` handler.
     */
    interface LocalIdentifiedDevice extends DeviceScanData {
      /** Device ID provided in the `SYNC` response */
      id?: string;
      /** Custom data provided in the `SYNC` response */
      customData?: unknown;
    }

    /**
     * Scan result provided by a [[ReachableDevicesRequest]]
     * to the application's `REACHABLE_DEVICES` handler.
     */
    interface ProxyDevice extends DeviceScanData {
      /** Device ID provided in the `SYNC` response */
      id: string;
      /** Custom data provided in the `SYNC` response */
      customData?: unknown;
      /** @hidden */
      proxyData?: unknown;
    }

    /**
     * Scan result provided by a [[ReachableDevicesRequest]]
     * to the application's `REACHABLE_DEVICES` handler.
     */
    interface LocalProxyDevice {
      /** Scan data for the locally identified device */
      proxyDevice: ProxyDevice;
    }

    /**
     * Request passed to the application's `IDENTIFY` intent handler,
     * containing a [[LocalIdentifiedDevice]] detected by the local
     * scan configuration.
     */
    export type IdentifyRequest = RequestInterface<LocalIdentifiedDevice>;

    /**
     * Request passed to the application's `REACHABLE_DEVICES` intent handler,
     * containing a [[LocalProxyDevice]] successfully identified as a proxy or
     * hub.
     */
    export type ReachableDevicesRequest = RequestInterface<LocalProxyDevice>;

    /**
     * Content of the [[IdentifyResponse]] returned by the application's
     * `IDENTIFY` intent handler.
     */
    interface IdentifyResponsePayload extends ResponsePayload {
      device: {
        /** Device ID from `IdentifyRequest` */
        id: string;
        /** Hardware type of the device */
        type?: string;
        /** Metadata describing the device */
        deviceInfo?: DeviceInfo;
        /** @hidden */
        indicationMode?: IndicationMode;
        /** @hidden */
        commandedOverProxy?: boolean;
        /**
         * True if this device does not appear in the `SYNC response.
         * This is common for hub devices.
         */
        isLocalOnly?: boolean;
        /**
         * True if this device can act as a proxy for other devices, enabling
         * the `REACHABLE_DEVICES` intent.
         * This is common for hub devices.
         */
        isProxy?: boolean;
        /** @hidden */
        requiresBonding?: boolean;
        /**
         * Local device ID. This value must match one of the `otherDeviceIds`
         * in the `SYNC` response.
         */
        verificationId?: string;
        /** @hidden */
        avoidAutoconnect?: boolean;
      };
    }

    /**
     * Content of the [[ReachableDevicesResponse]] returned by the application's
     * `REACHABLE_DEVICES` intent handler.
     */
    interface ReachableDevicesPayload extends ResponsePayload {
      /** List of device identifiers visible to the proxy device */
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
     */
    export type IdentifyResponse = ResponseInterface<IdentifyResponsePayload>;
    /**
     * Response returned by the application's `REACHABLE_DEVICES` intent handler
     * to describe additional devices visible to the proxy device.
     */
    export type ReachableDevicesResponse =
        ResponseInterface<ReachableDevicesPayload>;

    /**
     * Callback registered with the [[App]] via `onIdentify()` to
     * process incoming device discovery requests.
     */
    export type IdentifyHandler =
        IntentHandler<IdentifyRequest, IdentifyResponse>;

    /**
     * Callback registered with the [[App]] via `onReachableDevices()` to
     * discover additional devices visible to a proxy or hub.
     */
    export type ReachableDevicesHandler =
        IntentHandler<ReachableDevicesRequest, ReachableDevicesResponse>;
  }
}
/**
 * Declares types specific to proxy / hub scenarios.
 */
declare namespace smarthome {
  /**
   * Metadata about a local proxy device.
   *
   * See [[DeviceManager.getProxyInfo]].
   */
  export interface ProxyInfo {
    /** Device ID of the proxy device */
    proxyDeviceId: string;
    /** Device ID of the end device. */
    targetDeviceId: string;
    /** Custom data provided in the `SYNC` response. */
    customData?: unknown;
    /** @hidden */
    proxyData?: string;
  }
}
/** Declares interface to represent scan data that gets send in IDENTIFY. */
declare namespace smarthome {
  export namespace IntentFlow {
    /** Supported Class codes. */
    enum ClassType {
      IN = 'IN',
      /** @hidden */
      CS = 'CS',
      /** @hidden */
      CH = 'CH',
      /** @hidden */
      HS = 'HS',
    }
    /** Definition for mDNS record. */
    interface Record {
      /** Type of the record. 'TXT', SRV, AAAA, etc. */
      type: string;
      /** Class code. As of now only 'IN'/IP network is supported. */
      class: ClassType;
      /** Which name is this record for e.g. 'google.com'. */
      name: string;
      /** @hidden  Time to live. */
      ttl: number;
      /** Data specific to this record. */
      data: string;
    }
    /**
     * Data packet returned with an mDNS scan result
     */
    interface MdnsScanData {
      /** mDNS additional records. */
      additionals: Record[];
    }
    /**
     * Data packet returned with a UDP scan result
     */
    type UdpScanData = string;
    /**
     * Data packet returned with a UPnP scan result
     */
    interface UpnpScanData {
      /**
       * Path component of the URL returned in the LOCATION header.
       */
      location: string;
      /** UUID advertised by the local device. */
      deviceId: string;
      /** Device type advertised by the local device. */
      deviceType: string;
      /** Service type advertised by the local device. */
      serviceType: string;
    }
  }
}
