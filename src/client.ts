import * as DelightRPC from 'delight-rpc'
import { Deferred } from 'extra-promise'
import { CustomError } from '@blackglory/errors'
import { ExtraWebSocket } from 'extra-websocket'
import type { MessageEvent } from 'ws'
import { getResult } from 'return-style'
import { isString, isUndefined } from '@blackglory/prelude'
import { IResponse, IError, IBatchResponse } from '@delight-rpc/protocol'
import { withAbortSignal, timeoutSignal } from 'extra-abort'

export function createClient<IAPI extends object>(
  socket: ExtraWebSocket
, { parameterValidators, expectedVersion, channel, timeout }: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: string
    channel?: string
    timeout?: number
  } = {}
): [client: DelightRPC.ClientProxy<IAPI>, close: () => void] {
  const pendings: Record<string, Deferred<IResponse<any>> | undefined> = {}

  const removeMessageListener = socket.on('message', listener)

  const client = DelightRPC.createClient<IAPI>(
    async function send(request) {
      const res = new Deferred<IResponse<any>>()
      pendings[request.id] = res
      try {
        socket.send(JSON.stringify(request))
        if (isUndefined(timeout)) {
          return await res
        } else {
          return await withAbortSignal(timeoutSignal(timeout), () => res)
        }
      } finally {
        delete pendings[request.id]
      }
    }
  , {
      parameterValidators
    , expectedVersion
    , channel
    }
  )

  return [client, close]

  function close() {
    removeMessageListener()

    for (const [key, deferred] of Object.entries(pendings)) {
      deferred!.reject(new ClientClosed())
      delete pendings[key]
    }
  }

  function listener(event: MessageEvent): void {
    const data = event.data
    if (isString(data)) {
      const res = getResult(() => JSON.parse(data))
      if (DelightRPC.isResult(res) || DelightRPC.isError(res)) {
        pendings[res.id]?.resolve(res)
      }
    }
  }
}

export function createBatchClient(
  socket: ExtraWebSocket
, { expectedVersion, channel, timeout }: {
    expectedVersion?: string
    channel?: string
    timeout?: number
  } = {}
): [client: DelightRPC.BatchClient, close: () => void] {
  const pendings: Record<
    string
  , Deferred<
    | IError
    | IBatchResponse<unknown>
    > | undefined
  > = {}

  const removeMessageListener = socket.on('message', listener)

  const client = new DelightRPC.BatchClient(
    async function send(request) {
      const res = new Deferred<
      | IError
      | IBatchResponse<unknown>
      >()
      pendings[request.id] = res
      try {
        socket.send(JSON.stringify(request))
        if (isUndefined(timeout)) {
          return await res
        } else {
          return await withAbortSignal(timeoutSignal(timeout), () => res)
        }
      } finally {
        delete pendings[request.id]
      }
    }
  , {
      expectedVersion
    , channel
    }
  )

  return [client, close]

  function close() {
    removeMessageListener()

    for (const [key, deferred] of Object.entries(pendings)) {
      deferred!.reject(new ClientClosed())
      delete pendings[key]
    }
  }

  function listener(event: MessageEvent): void {
    const data = event.data
    if (isString(data)) {
      const res = getResult(() => JSON.parse(data))
      if (DelightRPC.isError(res) || DelightRPC.isBatchResponse(res)) {
        pendings[res.id]?.resolve(res)
      }
    }
  }
}

export class ClientClosed extends CustomError {}
