/**
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

/** Declares Execute and Report State builders. */
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
      /** @param requestId Request ID of the Execute intent. */
      setRequestId(requestId: string): this;
      /**
       * @param deviceId Device ID of the device.
       * @param deviceState If execution was successful, provide new state of
       *     the device.
       */
      setSuccessState(deviceId: string, deviceState: unknown): this;
      /**
       * @param deviceId Device ID of the device.
       * @param errorCode If execution failed, provide the errorCode.
       */
      setErrorState(deviceId: string, errorCode: IntentFlow.ExecuteErrors):
          this;
      /** Build Execute Response JSON. */
      build(): IntentFlow.ExecuteResponse;
    }
  }
}
/** Declares the request and response JSON for cloud intents. */
declare namespace smarthome {
  /**
   * <code>smarthome.IntentFlow</code> is a namespace that encapsulates all
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
      id: string;
      customData?: unknown;
    }
    /**
     * @hidden
     */
    interface QueryRequestPayload {
      devices: DeviceMetadata[];
      structureData: unknown;
    }
    /**
     * Describes the type for QUERY intent request.
     */
    export type QueryRequest = CloudRequest<QueryRequestPayload>;

    /**
     * @hidden
     */
    interface ExecuteRequestExecution {
      command: string;
      params: unknown;
    }
    /**
     * @hidden
     */
    interface ExecuteRequestCommands {
      devices: DeviceMetadata[];
      execution: ExecuteRequestExecution[];
    }
    /**
     * @hidden
     */
    interface ExecuteRequestPayload {
      commands: ExecuteRequestCommands[];
      structureData: unknown;
    }
    /**
     * Describes the type for EXECUTE intent response.
     */
    export type ExecuteRequest = CloudRequest<ExecuteRequestPayload>;

    /**
     * Status for Execute Response.
     */
    export type ExecuteStatus =
        'SUCCESS'|'PENDING'|'OFFLINE'|'ERROR'|'EXCEPTIONS';

    // See an extensive list of error codes at
    // https://developers.google.com/actions/reference/smarthome/errors-exceptions
    type ExecuteErrors = string;
    /**
     * @hidden
     */
    interface CloudResponse<P> {
      requestId: string;
      payload: P;
    }
    /**
     * @hidden
     */
    interface QueryPayload {
      devices: unknown;
    }
    /**
     * Describes the type for QUERY intent response.
     */
    export type QueryResponse = CloudResponse<QueryPayload>;

    /**
     * @hidden
     */
    interface ExecuteResponseCommands {
      ids: string[];
      status: ExecuteStatus;
      errorCode?: ExecuteErrors;
      debugString?: string;
      states?: unknown;
    }
    /**
     * @hidden
     */
    interface ExecutePayload {
      commands: ExecuteResponseCommands[];
      errorCode?: ExecuteErrors;
      debugString?: string;
    }
    /**
     * Describes the type for EXECUTE intent response.
     */
    export type ExecuteResponse = CloudResponse<ExecutePayload>;

    /** Handler type for QUERY intent. */
    export type QueryHandler = IntentHandler<QueryRequest, QueryResponse>;
    /** Handler type for EXECUTE intent. */
    export type ExecuteHandler = IntentHandler<ExecuteRequest, ExecuteResponse>;
  }
}
/**
 * Declares DataFlow namespace that provides interface to send commands to
 * platform using DeviceManager send API.
 */
declare namespace smarthome {
  export namespace DataFlow {
    interface HttpOptions {
      dataType: string;
      headers: string;
      isSecure: boolean;
      method: Constants.HttpOperation;
      path: string;
      port: number;
    }

    interface HttpResponse {
      statusCode: number;
      body: unknown;
    }

    interface TcpOptions {
      isSecure: boolean;
      port: number;
      operation: Constants.TcpOperation;
      hostname?: string;
      bytesToRead?: number;
    }

    interface TcpResponse {
      data: string;
    }

    interface UdpOptions {
      port: number;
    }

    interface UdpResponse {}

    interface CommandBase {
      requestId: string;
      deviceId: string;
      protocol: Constants.Protocol;
    }

    interface Command extends CommandBase {
      data: string;
    }

    interface HttpRequestData extends Command, HttpOptions {}
    interface TcpRequestData extends Command, TcpOptions {}
    interface UdpRequestData extends Command, UdpOptions {}

    /** For sending HTTP commands using DeviceManager.send API. */
    export class HttpRequestData implements HttpRequestData {}
    /** For sending TCP commands using DeviceManager.send API. */
    export class TcpRequestData implements TcpRequestData {}
    /** For sending UDP commands using DeviceManager.send API. */
    export class UdpRequestData implements UdpRequestData {}

    interface CommandSuccess extends CommandBase {}
    export interface HttpResponseData extends CommandSuccess {
      httpResponse: HttpResponse;
    }
    export interface TcpResponseData extends CommandSuccess {
      tcpResponse: TcpResponse;
    }
    export interface UdpResponseData extends CommandSuccess {}

    /** Response object that conveys a failed command. */
    export interface CommandFailure extends CommandBase {
      errorCode: string;
      debugString?: string;
    }
  }
}
/**
 * Declares App interface and Device Manager interface. App interface allows
 * AoGH apps to attach handlers for various intents. Device Manager interface
 * allows AoGH apps to communicate with the AoGH platform.
 */
declare namespace smarthome {
  export namespace IntentFlow {
    interface DeviceScanData {
      radioTypes: Constants.RadioType[];
      mdnsScanData?: MdnsScanData;
      udpScanData?: UdpScanData;
      upnpScanData?: UpnpScanData;
    }
  }

