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
 * Declares DataFlow namespace that provides interface to send commands to
 * platform using DeviceManager send API.
 */
declare namespace smarthome {
  /**
   * Request and response interfaces for communicating with local devices
   * over TCP, UDP, and HTTP.
   * @preferred
   */
  export namespace DataFlow {
    /** @hidden */
    interface HttpOptions {
      /** HTTP Content-Type header */
      dataType: string;
      /** List of HTTP headers for the request */
      headers: string;
      /** @hidden @deprecated True to send using HTTPS, false for HTTP */
      isSecure?: boolean;
      /** HTTP method to perform */
      method: Constants.HttpOperation;
      /** URI path on the target device */
      path: string;
      /** Port number on the target device. Default is port 80. */
      port?: number;
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
      /** @hidden @deprecated True to enable TLS for this request */
      isSecure?: boolean;
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
     */
    export class HttpRequestData implements HttpRequestData {}
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
     */
    export class TcpRequestData implements TcpRequestData {}
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
     * ```
     *
     */
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
