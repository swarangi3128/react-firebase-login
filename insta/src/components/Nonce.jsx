import React from 'react'
import { useEffect } from 'react';
function Nonce() {
    const generateNonce = () => {
        const nonce = Array.from(window.crypto.getRandomValues(new Uint8Array(16)))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
        console.log('Generated nonce:', nonce);
    };

    useEffect(() => {
        generateNonce();
    }, []);
    return (
        <div></div>
    )
}

export default Nonce