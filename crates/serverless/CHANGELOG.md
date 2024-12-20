# @lagoss/serverless

## 0.4.5

### Patch Changes

- [#79](https://github.com/lagossapp/lagoss/pull/79) [`9c4fa61`](https://github.com/lagossapp/lagoss/commit/9c4fa6154358cd704b579db1b3fae80f1da87990) Thanks [@anbraten](https://github.com/anbraten)! - Fix docker tag creation

## 0.4.4

### Patch Changes

- [#48](https://github.com/lagossapp/lagoss/pull/48) [`b8024e4`](https://github.com/lagossapp/lagoss/commit/b8024e40431b1e34ef340f59d9cc21f2ed33dc40) Thanks [@anbraten](https://github.com/anbraten)! - Update logging

## 0.4.3

### Patch Changes

- [#45](https://github.com/lagossapp/lagoss/pull/45) [`7287ab5`](https://github.com/lagossapp/lagoss/commit/7287ab537e12073016d4310e2b444567d6d6832a) Thanks [@anbraten](https://github.com/anbraten)! - Fix docker tags pattern

## 0.4.2

### Patch Changes

- [#43](https://github.com/lagossapp/lagoss/pull/43) [`d08bbb2`](https://github.com/lagossapp/lagoss/commit/d08bbb251067dfa551f0ae9d2b814ff5ab309df0) Thanks [@anbraten](https://github.com/anbraten)! - Fix asset loading

## 0.4.1

### Patch Changes

- [#41](https://github.com/lagossapp/lagoss/pull/41) [`7735890`](https://github.com/lagossapp/lagoss/commit/77358906a195bcab639db74ff5d1a22f42dcc209) Thanks [@anbraten](https://github.com/anbraten)! - Fix docker tag and publishing

## 0.4.0

### Minor Changes

- [#30](https://github.com/lagossapp/lagoss/pull/30) [`5036840`](https://github.com/lagossapp/lagoss/commit/5036840b66f8d380e4f35e6f044054a86672da6f) Thanks [@anbraten](https://github.com/anbraten)! - Load deployments using api

## 0.3.1

### Patch Changes

- [#18](https://github.com/lagossapp/lagoss/pull/18) [`0066bcf`](https://github.com/lagossapp/lagoss/commit/0066bcf7e24c81d2778c5c39fd05493afb985bd3) Thanks [@anbraten](https://github.com/anbraten)! - Create tags for private packages

## 0.3.0

### Minor Changes

- [#14](https://github.com/lagossapp/lagoss/pull/14) [`7a9b7da`](https://github.com/lagossapp/lagoss/commit/7a9b7daef8d11137f7e7b6b954ab0d6f0a37d443) Thanks [@anbraten](https://github.com/anbraten)! - Renamed from lagon to lagoss

### Patch Changes

- [#1027](https://github.com/lagonapp/lagon/pull/1027) [`0fb1f28`](https://github.com/lagossapp/lagoss/commit/0fb1f28818c8c2f781b9e571d7af5e8cdaea0f94) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Properly remove Cron functions

- [#15](https://github.com/lagossapp/lagoss/pull/15) [`55eee53`](https://github.com/lagossapp/lagoss/commit/55eee53d29aacf7134e1efced4dcac3ff5450585) Thanks [@anbraten](https://github.com/anbraten)! - Fix release workflow

## 0.2.4

### Patch Changes

- [#1001](https://github.com/lagonapp/lagon/pull/1001) [`d71d4c5`](https://github.com/lagonapp/lagon/commit/d71d4c56256090e1dd5f7ed15209ccb4c002d951) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Throw an error if handler function do no return a Response

## 0.2.3

### Patch Changes

- [#932](https://github.com/lagonapp/lagon/pull/932) [`dd96fd0`](https://github.com/lagonapp/lagon/commit/dd96fd0bf692c01023727d12415d737b21035f7d) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Add `CompressionStream` & `DecompressionStream` APIs

- [#976](https://github.com/lagonapp/lagon/pull/976) [`0d874be`](https://github.com/lagonapp/lagon/commit/0d874be5980287e9433ffcbfcb5364c551022356) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use Jemalloc instead of the default allocator

- [#977](https://github.com/lagonapp/lagon/pull/977) [`2cda111`](https://github.com/lagonapp/lagon/commit/2cda111f85d053b467a70a3486ebfb60ddaea5cc) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Reduce `clone()`ing

- [#965](https://github.com/lagonapp/lagon/pull/965) [`32a2c08`](https://github.com/lagonapp/lagon/commit/32a2c08a469a5dbcd23d47bafbd91d851f8a750d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Allow `fetch()` with a `Request`

- [#979](https://github.com/lagonapp/lagon/pull/979) [`cbc66fa`](https://github.com/lagonapp/lagon/commit/cbc66fa4d396792fb6e823f086824954bf42f6eb) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Avoid allocating `String` where possible and use `&str` instead

- [#969](https://github.com/lagonapp/lagon/pull/969) [`a232492`](https://github.com/lagonapp/lagon/commit/a232492c317c8c4fe74fac0e87a0f1a60fafb505) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add a fast path when handling assets, inline dashmap

## 0.2.2

### Patch Changes

- [#916](https://github.com/lagonapp/lagon/pull/916) [`a8a02dd`](https://github.com/lagonapp/lagon/commit/a8a02dd0bd244599d9c6be622e79c6f4cb1b3db4) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Replace once_cell with std's OnceLock

- [#949](https://github.com/lagonapp/lagon/pull/949) [`d003a29`](https://github.com/lagonapp/lagon/commit/d003a2937775f00c17e1bf6b83d46310355c077d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve performance of Headers & Body (Request & Response)

- [#952](https://github.com/lagonapp/lagon/pull/952) [`1a63dc7`](https://github.com/lagonapp/lagon/commit/1a63dc7e2ed22408455758265a901992bc059ab8) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add x-robots-tag: noindex header to preview deployments responses

- [#948](https://github.com/lagonapp/lagon/pull/948) [`1075ea8`](https://github.com/lagonapp/lagon/commit/1075ea823e1fb810642e883460240ffaa82cd713) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix redis pub/sub sometimes disconnecting

- [#916](https://github.com/lagonapp/lagon/pull/916) [`a8a02dd`](https://github.com/lagonapp/lagon/commit/a8a02dd0bd244599d9c6be622e79c6f4cb1b3db4) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Set region label for prometheus exporter globally

- [#941](https://github.com/lagonapp/lagon/pull/941) [`2dcce72`](https://github.com/lagonapp/lagon/commit/2dcce72d3d0033472c36d2817d8e13153aeaa1bf) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Support HTTP/2 (along with HTTP/1.1) in `fetch()`

- [#939](https://github.com/lagonapp/lagon/pull/939) [`079c008`](https://github.com/lagonapp/lagon/commit/079c008d7e140328a1e128dac0ec167509457028) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix sync responses bytes length

- [#948](https://github.com/lagonapp/lagon/pull/948) [`1075ea8`](https://github.com/lagonapp/lagon/commit/1075ea823e1fb810642e883460240ffaa82cd713) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use rustls-ls instead of native-tls

## 0.2.1

### Patch Changes

- [#928](https://github.com/lagonapp/lagon/pull/928) [`28bd4c6`](https://github.com/lagonapp/lagon/commit/28bd4c644db583b54827f5f1a6bee7ce0f64b4bb) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Set content-length header to 0 when body is null and method POST or PUT in `fetch()`

- [#929](https://github.com/lagonapp/lagon/pull/929) [`0174cad`](https://github.com/lagonapp/lagon/commit/0174cad77f41def0092583880c5c88f530e345d2) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Revert isolates cache eviction using ClickHouse to use local cache instead

- [#924](https://github.com/lagonapp/lagon/pull/924) [`cacb962`](https://github.com/lagonapp/lagon/commit/cacb9626c2039c3b1932152220467dc6206f8389) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Retrieve environment variables when booting

## 0.2.0

### Minor Changes

- [#873](https://github.com/lagonapp/lagon/pull/873) [`dd2b64e`](https://github.com/lagonapp/lagon/commit/dd2b64ef9cff03c079af60faf6e22c708d5aa78e) Thanks [@anbraten](https://github.com/anbraten)! - Release container image

### Patch Changes

- [#835](https://github.com/lagonapp/lagon/pull/835) [`12ff778`](https://github.com/lagonapp/lagon/commit/12ff77821b74bffc483a216c46053e270ddde64a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve implementation of Headers, Request, Response and URLSearchParams

- [#907](https://github.com/lagonapp/lagon/pull/907) [`6a593cb`](https://github.com/lagonapp/lagon/commit/6a593cbc3b1a853a6b2170a8d1d696ddf0e101d6) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix logs time-to-live

- [#920](https://github.com/lagonapp/lagon/pull/920) [`10d4086`](https://github.com/lagonapp/lagon/commit/10d40869d96f1d4ee590d5144a36941aee8d6b71) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add Cron Functions

- [#915](https://github.com/lagonapp/lagon/pull/915) [`f05147b`](https://github.com/lagonapp/lagon/commit/f05147b663e788c04680d76a1ce8a7c9a0f87959) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Replace assets table with a json column

## 0.1.33

### Patch Changes

- [#868](https://github.com/lagonapp/lagon/pull/868) [`33fa56c`](https://github.com/lagonapp/lagon/commit/33fa56c12b80d091a45fdffac0791c46f760e2e2) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Allow `export as` for handler function

* [#889](https://github.com/lagonapp/lagon/pull/889) [`62447ba`](https://github.com/lagonapp/lagon/commit/62447bac3dbef88eb31a2ade620f478e7c27b538) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Support RSA-OAEP for `SubtleCrypto#encrypt` & `SubtleCrypto#decrypto`

- [#883](https://github.com/lagonapp/lagon/pull/883) [`00c1e66`](https://github.com/lagonapp/lagon/commit/00c1e6630d43f247e8d9893e63ff5de1ca7e64f5) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve performance by always using Hyper types

## 0.1.32

### Patch Changes

- [#863](https://github.com/lagonapp/lagon/pull/863) [`4e6968a`](https://github.com/lagonapp/lagon/commit/4e6968a3688f52530cb4aed09022fd5dc54c0a80) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Add AES-CTR to `SubtleCrypto#encrypt` & `SubtleCrypto#decrypt`

* [#860](https://github.com/lagonapp/lagon/pull/860) [`f3ee3c4`](https://github.com/lagonapp/lagon/commit/f3ee3c44247d3776c8a2c339d1ca757e5f05b8e0) Thanks [@QuiiBz](https://github.com/QuiiBz)! - `SubtleCrypto#importKey` re-use key data

- [#857](https://github.com/lagonapp/lagon/pull/857) [`c08bbf9`](https://github.com/lagonapp/lagon/commit/c08bbf9405718d7c361f252f7485766fa3ab274c) Thanks [@QuiiBz](https://github.com/QuiiBz)! - `crypto#getRandomValues` updates array in-place

* [#861](https://github.com/lagonapp/lagon/pull/861) [`22f5cc1`](https://github.com/lagonapp/lagon/commit/22f5cc1eea6d65963060d289945dc956312a50b3) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Add RSA-PSS, RSASSA-PKCS1-v1_5 & ECDSA to `SubtleCrypto#sign` & `SubtleCrypto#verify`

## 0.1.31

### Patch Changes

- [#839](https://github.com/lagonapp/lagon/pull/839) [`52b170a`](https://github.com/lagonapp/lagon/commit/52b170a993e43da1bf465d2e5c7dd848c9eb1168) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Add SubtleCrypto#deriveBits

* [#851](https://github.com/lagonapp/lagon/pull/851) [`66b1fa5`](https://github.com/lagonapp/lagon/commit/66b1fa59992ac5fba83f6a0bdec49a6621bacc2c) Thanks [@akitaSummer](https://github.com/akitaSummer)! - Add SubtleCrypto#deriveKey

- [#853](https://github.com/lagonapp/lagon/pull/853) [`7d27a6a`](https://github.com/lagonapp/lagon/commit/7d27a6a87829bc8ddf59caa9e57d2cbab8597da3) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Ingest results error to the logs

* [#848](https://github.com/lagonapp/lagon/pull/848) [`cd214f2`](https://github.com/lagonapp/lagon/commit/cd214f2f20aa9bc32f96c0bc7841ac308650d3b7) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Support AES-CBC for `SubtleCrypto#encrypt` & `SubtleCrypto#decrypt`

## 0.1.30

### Patch Changes

- [#833](https://github.com/lagonapp/lagon/pull/833) [`3101c9e`](https://github.com/lagonapp/lagon/commit/3101c9eddb36c76a790d7c73ba4e54256e44cfb0) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Tweak release build flags to improve performance

## 0.1.29

### Patch Changes

- [#818](https://github.com/lagonapp/lagon/pull/818) [`cfa7238`](https://github.com/lagonapp/lagon/commit/cfa723805390f97d2fe1493c94094e1bfd34c09c) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Reduce head allocations on responses

* [#811](https://github.com/lagonapp/lagon/pull/811) [`b3b8b0f`](https://github.com/lagonapp/lagon/commit/b3b8b0f92957176abe6acdd9c07da9ec7496072f) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Download deployments assets in parallel

## 0.1.28

### Patch Changes

- [#778](https://github.com/lagonapp/lagon/pull/778) [`54df73e`](https://github.com/lagonapp/lagon/commit/54df73e6a0043307f4e153613806122fad1809d2) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use once_cell instead of lazy_static

## 0.1.27

### Patch Changes

- [#756](https://github.com/lagonapp/lagon/pull/756) [`4c50bf5`](https://github.com/lagonapp/lagon/commit/4c50bf5e4a73093381411dc8efde2adef2210bf2) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Download deployments in parallel

* [#754](https://github.com/lagonapp/lagon/pull/754) [`9cd29c6`](https://github.com/lagonapp/lagon/commit/9cd29c605ac58f94c6170d13c1f8cb4ca1c0cd0f) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Store logs for 7 days

## 0.1.26

### Patch Changes

- [#728](https://github.com/lagonapp/lagon/pull/728) [`476c2e2`](https://github.com/lagonapp/lagon/commit/476c2e23d1ce4ff5e30d3ccd2bd51f2070db4f6d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Migrate underlaying storage for stats & logs to Clickhouse

* [#733](https://github.com/lagonapp/lagon/pull/733) [`a75de67`](https://github.com/lagonapp/lagon/commit/a75de673cae0e7d2b2ef140b0e54df63875db27a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Limit maximum response time

## 0.1.25

### Patch Changes

- [#665](https://github.com/lagonapp/lagon/pull/665) [`a2ba9ce`](https://github.com/lagonapp/lagon/commit/a2ba9cec1bdfcabaee1e286f9a091f3a97899700) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Reply 403 for HTTP access to cron functions

* [#676](https://github.com/lagonapp/lagon/pull/676) [`54e37e3`](https://github.com/lagonapp/lagon/commit/54e37e34b3d49a1ecc70203db4a4bd99165bfa1c) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Allow parallel requests to the same isolate

- [#681](https://github.com/lagonapp/lagon/pull/681) [`e714ac3`](https://github.com/lagonapp/lagon/commit/e714ac3aed03fc3ae2703a9c22ee738cccd89136) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Remove useless LAGON_WORKERS env variable

* [#665](https://github.com/lagonapp/lagon/pull/665) [`a2ba9ce`](https://github.com/lagonapp/lagon/commit/a2ba9cec1bdfcabaee1e286f9a091f3a97899700) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Listen Redis Pub/Sub in another thread

- [#665](https://github.com/lagonapp/lagon/pull/665) [`a2ba9ce`](https://github.com/lagonapp/lagon/commit/a2ba9cec1bdfcabaee1e286f9a091f3a97899700) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Reuse isolates across domains using the same deployment id

* [#681](https://github.com/lagonapp/lagon/pull/681) [`e714ac3`](https://github.com/lagonapp/lagon/commit/e714ac3aed03fc3ae2703a9c22ee738cccd89136) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Split pub/sub & s3 downloading logic into separate crates

## 0.1.24

### Patch Changes

- [#648](https://github.com/lagonapp/lagon/pull/648) [`0a1dcce`](https://github.com/lagonapp/lagon/commit/0a1dcce63e90e38104b48f9957e4578996089d72) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix logs not streaming to Axiom

* [#663](https://github.com/lagonapp/lagon/pull/663) [`822db09`](https://github.com/lagonapp/lagon/commit/822db09957b439cf548dd5bac85e7325e6a468c8) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use ThreadRng instead of creating a new StdRng every time

- [#663](https://github.com/lagonapp/lagon/pull/663) [`822db09`](https://github.com/lagonapp/lagon/commit/822db09957b439cf548dd5bac85e7325e6a468c8) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use DashMap instead of RwLock<HashMap>

## 0.1.23

### Patch Changes

- [#627](https://github.com/lagonapp/lagon/pull/627) [`7671236`](https://github.com/lagonapp/lagon/commit/7671236956bb23f954caed45bd10543ca60f78b5) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Don't skip deployment when asset failed to download

* [#626](https://github.com/lagonapp/lagon/pull/626) [`06093d0`](https://github.com/lagonapp/lagon/commit/06093d051898d7603f356b9cae5e3f14078d480a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Send error messages to logs

## 0.1.22

### Patch Changes

- [#622](https://github.com/lagonapp/lagon/pull/622) [`c0cd90f`](https://github.com/lagonapp/lagon/commit/c0cd90fa08c4861def6196b6527af6cd9aa96ed5) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Support multiple request/response headers for set-cookie

## 0.1.21

### Patch Changes

- [#616](https://github.com/lagonapp/lagon/pull/616) [`16b0a43`](https://github.com/lagonapp/lagon/commit/16b0a43cd0df659f360448befa9ca22285728f0a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add `LAGON_WORKERS` environment variable to customize the size of the worker's pool

* [#616](https://github.com/lagonapp/lagon/pull/616) [`16b0a43`](https://github.com/lagonapp/lagon/commit/16b0a43cd0df659f360448befa9ca22285728f0a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Allow concurrent requests of isolates

## 0.1.20

### Patch Changes

- [#614](https://github.com/lagonapp/lagon/pull/614) [`909ff4b`](https://github.com/lagonapp/lagon/commit/909ff4b12ff8dd2f2b282b0c913b14a27ebf7baa) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Reconnect Redis Pub/Sub on error

## 0.1.19

### Patch Changes

- [#591](https://github.com/lagonapp/lagon/pull/591) [`0b422d6`](https://github.com/lagonapp/lagon/commit/0b422d698d80a77c5ed92bbb213078292092776f) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add option to load V8 heap snapshot

* [#580](https://github.com/lagonapp/lagon/pull/580) [`74efd18`](https://github.com/lagonapp/lagon/commit/74efd186f97b86dd085c7a90e1f35c78507f5bbe) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use lagon.dev for Lagon-hosted functions

## 0.1.18

### Patch Changes

- [#564](https://github.com/lagonapp/lagon/pull/564) [`8745295`](https://github.com/lagonapp/lagon/commit/87452957505670a0f538505384203d40728da73d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Send 404 if favicon doesn't exists

* [#568](https://github.com/lagonapp/lagon/pull/568) [`867ce0c`](https://github.com/lagonapp/lagon/commit/867ce0ce9e2b97890a385915eaf9ac8474d83188) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix bytes event on sync responses

- [#573](https://github.com/lagonapp/lagon/pull/573) [`90520ae`](https://github.com/lagonapp/lagon/commit/90520ae11497e4b4bf68d8f74fdd627f7fcf33a7) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix logging HTTP request

* [#571](https://github.com/lagonapp/lagon/pull/571) [`b2cca7f`](https://github.com/lagonapp/lagon/commit/b2cca7f897bd5f86e8e32a87a119bf5fa6b8d540) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Trace request id in logs

## 0.1.17

### Patch Changes

- [#557](https://github.com/lagonapp/lagon/pull/557) [`15477b1`](https://github.com/lagonapp/lagon/commit/15477b1b8dfef8076afceaed930044c280175b7c) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add IP-based authorization to prometheus exporter

* [#559](https://github.com/lagonapp/lagon/pull/559) [`8e2eaa0`](https://github.com/lagonapp/lagon/commit/8e2eaa0149d0b65e00414f27ff526afa93af78b7) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve error pages

## 0.1.16

### Patch Changes

- [#484](https://github.com/lagonapp/lagon/pull/484) [`d487cd0`](https://github.com/lagonapp/lagon/commit/d487cd0aa08cd0f9908a096133a3705aceeee73f) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Always drop isolates on the same thread as created

* [#493](https://github.com/lagonapp/lagon/pull/493) [`f15be2f`](https://github.com/lagonapp/lagon/commit/f15be2f4f568c0a42ab247104d8198d688a0413d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Support cron deployments

## 0.1.15

### Patch Changes

- [#483](https://github.com/lagonapp/lagon/pull/483) [`9468c1f`](https://github.com/lagonapp/lagon/commit/9468c1fc75e45cbe042f5a5b106158d918616562) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Drop and exit isolates in the same thread as they were created

* [#463](https://github.com/lagonapp/lagon/pull/463) [`6cabfb7`](https://github.com/lagonapp/lagon/commit/6cabfb78a97f69cf2206252c423f8fa409a371ad) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use the system root CA to connect to MySQL

- [#458](https://github.com/lagonapp/lagon/pull/458) [`083f639`](https://github.com/lagonapp/lagon/commit/083f6396bb79622222eabd0b769c3a7f382d5d21) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Allow ending a stream before sending the response

## 0.1.14

### Patch Changes

- [#416](https://github.com/lagonapp/lagon/pull/416) [`c3bbdb3`](https://github.com/lagonapp/lagon/commit/c3bbdb366ee6d419d1738511b3f547899c89e983) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Stop streaming and log errors when we have errors/timeouts/memory limits

* [#416](https://github.com/lagonapp/lagon/pull/416) [`c3bbdb3`](https://github.com/lagonapp/lagon/commit/c3bbdb366ee6d419d1738511b3f547899c89e983) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Handle termination results (timeouts and memory limit) before processing streaming to avoid hanging

## 0.1.13

### Patch Changes

- [#389](https://github.com/lagonapp/lagon/pull/389) [`5ec41ee`](https://github.com/lagonapp/lagon/commit/5ec41ee203bba86cb66d9486ffcde9fd2f28e361) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add metrics for errors/timeouts/memory limits

* [#397](https://github.com/lagonapp/lagon/pull/397) [`ab4e2ac`](https://github.com/lagonapp/lagon/commit/ab4e2ac7e1882497a57ed68e54ce972826c98acf) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use an Rc for isolates metadata instead of cloning

- [#379](https://github.com/lagonapp/lagon/pull/379) [`d48f00c`](https://github.com/lagonapp/lagon/commit/d48f00c3e042f6ec66cfba9ff7b2dafa418fcc84) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Forward X-Real-Ip header to X-Forwarded-For

* [#379](https://github.com/lagonapp/lagon/pull/379) [`d48f00c`](https://github.com/lagonapp/lagon/commit/d48f00c3e042f6ec66cfba9ff7b2dafa418fcc84) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Forward X-Lagon-Region header

## 0.1.12

### Patch Changes

- [#354](https://github.com/lagonapp/lagon/pull/354) [`2b0b265`](https://github.com/lagonapp/lagon/commit/2b0b265ce4657db96728e5a9c82eddefa4801bc9) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add LAGON_LISTEN_ADDR and PROMETHEUS_LISTEN_ADDR env variables

* [#353](https://github.com/lagonapp/lagon/pull/353) [`2bf63f3`](https://github.com/lagonapp/lagon/commit/2bf63f37dd92fdb99a173af5b49033a23456f4b4) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Don't use a .env file on release builds

- [#363](https://github.com/lagonapp/lagon/pull/363) [`04afb96`](https://github.com/lagonapp/lagon/commit/04afb9616bbffaa4e0ac5e1c5fcd2e0724b02713) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add more metrics

## 0.1.11

### Patch Changes

- [#335](https://github.com/lagonapp/lagon/pull/335) [`e10aabe`](https://github.com/lagonapp/lagon/commit/e10aabee456fa54892507f9b4407b66faee450d3) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve performances by not spawning a thread on each request

* [#329](https://github.com/lagonapp/lagon/pull/329) [`e24d381`](https://github.com/lagonapp/lagon/commit/e24d3811ef6b54d8c343edc26697713bdd4b2985) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve logs

## 0.1.10

### Patch Changes

- [#257](https://github.com/lagonapp/lagon/pull/257) [`2a185ef`](https://github.com/lagonapp/lagon/commit/2a185efa8395e770129025c2f8c973b4711c0c19) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add logs for response types

* [#261](https://github.com/lagonapp/lagon/pull/261) [`fee60e4`](https://github.com/lagonapp/lagon/commit/fee60e4641c39eac5b89ebe5a24b398070e5d291) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve performances by avoiding expensive clones

- [#295](https://github.com/lagonapp/lagon/pull/295) [`6e98d1b`](https://github.com/lagonapp/lagon/commit/6e98d1b435e46e85dc74c1161fc7c7041910c73d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add `startupTimeout` to functions that is higher than `timeout`

* [#264](https://github.com/lagonapp/lagon/pull/264) [`e970b9d`](https://github.com/lagonapp/lagon/commit/e970b9d09aecc7d173e5f1056a7c0bee854ce93a) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Properly clear isolates cache after the configured seconds and no requests

- [#276](https://github.com/lagonapp/lagon/pull/276) [`6dca4fd`](https://github.com/lagonapp/lagon/commit/6dca4fd0d4157693115a1420a4a405a14486a87d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix functions timeout

## 0.1.9

### Patch Changes

- [#249](https://github.com/lagonapp/lagon/pull/249) [`20d9b3c`](https://github.com/lagonapp/lagon/commit/20d9b3c2f9c290125fabffc78c221d8674c55fa5) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add functions statistics

* [#252](https://github.com/lagonapp/lagon/pull/252) [`745ad8d`](https://github.com/lagonapp/lagon/commit/745ad8d65a7ee40b874bfdf28a236aa9bee548a0) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Support .html and index.html for static file paths

## 0.1.8

### Patch Changes

- [#239](https://github.com/lagonapp/lagon/pull/239) [`241305a`](https://github.com/lagonapp/lagon/commit/241305a80725856c7e437650f0b9a2d17b4e9e42) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add more context to logs

* [#238](https://github.com/lagonapp/lagon/pull/238) [`045977c`](https://github.com/lagonapp/lagon/commit/045977cb200281d68c9a834573ca43ff300f9f73) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add production/preview deployments

- [#237](https://github.com/lagonapp/lagon/pull/237) [`747774b`](https://github.com/lagonapp/lagon/commit/747774b5bbf763fcb44de4834c3ac8c3dcd2604c) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve error handling

## 0.1.7

### Patch Changes

- [#216](https://github.com/lagonapp/lagon/pull/216) [`b5d47cb`](https://github.com/lagonapp/lagon/commit/b5d47cb30e7741c4f27adb8fbbf4c6cca6966021) Thanks [@bahlo](https://github.com/bahlo)! - Fix Axiom logger

* [#224](https://github.com/lagonapp/lagon/pull/224) [`0d2cd1a`](https://github.com/lagonapp/lagon/commit/0d2cd1a291c1815f28fd24d09222df5b2447c9d4) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Improve 500/400 pages with proper HTML/CSS

- [#223](https://github.com/lagonapp/lagon/pull/223) [`5e803dc`](https://github.com/lagonapp/lagon/commit/5e803dce3488ddf0fb80715cececf63dda773d1e) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add configurable LRU time cache for isolates

* [#220](https://github.com/lagonapp/lagon/pull/220) [`4d368dc`](https://github.com/lagonapp/lagon/commit/4d368dc22bcbb311eb31aeb1947490ac311590c9) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Forward client IP through X-Forwarded-For header

## 0.1.6

### Patch Changes

- [#213](https://github.com/lagonapp/lagon/pull/213) [`0ee60b8`](https://github.com/lagonapp/lagon/commit/0ee60b859b06613b6e28e495e4dff69b0d12e05d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Make streaming APIs global

## 0.1.5

### Patch Changes

- [#204](https://github.com/lagonapp/lagon/pull/204) [`f95dbe4`](https://github.com/lagonapp/lagon/commit/f95dbe41212f020a2fafe2ba072ae137cce67ff8) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix subsequent requests when streaming response

* [#204](https://github.com/lagonapp/lagon/pull/204) [`f95dbe4`](https://github.com/lagonapp/lagon/commit/f95dbe41212f020a2fafe2ba072ae137cce67ff8) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Correctly resolve stream bytes

## 0.1.4

### Patch Changes

- [#181](https://github.com/lagonapp/lagon/pull/181) [`fe752fb`](https://github.com/lagonapp/lagon/commit/fe752fb54011208a76ef4ff538d6aadbd41b2c7f) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add support for http streaming via ReadableStream

* [#183](https://github.com/lagonapp/lagon/pull/183) [`2830c24`](https://github.com/lagonapp/lagon/commit/2830c24116924353140f077d10ec978b7c0952e3) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix assets directory not deleting on undeploys

## 0.1.3

### Patch Changes

- [#164](https://github.com/lagonapp/lagon/pull/164) [`d7f6f32`](https://github.com/lagonapp/lagon/commit/d7f6f3210af0a5f59acd69ddae2452c217603fcd) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix URL format

* [#164](https://github.com/lagonapp/lagon/pull/164) [`d7f6f32`](https://github.com/lagonapp/lagon/commit/d7f6f3210af0a5f59acd69ddae2452c217603fcd) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix domains assignement

- [#164](https://github.com/lagonapp/lagon/pull/164) [`d7f6f32`](https://github.com/lagonapp/lagon/commit/d7f6f3210af0a5f59acd69ddae2452c217603fcd) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Use TLS for Redis / MySQL connections

* [#162](https://github.com/lagonapp/lagon/pull/162) [`2821265`](https://github.com/lagonapp/lagon/commit/282126547213021475c05d36e5c12fd2db51add5) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add stdout & axiom logging

## 0.1.2

### Patch Changes

- [#160](https://github.com/lagonapp/lagon/pull/160) [`94c14ac`](https://github.com/lagonapp/lagon/commit/94c14ac522075079e0d271467f4445b38f9a2d47) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Correctly bundle assets

* [#160](https://github.com/lagonapp/lagon/pull/160) [`94c14ac`](https://github.com/lagonapp/lagon/commit/94c14ac522075079e0d271467f4445b38f9a2d47) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Fix deployments not working with multiple assets

- [#156](https://github.com/lagonapp/lagon/pull/156) [`dcfdf5d`](https://github.com/lagonapp/lagon/commit/dcfdf5d591fb787a8d9c549345f8c8901593a455) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Add statistics

## 0.1.1

### Patch Changes

- [#146](https://github.com/lagonapp/lagon/pull/146) [`e8175ef`](https://github.com/lagonapp/lagon/commit/e8175effa1e3ccaaa673e60bfba4fcb9376cc15d) Thanks [@QuiiBz](https://github.com/QuiiBz)! - Move from Node.js to Rust
