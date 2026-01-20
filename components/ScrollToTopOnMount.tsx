'use client';

import { useEffect } from 'react';

export default function ScrollToTopOnMount() {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if ('scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual';
            }

            const scrollToTop = () => {
                window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
            };

            scrollToTop();

            const timeoutId = window.setTimeout(scrollToTop, 0);
            return () => window.clearTimeout(timeoutId);
        }
        return undefined;
    }, []);

    return null;
}
