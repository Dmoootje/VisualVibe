import {
  seoGeoChecklistCategories,
  type SeoGeoChecklistCategory,
  type SeoGeoChecklistItem,
} from "@/data/tools";

export type PrintableChecklistItem = SeoGeoChecklistItem & {
  categoryId: SeoGeoChecklistCategory["id"];
  categoryTitle: string;
  checked: boolean;
};

export type ChecklistPdfModel = {
  hasEmptySelectionNotice: boolean;
  checkedCount: number;
  groups: Array<{
    category: SeoGeoChecklistCategory;
    items: PrintableChecklistItem[];
  }>;
};

export function buildChecklistPdfModel(checkedItemIds: string[]): ChecklistPdfModel {
  const checkedIds = new Set(checkedItemIds);
  const groups = seoGeoChecklistCategories.map((category) => ({
    category,
    items: category.items.map((item) => ({
      ...item,
      categoryId: category.id,
      categoryTitle: category.title,
      checked: checkedIds.has(item.id),
    })),
  }));

  const checkedCount = groups.reduce(
    (total, group) => total + group.items.filter((item) => item.checked).length,
    0,
  );

  return {
    hasEmptySelectionNotice: checkedCount === 0,
    checkedCount,
    groups,
  };
}
