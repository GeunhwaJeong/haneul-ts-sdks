# @haneullabs/enoki

## 0.13.0

### Minor Changes

- 95c02d8: Add `additionalEpochs` as part of the configuration to generate zkLogin nonce

## 0.12.15

### Patch Changes

- 746b660: open window with `about:blank` instead of `undefined`

## 0.12.14

### Patch Changes

- Updated dependencies [29e8b92]
  - @haneullabs/sui@1.45.2
  - @haneullabs/signers@0.6.2
  - @haneullabs/wallet-standard@0.19.9

## 0.12.13

### Patch Changes

- Updated dependencies [e3811f1]
  - @haneullabs/sui@1.45.1
  - @haneullabs/signers@0.6.1
  - @haneullabs/wallet-standard@0.19.8

## 0.12.12

### Patch Changes

- Updated dependencies [434381d]
  - @haneullabs/signers@0.6.0

## 0.12.11

### Patch Changes

- Updated dependencies [88bdbac]
  - @haneullabs/sui@1.45.0
  - @haneullabs/signers@0.5.10
  - @haneullabs/wallet-standard@0.19.7

## 0.12.10

### Patch Changes

- Updated dependencies [44d9b4f]
  - @haneullabs/sui@1.44.0
  - @haneullabs/signers@0.5.9
  - @haneullabs/wallet-standard@0.19.6

## 0.12.9

### Patch Changes

- @haneullabs/sui@1.43.2
- @haneullabs/signers@0.5.8
- @haneullabs/wallet-standard@0.19.5

## 0.12.8

### Patch Changes

- @haneullabs/sui@1.43.1
- @haneullabs/signers@0.5.7
- @haneullabs/wallet-standard@0.19.4

## 0.12.7

### Patch Changes

- Updated dependencies [f3b19a7]
- Updated dependencies [bf9f85c]
  - @haneullabs/sui@1.43.0
  - @haneullabs/signers@0.5.6
  - @haneullabs/wallet-standard@0.19.3

## 0.12.6

### Patch Changes

- Updated dependencies [98c8a27]
  - @haneullabs/sui@1.42.0
  - @haneullabs/signers@0.5.5
  - @haneullabs/wallet-standard@0.19.2

## 0.12.5

### Patch Changes

- Updated dependencies [d554cd2]
- Updated dependencies [04fcfbc]
  - @haneullabs/sui@1.41.0
  - @haneullabs/signers@0.5.4
  - @haneullabs/wallet-standard@0.19.1

## 0.12.4

### Patch Changes

- Updated dependencies [f5fc0c0]
- Updated dependencies [f5fc0c0]
  - @haneullabs/wallet-standard@0.19.0
  - @haneullabs/sui@1.40.0
  - @haneullabs/signers@0.5.3

## 0.12.3

### Patch Changes

- Updated dependencies [a9f9035]
  - @haneullabs/sui@1.39.1
  - @haneullabs/signers@0.5.2
  - @haneullabs/wallet-standard@0.18.1

## 0.12.2

### Patch Changes

- Updated dependencies [566b9ae]
- Updated dependencies [ca92487]
- Updated dependencies [5ab3c0a]
  - @haneullabs/wallet-standard@0.18.0
  - @haneullabs/sui@1.39.0
  - @haneullabs/signers@0.5.1

## 0.12.1

### Patch Changes

- Updated dependencies [0faabdc]
  - @haneullabs/signers@0.5.0

## 0.12.0

### Minor Changes

- ea1ac70: Update dependencies and improve support for typescript 5.9

### Patch Changes

- 1fb857c: reuse existing proof when available
- Updated dependencies [3c1741f]
- Updated dependencies [ea1ac70]
  - @haneullabs/sui@1.38.0
  - @haneullabs/wallet-standard@0.17.0
  - @haneullabs/signers@0.4.0

## 0.11.10

### Patch Changes

