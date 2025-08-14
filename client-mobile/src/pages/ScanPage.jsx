import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';

export default function ScanPage() {
    const navigate = useNavigate();
    const scannerRef = useRef(null);
    const hasScanned = useRef(false);
    const isUnmounting = useRef(false);
    const [scannerStarted, setScannerStarted] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        const initScanner = async () => {
            try {
                await scanner.start(
                    { facingMode: 'environment' },
                    { fps: 10, qrbox: 250 },
                    async (decodedText) => {
                        if (hasScanned.current || !isMounted) return;
                        hasScanned.current = true;

                        try {
                            await scanner.stop();
                            if (isMounted) setScannerStarted(false);
                        } catch (stopErr) {
                            console.warn('Scanner stop error:', stopErr);
                        }

                        // Only navigate if component is still mounted
                        if (isMounted) {
                            setTimeout(() => {
                                if (isMounted) {
                                    alert(`Scanned: ${decodedText}`);
                                    navigate(-1);
                                }
                            }, 200);
                        }
                    },
                    (errorMessage) => {
                        // silent errors
                    }
                );
                
                if (isMounted) {
                    setScannerStarted(true);
                }
            } catch (err) {
                console.error('Scanner failed to start:', err);
            }
        };

        initScanner();

        return () => {
            isMounted = false;
            isUnmounting.current = true;
            
            const cleanup = async () => {
                if (scanner) {
                    try {
                        const state = await scanner.getState();
                        if (state === Html5Qrcode.SCANNING) {
                            await scanner.stop();
                        }
                    } catch (err) {
                        console.warn('Cleanup error:', err);
                    }
                }
            };

            cleanup();
        };
    }, []); // Empty dependency array - only run once

    const handleCancel = async () => {
        if (scannerRef.current && scannerStarted) {
            try {
                await scannerRef.current.stop();
                setScannerStarted(false);
            } catch (err) {
                console.warn('Cancel stop error:', err);
            }
        }
        navigate(-1);
    };

    return (
        <main className="container">
            <h3 style={{ textAlign: 'center' }}>📷 QR Scanner</h3>
            <div id="qr-reader" style={{ width: '100%', margin: 'auto' }}></div>
            <button onClick={handleCancel} style={{ marginTop: '1rem' }}>
                Cancel
            </button>
        </main>
    );
}