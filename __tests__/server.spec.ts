import { createClient } from '@src/client.js'
import { createServer } from '@src/server.js'
import WebSocket, { WebSocketServer } from 'ws'
import { getErrorPromise } from 'return-style'
import { Level } from 'extra-logger'
import * as DelightRPCWebSocket from '@delight-rpc/websocket'
import { ExtraWebSocket } from 'extra-websocket'
import { delay, promisify } from 'extra-promise'
import { assert } from '@blackglory/errors'
import { javascript } from 'extra-tags'
import { AbortError } from 'extra-abort'

interface IAPI {
  eval(code: string): Promise<unknown>
}

const SERVER_URL = 'ws://localhost:8080'

const api = {
  echo(message: string): string {
    return message
  }
, error(message: string): never {
    throw new Error(message)
  }
, async loop(signal?: AbortSignal): Promise<never> {
    assert(signal)

    while (!signal.aborted) {
      await delay(100)
    }

    throw signal.reason
  }
}

let server: WebSocketServer
let cancelServer: (() => void) | undefined
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
  cancelServer?.()

  await promisify(server.close.bind(server))()
})

describe('createServer', () => {
  test('result', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket(SERVER_URL))
    await wsClient.connect()

    const cancelServer = createServer(api, wsClient, {
      loggerLevel: Level.None
    })
    const [client, close] = createClient<IAPI>(wsClient)
    try {
      const result = await client.eval(javascript`
        client.echo('hello')
      `)
      expect(result).toEqual('hello')
    } finally {
      close()
      await wsClient.close()
      cancelServer()
    }
  })

  test('error', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket(SERVER_URL))
    await wsClient.connect()

    const cancelServer = createServer(api, wsClient, {
      loggerLevel: Level.None
    })
    const [client, close] = createClient<IAPI>(wsClient)
    try {
      const err = await getErrorPromise(client.eval(javascript`
        client.error('hello')
      `))
      expect(err).toBeInstanceOf(Error)
      expect(err!.message).toMatch('hello')
    } finally {
      close()
      await wsClient.close()
      cancelServer()
    }
  })

  test('abort', async () => {
    const wsClient = new ExtraWebSocket(() => new WebSocket(SERVER_URL))
    await wsClient.connect()

    const cancelServer = createServer(api, wsClient)
    const [client, close] = createClient<IAPI>(wsClient)
    try {
      const err = await getErrorPromise(client.eval(javascript`
        const controller = new AbortController()
        const promise = client.loop(controller.signal)
        controller.abort()
        promise
      `))

      expect(err).toBeInstanceOf(AbortError)
    } finally {
      close()
      await wsClient.close()
      cancelServer()
    }
  })
})
