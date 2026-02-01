import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

// Import corpus images
import materialGeometryImg from "@/assets/e0002d95bf2e6c4df3e70a4a2705d9af91811f08.png";
import holdMeLongerImg from "@/assets/98f5e5673f259ba97ffb82f33874801965c60275.png";
import carbonSavingsImg from "@/assets/1d1b2101c292ca37eee260e9ecc975ee340f8e38.png";
import colossalSquidImg from "@/assets/896c64b7a21faccf960a2f8aa6537a368c4988c7.png";
import microplasticsImg from "@/assets/322dbc2ce208ff28d547122b1bb2b5c2332583de.png";
import whalingDataImg from "@/assets/8e36631383f982e17e62127d7eb4592027752923.png";
import airportsImg from "@/assets/56d395067a07cf11817f546d7419878dde9a161a.png";
import catholicsSpainImg from "@/assets/8e86e79f822900c64016dde48cde593ac5ae13e8.png";
import vegetariansImg from "@/assets/5c370cfddd10015211eea8bf8cc847991a1bf4b1.png";

const corpusItems = [
  {
    id: 1,
    title: "Material & Geometry Composition",
    description: "A 3D visualization exploring material properties and geometric relationships through transparent and opaque cubes with varying materials including glass, metal, and solid colors.",
    tags: ["3D", "Static", "High Realism", "Material Transformations", "Shape", "Position", "Size"],
    image: materialGeometryImg
  },
  {
    id: 2,
    title: "Hold Me Longer",
    description: "Physical data visualization showing pleasure ratings for different hug durations, using deformable gradient bars with hands to represent tactile interaction and temporal measurement.",
    tags: ["Photo of Physicalization", "Static", "Indistinguishable from Reality", "Stretching", "Progression", "Material Transformations", "Position"],
    image: holdMeLongerImg
  },
  {
    id: 3,
    title: "Equivalent Carbon Dioxide Savings",
    description: "Fortune 100 companies' carbon savings visualized as coal volumes, using material metaphor to represent emissions data through stacked cubes with the Empire State Building for scale.",
    tags: ["3D", "Static", "High Realism", "Simple Materials", "Position", "Size", "Count", "Spatial Arrangement"],
    image: carbonSavingsImg
  },
  {
    id: 4,
    title: "Redside 8K - Colossal Squid",
    description: "Augmented reality visualization placing a life-sized colossal squid in an urban environment, demonstrating biological scale and spatial attributes through realistic rendering.",
    tags: ["3D", "Static", "High Realism", "Position", "Size", "Material Transformations", "Environment", "Growth"],
    image: colossalSquidImg
  },
  {
    id: 5,
    title: "Microplastics by Degradation",
    description: "Particle-based visualization showing microplastic sources through aggregated point clouds, using color and spatial distribution to represent categorical data and proportions.",
    tags: ["3D", "Static", "Intermediate Realism", "Count", "Density", "Position", "Simple Materials"],
    image: microplasticsImg
  },
  {
    id: 6,
    title: "No Way, Norway - Whaling Data",
    description: "Whale catch statistics by country visualized using biological metaphor, with whale sizes proportional to total catches (Norway: 660, Japan: 520, Iceland: 184) for the year 2015.",
    tags: ["Graphic Design / Illustration", "Static", "Intermediate Realism", "Position", "Size", "Material Transformations", "Growth"],
    image: whalingDataImg
  },
  {
    id: 7,
    title: "Attention Please! - Most Airports Worldwide",
    description: "Countries with most airports visualized as inflatable runway windsocks, with length encoding quantity (USA: 13,513, Brazil: 4,093, Mexico: 1,714, Canada: 1,467, Russia: 1,218).",
    tags: ["3D", "Static", "High Realism", "Stretching", "Position", "Size", "Material Transformations", "Fluids"],
    image: airportsImg
  },
  {
    id: 8,
    title: "Percentage of Catholics Within Spanish Population",
    description: "Temporal trend visualization (2018-2022) using stacked yellow chairs in a cathedral setting to represent declining Catholic population percentages from 68.8% to 55.2%.",
    tags: ["3D", "Static", "High Realism", "Count", "Spatial Arrangement", "Position", "Environment", "Lighting"],
    image: catholicsSpainImg
  },
  {
    id: 9,
    title: "The Five Countries with the Highest Amount of Vegetarians",
    description: "Vegetarian population data visualized as stacked lettuce leaves, showing Italy, Japan, UK, US, and Australia with heights proportional to population (4.2M to 11.2M).",
    tags: ["Photo of Physicalization", "Static", "Indistinguishable from Reality", "Position", "Size", "Count", "Spatial Arrangement", "Material Transformations"],
    image: vegetariansImg
  }
];

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
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    filterCategories
      .filter((cat): cat is ExpandableFilterCategory => cat.type === "expandable")
      .map(cat => cat.name) // Expandable categories start expanded
  );

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
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl mb-4">Corpus</h1>
        <p className="text-muted-foreground max-w-4xl">
          A collection of physically-inspired visualizations analyzed using our design space framework. 
          Each example demonstrates different physical attributes and metaphorical approaches to data representation.
        </p>
      </div>

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
                    <div className="flex flex-wrap gap-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:border-foreground transition-colors cursor-pointer">
            <CardHeader>
              <div className="aspect-video bg-muted rounded mb-4 flex items-center justify-center text-muted-foreground text-sm">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{item.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 bg-muted text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
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