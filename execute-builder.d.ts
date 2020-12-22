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

/** Declares Execute Response builder. */
declare namespace smarthome {
  /**
   * Classes for reporting the status of an `EXECUTE` intent.
   */
  namespace Execute.Response {
    /**
     * Use this class to build an instance of [[ExecuteResponse]].
     */
    class Builder {
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
