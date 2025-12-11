"use client";

export default function Error({error, reset}: ErrorPageProps) {
    return (
        <div style={{
            padding: '10rem'
        }}>
            <h1>:(</h1>
            <p>Upss!! Algo salio mal</p>
            <button onClick={reset}>Reload</button>
        </div>
    );
}