import { createClient } from '@src/client.js'
import { createServer } from '@src/server.js'
import WebSocket, { WebSocketServer } from 'ws'
import { getErrorPromise } from 'return-style'
import { Level } from 'extra-logger'
import * as DelightRPCWebSocket from '@delight-rpc/websocket'
import { ExtraWebSocket } from 'extra-websocket'
import { promisify } from 'extra-promise'

interface IAPI {
  eval(code: string): Promise<unknown>
}

const api = {
  echo(message: string): string {
    return message
  }
, error(message: string): never {
    throw new Error(message)
  }
}

let server: WebSocketServer
let cancelServer: () => void
beforeEach(() => {
  server = new WebSocketServer({ port: 8080 })
  server.on('connection', socket => {
    const [client] = DelightRPCWebSocket.createClient(socket)
    cancelServer = DelightRPCWebSocket.createServer<IAPI>({
      async eval(code) {
        return await eval(code)
      }
    }, socket)
  })
})
afterEach(async () => {
  cancelServer()
  await promisify(server.close.bind(server))()
})

describe('createServer', () => {
  test('echo', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket('ws://localhost:8080'))
    await wsClient.connect()

    const cancelServer = createServer(api, wsClient, {
      loggerLevel: Level.None
    })
    const [client, close] = createClient<IAPI>(wsClient)
    try {
      const result = await client.eval('client.echo("hello")')
      expect(result).toEqual('hello')
    } finally {
      close()
      wsClient.close()
      cancelServer()
    }
  })

  test('error', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket('ws://localhost:8080'))
    await wsClient.connect()

    const cancelServer = createServer(api, wsClient, {
      loggerLevel: Level.None
    })
    const [client, close] = createClient<IAPI>(wsClient)
    try {
      const err = await getErrorPromise(client.eval('client.error("hello")'))
      expect(err).toBeInstanceOf(Error)
      expect(err!.message).toMatch('hello')
    } finally {
      close()
      wsClient.close()
      cancelServer()
    }
  })
})
