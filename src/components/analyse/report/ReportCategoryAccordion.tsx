"use client";

import { CheckCircle2, CircleX, TriangleAlert } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { NormalizedPartnerAuditCategory } from "@/types/analysis";
import { defaultOpenCheckValues } from "@/components/analyse/report/reportViewModel";
import { getReportCopy, type ReportLocale } from "@/components/analyse/report/reportCopy";
import { SectionTitle } from "@/components/analyse/report/SectionTitle";

export function ReportCategoryAccordion({ categories, locale = "nl" }: { categories: NormalizedPartnerAuditCategory[]; locale?: ReportLocale }) {
  const reportCopy = getReportCopy(locale);
  return (
    <section>
      <SectionTitle>{reportCopy.details}</SectionTitle>
      <div className="space-y-4">
        {categories.map((category) => (
          <article key={category.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
              <h3 className="font-bold text-white">{category.title}</h3>
              <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-sm font-black text-emerald-300">{category.score}/100</span>
            </div>
            <Accordion type="multiple" defaultValue={defaultOpenCheckValues(category)} className="px-4 sm:px-5">
              {category.checks.map((check, index) => {
                const value = `${category.id}-${check.id}-${index}`;
                const Icon = check.status === "pass" ? CheckCircle2 : check.status === "warning" ? TriangleAlert : CircleX;
                const color = check.status === "pass" ? "text-emerald-300" : check.status === "warning" ? "text-amber-300" : "text-red-300";
                return (
                  <AccordionItem key={value} value={value} className="border-white/10 last:border-0">
                    <AccordionTrigger className="text-sm text-white/85 hover:no-underline">
                      <span className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 shrink-0 ${color}`} aria-hidden="true" />
                        <span>{check.title}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pl-7">
                      <p className="leading-6 text-white/60">{check.description}</p>
                      {check.advice && (
                        <div className="mt-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] p-3.5">
                          <p className="text-[11px] font-bold uppercase tracking-wide text-orange-300">{reportCopy.advice}</p>
                          <p className="mt-1.5 leading-6 text-white/65">{check.advice}</p>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </article>
        ))}
      </div>
    </section>
  );
}