  /** Intents */
  export enum Intents {
    EXECUTE = 'action.devices.EXECUTE',
    IDENTIFY = 'action.devices.IDENTIFY',
    REACHABLE_DEVICES = 'action.devices.REACHABLE_DEVICES',
  }

  export namespace DataFlow {
    /** Generic options object. */
    export type CommandOptions = HttpOptions|TcpOptions|UdpOptions;

    /**
     * Generic command request object that can be used in function signatures
     * that work with command obejcts in a generic way.
     */
    export type CommandRequest = HttpRequestData|TcpRequestData|UdpRequestData;

    /**
     * Generic command response object that can be used in function signatures
     * that work with command obejcts in a generic way.
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
    start: () => Promise<void>;
    send:
        (command: DataFlow.CommandRequest) => Promise<DataFlow.CommandSuccess>;
    markPending: (request: IntentRequest) => Promise<void>;
    getProxyInfo: (id: string) => ProxyInfo;
  }

  /** App interface. */
  export class App {
    constructor(version: string);
    getDeviceManager: () => DeviceManager;
    listen: () => Promise<void>;
    onExecute: (handler: IntentFlow.ExecuteHandler) => this;
    onIdentify: (handler: IntentFlow.IdentifyHandler) => this;
    onReachableDevices: (handler: IntentFlow.ReachableDevicesHandler) => this;
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
      manufacturer: string;
      model: string;
      hwVersion: string;
      swVersion: string;
    }

    /**
     * @hidden
     */
    interface DeviceNames {
      name: string;
      defaultNames?: string[];
      nicknames?: string[];
    }
    /**
     * @hidden
     */
    interface Device {
      attributes?: object;
      customData?: object;
      deviceInfo?: DeviceInfo;
      id: string;
      name: DeviceNames;
      roomHint?: string;
      traits: string[];
      type: string;
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
      requestId: string;
      errorCode: string;
      debugString?: string;
      constructor(requestId: string, errorCode: string, debugString?: string);
    }
  }
}
/** Declares request and response interface between AoGH apps and SDK */
declare namespace smarthome {
  /**
   * `smarthome.Constants` is a namespace that encapsulates a few
   * common enums.
   */
  export namespace Constants {
    /** Radio types, useful for apps in deciding the transport to use. */
    export enum RadioType {WIFI = 'WIFI'}

    /** Protocol, to be used in commands while communicating with the SDK. */
    export enum Protocol {
      HTTP = 'HTTP',
      TCP = 'TCP',
      UDP = 'UDP'
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
/** Declares request and response interface between AoGH apps and SDK */
declare namespace smarthome {
  /**
   * <code>IntentFlow</code> is a namespace that encapsulates all intent request
   * and response objects.
   * @preferred
   */
  export namespace IntentFlow {

    // Device objects depending upon the state of the device.
    interface LocalUnIdentifiedDevice extends DeviceScanData {}

    interface LocalIdentifiedDevice extends DeviceScanData {
      id?: string;
      customData?: unknown;
    }

    interface ProxyDevice extends DeviceScanData {
      id: string;
      customData?: unknown;
      proxyData?: unknown;
    }

    interface LocalProxyDevice {
      proxyDevice: ProxyDevice;
      possiblyReachableDevices: LocalIdentifiedDevice[];
    }

    /** Request Object for IDENTIFY intent. */
    // Using LocalIdentifiedDevice because IDENTIFY is called for already
    // identified devices also.
    export type IdentifyRequest = RequestInterface<LocalIdentifiedDevice>;

    // To explore devices behind a hub.
    /** Request Object for REACHABLE_DEVICES intent.  */
    export type ReachableDevicesRequest = RequestInterface<LocalProxyDevice>;

    /** Intent specific payload interface. */
    interface IdentifyResponsePayload extends ResponsePayload {
      device: {
        id: string;
        type?: string;
        deviceInfo?: DeviceInfo;
        indicationMode?: IndicationMode;
        commandedOverProxy?: boolean;
        isLocalOnly?: boolean;
        isProxy?: boolean;
        requiresBonding?: boolean;
        verificationId?: string;
        avoidAutoconnect?: boolean;
      };
    }

    // Proxy related intents.
    interface ReachableDevicesPayload extends ResponsePayload {
      devices: Array<{id?: string; verificationId?: string;}>;
    }

    /** Response Object for IDENTIFY intent. */
    export type IdentifyResponse = ResponseInterface<IdentifyResponsePayload>;
    /** Response Object for REACHABLE_DEVICES intent. */
    export type ReachableDevicesResponse =
        ResponseInterface<ReachableDevicesPayload>;

    /** Handler type for IDENTIFY intent. */
    export type IdentifyHandler =
        IntentHandler<IdentifyRequest, IdentifyResponse>;

    /** Handler type for REACHABLE_DEVICES intent. */
    export type ReachableDevicesHandler =
        IntentHandler<ReachableDevicesRequest, ReachableDevicesResponse>;
  }
}
/**
 * Declares types specific to proxy / hub scenarios.
 */
declare namespace smarthome {
  /** Provides information about proxy. See [[DeviceManager.getProxyInfo]]. */
  export interface ProxyInfo {
    proxyDeviceId: string;
    targetDeviceId: string;
    customData?: unknown;
    proxyData?: string;
  }
}
/** Declares interface to represent scan data that gets send in IDENTIFY. */
declare namespace smarthome {
  export namespace IntentFlow {
    type MdnsScanData = string;
    type UdpScanData = string;

    interface UpnpScanData {
      /**
       * The path for the URL returned in the LOCATION header. The IP address
       * is stripped out.
       */
      location: string;
      deviceId: string;
      deviceType: string;
      /** Service type as returned in the ST header. */
      serviceType: string;
    }
  }
}