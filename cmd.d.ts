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
 * Declares DataFlow namespace that provides interface to send commands to
 * platform using DeviceManager send API.
 */
declare namespace smarthome {
  /**
   * Request and response interfaces for communicating with local devices
   * over TCP, UDP, and HTTP.
   * @preferred
   */
  namespace DataFlow {
    interface HttpOptions {
      /** HTTP Content-Type header */
      dataType: string;
      /**
       * List of HTTP headers for the request.
       * @deprecated use [[HttpRequestData.additionalHeaders]]
       */
      headers: string;
      /**
       * Additional HTTP headers for the request, as an object containing
       * key/value pairs.
       * ```
       * {
       *   'Authorization': 'Bearer ...',
       *   'Accept': 'application/json',
       * }
       * ```
       */
      additionalHeaders: {[key: string]: string};
      /** @hidden @deprecated True to send using HTTPS, false for HTTP */
      isSecure?: boolean;
      /** HTTP method to perform */
      method: Constants.HttpOperation;
      /** URI path on the target device */
      path: string;
      /** Port number on the target device. Default is port 80. */
      port?: number;
    }
    /** Content of an HTTP response */
    interface HttpResponse {
      /** HTTP response code */
      statusCode: number;
      /** HTTP response body */
      body: unknown;
    }

    /** @hidden */
    interface Template {}

    /** @hidden Supported Cipher Suites */
    type CipherSuites = 'EC-JPAKE';

    interface TcpOptions {
      /** @hidden True to enable TLS for this request */
      isSecure?: boolean;
      /** Port number on the target device */
      port: number;
      /** TCP operation to perform */
      operation: Constants.TcpOperation;
      /** Hostname on the target device */
      hostname?: string;
      /** For read requests, number of expected bytes */
      bytesToRead?: number;
      /** @hidden Cipher suite to be used for TLS */
      cipher?: CipherSuites;
      /** @hidden Short code needed with EC-JPAKE */
      shortCode?: string;
    }
    /** Content of a TCP response */
    interface TcpResponse {
      /** Hex-encoded payload received from the device. */
      data: string;
    }
    interface UdpOptions {
      /** Port number on the target device */
      port: number;
      /**
       * Expected number of UDP response packets. Actual number of packets
       * received in the [[UdpResponseData]] may not match expected value if
       * timeout of 1 second is exceeded.
       */
      expectedResponsePackets?: number;
    }
    /** Content of a UDP response */
    interface UdpResponse {
      /** Array of hex-encoded packets received from the device. */
      responsePackets?: string[];
    }
    interface CommandBase {
      /** Request ID from the associated `EXECUTE` intent.  */
      requestId: string;
      /** Device ID of the target device. */
      deviceId: string;
      /** Protocol to use when sending this command */
      protocol: Constants.Protocol;
    }
    interface Command extends CommandBase {
      /** Payload sent to the target device */
      data: string;
      /** @hidden Experimental feature, to apply template parameters to data */
      template?: Template;
    }

    interface HttpRequestData extends Command, HttpOptions {}
    interface TcpRequestData extends Command, TcpOptions {}
    interface UdpRequestData extends Command, UdpOptions {}

