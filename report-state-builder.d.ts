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

/** Declares Report State builder. */
declare namespace smarthome {
  /**
   * `ReportState.Response` is a namespace from which Builder class
   * is accessed.
   */
  namespace ReportState.Response {
    /**
     * `ReportState.Response.Payload` defines report state payload.
     * https://developers.google.com/actions/smarthome/report-state#call_the_api
     */
    interface Payload {
      requestId: string;
      agentUserId?: string;
      payload: {devices: {states: {[id: string]: unknown;};};};
    }

    /**
     * `ReportState.Response.Builder` allows the app to build ReportState
     * payload.
     */
    class Builder {
      /** @param requestId Request ID of the intent. */
      setRequestId(requestId: string): this;
      /**
       * @param agentId Agent User ID, To maintain parity with Report State,
       *     actually its not applicable to seamless setup.
       * @hidden
       */
      setAgentUserId(agentId: string): this;
      /**
       * @param deviceId Device ID of the device.
       * @param deviceState If execution was successful, provide new state of
       *     the device.
       */
      setState(deviceId: string, deviceState: unknown): this;
      /**
       * Build ParseNotification Response, which is somewhat same as
       * ReportState request (expect agentUserId).
       */
      build(): Payload;
    }
  }
}
