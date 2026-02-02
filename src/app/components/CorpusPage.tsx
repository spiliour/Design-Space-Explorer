import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

import corpusData from "@/data/corpus.json";
import filterCategoriesData from "@/data/filterCategories.json";

// ---- Corpus data (JSON-driven) ----
type CorpusJsonRow = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string; // relative path like "media/corpus/ex-001.png" (no leading slash recommended)
  method_of_making?: string; // e.g. "3D"
  animation?: string; // e.g. "Static"
  perceptual_realism?: string; // e.g. "High Realism"
  encodings?: string[] | string; // array or semicolon-separated
  contextual?: string[] | string; // array or semicolon-separated
  mechanisms?: string[] | string; // array or semicolon-separated
  link?: string;
};

type CorpusItem = {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  method_of_making?: string;
  animation?: string;
  perceptual_realism?: string;
  encodings: string[];
  contextual: string[];
  mechanisms: string[];
  link?: string;
};

// BASE_URL-safe helper (works on GitHub Pages subpaths)
const withBase = (relPath: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

// Inline SVG placeholder (no extra file needed)
const PLACEHOLDER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e5e7eb"/>
      <stop offset="1" stop-color="#f3f4f6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="675" fill="url(#g)"/>
  <g fill="#9ca3af" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" text-anchor="middle">
    <text x="600" y="320" font-size="34">Placeholder image</text>
    <text x="600" y="365" font-size="18">Add files under public/media/</text>
  </g>
</svg>
`);
const PLACEHOLDER_IMG = `data:image/svg+xml;charset=utf-8,${PLACEHOLDER_SVG}`;

const normalizeTags = (tags?: string[] | string): string[] => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map(t => String(t).trim()).filter(Boolean);
  return String(tags).split(";").map(t => t.trim()).filter(Boolean);
};

const uniq = (arr: string[]) => Array.from(new Set(arr));

// Normalize perceptual realism values to match filter options
const normalizePerceptualRealism = (value?: string): string | undefined => {
  if (!value) return undefined;
  const trimmed = value.trim();
  const lower = trimmed.toLowerCase();
  // Convert "Very High" (any case) to "Indistinguishable from Reality"
  if (lower === "very high" || lower === "very high realism") {
    return "Indistinguishable from Reality";
  }
  // If it already ends with "Realism" or is "Indistinguishable from Reality", keep as-is
  if (trimmed.endsWith("Realism") || trimmed === "Indistinguishable from Reality") {
    return trimmed;
  }
  // Otherwise, append " Realism"
  return `${trimmed} Realism`;
};

const corpusItems: CorpusItem[] = (corpusData as CorpusJsonRow[]).map((row, index) => {
  // Normalize each field separately
  const encodingsList = normalizeTags(row.encodings);
  const contextualList = normalizeTags(row.contextual);
  const mechanismsList = normalizeTags(row.mechanisms);

  return {
    id: row.id ?? index + 1,
    title: row.title ?? `Example ${index + 1}`,
    description: row.description ?? "",
    image: row.image ? String(row.image).replace(/^\/+/, "") : undefined,
    method_of_making: row.method_of_making,
    animation: row.animation,
    perceptual_realism: normalizePerceptualRealism(row.perceptual_realism),
    encodings: encodingsList,
    contextual: contextualList,
    mechanisms: mechanismsList,
    link: row.link ? String(row.link).trim() : undefined,
  };
});

const resolveImgSrc = (image?: string) => (image ? withBase(image) : PLACEHOLDER_IMG);




interface InlineFilterCategory {
  type: "inline";
  name: string;
  options: string[];
}

interface ExpandableFilterCategory {
  type: "expandable";
  name: string;
  subcategories: {
    name: string;
    options: string[];
  }[];
}

type FilterCategory = InlineFilterCategory | ExpandableFilterCategory;

const filterCategories: FilterCategory[] = filterCategoriesData as FilterCategory[];

export function CorpusPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleCategory = (categoryName: string) => {
    if (expandedCategories.includes(categoryName)) {
      setExpandedCategories(expandedCategories.filter(c => c !== categoryName));
    } else {
      setExpandedCategories([...expandedCategories, categoryName]);
    }
  };

  // Get all options from a category
  const getCategoryOptions = (category: FilterCategory): string[] => {
    if (category.type === "inline") {
      return category.options;
    } else {
      return category.subcategories.flatMap(sub => sub.options);
    }
  };

  // Helper to count and sort tags by frequency
  const countAndSortTags = (tags: string[]): Array<{ tag: string; count: number }> => {
    const counts = tags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  // Helper to process item data for display
  const processItem = (item: CorpusItem) => {
    return {
      encodings: countAndSortTags(item.encodings),
      contextual: countAndSortTags(item.contextual),
      mechanisms: countAndSortTags(item.mechanisms),
    };
  };

  // Filter items based on selected tags with AND/OR logic
  const filteredItems = selectedTags.length === 0
    ? corpusItems
    : corpusItems.filter(item => {
        // Categorize selected tags
        const selectedMethodOfMaking = selectedTags.filter(tag =>
          ["3D render", "Photograph of physical artefact", "Graphic design - Illustration"].includes(tag)
        );
        const selectedAnimation = selectedTags.filter(tag =>
          ["Static", "Dynamic"].includes(tag)
        );
        const selectedPerceptualRealism = selectedTags.filter(tag =>
          ["Low Realism", "Intermediate Realism", "High Realism", "Indistinguishable from Reality"].includes(tag)
        );
        const selectedPhysicalAttrs = selectedTags.filter(tag => {
          const physicalCategory = filterCategories
            .find(cat => cat.type === "expandable" && cat.name === "Physical Attributes");
          const physicalOptions = physicalCategory && physicalCategory.type === "expandable"
            ? physicalCategory.subcategories.flatMap(sub => sub.options)
            : [];
          return physicalOptions.includes(tag);
        });
        const selectedMechanisms = selectedTags.filter(tag => {
          const mechanismCategory = filterCategories
            .find(cat => cat.type === "expandable" && cat.name === "Mechanisms");
          const mechanismOptions = mechanismCategory && mechanismCategory.type === "expandable"
            ? mechanismCategory.subcategories.flatMap(sub => sub.options)
            : [];
          return mechanismOptions.includes(tag);
        });

        // Check each category with appropriate logic
        const itemPhysicalAttrs = [...item.encodings, ...item.contextual];

        // Method of Making: OR logic (match any if selected)
        const matchesMethodOfMaking = selectedMethodOfMaking.length === 0 ||
          selectedMethodOfMaking.includes(item.method_of_making || "");

        // Animation: OR logic (match any if selected)
        const matchesAnimation = selectedAnimation.length === 0 ||
          selectedAnimation.includes(item.animation || "");

        // Perceptual Realism: OR logic (match any if selected)
        const matchesPerceptualRealism = selectedPerceptualRealism.length === 0 ||
          selectedPerceptualRealism.includes(item.perceptual_realism || "");

        // Physical Attributes: AND logic (must have all selected)
        const matchesPhysicalAttrs = selectedPhysicalAttrs.length === 0 ||
          selectedPhysicalAttrs.every(tag => itemPhysicalAttrs.includes(tag));

        // Mechanisms: AND logic (must have all selected)
        const matchesMechanisms = selectedMechanisms.length === 0 ||
          selectedMechanisms.every(tag => item.mechanisms.includes(tag));

        // AND logic between categories
        return matchesMethodOfMaking && matchesAnimation && matchesPerceptualRealism &&
               matchesPhysicalAttrs && matchesMechanisms;
      });

  return (
    <div className="max-w-screen-2xl mx-auto px-6 py-12">
      {/* <div className="mb-12">
        <h1 className="text-4xl mb-4">Corpus</h1>
        <p className="text-muted-foreground max-w-4xl">
          A collection of physically-inspired visualizations analyzed using our design space framework. 
          Each example demonstrates different physical attributes and metaphorical approaches to data representation.
        </p>
      </div> */}

      {/* Filter Section */}
      <div className="mb-8 pb-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider text-muted-foreground">
            Filter by Tags
          </h3>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all ({selectedTags.length})
            </button>
          )}
        </div>

        {/* Filter Categories */}
        <div className="space-y-4">
          {filterCategories.map((category) => {
            if (category.type === "inline") {
              // Inline category - show tags next to title
              return (
                <div key={category.name} className="py-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium">{category.name}:</span>
                    <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                      {category.options.map((option) => (
                        <button
                          key={option}
                          onClick={() => toggleTag(option)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                            selectedTags.includes(option)
                              ? "bg-foreground text-background border-foreground"
                              : "bg-background text-foreground border-border hover:border-foreground"
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Expandable category
              const isExpanded = expandedCategories.includes(category.name);
              const categoryOptions = getCategoryOptions(category);
              
              return (
                <div key={category.name} className="border border-border rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.name)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-sm font-medium">{category.name}</span>
                    <div className="flex items-center gap-2">
                      {selectedTags.filter(tag => categoryOptions.includes(tag)).length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({selectedTags.filter(tag => categoryOptions.includes(tag)).length})
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Category Options - Grouped by Subcategory */}
                  {isExpanded && (
                    <div className="p-4 space-y-4">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.name}>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                            {subcategory.name}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {subcategory.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => toggleTag(option)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                                  selectedTags.includes(option)
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-border hover:border-foreground"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>

        {/* Selected Tags - Below Filter Categories */}
        {selectedTags.length > 0 && (
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
              Active Filters
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1.5 text-sm rounded-full bg-foreground text-background border border-foreground transition-colors hover:opacity-80"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredItems.length} of {corpusItems.length} visualization{filteredItems.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 justify-center [grid-template-columns:repeat(auto-fit,350px)]">
        {filteredItems.map((item) => {
          const processed = processItem(item);

          return (
            <Card
              key={item.id}
              className="hover:border-foreground transition-colors flex flex-col shadow-md"
            >
              <CardHeader>
                <div className="aspect-[4/3] bg-muted rounded mb-4 flex items-center justify-center text-muted-foreground text-sm overflow-hidden">
                  <img
                    src={resolveImgSrc(item.image)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 space-y-3 mb-4">
                  {/* First row: Method of Making - Animation - Perceptual Realism */}
                  <div className="flex flex-wrap gap-2">
                    {item.method_of_making && (
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        selectedTags.includes(item.method_of_making)
                          ? "bg-black text-white"
                          : "bg-muted"
                      }`}>
                        {item.method_of_making}
                      </span>
                    )}
                    {item.animation && (
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        selectedTags.includes(item.animation)
                          ? "bg-black text-white"
                          : "bg-muted"
                      }`}>
                        {item.animation}
                      </span>
                    )}
                    {item.perceptual_realism && (
                      <span className={`inline-block px-3 py-1 text-xs rounded-full ${
                        selectedTags.includes(item.perceptual_realism)
                          ? "bg-black text-white"
                          : "bg-muted"
                      }`}>
                        {item.perceptual_realism}
                      </span>
                    )}
                  </div>

                  {/* Encodings */}
                  {processed.encodings.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-medium text-muted-foreground">Encodings:</span>
                      {processed.encodings.map((tagItem) => (
                        <span
                          key={tagItem.tag}
                          className={`inline-block px-3 py-1 text-xs rounded-full ${
                            selectedTags.includes(tagItem.tag)
                              ? "bg-black text-white"
                              : "bg-muted"
                          }`}
                        >
                          {tagItem.tag}{tagItem.count > 1 && ` (x${tagItem.count})`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Contextual */}
                  {processed.contextual.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-medium text-muted-foreground">Contextual:</span>
                      {processed.contextual.map((tagItem) => (
                        <span
                          key={tagItem.tag}
                          className={`inline-block px-3 py-1 text-xs rounded-full ${
                            selectedTags.includes(tagItem.tag)
                              ? "bg-black text-white"
                              : "bg-muted"
                          }`}
                        >
                          {tagItem.tag}{tagItem.count > 1 && ` (x${tagItem.count})`}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Mechanisms */}
                  {processed.mechanisms.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-xs font-medium text-muted-foreground">Mechanisms:</span>
                      {processed.mechanisms.map((tagItem) => (
                        <span
                          key={tagItem.tag}
                          className={`inline-block px-3 py-1 text-xs rounded-full ${
                            selectedTags.includes(tagItem.tag)
                              ? "bg-black text-white"
                              : "bg-muted"
                          }`}
                        >
                          {tagItem.tag}{tagItem.count > 1 && ` (x${tagItem.count})`}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  {item.link && (
                    <button
                      onClick={() => window.open(item.link!, "_blank", "noopener,noreferrer")}
                      className="flex-1 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>🔗</span> Link
                    </button>
                  )}
                  <button
                    className="flex-1 px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-white rounded text-xs font-medium transition-colors"
                  >
                    Open coding
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>


      {/* No Results Message */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No visualizations match the selected tags.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm text-foreground hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}