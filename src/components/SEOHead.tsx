import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  url?: string;
  schemaJson?: object;
}

export default function SEOHead({ title, description, url, schemaJson }: SEOHeadProps) {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    if (url) {
      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute("content", url);

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.setAttribute("href", url);
    }

    // JSON-LD Schema
    let scriptTag = document.getElementById("dynamic-jsonld") as HTMLScriptElement | null;
    if (schemaJson) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "dynamic-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaJson);
    } else {
      if (scriptTag) {
        scriptTag.remove();
      }
    }
  }, [title, description, url, schemaJson]);

  return null;
}
