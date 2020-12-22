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

/** Declares generic intent request and response JSONs. */
declare namespace smarthome {
  /**
   * `smarthome.IntentFlow` is a namespace that encapsulates all
   * intent request and response objects.
   */
  namespace IntentFlow {
    /** @hidden Allows apps to choose the indication mode for their devices. */
    enum IndicationMode { BLINK = 'BLINK' }

    /**
     * Error codes that can be used in intent responses.
     */
    enum ErrorCode {
      /** Returned when the intent is not supported by the application. */
      NOT_SUPPORTED = 'NOT_SUPPORTED',

      /** Returned when the request is not valid. */
      INVALID_REQUEST = 'INVALID_REQUEST',

      /** Returned when the request is cancelled. */
      INTENT_CANCELLED = 'INTENT_CANCELLED',

      /** Unspecified error occurred. */
      GENERIC_ERROR = 'GENERIC_ERROR',

      /** Returned when the `device` is not identified correctly. */
      DEVICE_NOT_IDENTIFIED = 'DEVICE_NOT_IDENTIFIED',

      /** Returned when the `device` is not supported by local path. */
      DEVICE_NOT_SUPPORTED = 'DEVICE_NOT_SUPPORTED',

      /** Returned when the `device` is not found in sync-ed devices. */
      DEVICE_VERIFICATION_FAILED = 'DEVICE_VERIFICATION_FAILED',
    }

    /**
     * Captures metadata about the device.
     */
    interface DeviceInfo {
      /** Device manufacturer name */
      manufacturer: string;
      /** Device model name */
      model: string;
      /** Device hardware revision */
      hwVersion: string;
      /** Device firmware version */
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
     * Device registered with the platform.
     */
    interface RegisteredDevice {
      id: string;
      customData?: unknown;
      radioType?: Constants.RadioType;
      scanData?: ScanData;
    }
    /**
     * @hidden Generic intent request interface.
     */
    interface Params {}

    /**
     * Generic intent request interface payload.
     */
    interface Payload<D, T = {}> {
      device: D;
      structureData: unknown;
      params: T;
    }
    /**
     * Generic intent request interface input.
     */
    interface Input<D, T = {}> {
      intent: Intents;
      payload: Payload<D, T>;
    }
    /**
     * Generic intent request interface.
     */
    interface RequestInterface<D, T = {}> {
      requestId: string;
      inputs: Array<Input<D, T>>;
      /** @deprecated use [[DeviceManager.getRegisteredDevices]] */
      devices: RegisteredDevice[];
    }
    /**
     * Generic intent response interface payload.
     */
    interface ResponsePayload {
      errorCode?: string;
      debugString?: string;
    }
    /**
     * Generate intent response interface.
     */
    interface ResponseInterface<P> {
      requestId: string;
      // Needed for Report State / Parse Notification.
      agentUserId?: string;
      intent: Intents;
      payload: P;
    }
    /**
     * Generic intent handler.
     */
    interface IntentHandler<REQ, RES> {
      /**
       * Callback function for the intent.
       *
       * Implement this function to handle each intent request and return
       * a response.
       */
      (request: REQ): Promise<RES>|RES;
    }

    /**
     * Use the `HandlerError` class to return an error status from your intent
     * handler code. Classes such as [[DeviceManager]] return an instance of
     * `HandlerError` when an error occurs.
     * For other errors that may occur in your app, you can create a new
     * instance and return a rejected `Promise`.
     *
     * ```
     * identifyHandler(request: IntentFlow.IdentifyRequest):
     *     Promise<IntentFlow.IdentifyResponse> {
     *   const scanData = request.inputs[0].payload.device.udpScanData;
     *   if (!scanData) {
     *     const err = new IntentFlow.HandlerError(request.requestId,
     *         ErrorCode.INVALID_REQUEST, 'Scan data not found');
     *     return Promise.reject(err);
     *   }
     *   ...
     * }
     * ```
     *
     * Errors returned by your app are visible in your cloud project logs.
     * For more details, see the error logging
     * [developer guide](/assistant/smarthome/develop/error-logging).
     *
     */
    class HandlerError extends Error {
      /** Request ID from the associated `EXECUTE` intent. */
      requestId: string;
      /** The cause for this error */
      errorCode: string;
      /** Human readable description of this error */
      debugString?: string;
      /**
       * @param requestId Request ID of the intent.
       * @param errorCode The cause for this error. For more details on error
       *     codes, see [errors and
       *     exceptions](/assistant/smarthome/reference/errors-exceptions).
       * @param debugString Human readable description of this error
       */
      constructor(requestId: string, errorCode?: string, debugString?: string);
    }

    /**
     * Use the `DeviceNotSupportedError` to indicate that the discovered device
     * provided to your [[IdentifyHandler]] should be ignored. The platform will
     * not report this device to your app again until the next reboot.
     *
     * For more details on error handling, see [[HandlerError]].
     */
    class DeviceNotSupportedError extends HandlerError {
      /**
       * @param requestId Request ID of the intent.
       * @param debugString Human readable description of this error.
       */
      constructor(requestId: string, debugString?: string);
    }

    /**
     * Use the `DeviceNotIdentifiedError` to indicate that you are unable to
     * identify the discovered device provided to your [[IdentifyHandler]] using
     * the provided scan data. The platform will not report this device to your
     * app again until the next reset.
     *
     * For more details on error handling, see [[HandlerError]].
     */
    class DeviceNotIdentifiedError extends HandlerError {
      /**
       * @param requestId Request ID of the intent.
       * @param debugString Human readable description of this error.
       */
      constructor(requestId: string, debugString?: string);
    }

    /**
     * Use the `InvalidRequestError` to indicate that you are unable to process
     * the intent request provided to your app.
     *
     * For more details on error handling, see [[HandlerError]].
     */
    class InvalidRequestError extends HandlerError {
      /**
       * @param requestId Request ID of the intent.
       * @param debugString Human readable description of this error.
       */
      constructor(requestId: string, debugString?: string);
    }
  }
}
