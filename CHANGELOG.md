# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.7.8](https://github.com/delight-rpc/extra-websocket/compare/v0.7.7...v0.7.8) (2026-02-26)


### Bug Fixes

* **create-client:** an incorrect destruction ([55df6bc](https://github.com/delight-rpc/extra-websocket/commit/55df6bcad28a9206d9d6178da96b29381e036aa2))

### [0.7.7](https://github.com/delight-rpc/extra-websocket/compare/v0.7.6...v0.7.7) (2026-02-26)


### Bug Fixes

* **client, server:** replace `close()` with `abortAllPendings()` ([4cdab88](https://github.com/delight-rpc/extra-websocket/commit/4cdab88f6612391afa3ca9a301006de16a4087aa))

### [0.7.6](https://github.com/delight-rpc/extra-websocket/compare/v0.7.5...v0.7.6) (2026-02-26)


### Bug Fixes

* **client, server:** destructors ([e0c9dfc](https://github.com/delight-rpc/extra-websocket/commit/e0c9dfc583808fb00f2fd4392387b687db6b80a3))

### [0.7.5](https://github.com/delight-rpc/extra-websocket/compare/v0.7.4...v0.7.5) (2026-02-25)


### Features

* add support for delight-rpc@^7.0.0 ([fafa63e](https://github.com/delight-rpc/extra-websocket/commit/fafa63e338212c3ee354e54917d42c0f9153a395))


### Bug Fixes

* **server:** abort requests with channel ([a5fcf6c](https://github.com/delight-rpc/extra-websocket/commit/a5fcf6cafeab5d6e9d4c9869adeed2a1d1641300))

### [0.7.4](https://github.com/delight-rpc/extra-websocket/compare/v0.7.3...v0.7.4) (2026-02-12)


### Bug Fixes

* **client:** replace `Object.entries()` with `Map#entries()` ([98f0dfb](https://github.com/delight-rpc/extra-websocket/commit/98f0dfba58818ef55ea85b70d27bb4954af1e756))

### [0.7.3](https://github.com/delight-rpc/extra-websocket/compare/v0.7.2...v0.7.3) (2026-01-25)

### [0.7.2](https://github.com/delight-rpc/extra-websocket/compare/v0.7.1...v0.7.2) (2025-11-03)

### [0.7.1](https://github.com/delight-rpc/extra-websocket/compare/v0.7.0...v0.7.1) (2025-07-22)


### Features

* add support for extra-websocket v0.5 ([384f1d8](https://github.com/delight-rpc/extra-websocket/commit/384f1d89471e0aa61f0ac0559245bcabac308018))

## [0.7.0](https://github.com/delight-rpc/extra-websocket/compare/v0.6.3...v0.7.0) (2023-12-08)


### ⚠ BREAKING CHANGES

* Node.js v16 => Node.js v18.17.0

* upgrade dependencies ([2813406](https://github.com/delight-rpc/extra-websocket/commit/28134066221d5dae84a5bd4495be4cb6fc50334b))

### [0.6.3](https://github.com/delight-rpc/extra-websocket/compare/v0.6.2...v0.6.3) (2023-12-03)


### Bug Fixes

* createBatchClient ([59f1874](https://github.com/delight-rpc/extra-websocket/commit/59f1874eb5559644edffa4d2b3906e095d299e74))

### [0.6.2](https://github.com/delight-rpc/extra-websocket/compare/v0.6.1...v0.6.2) (2023-04-03)


### Features

* add `Abort` support ([788b4ef](https://github.com/delight-rpc/extra-websocket/commit/788b4ef070106206a7a9c7a4b4772931908a05b6))

### [0.6.1](https://github.com/delight-rpc/extra-websocket/compare/v0.6.0...v0.6.1) (2023-03-19)

## [0.6.0](https://github.com/delight-rpc/extra-websocket/compare/v0.4.1...v0.6.0) (2023-03-19)


### ⚠ BREAKING CHANGES

* CommonJS => ESM

* upgrade dependencies ([5e50cd4](https://github.com/delight-rpc/extra-websocket/commit/5e50cd4bbb6dd41d3c02534f10f7d51e1535686a))

### [0.4.1](https://github.com/delight-rpc/extra-websocket/compare/v0.4.0...v0.4.1) (2023-02-05)

## [0.4.0](https://github.com/delight-rpc/extra-websocket/compare/v0.3.2...v0.4.0) (2022-12-15)


### ⚠ BREAKING CHANGES

* - The minimal version of Node.js is 16
- It requires delight-rpc@^5.0.0

* upgrade dependencies ([2c02f5d](https://github.com/delight-rpc/extra-websocket/commit/2c02f5deaa00b63ed894b7dda3135137c16775f4))

### [0.3.2](https://github.com/delight-rpc/extra-websocket/compare/v0.3.1...v0.3.2) (2022-08-01)

### [0.3.1](https://github.com/delight-rpc/extra-websocket/compare/v0.3.0...v0.3.1) (2022-06-21)

## [0.3.0](https://github.com/delight-rpc/extra-websocket/compare/v0.2.3...v0.3.0) (2022-06-08)


### ⚠ BREAKING CHANGES

* It requires extra-websocket^0.3.0 now

* upgrade dependencies ([e76da75](https://github.com/delight-rpc/extra-websocket/commit/e76da751ac383f2f40bfc0be1919d201a3d267f3))

### [0.2.3](https://github.com/delight-rpc/extra-websocket/compare/v0.2.2...v0.2.3) (2022-06-08)

### [0.2.2](https://github.com/delight-rpc/extra-websocket/compare/v0.2.1...v0.2.2) (2022-06-08)

### [0.2.1](https://github.com/delight-rpc/extra-websocket/compare/v0.2.0...v0.2.1) (2022-05-31)


### Features

* add timeout option ([2b7a477](https://github.com/delight-rpc/extra-websocket/commit/2b7a477104b50876a168cde0dbb279ad27e7de27))

## [0.2.0](https://github.com/delight-rpc/extra-websocket/compare/v0.1.1...v0.2.0) (2022-05-31)


### ⚠ BREAKING CHANGES

* The module requires extra-websocket^0.2.1

* upgrade dependencies ([2bfe88c](https://github.com/delight-rpc/extra-websocket/commit/2bfe88cc168caf55c3f6aecd4730345403e98c94))

### [0.1.1](https://github.com/delight-rpc/extra-websocket/compare/v0.1.0...v0.1.1) (2022-05-31)


### Features

* add createServer ([58d3737](https://github.com/delight-rpc/extra-websocket/commit/58d3737e4235983a2eae6989657a4c9864ea8cbb))

## 0.1.0 (2022-05-31)


### Features

* init ([88a8e76](https://github.com/delight-rpc/extra-websocket/commit/88a8e76fa7107b3ad471b9a6b1e67ed0fc74c4a5))
