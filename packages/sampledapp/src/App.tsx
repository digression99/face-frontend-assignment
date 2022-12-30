import React, { ChangeEvent, useState, useEffect } from 'react';
import './App.css';
import { FaceSDK } from '@face/sdk';

function App() {
    const [sdk, setSDK] = useState<FaceSDK | undefined>(undefined);
    const [value, setValue] = useState('0.00')

    useEffect(() => {
        setSDK(new FaceSDK())
    }, [])

    const onValueChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    async function clickCreateWallet() {
        if (!sdk) return
        console.log('calling create wallet');
        const address = await sdk.createWallet();
        console.log('sampledapp createwallet: ', address);
    }

    async function clickSendTransaction() {
        if (!sdk) return
        const transactionHash = await sdk.sendTransaction(value);
        console.log('click send transaction : ', transactionHash);
    }

    return (
        <div className="App">
            <div className="box">
                <button className="btn" onClick={clickCreateWallet}>
                    지갑 생성하기
                </button>
            </div>
            <div className="box">
                <div className="label">Amount</div>

                <div className="input-wrapper">
                    <input type="number" className="input-text" value={value} onChange={onValueChange} />
                </div>

                <button className="btn" onClick={clickSendTransaction} disabled={!value}>
                    트랜잭션 전송하기
                </button>
            </div>
        </div>
    );
}

export default App;