    /**
     * Request to send a local device command over HTTP.
     * Commands are sent to the device using [[DeviceManager.send]].
     *
     * Example [[GET]] request:
     * ```typescript
     * const command = new DataFlow.HttpRequestData();
     * command.requestId = request.requestId;
     * command.deviceId = 'device-id';
     * command.method = Constants.HttpOperation.GET;
     * command.port = 80;
     * command.path = '/endpoint/control?state=on';
     * ```
     *
     * Example [[POST]] request:
     * ```typescript
     * const postData = {
     *   on: true,
     * };
     *
     * const command = new DataFlow.HttpRequestData();
     * command.requestId = request.requestId;
     * command.deviceId = 'device-id';
     * command.method = Constants.HttpOperation.POST;
     * command.port = 80;
     * command.path = '/endpoint/control';
     * command.dataType = 'application/json';
     * command.data = JSON.stringify(postData);
     * ```
     *
     * ## Handle the response
     *
     * If the command succeeds, [[DeviceManager.send]] returns an
     * [[HttpResponseData]] result, which contains the [[HttpResponse]].
     *
     * ```typescript
     * const command = new DataFlow.HttpRequestData();
     * ...
     *
     * localHomeApp.getDeviceManager()
     *  .send(command)
     *  .then((result: DataFlow.CommandSuccess) => {
     *    const httpResult = result as DataFlow.HttpResponseData;
     *    const responseBody = httpResult.httpResponse.body;
     *  })
     *  .catch((err: IntentFlow.HandlerError) => {
     *    // Handle command error
     *  });
     * ```
     */
    class HttpRequestData implements HttpRequestData {}
    /**
     * Request to send a local device command over TCP sockets.
     * Commands are sent to the device using [[DeviceManager.send]].
     *
     * Example TCP command:
     * ```typescript
     * const payload = new Uint8Array([0x00, 0xFF, 0x00, 0xFF]);
     *
     * const command = new DataFlow.TcpRequestData();
     * command.requestId = request.requestId;
     * command.deviceId = 'device-id';
     * command.port = 5555;
     * command.operation = Constants.TcpOperation.WRITE;
     * command.data = Buffer.from(payload).toString('hex');
     * ```
     *
     * ## Handle the response
     *
     * If the command succeeds, [[DeviceManager.send]] returns a
     * [[TcpResponseData]] result. For [[TcpOperation.READ]] commands, the
     * result contains a [[TcpResponse]].
     *
     * ```typescript
     * const command = new DataFlow.TcpRequestData();
     * command.operation = Constants.TcpOperation.READ;
     * ...
     *
     * localHomeApp.getDeviceManager()
     *  .send(command)
     *  .then((result: DataFlow.CommandSuccess) => {
     *    const tcpResult = result as DataFlow.TcpResponseData;
     *    const response = tcpResult.tcpResponse.data;
     *  })
     *  .catch((err: IntentFlow.HandlerError) => {
     *    // Handle command error
     *  });
     * ```
     */
    class TcpRequestData implements TcpRequestData {}
    /**
     * Request to send a local device command over UDP datagram.
     * Commands are sent to the device using [[DeviceManager.send]].
     *
     * Example UDP command:
     * ```typescript
     * const payload = new Uint8Array([0x00, 0xFF, 0x00, 0xFF]);
     *
     * const command = new DataFlow.UdpRequestData();
     * command.requestId = request.requestId;
     * command.deviceId = 'device-id';
     * command.port = 5555;
     * command.data = Buffer.from(payload).toString('hex');
     * command.expectedResponsePackets = 1;
     * ```
     *
     * ## Handle the response
     *
     * If the command succeeds, [[DeviceManager.send]] returns a
     * [[UdpResponseData]] result. For commands with
     * [[UdpRequestData.expectedResponsePackets]] set, the result contains a
     * [[UdpResponse]].
     *
     * ```typescript
     * const command = new DataFlow.UdpRequestData();
     * command.expectedResponsePackets = 1;
     * ...
     *
     * localHomeApp.getDeviceManager()
     *  .send(command)
     *  .then((result: DataFlow.CommandSuccess) => {
     *    const udpResult = result as DataFlow.UdpResponseData;
     *    const packets = udpResult.udpResponse.responsePackets;
     *  })
     *  .catch((err: IntentFlow.HandlerError) => {
     *    // Handle command error
     *  });
     * ```
     */
    class UdpRequestData implements UdpRequestData {}

    /**
     * Successful response to a [[DeviceManager]] command.
     */
    interface CommandSuccess extends CommandBase {}
    /** Command result containing an [[HttpResponse]]. */
    interface HttpResponseData extends CommandSuccess {
      /** Response to an HTTP request */
      httpResponse: HttpResponse;
    }
    /** Command result containing a [[TcpResponse]]. */
    interface TcpResponseData extends CommandSuccess {
      /** Response to a TCP request */
      tcpResponse: TcpResponse;
    }
    /** Command result containing a [[UdpResponse]]. */
    interface UdpResponseData extends CommandSuccess {
      /** Response to a UDP request. */
      udpResponse: UdpResponse;
    }

    /**
     * Response to a [[DeviceManager]] command that resulted
     * in an error.
     *
     * @deprecated See [[HandlerError]] for handling command failures.
     */
    interface CommandFailure extends CommandBase {
      /** The cause for this error */
      errorCode: string;
      /** Human readable description of this error */
      debugString?: string;
    }
  }

  /**
   * Options for [[DeviceManager.send]] API.
   * Use `send(command, {commandTimeout: 1000});` to wait for the platform to
   * respond with success or timeout after 1000ms.
   * Use `send(command, {retries: 2, delayInMilliseconds: 20});` to retry a
   * command 2 times with 20ms delay between each retry.
   */
  interface SendOptions {
    /**
     * Waits for command response for upto `commandTimeout` ms but no less than
     * 1000ms. Usage outside execute handler is not recommended. In addition, it
     * should be used only when platform provided timeouts are not enough.
     */
    commandTimeout?: number;
    /**
     * Retries the command upto `retries` times upto 3 times. `commandTimeout`
     * applies to each command. Each retry will also get the timeout.
     */
    retries?: number;
    /** Delay in ms between each retry. Default is no-delay between commands. */
    delayInMilliseconds?: number;
  }
}
