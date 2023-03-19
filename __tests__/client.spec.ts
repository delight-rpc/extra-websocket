import { createClient } from '@src/client.js'
import WebSocket, { WebSocketServer } from 'ws'
import { getErrorPromise } from 'return-style'
import * as DelightRPCWebSocket from '@delight-rpc/websocket'
import { ExtraWebSocket } from 'extra-websocket'
import { promisify } from 'extra-promise'

interface IAPI {
  echo(message: string): string
  error(message: string): never
}

let server: WebSocketServer
beforeEach(() => {
  server = new WebSocketServer({ port: 8080 })
  server.on('connection', socket => {
    const cancelServer = DelightRPCWebSocket.createServer<IAPI>({
      echo(message) {
        return message
      }
    , error(message) {
        throw new Error(message)
      }
    }, socket)
  })
})
afterEach(async () => {
  await promisify(server.close.bind(server))()
})

describe('createClient', () => {
  test('echo', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket('ws://localhost:8080'))
    await wsClient.connect()

    try {
      const [client] = createClient<IAPI>(wsClient)
      const result = await client.echo('hello')

      expect(result).toBe('hello')
    } finally {
      wsClient.close()
    }
  })

  test('error', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket('ws://localhost:8080'))
    await wsClient.connect()

    try {
      const [client] = createClient<IAPI>(wsClient)
      const err = await getErrorPromise(client.error('hello'))

      expect(err).toBeInstanceOf(Error)
      expect(err!.message).toMatch('hello')
    } finally {
      wsClient.close()
    }
  })
})
