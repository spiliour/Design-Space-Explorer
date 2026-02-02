import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

import designspaceDataRaw from "@/data/designspace.json";
import corpusDataRaw from "@/data/corpus.json";

type DesignSpaceJson = {
  schema_version?: number;
  categories: Array<{
    category: string;
    order?: number;
    dimensions: Array<{
      id: string;
      label: string;
      description?: string;
      color?: string;
      icon?: string;
      order?: number;
      cards: Array<{
        id: string;
        title: string;
        description?: string;
        details?: string[];
        example?: string;
        examples?: string;
        image?: string;
        video?: string;
        source?: string;
        url?: string;
        coding_link?: string;
        order?: number;
        icon?: string;
      }>;
    }>;
  }>;
};

interface DimensionCard {
  id: string;
  title: string;
  description: string;
  details?: string[];
  examples?: string;
  image?: string;
  video?: string;
  source?: string;
  url?: string;
  coding_link?: string;
}

interface Dimension {
  id: string;
  label: string;
  description?: string;
  category: string;
  color: string;
  cards: DimensionCard[];
  categoryIcon?: string;
}

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
    <text x="600" y="320" font-size="34">Missing media</text>
    <text x="600" y="365" font-size="18">Check public/ paths</text>
  </g>
</svg>
`);
const PLACEHOLDER_IMG = `data:image/svg+xml;charset=utf-8,${PLACEHOLDER_SVG}`;

const withBase = (relPath: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

const resolveAsset = (src?: string) => {
  if (!src) return undefined;
  let s = String(src).trim();
  if (!s) return undefined;

  // Strip any extra quotes that might be in the JSON
  s = s.replace(/^["']|["']$/g, "");
  if (!s) return undefined;

  // Keep absolute URLs / data URLs as-is
  if (/^(https?:)?\/\//i.test(s) || s.startsWith("data:")) return s;

  // Normalize to relative (GitHub Pages-safe) and prepend BASE_URL
  const rel = s.replace(/^\/Design-Space-Explorer\//, "").replace(/^\/+/, "");
  return withBase(rel);
};

function FlippableCard({
  card,
  categoryIcon,
  dimensionColor,
  isPhysicalAttribute,
  corpusById,
}: {
  card: DimensionCard;
  categoryIcon?: string;
  dimensionColor: string;
  isPhysicalAttribute?: boolean;
  corpusById: Map<string, CorpusItem>;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const imageSrc = resolveAsset(card.image) ?? PLACEHOLDER_IMG;
  const videoSrc = resolveAsset(card.video);

  // Look up example in corpus if card.examples is an ID
  const exampleId = card.examples;
  const corpusExample = exampleId ? corpusById.get(exampleId) : undefined;
  const exampleSrc = corpusExample?.image
    ? withBase(corpusExample.image)
    : (exampleId ? resolveAsset(exampleId) : undefined);
  const exampleTitle = corpusExample?.title;
  const exampleLink = corpusExample?.link;

  const showMedia = Boolean(card.image || card.video);
  const canToggle = Boolean(isPhysicalAttribute && card.image && card.video);

  const openInNewTab = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="flip-container w-full"
      style={{ aspectRatio: "4 / 6", perspective: "1000px" }}
    >
      <div
        className={`flip-inner relative w-full h-full transition-transform duration-600 ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
          className="flip-face flip-front absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <Card className="hover:border-foreground transition-colors h-full flex flex-col overflow-hidden shadow-md">
            <CardHeader
              className="relative flex-shrink-0"
              style={{
                borderTop: `10px solid ${dimensionColor}`,
              }}
            >
              {categoryIcon && (
                <div className="absolute top-4 right-4 w-10 h-10">
                  <img
                    src={categoryIcon}
                    alt="Category icon"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <CardTitle className="text-lg mb-3 pr-12">
                {card.title}
              </CardTitle>

              {showMedia && (
                <div className="space-y-2">
                  <div className="rounded-lg border-2 border-border overflow-hidden bg-muted">
                    {showVideo && videoSrc ? (
                      <img
                        src={videoSrc}
                        alt={`${card.title} animation`}
                        className="w-full h-auto"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    ) : (
                      <img
                        src={imageSrc}
                        alt={card.title}
                        className="w-full h-auto"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    )}
                  </div>

                  {/* Image/Video Toggle - only show if both exist and is Physical Attribute */}
                  {canToggle && (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => setShowVideo(false)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          !showVideo
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Image
                      </button>
                      <button
                        onClick={() => setShowVideo(true)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          showVideo
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Video
                      </button>
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 card-scroll">
                {card.description && (
                  <CardDescription className="text-sm">
                    {card.description}
                  </CardDescription>
                )}

                {card.details && card.details.length > 0 && (
                  <div className="space-y-1.5">
                    {card.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-muted-foreground"
                      >
                        <div className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* View Example Button */}
              {exampleSrc && (
                <div className="pt-4 flex justify-end flex-shrink-0">
                  <button
                    onClick={() => setIsFlipped(true)}
                    className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
                  >
                    View example
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Back Side */}
        <div
          className="flip-face flip-back absolute inset-0 w-full h-full"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Card className="h-full flex flex-col overflow-hidden shadow-md">
            <CardHeader
              className="relative flex-shrink-0"
              style={{
                borderTop: `10px solid ${dimensionColor}`,
              }}
            >
              {categoryIcon && (
                <div className="absolute top-4 right-4 w-10 h-10">
                  <img
                    src={categoryIcon}
                    alt="Category icon"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <CardTitle className="text-lg mb-3 pr-12">
                {card.title}
              </CardTitle>

              {exampleSrc && (
                <div className="rounded-lg border-2 border-border overflow-hidden bg-muted max-h-75">
                  <img
                    src={exampleSrc}
                    alt={`${card.title} example`}
                    className="w-full h-auto max-h-80 object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                    }}
                  />
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 card-scroll">
                {exampleTitle && (
                  <div>
                    {/* <h3 className="font-bold text-sm mb-1">EXAMPLE</h3> */}
                    <p className="text-sm">{exampleTitle}</p>
                  </div>
                )}

                {card.source && (
                  <div>
                    <h3 className="font-bold text-sm mb-1">SOURCE</h3>
                    <p className="text-sm">{card.source}</p>
                  </div>
                )}
              </div>

              {/* Links and Back Button */}
              <div className="pt-4 flex justify-between items-center flex-shrink-0">
                <div className="flex items-center gap-3">
                  {exampleLink && (
                    <button
                      onClick={() => openInNewTab(exampleLink)}
                      className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                    >
                      <span>🔗</span> URL
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setIsFlipped(false)}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  Back to front
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Corpus lookup types
type CorpusItem = {
  id: string;
  title: string;
  image?: string;
  link?: string;
};

export function DesignSpacePage() {
  const data = designspaceDataRaw as DesignSpaceJson;

  // Create corpus lookup by ID
  const corpusById = useMemo(() => {
    const corpus = corpusDataRaw as CorpusItem[];
    const map = new Map<string, CorpusItem>();
    corpus.forEach(item => {
      if (item.id) map.set(item.id, item);
    });
    return map;
  }, []);

  // Build ordered categories -> ordered dimensions -> cards
  const orderedCategories = useMemo(() => {
    const cats = Array.isArray(data.categories) ? [...data.categories] : [];
    cats.sort((a, b) => {
      const ao = a.order ?? 999;
      const bo = b.order ?? 999;
      if (ao !== bo) return ao - bo;
      return String(a.category).localeCompare(String(b.category));
    });
    return cats;
  }, [data]);

  const dimensions: Dimension[] = useMemo(() => {
    const out: Dimension[] = [];

    for (const cat of orderedCategories) {
      const dims = Array.isArray(cat.dimensions) ? [...cat.dimensions] : [];
      dims.sort((a, b) => {
        const ao = a.order ?? 999;
        const bo = b.order ?? 999;
        if (ao !== bo) return ao - bo;
        return String(a.label).localeCompare(String(b.label));
      });

      for (const d of dims) {
        const cards = Array.isArray(d.cards) ? [...d.cards] : [];
        cards.sort((a, b) => {
          const ao = a.order ?? 999;
          const bo = b.order ?? 999;
          if (ao !== bo) return ao - bo;
          return String(a.title).localeCompare(String(b.title));
        });

        out.push({
          id: d.id,
          label: d.label,
          description: d.description,
          category: cat.category,
          color: d.color ?? "#94a3b8",
          categoryIcon: resolveAsset(d.icon),
          cards: cards.map((c) => ({
            id: c.id,
            title: c.title,
            description: c.description ?? "",
            details: c.details ?? [],
            examples: c.examples ?? c.example,
            image: c.image,
            video: c.video,
            source: c.source,
            url: c.url,
            coding_link: c.coding_link,
          })),
        });
      }
    }

    return out;
  }, [orderedCategories]);

  const groupedDimensions = useMemo(() => {
    // Preserve category order by iterating orderedCategories
    const byCat: Array<{ category: string; dims: Dimension[] }> = [];
    const map = new Map<string, Dimension[]>();
    for (const dim of dimensions) {
      if (!map.has(dim.category)) map.set(dim.category, []);
      map.get(dim.category)!.push(dim);
    }
    for (const cat of orderedCategories) {
      const dims = map.get(cat.category) ?? [];
      byCat.push({ category: cat.category, dims });
    }
    return byCat;
  }, [dimensions, orderedCategories]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const scrollContainer = document.getElementById("design-space-scroll-container");

    if (element && scrollContainer) {
      const elementTop = element.offsetTop;
      const offset = 100; // Offset to show the title
      scrollContainer.scrollTo({
        top: elementTop - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <>
      <style>{`
        /* Custom scrollbar styles */
        .custom-scrollbar {
          scrollbar-gutter: stable;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }

        .custom-scrollbar:hover::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Right panel scrollbar - always visible at fixed size */
        .right-panel-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .right-panel-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
        }

        .right-panel-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }

        .right-panel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Card content scrollbar */
        .card-scroll {
          scrollbar-gutter: stable;
        }

        .card-scroll::-webkit-scrollbar {
          width: 3px;
        }

        .card-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .card-scroll::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 2px;
        }

        .card-scroll:hover::-webkit-scrollbar {
          width: 6px;
        }

        .card-scroll:hover::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }

        .card-scroll::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-border bg-background overflow-y-auto custom-scrollbar">
          <div className="p-6">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Explore Dimensions
            </h2>

            {groupedDimensions.map(({ category, dims }) => (
              <div key={category} className="mb-6">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {dims.map((dimension) => (
                    <button
                      key={dimension.id}
                      onClick={() => scrollToSection(dimension.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-muted"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          backgroundColor: dimension.color,
                        }}
                      />
                      <span className="flex-1">
                        {dimension.label} ({dimension.cards.length})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content Area - Scrollable One Pager */}
        <div
          id="design-space-scroll-container"
          className="flex-1 overflow-y-auto right-panel-scrollbar"
        >
          <div className="p-8">
            {dimensions.map((dimension, dimIndex) => (
              <div key={dimension.id} id={dimension.id} className="mb-16">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: dimension.color,
                      }}
                    />
                    <h1 className="text-3xl">{dimension.label}</h1>
                  </div>
                  {dimension.description && (
                    <p className="text-muted-foreground text-sm">
                      {dimension.description}
                    </p>
                  )}
                </div>

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns: "repeat(auto-fill, 360px)",
                    justifyContent: "start",
                  }}
                >
                  {dimension.cards.map((card) => (
                    <FlippableCard
                      key={card.id}
                      card={card}
                      categoryIcon={dimension.categoryIcon}
                      dimensionColor={dimension.color}
                      isPhysicalAttribute={dimension.category === "Physical Attributes"}
                      corpusById={corpusById}
                    />
                  ))}
                </div>

                {/* Separator between sections, except for the last one */}
                {dimIndex < dimensions.length - 1 && (
                  <div className="mt-16 border-t border-border"></div>
                )}
              </div>
            ))}
          </div>

          {/* Footer inside right panel */}
          <footer className="border-t border-border mt-8 bg-slate-800">
            <div className="px-8 py-8 text-center text-sm text-white">
              {/* Footer content can be added here if needed */}
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}
