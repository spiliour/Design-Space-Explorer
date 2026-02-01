import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

import corpusData from "@/data/corpus.json";

// ---- Corpus data (JSON-driven) ----
type CorpusJsonRow = {
  id?: string | number;
  title?: string;
  description?: string;
  image?: string; // relative path like "media/corpus/ex-001.png" (no leading slash recommended)
  method_of_making?: string; // e.g. "3D"
  animation?: string; // e.g. "Static"
  perceptual_realism?: string; // e.g. "High Realism"
  tags?: string[] | string; // array or semicolon-separated
  link?: string;
};

type CorpusItem = {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  tags: string[];
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

const corpusItems: CorpusItem[] = (corpusData as CorpusJsonRow[]).map((row, index) => {
  const coreTags = normalizeTags(row.tags);
  // Keep your existing filters working by folding these fields into tags too:
  const extraTags = [row.method_of_making, row.animation, row.perceptual_realism]
    .filter(Boolean)
    .map(v => String(v).trim())
    .filter(Boolean);

  return {
    id: row.id ?? index + 1,
    title: row.title ?? `Example ${index + 1}`,
    description: row.description ?? "",
    image: row.image ? String(row.image).replace(/^\/+/, "") : undefined,
    tags: uniq([...extraTags, ...coreTags]),
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

const filterCategories: FilterCategory[] = [
  {
    type: "inline",
    name: "Method of Making",
    options: ["3D", "Photo of Physicalization", "Graphic Design / Illustration"]
  },
  {
    type: "inline",
    name: "Animation",
    options: ["Static", "Dynamic"]
  },
  {
    type: "inline",
    name: "Perceptual Realism",
    options: ["Low Realism", "Intermediate Realism", "High Realism", "Indistinguishable from Reality"]
  },
  {
    type: "expandable",
    name: "Physical Attributes",
    subcategories: [
      {
        name: "Spatial Attributes",
        options: ["Position", "Orientation", "Size"]
      },
      {
        name: "Geometry Attributes",
        options: ["Shape", "Surface"]
      },
      {
        name: "Material Attributes",
        options: ["Simple Materials", "Material Transformations"]
      },
      {
        name: "Structural Attributes",
        options: ["Stretching", "Twist", "Break / Shatter"]
      },
      {
        name: "Groups and Populations",
        options: ["Count", "Density", "Spatial Arrangement"]
      },
      {
        name: "Framing Attributes",
        options: ["Lighting", "Camera", "Environment"]
      },
      {
        name: "Time Attributes",
        options: ["Progression", "Speed", "Rhythm"]
      }
    ]
  },
  {
    type: "expandable",
    name: "Implied Physical Mechanisms",
    subcategories: [
      {
        name: "Biological Mechanisms",
        options: ["Growth", "Decay", "Living Movement", "Infection", "Self-Organization & Patterns", "Life-Cycle Events"]
      },
      {
        name: "Physics & Chemical Mechanisms",
        options: ["Rigid-Body Mechanics", "Deformable Solid Mechanics", "Fluids", "Burning & Smoke", "Thermodynamics", "Force Fields & Particles", "Waves & Oscillations", "Optics", "Weathering"]
      }
    ]
  }
];

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

  // Filter items based on selected tags
  const filteredItems = selectedTags.length === 0
    ? corpusItems
    : corpusItems.filter(item => 
        selectedTags.some(tag => item.tags.includes(tag))
      );

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
          const clickable = Boolean(item.link);

          return (
            <Card
              key={item.id}
              className={[
                "hover:border-foreground transition-colors",
                clickable ? "cursor-pointer" : "cursor-default",
              ].join(" ")}
              onClick={() => clickable && window.open(item.link!, "_blank", "noopener,noreferrer")}
              role={clickable ? "link" : undefined}
              tabIndex={clickable ? 0 : -1}
              onKeyDown={(e) => {
                if (!clickable) return;
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  window.open(item.link!, "_blank", "noopener,noreferrer");
                }
              }}
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

              <CardContent>
                <CardDescription className="mb-4">{item.description}</CardDescription>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={tag} className="inline-block px-2 py-1 bg-muted text-xs rounded">
                      {tag}
                    </span>
                  ))}
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