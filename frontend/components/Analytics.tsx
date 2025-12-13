import { useEffect } from 'react';

export default function Analytics() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true';
  const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

  useEffect(() => {
    if (!enabled || !gaId) return;

    // Inject GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${gaId}');`;
    document.head.appendChild(inline);

    return () => {
      document.head.removeChild(script);
      document.head.removeChild(inline);
    };
  }, [enabled, gaId]);

  return null;
}
