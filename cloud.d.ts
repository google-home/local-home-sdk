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

/** Declares the request and response JSON for cloud intents. */
declare namespace smarthome {
  /**
   * `smarthome.IntentFlow` is a namespace that encapsulates all
   * intent request and response objects.
   */
  namespace IntentFlow {
    interface CloudRequest<P> {
      requestId: string;
      inputs: Array<{intent: Intents; payload: P;}>;
    }
    interface DeviceMetadata {
      /** Device ID provided in the `SYNC` response */
      id: string;
      /** Custom data provided in the `SYNC` response */
      customData?: unknown;
    }
    interface QueryRequestPayload {
      /** List of devices to query */
      devices: DeviceMetadata[];
      /** @hidden */
      structureData: unknown;
    }
    /**
     * Request passed to the application's `QUERY` intent handler,
     * containing a list of device IDs to report state.
     *
     * See [[QueryHandler]] for more details.
     */
    type QueryRequest = CloudRequest<QueryRequestPayload>;

    interface ExecuteRequestExecution {
      /** Device trait to be updated */
      command: string;
      /** New state values for the trait attributes */
      params: unknown;
    }
    interface ExecuteRequestCommands {
      /** List of devices to update */
      devices: DeviceMetadata[];
      /** List of traits to update */
      execution: ExecuteRequestExecution[];
    }
    interface ExecuteRequestPayload {
      /** List of commands to execute */
      commands: ExecuteRequestCommands[];
      /** @hidden */
      structureData: unknown;
    }
    /**
     * Request passed to the application's `EXECUTE` intent handler,
     * containing a list of commands and target device IDs to be updated.
     *
     * See [[ExecuteHandler]] for more details.
     */
    type ExecuteRequest = CloudRequest<ExecuteRequestPayload>;

    /**
     * Response status codes for `EXECUTE` intent requests.
     */
    type ExecuteStatus = 'SUCCESS'|'PENDING'|'OFFLINE'|'ERROR'|'EXCEPTIONS';

    /**
     * For a list of the supported `EXECUTE` error codes, see
     * [Errors and exceptions](/assistant/smarthome/reference/errors-exceptions)
     */
    type ExecuteErrors = string;
    interface CloudResponse<P> {
      requestId: string;
      payload: P;
    }
    /**
     * Content of the [[QueryResponse]] returned by the application's
     * `QUERY` intent handler.
     */
    interface QueryPayload {
      devices: unknown;
    }
    /**
     * Response returned by the application's `QUERY` intent handler.
     *
     * See [[QueryHandler]] for more details.
     */
    type QueryResponse = CloudResponse<QueryPayload>;

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
     * Container for the status of the commands that the local app received
     * in an `EXECUTE` intent.
     *
     * Use [[Response.Builder]] to create an [[ExecuteResponse]] instance and
     * set the corresponding status for each target device ID present in
     * the [[ExecuteRequest]].
     *
     * ```
     * const response = new Execute.Response.Builder()
     *     .setRequestId(request.requestId);
     *
     * const result = localHomeApp.getDeviceManager()
     *   .send(deviceCommand)
     *   .then((result) => {
     *     // Handle command success
     *     response.setSuccessState(device.id, state);
     *   })
     *   .catch((err: IntentFlow.HandlerError) => {
     *     // Handle command error
     *     response.setErrorState(device.id, err.errorCode);
     *   });
     *
     * return result.then(() => response.build());
     * ```
     *
     * See [[ExecuteHandler]] for more details.
     */
    type ExecuteResponse = CloudResponse<ExecutePayload>;

    /**
     * Callback registered with the [[App]] via [[App.onQuery]] to process
     * requests for current device state.
     */
    interface QueryHandler extends IntentHandler<QueryRequest, QueryResponse> {}
    /**
     * Callback registered with the [[App]] via [[App.onExecute]] to process
     * requests to update device state.
     *
     * To support local fulfillment, the local home platform must first
     * establish a local fulfillment path. For more details, see the
     * [developer guide](/assistant/smarthome/develop/local).
     *
     * ```typescript
     * const executeHandler = (request: IntentFlow.ExecuteRequest):
     *   Promise<IntentFlow.ExecuteResponse> => {
     *
     *     // Extract command(s) and device target(s) from request
     *     const command = request.inputs[0].payload.commands[0];
     *     const execution = command.execution[0];
     *
     *     const response = new Execute.Response.Builder()
     *       .setRequestId(request.requestId);
     *
     *     const result = command.devices.map((device) => {
     *       // Construct a local device command
     *       const deviceCommand = new DataFlow.TcpRequestData();
     *       // ...
     *
     *       // Send command to the local device
     *       return localHomeApp.getDeviceManager()
     *         .send(deviceCommand)
     *         .then((result) => {
     *           response.setSuccessState(result.deviceId, state);
     *         })
     *         .catch((err: IntentFlow.HandlerError) => {
     *           err.errorCode = err.errorCode || "invalid_request";
     *           response.setErrorState(device.id, err.errorCode);
     *         });
     *     });
     *
     *     // Respond once all commands complete
     *     return Promise.all(result)
     *       .then(() => response.build());
     *   };
     * ```
     *
     */
    interface ExecuteHandler extends
        IntentHandler<ExecuteRequest, ExecuteResponse> {}
  }
}