- Updated dependencies [c689b98]
- Updated dependencies [c689b98]
- Updated dependencies [5b9ff1a]
  - @haneullabs/sui@1.37.6
  - @haneullabs/wallet-standard@0.16.14
  - @haneullabs/signers@0.3.9

## 0.11.9

### Patch Changes

- Updated dependencies [3980d04]
  - @haneullabs/sui@1.37.5
  - @haneullabs/signers@0.3.8
  - @haneullabs/wallet-standard@0.16.13

## 0.11.8

### Patch Changes

- Updated dependencies [6b03e57]
  - @haneullabs/sui@1.37.4
  - @haneullabs/signers@0.3.7
  - @haneullabs/wallet-standard@0.16.12

## 0.11.7

### Patch Changes

- Updated dependencies [8ff1471]
  - @haneullabs/sui@1.37.3
  - @haneullabs/signers@0.3.6
  - @haneullabs/wallet-standard@0.16.11

## 0.11.6

### Patch Changes

- Updated dependencies [660377c]
  - @haneullabs/sui@1.37.2
  - @haneullabs/signers@0.3.5
  - @haneullabs/wallet-standard@0.16.10

## 0.11.5

### Patch Changes

- @haneullabs/sui@1.37.1
- @haneullabs/signers@0.3.4
- @haneullabs/wallet-standard@0.16.9

## 0.11.4

### Patch Changes

- Updated dependencies [72168f0]
  - @haneullabs/sui@1.37.0
  - @haneullabs/signers@0.3.3
  - @haneullabs/wallet-standard@0.16.8

## 0.11.3

### Patch Changes

- Updated dependencies [44354ab]
  - @haneullabs/sui@1.36.2
  - @haneullabs/signers@0.3.2
  - @haneullabs/wallet-standard@0.16.7

## 0.11.2

### Patch Changes

- d016fa8: support playtron provider with pkce oauth flow

## 0.11.1

### Patch Changes

- Updated dependencies [c76ddc5]
  - @haneullabs/sui@1.36.1
  - @haneullabs/signers@0.3.1
  - @haneullabs/wallet-standard@0.16.6

## 0.11.0

### Minor Changes

- 5d0269c: Split the `enoki:getMetadata` feature into `enoki:getMetadata` and `enoki:getSession`.

  `getWalletMetadata` now only returns the authentication provider, while `getSession` returns the
  zkLogin session data.

## 0.10.0

### Minor Changes

- 7a25d35: Use IndexedDB for persisting zkLogin state and session data

### Patch Changes

- f8f9afc: adds ONE Championship auth provider

## 0.9.1

### Patch Changes

- 1c4a82d: update links in package.json
- Updated dependencies [1c4a82d]
- Updated dependencies [783bb9e]
- Updated dependencies [783bb9e]
- Updated dependencies [5cbbb21]
  - @haneullabs/signers@0.3.0
  - @haneullabs/sui@1.36.0
  - @haneullabs/wallet-standard@0.16.5

## 0.9.0

### Minor Changes

- eba589c: AuthProviderOptions extraParams can also be a function

### Patch Changes

- Updated dependencies [888afe6]
  - @haneullabs/sui@1.35.0
  - @haneullabs/signers@0.2.19
  - @haneullabs/wallet-standard@0.16.4

## 0.8.0

### Minor Changes

- 4990b4b: Add multi-network support and an initializer plugin for the Enoki wallet standard
  implementation

## 0.7.1

### Patch Changes

- 7a91b1e: fix error creating idb for multiple networks
- Updated dependencies [3fb7a83]
  - @haneullabs/sui@1.34.0
  - @haneullabs/signers@0.2.18
  - @haneullabs/wallet-standard@0.16.3

## 0.7.0

### Minor Changes

- 4117d38: Add methods for filtering and identifying Enoki wallets given `UiWallet` handles
- 5ef7cad: Return information about the active session from the new `EnokiGetMetadata` feature
- 81804c7: Revert small change that made `getWalletMetadata` throw an error instead of returning
  null

