import * as DelightRPC from 'delight-rpc'
import { ExtraWebSocket } from 'extra-websocket'
import { MessageEvent } from 'ws'
import { getResult } from 'return-style'
import { Logger, TerminalTransport, Level } from 'extra-logger'
import { isntNull, isString } from '@blackglory/prelude'

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

  const removeMessageListener = socket.on('message', listener)
  return () => removeMessageListener()

  async function listener(event: MessageEvent): Promise<void> {
    const data = event.data
    if (isString(data)) {
      const request = getResult(() => JSON.parse(data))
      if (DelightRPC.isRequest(request) || DelightRPC.isBatchRequest(request)) {
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
            }
          )
        )

        if (isntNull(response)) {
          socket.send(JSON.stringify(response))
        }
      }
    }
  }
}
