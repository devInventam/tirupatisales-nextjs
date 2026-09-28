"use client";

import { useEffect, useRef, useState } from "react";

interface HtmlFileContentProps {
  url: string;
}

export default function HtmlFileContent({ url }: HtmlFileContentProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [height, setHeight] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load");
        return r.text();
      })
      .then(setHtml)
      .catch(() => setError(true));
  }, [url]);

  useEffect(() => {
    if (!html) return;

    const resize = () => {
      const doc = iframeRef.current?.contentDocument;
      if (doc?.documentElement) {
        setHeight(doc.documentElement.scrollHeight);
      }
    };

    resize();
    const id = window.setInterval(resize, 400);
    const stop = window.setTimeout(() => window.clearInterval(id), 8000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(stop);
    };
  }, [html]);

  if (error) {
    return (
      <p className="text-red-500 text-sm px-4">Failed to load HTML content.</p>
    );
  }

  if (!html) {
    return <div className="h-48 animate-pulse rounded-2xl bg-gray-100 mx-4" />;
  }

  return (
    <iframe
      ref={iframeRef}
      title="Blog content"
      srcDoc={html}
      onLoad={() => {
        const doc = iframeRef.current?.contentDocument;
        if (doc?.documentElement) setHeight(doc.documentElement.scrollHeight);
      }}
      sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      className="w-full border-0 block"
      style={{ height: height || 600 }}
    />
  );
}
