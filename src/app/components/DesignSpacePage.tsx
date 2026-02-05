import { useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
        mechanism_creator?: string;
        mechanism_creator_link?: string;
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
  mechanism_creator?: string;
  mechanism_creator_link?: string;
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
  isMechanism,
  corpusById,
}: {
  card: DimensionCard;
  categoryIcon?: string;
  dimensionColor: string;
  isMechanism?: boolean;
  corpusById: Map<string, CorpusItem>;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  // Show video/gif by default if one exists (but not for mechanisms - they play on hover)
  const [showVideo, setShowVideo] = useState(Boolean(card.video) && !isMechanism);
  const [isZooming, setIsZooming] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse up globally to catch release outside the element
  useEffect(() => {
    if (isZooming) {
      const handleMouseUp = () => setIsZooming(false);
      window.addEventListener("mouseup", handleMouseUp);
      return () => window.removeEventListener("mouseup", handleMouseUp);
    }
  }, [isZooming]);

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
  // Show toggle if both static image and dynamic video/gif exist, but NOT for mechanisms
  const canToggle = Boolean(card.image && card.video && !isMechanism);

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
          <Card className="hover:border-foreground transition-colors h-full flex flex-col overflow-hidden shadow-md min-h-0">
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
                  {/* Preload GIF for mechanisms so it's cached when user hovers */}
                  {isMechanism && videoSrc && (
                    <img
                      src={videoSrc}
                      alt=""
                      className="hidden"
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className="rounded-lg border-2 border-border overflow-hidden bg-muted cursor-zoom-in select-none"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setIsZooming(true);
                    }}
                    onMouseEnter={() => isMechanism && setIsHovering(true)}
                    onMouseLeave={() => isMechanism && setIsHovering(false)}
                  >
                    {/* For mechanisms: show GIF only on hover. For others: use toggle state */}
                    {(isMechanism ? isHovering : showVideo) && videoSrc ? (
                      <img
                        src={videoSrc}
                        alt={`${card.title} animation`}
                        className="w-full h-auto pointer-events-none"
                        draggable={false}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    ) : (
                      <img
                        src={imageSrc}
                        alt={card.title}
                        className="w-full h-auto pointer-events-none"
                        draggable={false}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    )}
                  </div>

                  {/* Image/Video Toggle - only show if both exist and NOT a mechanism */}
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
                        Static
                      </button>
                      <button
                        onClick={() => setShowVideo(true)}
                        className={`px-3 py-1 text-xs rounded transition-colors ${
                          showVideo
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        Dynamic
                      </button>
                    </div>
                  )}

                  {/* Creator attribution for mechanisms */}
                  {isMechanism && card.mechanism_creator && (
                    <div className="text-xs text-muted-foreground text-center">
                      made by{" "}
                      {card.mechanism_creator_link ? (
                        <a
                          href={card.mechanism_creator_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {card.mechanism_creator}
                        </a>
                      ) : (
                        <span>{card.mechanism_creator}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto space-y-3 card-scroll min-h-0">
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
          <Card className="h-full flex flex-col overflow-hidden shadow-md min-h-0">
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

            <CardContent className="flex-1 flex flex-col overflow-hidden min-h-0">
              <div className="flex-1 overflow-y-auto space-y-3 card-scroll min-h-0">
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

      {/* Zoom Overlay - Enlarged Card (rendered via Portal to escape transform context) */}
      {isZooming &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 cursor-zoom-out"
            onMouseUp={() => setIsZooming(false)}
          >
            <div
              style={{
                width: "min(500px, 85vw)",
                aspectRatio: "4 / 6",
                maxHeight: "90vh",
              }}
            >
              <Card className="h-full flex flex-col overflow-hidden shadow-2xl">
                <CardHeader
                  className="relative flex-shrink-0 p-8"
                  style={{ borderTop: `14px solid ${dimensionColor}` }}
                >
                  {categoryIcon && (
                    <div className="absolute top-6 right-6 w-14 h-14">
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

                  <CardTitle className="text-2xl mb-4 pr-16">{card.title}</CardTitle>

                  {showMedia && (
                    <div className="space-y-3 mt-2">
                      {/* mt-2 controls how far down the image sits - adjust mt-1, mt-3, mt-4 etc. */}
                      <div className="rounded-xl border-[3px] border-border overflow-hidden bg-muted">
                        {showVideo && videoSrc ? (
                          <img
                            src={videoSrc}
                            alt={`${card.title} animation`}
                            className="w-full h-auto"
                            draggable={false}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                            }}
                          />
                        ) : (
                          <img
                            src={imageSrc}
                            alt={card.title}
                            className="w-full h-auto"
                            draggable={false}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                            }}
                          />
                        )}
                      </div>

                      {canToggle && (
                        <div className="flex gap-3 justify-center">
                          <button
                            className={`px-4 py-1.5 text-sm rounded transition-colors ${
                              !showVideo
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            Static
                          </button>
                          <button
                            className={`px-4 py-1.5 text-sm rounded transition-colors ${
                              showVideo
                                ? "bg-foreground text-background"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                            }`}
                          >
                            Dynamic
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-1 flex flex-col overflow-hidden px-8 pb-8">
                  <div className="flex-1 overflow-y-auto space-y-4 card-scroll">
                    {card.description && (
                      <CardDescription className="text-lg">
                        {card.description}
                      </CardDescription>
                    )}

                    {card.details && card.details.length > 0 && (
                      <div className="space-y-2">
                        {card.details.map((detail, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 text-sm text-muted-foreground"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>,
          document.body
        )}
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

// Dimensions that should display as continuous axis instead of grid
const CONTINUOUS_DIMENSIONS = [
  "metaphorical-proximity-to-data",
  "metaphorical-proximity-to-reality",
  "semantic-congruence",
];

// Hard-coded category descriptions
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Visual Elements": "A visual element is any perceivable graphical object or grouping within the composition that (a) supports data encodings (directly or indirectly), (b) supports the reading or interpretation of those encodings, or (c) contributes to the interpretation of the context of the dataset or the message of the visualization.",
  "Physical Attributes": "Physically-inspired attributes are visual cues that evoke characteristics of the physical world. They invite viewers to interpret a visual element in an image as a physical substance governed by real-world properties (e.g., physical size, texture, deformation, fracture, lighting).",
  "Attribute Dimensions": "The different dimensions that characterize a physically-inspired attribute.",
  "Physical Mechanisms": "Implied physical mechanisms refers to the perceived causal process that a visualization suggests is responsible for a physically-inspired attribute’s visual state or change. It captures the viewer’s inference of “what physical process is happening here”, independent of whether that process is physically correct or actually simulated.",
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
            mechanism_creator: c.mechanism_creator,
            mechanism_creator_link: c.mechanism_creator_link,
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
          background: #26334c;
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
                {/* Category title - adjust text-sm/text-base for size, font-bold/font-semibold for weight */}
                <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 px-3">
                  {category}
                </h3>
                <div className="space-y-1">
                  {dims.map((dimension) => (
                    <button
                      key={dimension.id}
                      onClick={() => scrollToSection(dimension.id)}
                      className="w-full flex items-center gap-3 px-3 py-0 rounded-lg text-left text-sm transition-colors hover:bg-muted"
                    >
                      {dimension.categoryIcon ? (
                        <img
                          src={dimension.categoryIcon}
                          alt=""
                          className="w-7 h-7 object-contain"
                        />
                      ) : (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: dimension.color,
                          }}
                        />
                      )}
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
            {groupedDimensions.map(({ category, dims }, catIndex) => (
              <div key={category} className="mb-16">
                {/* Category Header - centered, uppercase, with description */}
                <div className="text-center mb-12">
                  <h1 className="text-2xl font-bold uppercase tracking-wider mb-3">
                    {category}
                  </h1>
                  {CATEGORY_DESCRIPTIONS[category] && (
                    <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
                      {CATEGORY_DESCRIPTIONS[category]}
                    </p>
                  )}
                </div>

                {/* Dimensions within this category */}
                {dims.map((dimension, dimIndex) => (
                  <div key={dimension.id} id={dimension.id} className="mb-16">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-2">
                        {/* {dimension.categoryIcon ? (
                          <img
                            src={dimension.categoryIcon}
                            alt=""
                            className="w-10 h-10 object-contain"
                          />
                        ) : (
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: dimension.color,
                            }}
                          />
                        )} */}
                        <h2 className="text-3xl">{dimension.label}</h2>
                      </div>
                      {dimension.description && (
                        <p className="text-muted-foreground text-sm">
                          {dimension.description}
                        </p>
                      )}
                    </div>

                    {CONTINUOUS_DIMENSIONS.includes(dimension.id) ? (
                      /* Continuous Axis Layout */
                      <div className="relative">
                        {/* Cards with connectors */}
                        <div
                          className="grid gap-6"
                          style={{
                            gridTemplateColumns: `repeat(${dimension.cards.length}, 360px)`,
                            justifyContent: "start",
                          }}
                        >
                          {dimension.cards.map((card) => (
                            <div key={card.id} className="relative">
                              <FlippableCard
                                card={card}
                                categoryIcon={dimension.categoryIcon}
                                dimensionColor={dimension.color}
                                isMechanism={dimension.category === "Physical Mechanisms"}
                                corpusById={corpusById}
                              />
                              {/* Connector line from card to axis */}
                              <div className="flex flex-col items-center mt-2">
                                <div className="w-0.5 h-8 bg-gray-400" />
                                <div className="w-2.5 h-2.5 rounded-full -mt-1.5 bg-gray-400" />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Axis with gradient */}
                        <div
                          className="relative mt-2"
                          style={{
                            width: `calc(${dimension.cards.length} * 360px + ${dimension.cards.length - 1} * 24px)`,
                          }}
                        >
                          {/* Gradient background */}
                          <div
                            className="absolute inset-0 h-3 rounded-full"
                            style={{
                              background: `linear-gradient(to right, transparent, ${dimension.color})`,
                            }}
                          />
                          {/* Axis line */}
                          <div className="relative h-3 rounded-full border-2 border-gray-300" />

                          {/* Axis labels */}
                          <div className="flex justify-between mt-3 text-sm font-medium text-muted-foreground px-1">
                            <span>Low</span>
                            <span>Intermediate</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Standard Grid Layout */
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
                            isMechanism={dimension.category === "Physical Mechanisms"}
                            corpusById={corpusById}
                          />
                        ))}
                      </div>
                    )}

                    {/* Separator between dimensions within a category */}
                    {dimIndex < dims.length - 1 && (
                      <div className="mt-16 border-t border-border"></div>
                    )}
                  </div>
                ))}

                {/* Separator between categories */}
                {catIndex < groupedDimensions.length - 1 && (
                  <div className="mt-8 border-t-2 border-border"></div>
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
