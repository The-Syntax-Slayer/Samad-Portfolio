import { useEffect, useState } from "react";
import { services, type ServicePage } from "../data/services";

function getSlugFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts[0] === "services" && parts[1]) return parts[1];
  return null;
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  const el = document.querySelector(`meta[${attr}="${name}"]`);
  if (el) el.setAttribute("content", content);
}

export default function Services() {
  const [slug, setSlug] = useState<string | null>(() => getSlugFromPath());

  useEffect(() => {
    const onPopState = () => setSlug(getSlugFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const service: ServicePage | undefined = slug
    ? services.find((s) => s.slug === slug)
    : undefined;

  const title = service
    ? service.title
    : "Services | Websites, Business Software & AI Automation in Mumbai — Samad Shaikh";
  const description = service
    ? service.metaDescription
    : "Services by Samad Shaikh in Bandra, Mumbai: business websites from ₹19,999, business software from ₹39,999, and AI automation. Book a free demo.";
  const canonical = service
    ? `https://www.samadshaikh.dev/services/${service.slug}`
    : "https://www.samadshaikh.dev/services";

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";
    const prevCanonical = document
      .querySelector('link[rel="canonical"]')
      ?.getAttribute("href");

    document.title = title;
    setMeta("description", description);
    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:title", title, "property");
    setMeta("twitter:description", description, "property");
    setMeta("twitter:url", canonical, "property");
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.setAttribute("href", canonical);

    const schema = service
      ? {
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              "@id": `${canonical}#service`,
              name: service.h1,
              description: service.metaDescription,
              url: canonical,
              provider: { "@id": "https://www.samadshaikh.dev/#person" },
              areaServed: ["Bandra, Mumbai", "Mumbai", "Maharashtra, India"],
            },
            {
              "@type": "FAQPage",
              "@id": `${canonical}#faq`,
              mainEntity: service.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${canonical}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.samadshaikh.dev" },
                { "@type": "ListItem", position: 2, name: "Services", item: "https://www.samadshaikh.dev/services" },
                { "@type": "ListItem", position: 3, name: service.h1, item: canonical },
              ],
            },
          ],
        }
      : {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: canonical,
        };

    let scriptTag = document.getElementById("jsonld-service") as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = "jsonld-service";
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    return () => {
      document.title = prevTitle;
      if (metaDesc) metaDesc.setAttribute("content", prevDesc);
      if (canonicalLink && prevCanonical) canonicalLink.setAttribute("href", prevCanonical);
      scriptTag?.remove();
    };
  }, [title, description, canonical, service]);

  if (slug && !service) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-2xl font-semibold text-white mb-4">Service not found</h1>
        <p className="text-white/60 mb-6">
          That service page does not exist. See all services below.
        </p>
        <a href="/services" className="text-[#8FFFD1] underline">
          All services
        </a>
      </div>
    );
  }

  if (service) {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-16">
        <p className="text-[10px] font-Spline_Sans_Mono tracking-widest text-[#8FFFD1] uppercase mb-4">
          Services — Bandra, Mumbai
        </p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
          {service.h1}
        </h1>
        <p className="text-white/70 leading-relaxed mb-10">{service.problem}</p>

        <h2 className="text-xl font-semibold text-white mb-4">What you get</h2>
        <ul className="list-disc pl-6 text-white/70 leading-relaxed mb-10">
          {service.includes.map((item) => (
            <li key={item} className="mb-2">
              {item}
            </li>
          ))}
        </ul>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-10">
          <p className="text-white font-semibold mb-2">{service.price}</p>
          <p className="text-white/60 text-sm">{service.priceNote}</p>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">How it works</h2>
        <ol className="list-decimal pl-6 text-white/70 leading-relaxed mb-10">
          {service.process.map((step) => (
            <li key={step} className="mb-2">
              {step}
            </li>
          ))}
        </ol>

        <h2 className="text-xl font-semibold text-white mb-4">Proof</h2>
        <p className="text-white/70 leading-relaxed mb-10">{service.proof}</p>

        <h2 className="text-xl font-semibold text-white mb-4">Frequently asked questions</h2>
        <div className="mb-10">
          {service.faqs.map((f) => (
            <div key={f.q} className="mb-5">
              <h3 className="text-white font-medium mb-1">{f.q}</h3>
              <p className="text-white/60 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-[#8FFFD1]/20 bg-[#8FFFD1]/5 p-6 mb-10">
          <p className="text-white font-semibold mb-2">Book a free demo</p>
          <p className="text-white/60 text-sm mb-4">
            Tell me your business type and budget — I will reply with a fixed quote, not an
            hourly estimate.
          </p>
          <a
            href="/connect"
            className="inline-block px-5 py-3 rounded-xl border border-[#8FFFD1]/40 text-[#8FFFD1] text-sm"
          >
            Go to Connect ↗
          </a>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">Related articles</h2>
        <ul className="list-disc pl-6 text-white/70">
          {service.relatedBlogSlugs.map((blogSlug, i) => (
            <li key={blogSlug} className="mb-2">
              <a href={`/blog/${blogSlug}`} className="text-[#8FFFD1] hover:underline">
                {service.relatedBlogTitles[i]}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-10">
          <a href="/services" className="text-white/50 hover:text-white text-sm underline">
            ← All services
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16">
      <p className="text-[10px] font-Spline_Sans_Mono tracking-widest text-[#8FFFD1] uppercase mb-4">
        Services — Bandra, Mumbai
      </p>
      <h1 className="text-3xl md:text-4xl font-semibold text-white leading-tight mb-4">
        Services for Mumbai Businesses
      </h1>
      <p className="text-white/70 leading-relaxed mb-10">
        Websites, business software and AI automation — built for owner-run small businesses,
        with a fixed quote after a free demo.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map((s) => (
          <a
            key={s.slug}
            href={`/services/${s.slug}`}
            className="block rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-[#8FFFD1]/30 transition-colors"
          >
            <h2 className="text-white font-semibold mb-2">{s.h1}</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">{s.metaDescription}</p>
            <p className="text-[#8FFFD1] text-sm">{s.price} →</p>
          </a>
        ))}
      </div>
      <p className="mt-10 text-white/60">
        Not sure which one you need?{" "}
        <a href="/connect" className="text-[#8FFFD1] underline">
          Book a free demo
        </a>{" "}
        and I will point you to the right one.
      </p>
    </div>
  );
}