## 0.6.20

### Patch Changes

- Updated dependencies [a00522b]
  - @haneullabs/sui@1.33.0
  - @haneullabs/signers@0.2.17
  - @haneullabs/wallet-standard@0.16.2

## 0.6.19

### Patch Changes

- Updated dependencies [6b7deb8]
  - @haneullabs/sui@1.32.0
  - @haneullabs/signers@0.2.16
  - @haneullabs/wallet-standard@0.16.1

## 0.6.18

### Patch Changes

- Updated dependencies [1ff4e57]
- Updated dependencies [550e2e3]
- Updated dependencies [550e2e3]
  - @haneullabs/sui@1.31.0
  - @haneullabs/wallet-standard@0.16.0
  - @haneullabs/signers@0.2.15

## 0.6.17

### Patch Changes

- Updated dependencies [5bd6ca3]
  - @haneullabs/sui@1.30.5
  - @haneullabs/signers@0.2.14
  - @haneullabs/wallet-standard@0.15.6

## 0.6.16

### Patch Changes

- Updated dependencies [5dce590]
- Updated dependencies [4a5aef6]
  - @haneullabs/sui@1.30.4
  - @haneullabs/signers@0.2.13
  - @haneullabs/wallet-standard@0.15.5

## 0.6.15

### Patch Changes

- bb7c03a: Update dependencies
- Updated dependencies [4457f10]
- Updated dependencies [bb7c03a]
  - @haneullabs/sui@1.30.3
  - @haneullabs/wallet-standard@0.15.4
  - @haneullabs/signers@0.2.12

## 0.6.14

### Patch Changes

- Updated dependencies [b265f7e]
  - @haneullabs/sui@1.30.2
  - @haneullabs/signers@0.2.11
  - @haneullabs/wallet-standard@0.15.3

## 0.6.13

### Patch Changes

- Updated dependencies [ec519fc]
  - @haneullabs/sui@1.30.1
  - @haneullabs/signers@0.2.10
  - @haneullabs/wallet-standard@0.15.2

## 0.6.12

### Patch Changes

- Updated dependencies [2456052]
- Updated dependencies [5264038]
- Updated dependencies [2456052]
- Updated dependencies [2456052]
- Updated dependencies [2456052]
- Updated dependencies [2456052]
  - @haneullabs/sui@1.30.0
  - @haneullabs/signers@0.2.9
  - @haneullabs/wallet-standard@0.15.1

## 0.6.11

### Patch Changes

- Updated dependencies [afbbb80]
  - @haneullabs/wallet-standard@0.15.0

## 0.6.10

### Patch Changes

- @haneullabs/sui@1.29.1
- @haneullabs/signers@0.2.8
- @haneullabs/wallet-standard@0.14.9

## 0.6.9

### Patch Changes

- Updated dependencies [8356318]
  - @haneullabs/signers@0.2.7

## 0.6.8

### Patch Changes

- Updated dependencies [7d66a32]
- Updated dependencies [eb91fba]
- Updated dependencies [19a8045]
  - @haneullabs/sui@1.29.0
  - @haneullabs/signers@0.2.6
  - @haneullabs/wallet-standard@0.14.8

## 0.6.7

### Patch Changes

- Updated dependencies [9a94aea]
  - @haneullabs/sui@1.28.2
  - @haneullabs/signers@0.2.5
  - @haneullabs/wallet-standard@0.14.7

## 0.6.6

### Patch Changes

- Updated dependencies [3cd4e53]
  - @haneullabs/sui@1.28.1
  - @haneullabs/signers@0.2.4
  - @haneullabs/wallet-standard@0.14.6

## 0.6.5

### Patch Changes

- Updated dependencies [2705dc8]
  - @haneullabs/sui@1.28.0
  - @haneullabs/signers@0.2.3
  - @haneullabs/wallet-standard@0.14.5

