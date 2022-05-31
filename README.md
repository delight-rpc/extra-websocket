# @delight-rpc/extra-websocket
## Install
```sh
npm install --save @delight-rpc/extra-websocket
# or
yarn add @delight-rpc/extra-websocket
```

## API
### createClient
```ts
function createClient<IAPI extends object>(
  socket: ExtraWebSocket
, options?: {
    parameterValidators?: DelightRPC.ParameterValidators<IAPI>
    expectedVersion?: `${number}.${number}.${number}`
    channel?: string
  }
): [client: DelightRPC.ClientProxy<IAPI>, close: () => void]
```

### createBatchClient
```ts
function createBatchClient(
  socket: ExtraWebSocket
, options?: {
    expectedVersion?: `${number}.${number}.${number}`
    channel?: string
  }
): [client: DelightRPC.BatchClient, close: () => void]
```
