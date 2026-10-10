import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, OG_DEFAULT } from "./site";
import type { DehumidifierModel } from "../data/models";

type Ld = Record<string, unknown>;

export const ORG_ID = `${SITE_URL}/#organization`;

export function organizationLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    description: SITE_DESCRIPTION,
  };
}

export function websiteLd(): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORG_ID },
    inLanguage: "en-US",
  };
}

export interface Crumb {
  name: string;
  href: string;
}

export function breadcrumbLd(crumbs: Crumb[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: new URL(c.href, SITE_URL).toString(),
    })),
  };
}

export function articleLd(a: {
  title: string;
  description: string;
  url: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
}): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    image: a.image ?? OG_DEFAULT,
    datePublished: a.pubDate.toISOString(),
    dateModified: (a.updatedDate ?? a.pubDate).toISOString(),
    author: { "@type": "Organization", name: `${SITE_NAME} Editorial Team`, url: `${SITE_URL}/about/` },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: a.url,
    inLanguage: "en-US",
  };
}

export function faqLd(faq: { q: string; a: string }[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Ranked list of models, each pointing to its review page. */
export function itemListLd(name: string, models: DehumidifierModel[]): Ld {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: models.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/dehumidifiers/${m.id}/`,
      name: m.name,
    })),
  };
}

/** Research-based product summary, without invented review ratings. */
export function productLd(m: DehumidifierModel, url: string, reviewDate: Date, image: string = OG_DEFAULT): Ld {
  void reviewDate;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: m.name,
    brand: { "@type": "Brand", name: m.brand },
    description: m.bestFor,
    image,
    url,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: m.priceLow,
      highPrice: m.priceHigh,
    },
  };
}