## 0.6.4

### Patch Changes

- 20568cd: Fix the public key not being stored in IndexedDB for `EnokiFlow` and Enoki wallets
- Updated dependencies [5cea435]
  - @haneullabs/sui@1.27.1
  - @haneullabs/signers@0.2.2
  - @haneullabs/wallet-standard@0.14.4

## 0.6.3

### Patch Changes

- Updated dependencies [4d13ef8]
- Updated dependencies [4d13ef8]
  - @haneullabs/sui@1.27.0
  - @haneullabs/signers@0.2.1
  - @haneullabs/wallet-standard@0.14.3

## 0.6.2

### Patch Changes

- 7ba32a4: update dependencies
- 4d7f04c: Add new EnokiClient methods
- Updated dependencies [156ae13]
- Updated dependencies [7ba32a4]
  - @haneullabs/signers@0.2.0
  - @haneullabs/wallet-standard@0.14.2
  - @haneullabs/sui@1.26.1

## 0.6.1

### Patch Changes

- Updated dependencies [906dd14]
  - @haneullabs/sui@1.26.0
  - @haneullabs/signers@0.1.17
  - @haneullabs/wallet-standard@0.14.1

## 0.6.0

### Minor Changes

- 132e67d: Add `registerEnokiWallets` for better compatibility with the wallet-standard and dApp-kit
- 132e67d: Deprecate `EnokiFlow` and remove sponsorship and execution from the EnokiFlow class

### Patch Changes

- 132e67d: Clear the ephemeral keypair from IDB for the experimental web crypto signer
- Updated dependencies [68a9ecd]
- Updated dependencies [e8b5d04]
  - @haneullabs/wallet-standard@0.14.0
  - @haneullabs/sui@1.25.0
  - @haneullabs/signers@0.1.16

## 0.5.3

### Patch Changes

- 850369a: Add experimental support for WebCrypto signer
- Updated dependencies [850369a]
  - @haneullabs/signers@0.1.15

## 0.5.2

### Patch Changes

- e8c4cd8: fix enoki sdk build
- 402c126: expose zkLogin public key

## 0.5.1

### Patch Changes

- Updated dependencies [cf3d12d]
  - @haneullabs/sui@1.24.0

## 0.5.0

### Minor Changes

- 8baac61: remove jose dependency
- d3cff85: Update EnokiKeypair and EnokiPublicKey classes to use correct publicKey bytes

### Patch Changes

- Updated dependencies [8baac61]
- Updated dependencies [8baac61]
  - @haneullabs/sui@1.23.0

## 0.4.26

### Patch Changes

- Updated dependencies [03975f4]
  - @haneullabs/sui@1.22.0

## 0.4.25

### Patch Changes

- @haneullabs/sui@1.21.2

## 0.4.24

### Patch Changes

- @haneullabs/sui@1.21.1

## 0.4.23

### Patch Changes

- Updated dependencies [3d8a0d9]
- Updated dependencies [20a5aaa]
  - @haneullabs/sui@1.21.0

## 0.4.22

### Patch Changes

- Updated dependencies [827a200]
  - @haneullabs/sui@1.20.0

## 0.4.21

### Patch Changes

- Updated dependencies [c39f32f]
- Updated dependencies [539168a]
  - @haneullabs/sui@1.19.0

## 0.4.20

### Patch Changes

- 7abd243: Update repo links
- Updated dependencies [7abd243]
  - @haneullabs/sui@1.18.1

## 0.4.19

### Patch Changes

- Updated dependencies [4f012b9]
- Updated dependencies [85bd9e4]
- Updated dependencies [5e3709d]
- Updated dependencies [b2928a9]
- Updated dependencies [dc0e21e]
- Updated dependencies [85bd9e4]
- Updated dependencies [a872b97]
  - @haneullabs/sui@1.18.0

