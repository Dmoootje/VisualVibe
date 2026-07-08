import { JsonLd } from "./JsonLd";

export type FaqItem = {
  question: string;
  answer: string;
};

export function FaqPageJsonLd({ items }: { items: FaqItem[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}
