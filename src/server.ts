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
      const message = getResult(() => JSON.parse(data))
      if (DelightRPC.isRequest(message) || DelightRPC.isBatchRequest(message)) {
        const controller = new AbortController()
        idToController.set(message.id, controller)

        try {
          const response = await logger.infoTime(
            () => {
              if (DelightRPC.isRequest(message)) {
                return message.method.join('.')
              } else {
                return message.requests.map(x => x.method.join('.')).join(', ')
              }
            }
          , () => DelightRPC.createResponse(
              api
            , message
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
          idToController.delete(message.id)
        }
      } else if (DelightRPC.isAbort(message)) {
        if (DelightRPC.matchChannel(message, channel)) {
          idToController.get(message.id)?.abort()
          idToController.delete(message.id)
        }
      }
    }
  }
}