## 0.4.18

### Patch Changes

- Updated dependencies [20af12d]
  - @haneullabs/sui@1.17.0

## 0.4.17

### Patch Changes

- Updated dependencies [100207f]
  - @haneullabs/sui@1.16.2

## 0.4.16

### Patch Changes

- 69ee5cc: remove @haneullabs/zklogin dependency

## 0.4.15

### Patch Changes

- @haneullabs/sui@1.16.1
- @haneullabs/zklogin@0.8.1

## 0.4.14

### Patch Changes

- Updated dependencies [ec2dc7f]
- Updated dependencies [ec2dc7f]
  - @haneullabs/sui@1.16.0
  - @haneullabs/zklogin@0.8.0

## 0.4.13

### Patch Changes

- @haneullabs/sui@1.15.1
- @haneullabs/zklogin@0.7.30

## 0.4.12

### Patch Changes

- Updated dependencies [6460e45]
  - @haneullabs/sui@1.15.0
  - @haneullabs/zklogin@0.7.29

## 0.4.11

### Patch Changes

- Updated dependencies [938fb6e]
  - @haneullabs/sui@1.14.4
  - @haneullabs/zklogin@0.7.28

## 0.4.10

### Patch Changes

- Updated dependencies [d5a23d7]
  - @haneullabs/sui@1.14.3
  - @haneullabs/zklogin@0.7.27

## 0.4.9

### Patch Changes

- Updated dependencies [e7bc63e]
  - @haneullabs/sui@1.14.2
  - @haneullabs/zklogin@0.7.26

## 0.4.8

### Patch Changes

- Updated dependencies [69ef100]
  - @haneullabs/sui@1.14.1
  - @haneullabs/zklogin@0.7.25

## 0.4.7

### Patch Changes

- Updated dependencies [c24814b]
  - @haneullabs/sui@1.14.0
  - @haneullabs/zklogin@0.7.24

## 0.4.6

### Patch Changes

- Updated dependencies [477d2a4]
  - @haneullabs/sui@1.13.0
  - @haneullabs/zklogin@0.7.23

## 0.4.5

### Patch Changes

- Updated dependencies [5436a90]
- Updated dependencies [5436a90]
  - @haneullabs/sui@1.12.0
  - @haneullabs/zklogin@0.7.22

## 0.4.4

### Patch Changes

- Updated dependencies [489f421]
- Updated dependencies [489f421]
  - @haneullabs/sui@1.11.0
  - @haneullabs/zklogin@0.7.21

## 0.4.3

### Patch Changes

- Updated dependencies [830b8d8]
  - @haneullabs/sui@1.10.0
  - @haneullabs/zklogin@0.7.20

## 0.4.2

### Patch Changes

- Updated dependencies [2c96b06]
- Updated dependencies [1fd22cc]
  - @haneullabs/sui@1.9.0
  - @haneullabs/zklogin@0.7.19

## 0.4.1

### Patch Changes

- Updated dependencies [569511a]
  - @haneullabs/sui@1.8.0
  - @haneullabs/zklogin@0.7.18

## 0.4.0

### Minor Changes

- f589885: Add sdk methods for managing enoki subnames

## 0.3.17

### Patch Changes

- Updated dependencies [143cd9d]
- Updated dependencies [4357ac6]
- Updated dependencies [4019dd7]
- Updated dependencies [4019dd7]
- Updated dependencies [00a974d]
  - @haneullabs/sui@1.7.0
  - @haneullabs/zklogin@0.7.17

## 0.3.16

### Patch Changes

- Updated dependencies [a3e32fe]
  - @haneullabs/sui@1.6.0
  - @haneullabs/zklogin@0.7.16

## 0.3.15

### Patch Changes

- Updated dependencies [6f79ed9]
  - @haneullabs/zklogin@0.7.15

## 0.3.14

### Patch Changes

