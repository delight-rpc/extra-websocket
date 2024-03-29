import { createBatchClient, createClient } from '@src/client.js'
import WebSocket, { WebSocketServer } from 'ws'
import { getErrorPromise } from 'return-style'
import * as DelightRPCWebSocket from '@delight-rpc/websocket'
import { ExtraWebSocket } from 'extra-websocket'
import { promisify } from 'extra-promise'
import { createBatchProxy } from 'delight-rpc'

interface IAPI {
  echo(message: string): string
  error(message: string): never
}

const SERVER_URL = 'ws://localhost:8080'

let server: WebSocketServer
let wsClient: ExtraWebSocket
let cancelServer: () => void
beforeEach(async () => {
  server = new WebSocketServer({ port: 8080 })
  server.on('connection', socket => {
    cancelServer = DelightRPCWebSocket.createServer<IAPI>({
      echo(message) {
        return message
      }
    , error(message) {
        throw new Error(message)
      }
    }, socket)
  })

  wsClient = new ExtraWebSocket(() => new WebSocket(SERVER_URL))
  await wsClient.connect()
})
afterEach(async () => {
  await wsClient.close()

  cancelServer()
  await promisify(server.close.bind(server))()
})

describe('createClient', () => {
  test('echo', async () => {
    const [client] = createClient<IAPI>(wsClient)
    const result = await client.echo('hello')

    expect(result).toBe('hello')
  })

  test('echo (batch)', async () => {
    const [client, close] = createBatchClient(wsClient)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.echo('hello'))
    close()

    expect(result.length).toBe(1)
    expect(result[0].unwrap()).toBe('hello')
  })

  test('error', async () => {
    const [client] = createClient<IAPI>(wsClient)

    const err = await getErrorPromise(client.error('hello'))

    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })

  test('error (batch)', async () => {
    const [client, close] = createBatchClient(wsClient)
    const proxy = createBatchProxy<IAPI>()

    const result = await client.parallel(proxy.error('hello'))
    close()

    expect(result.length).toBe(1)
    const err = result[0].unwrapErr()
    expect(err).toBeInstanceOf(Error)
    expect(err!.message).toMatch('hello')
  })
})
