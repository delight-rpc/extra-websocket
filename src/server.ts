import * as DelightRPC from 'delight-rpc'
import { ExtraWebSocket } from 'extra-websocket'
import { MessageEvent } from 'ws'
import { getResult } from 'return-style'
import { Logger, TerminalTransport, Level } from 'extra-logger'
import { isntNull, isString } from '@blackglory/prelude'
import { AbortController } from 'extra-abort'

export { Level } from 'extra-logger'

export function createServer<IAPI extends object>(
  api: DelightRPC.ImplementationOf<IAPI>
, socket: ExtraWebSocket
, { loggerLevel = Level.None, parameterValidators, version, channel, ownPropsOnly }: {
    loggerLevel?: Level
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    version?: `${number}.${number}.${number}`
    channel?: string | RegExp | typeof DelightRPC.AnyChannel
    ownPropsOnly?: boolean
  } = {}
): () => void {
  const logger = new Logger({
    level: loggerLevel
  , transport: new TerminalTransport()
  })
  const idToController: Map<string, AbortController> = new Map()

  const removeMessageListener = socket.on('message', listener)
  socket.on('close', () => {
    for (const controller of idToController.values()) {
      controller.abort()
    }

    idToController.clear()
  })
  return () => removeMessageListener()

  async function listener(event: MessageEvent): Promise<void> {
    const data = event.data
    if (isString(data)) {
      const request = getResult(() => JSON.parse(data))
      if (DelightRPC.isRequest(request) || DelightRPC.isBatchRequest(request)) {
        const controller = new AbortController()
        idToController.set(request.id, controller)

        try {
          const response = await logger.infoTime(
            () => {
              if (DelightRPC.isRequest(request)) {
                return request.method.join('.')
              } else {
                return request.requests.map(x => x.method.join('.')).join(', ')
              }
            }
          , () => DelightRPC.createResponse(
              api
            , request
            , {
                parameterValidators
              , version
              , channel
              , ownPropsOnly
              , signal: controller.signal
              }
            )
          )

          if (isntNull(response)) {
            socket.send(JSON.stringify(response))
          }
        } finally {
          idToController.delete(request.id)
        }
      } else if (DelightRPC.isAbort(request)) {
        if (DelightRPC.matchChannel(request, channel)) {
          idToController.get(request.id)?.abort()
          idToController.delete(request.id)
        }
      }
    }
  }
}