- Updated dependencies [0851b31]
- Updated dependencies [f37b3c2]
  - @haneullabs/sui@1.5.0
  - @haneullabs/zklogin@0.7.14

## 0.3.13

### Patch Changes

- Updated dependencies [4419234]
  - @haneullabs/sui@1.4.0
  - @haneullabs/zklogin@0.7.13

## 0.3.12

### Patch Changes

- Updated dependencies [a45f461]
  - @haneullabs/sui@1.3.1
  - @haneullabs/zklogin@0.7.12

## 0.3.11

### Patch Changes

- 0f27a97: Update dependencies
- Updated dependencies [7fc464a]
- Updated dependencies [086b2bc]
- Updated dependencies [0fb0628]
- Updated dependencies [cdedf69]
- Updated dependencies [0f27a97]
- Updated dependencies [beed646]
  - @haneullabs/sui@1.3.0
  - @haneullabs/zklogin@0.7.11

## 0.3.10

### Patch Changes

- Updated dependencies [06a900c1ab]
- Updated dependencies [45877014d1]
- Updated dependencies [87d6f75403]
  - @haneullabs/sui@1.2.1
  - @haneullabs/zklogin@0.7.10

## 0.3.9

### Patch Changes

- Updated dependencies [fef99d377f]
  - @haneullabs/sui@1.2.0
  - @haneullabs/zklogin@0.7.9

## 0.3.8

### Patch Changes

- Updated dependencies [0dfff33b95]
  - @haneullabs/sui@1.1.2
  - @haneullabs/zklogin@0.7.8

## 0.3.7

### Patch Changes

- Updated dependencies [101f1ff4b8]
  - @haneullabs/sui@1.1.1
  - @haneullabs/zklogin@0.7.7

## 0.3.6

### Patch Changes

- Updated dependencies [bae8f9683c]
  - @haneullabs/sui@1.1.0
  - @haneullabs/zklogin@0.7.6

## 0.3.5

### Patch Changes

- Updated dependencies [369b924343]
  - @haneullabs/sui@1.0.5
  - @haneullabs/zklogin@0.7.5

## 0.3.4

### Patch Changes

- Updated dependencies [f1e828f557]
  - @haneullabs/sui@1.0.4
  - @haneullabs/zklogin@0.7.4

## 0.3.3

### Patch Changes

- Updated dependencies [1f20580841]
  - @haneullabs/sui@1.0.3
  - @haneullabs/zklogin@0.7.3

## 0.3.2

### Patch Changes

- Updated dependencies [f0a839f874]
  - @haneullabs/sui@1.0.2
  - @haneullabs/zklogin@0.7.2

## 0.3.1

### Patch Changes

- Updated dependencies [6fc6235984]
  - @haneullabs/sui@1.0.1
  - @haneullabs/zklogin@0.7.1

## 0.3.0

### Minor Changes

