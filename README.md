# Face Frontend Assignment

과제를 위한 프로젝트입니다.

nodejs 16을 사용하여 구현해주세요

## 패키지 설치 및 빌드

다음 명령어를 실행하여 프로젝트를 빌드합니다.

```
npm install
npx lerna bootstrap
npx lerna run build
```

## 실행 방법

다음 명령어를 실행하여 지갑을 실행합니다.
```
// sampledapp을 실행시키기 전에 iframe을 실행시킵니다.
cd packages/iframe
npm run start

cd packages/sampledapp
npm run start
```
http://localhost:3000에서 지갑 Template을 확인 할 수 있습니다.

## 과제 설명에 대한 글을 작성해주세요

## 코드 구조

### packages/iframe

- packages/frame은 핵심 로직을 숨기는 역할이다. 즉 createWallet, sendTransaction 두 로직을 sdk, dapp으로부터 감춘다.
- 이를 위해 packages/iframe에서는 앱과 통신을 하여 데이터를 주고받는다.
- `create-wallet` 메시지를 받으면, `CreateWalletPage` 를 렌더하여 사용자에게 지갑을 만들어 보여주고, sdk에 지갑 정보를 전송하게 된다.
- `send-transaction` 메시지를 받으면, `SendTransactionPage` 를 렌더하여 sendTransaction을 실행한다.
    - transaction 전송을 위해 sdk로부터 toAddress, amount 등의 정보를 얻는다.

### packages/sdk

- packages/sdk는 dapp의 요구사항을 한 겹 숨기는 역할이다. dapp은 createWallet, sendTransaction 등의 정해진 메서드만 사용하게 되는데, 그 이유는 dapp과 iframe이 직접 통신하는 과정이 복잡하고, 또한 내부 로직이 노출되어선 안되기 때문이다.

### packages/sampledapp

- dapp은 sdk를 사용해 iframe과 통신하여 createWallet, sendTransaction 기능을 사용하게 된다.
- dapp은 iframe, sdk가 어떻게 wallet을 생성하는지, 어떻게 transaction을 전송하는지 알 수 없다.

**핵심 로직 설명 - sdk.createWallet**

- ethers 패키지의 `Wallet.createRandom()` 함수로 새로운 wallet instance를 생성한다.
- 생성된 wallet의 mnemonic을 local storage에 저장한다. 이는 wallet 정보를 통째로 저장하기보다, wallet을 손쉽게 복구할 수 있는 최소한의 정보를 저장하기 위함이다.
- local storage에 저장된 wallet mnemonic이 있다면,  wallet mnemonic을 읽어와 wallet을 복구하게 된다.

**핵심 로직 설명 - sdk.sendTransaction**

- `createTxObject` 는 transaction을 만들기 위한 transaction object 객체를 생성해 리턴한다. transaction object는 to, from, value, nonce,gasLimit, gasPrice 등이 포함된다.
- `sendTransactionWithTxObject` 는 `createTxObject` 로 생성된 transaction object로, ethers 패키지의 `Signer.sendTransaction` 을 활용해 transaction을 생성한다.

**핵심 로직 설명 - sdk와 iframe 간의 통신**

- sdk는 `iframe.postMessage` 로 iframe에 요청을 보낸다. 요청을 보내면 `iframe.postMessage` 는 `requestId`를 리턴한다.
- iframe은 `create-wallet`, `send-transaction`두 메시지를 받는다.
- `create-wallet` 메시지는 지갑 생성 로직을 실행하는 `CreateWalletPage` 를 렌더하게 된다.
- `send-transaction` 메시지는 트랜잭션을 전송하는 `SendTransactionPage`를 렌더하게 된다.
- iframe은 로직 실행에 따라 `window.top.postMessage`로 부모에 메시지를 전송한다. 이때 sdk는 `iframe.waitForMessage` 로 `requestId` 에 대한 메시지를 기다리게 된다.

### 실행 방법

- `npx lerna bootstrap` 를 실행해 dependency를 연결한다.
- `npx lerna run build` 를 실행해 sdk를 빌드한다.
- `packages/iframe` 디렉터리에서 `npm run start` 로 프로젝트를 실행한다.
- `packages/sampledapp` 디렉터리에서 `npm run start`로 디앱을 실행한다.

---

- sdk 쪽 코드를 수정하면 face-frontend-assignment 루트에서 `npx lerna run build` 를 실행해 다시 sdk를 빌드해주어야만 sampledapp 에서 업데이트된 sdk를 사용할 수 있다.
