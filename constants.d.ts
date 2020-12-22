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
 * Main interfaces to access local home platform functionality.
 * @preferred
 */
declare namespace smarthome {
  // Placeholder enum. Actual implementation depends on integration.
  enum Intents {}

  /**
   * Common data type enumerations.
   */
  namespace Constants {
    /**
     * Radio types, useful for apps in deciding the transport to use.
     */
    enum RadioType {
      /** @hidden */
      BLE = 'BLE',
      WIFI = 'WIFI',
    }

    /**
     * Protocol to be used in commands while communicating with the SDK.
     * This value is handled automatically by the SDK when using
     * [[HttpRequestData]], [[TcpRequestData]], and [[UdpRequestData]].
     */
    enum Protocol {
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
    enum BleOperation {
      CREATE_BOND = 'CREATE_BOND',
      DISCONNECT = 'DISCONNECT',
      READ = 'READ',
      REGISTER_FOR_NOTIFICATIONS = 'REGISTER_FOR_NOTIFICATIONS',
      REMOVE_BOND = 'REMOVE_BOND',
      REQUEST_MTU = 'REQUEST_MTU',
      WRITE = 'WRITE',
      WRITE_WITHOUT_RESPONSE = 'WRITE_WITHOUT_RESPONSE',
    }

    /**
     * HTTP transport methods supported by [[HttpRequestData]].
     */
    enum HttpOperation {
      GET = 'GET',
      POST = 'POST',
      PUT = 'PUT',
    }

    /**
     * TCP transport methods supported by [[TcpRequestData]].
     */
    enum TcpOperation {
      READ = 'READ',
      WRITE = 'WRITE',
    }
  }
}