- a92b03de42: The Typescript SDK has been renamed to `@haneullabs/sui` and includes many new features
  and breaking changes. See the
  [full migration guide](https://sdk.haneullabs.com/typescript/migrations/sui-1.0) for details on
  how to upgrade.

### Patch Changes

- Updated dependencies [ebdfe7cf21]
- Updated dependencies [a92b03de42]
  - @haneullabs/sui@1.0.0
  - @haneullabs/zklogin@0.7.0

## 0.2.8

### Patch Changes

- 7e88f74d66: Add support for signing personal messages

## 0.2.7

### Patch Changes

- Updated dependencies [99b112178c]
  - @haneullabs/sui.js@0.54.1
  - @haneullabs/zklogin@0.6.3

## 0.2.6

### Patch Changes

- Updated dependencies [b7f673dbd9]
- Updated dependencies [123b42c75c]
  - @haneullabs/sui.js@0.54.0
  - @haneullabs/zklogin@0.6.2

## 0.2.5

### Patch Changes

- Updated dependencies [774bfb41a8]
  - @haneullabs/sui.js@0.53.0
  - @haneullabs/zklogin@0.6.1

## 0.2.4

### Patch Changes

- Updated dependencies [e279098cff]
  - @haneullabs/zklogin@0.6.0

## 0.2.3

### Patch Changes

- 049610aeb6: Add network to execution flow
- 9a1406a396: Add missing network param to enokiflow
- Updated dependencies [929db4976a]
  - @haneullabs/sui.js@0.52.0
  - @haneullabs/zklogin@0.5.3

## 0.2.2

### Patch Changes

- Updated dependencies [b4ecdb5860]
  - @haneullabs/sui.js@0.51.2
  - @haneullabs/zklogin@0.5.2

## 0.2.1

### Patch Changes

- Updated dependencies [6984dd1e38]
  - @haneullabs/sui.js@0.51.1
  - @haneullabs/zklogin@0.5.1

## 0.2.0

### Minor Changes

- 3b1da3967a: Add support for secret key authentication

## 0.1.4

### Patch Changes

- f704211291: Add EnokiClientError to expose error details
- Updated dependencies [0cafa94027]
- Updated dependencies [3a84c3ab21]
  - @haneullabs/sui.js@0.51.0
  - @haneullabs/zklogin@0.5.0

## 0.1.3

### Patch Changes

- 4830361fa4: Updated typescript version
- Updated dependencies [4830361fa4]
  - @haneullabs/sui.js@0.50.1
  - @haneullabs/zklogin@0.4.3

## 0.1.2

### Patch Changes

- 33752daf9c: Fix decoding of ephemeral keypair secret
- 4bf3e0060b: Update to latest Enoki API changes
- Updated dependencies [a34f1cb67d]
- Updated dependencies [c08e3569ef]
- Updated dependencies [9a14e61db4]
- Updated dependencies [13e922d9b1]
- Updated dependencies [a34f1cb67d]
- Updated dependencies [220a766d86]
  - @haneullabs/sui.js@0.50.0
  - @haneullabs/zklogin@0.4.2

## 0.1.1

### Patch Changes

- Updated dependencies [9ac0a4ec01]
  - @haneullabs/sui.js@0.49.1
  - @haneullabs/zklogin@0.4.1

## 0.1.0

### Minor Changes

- e5f9e3ba21: Replace tsup based build to fix issues with esm/cjs dual publishing

### Patch Changes

- Updated dependencies [e5f9e3ba21]
  - @haneullabs/sui.js@0.49.0
  - @haneullabs/zklogin@0.4.0

## 0.0.8

### Patch Changes

- Updated dependencies [dd362ec1d6]
  - @haneullabs/sui.js@0.48.1
  - @haneullabs/zklogin@0.3.10

## 0.0.7

### Patch Changes

- dd485449a7: Update to new two-step API
- Updated dependencies [cdcfa76c43]
  - @haneullabs/sui.js@0.48.0
  - @haneullabs/zklogin@0.3.9

## 0.0.6

### Patch Changes

- 0eb6fa61b: Hydrate the session on mount

## 0.0.5

### Patch Changes

- Updated dependencies [0e3d0dfae]
  - @haneullabs/zklogin@0.3.8

## 0.0.4

### Patch Changes

- 732fdbb5b: Make enoki flow session observable. Expose state parameter on useAuthCallback.

## 0.0.3

### Patch Changes

- dfa523c77: Key storage off of the API key, and add APIs for transaction block sponsorship

## 0.0.2

### Patch Changes

- 180616bef: Rewrite the encryption layer
- 9ac7e2f3d: Introduce Enoki SDK
- Updated dependencies [194c980cb]
- Updated dependencies [9ac7e2f3d]
- Updated dependencies [0259aec82]
- Updated dependencies [64d45ba27]
  - @haneullabs/sui.js@0.47.0
  - @haneullabs/zklogin@0.3.7
