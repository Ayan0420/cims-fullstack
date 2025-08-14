// src/components/InstallButton.jsx
import { useEffect, useState } from 'react';

export default function InstallButton({ className = '', style = {} }) {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [canInstall, setCanInstall] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setCanInstall(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);
        setDeferredPrompt(null);
        setCanInstall(false);
    };

    if (!canInstall) return null;

    return (
        <button
            onClick={handleInstall}
            className={`contrast ${className}`}
            style={{ marginTop: '1rem', ...style }}
        >
            📲 Install App
        </button>
    );
}
