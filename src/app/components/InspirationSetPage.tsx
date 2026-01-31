import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

// Import inspiration images
import subsurfaceScatteringImg from "figma:asset/128fa6591da907f09456e78a4a95019947be93db.png";
import helixStructureImg from "figma:asset/b5f1c5effd6c57ab218089bdf7a6a1f09630cc9a.png";
import molecularBlobsImg from "figma:asset/f805b4059ce5330a2df49dd9eda3c0926fff3f5d.png";
import organicOrangeImg from "figma:asset/336a5292e0096f8665ad9ca8e439c3057e3c6165.png";
import baconTextureImg from "figma:asset/e0a263db05036033c1bf379eae1f2b60424400bb.png";
import lightingBlobsImg from "figma:asset/18aee70ec96df71ef68964d3d5a8d6cb9609d550.png";
import environmentBlobsImg from "figma:asset/5f96707deb1f75d22ddf5cdb32f563c99a77cf67.png";
import stretchingBlobsImg from "figma:asset/92bf95632dcedf99383c25e7ffb8e1318be33e53.png";
import twistBlobsImg from "figma:asset/6bd82f095f0e1c2cbf86db632a368f8e993bd1bf.png";
import breakBlobsImg from "figma:asset/f55f1c33cb1c7616ac5384550188f0718c76e4ca.png";
import geometricConesImg from "figma:asset/9c2c24879ed6f48f72030c6064a18f68be68b975.png";
import iridescentMeshImg from "figma:asset/56c32e458099cf339f51f9d8b1df644f85e43577.png";
import glassSpheresImg from "figma:asset/755209d4011a863bc0248a6157709c8891eaa54d.png";
import organicFlowerImg from "figma:asset/72034ea53217ca08e50745e459943ca7891c9287.png";

const inspirationItems = [
  {
    id: 1,
    title: "Organic Growth Patterns",
    description: "Natural branching structures and self-organization principles applied to hierarchical data visualization.",
    tags: ["Growth", "Biological", "Hierarchy", "3D"],
    image: organicFlowerImg
  },
  {
    id: 2,
    title: "Material States & Transformations",
    description: "Visualizing data transitions through phase changes, melting, freezing, and material metamorphosis.",
    tags: ["Materials", "Thermodynamics", "Transformation"],
    image: baconTextureImg
  },
  {
    id: 3,
    title: "Kinetic Energy Systems",
    description: "Motion and momentum visualizations using rigid-body mechanics and collision dynamics.",
    tags: ["Rigid-Body", "Motion", "Dynamics", "Spatial"],
    image: geometricConesImg
  },
  {
    id: 4,
    title: "Fluid & Flow Metaphors",
    description: "Data streams represented through liquid behavior, turbulence, and diffusion patterns.",
    tags: ["Fluids", "Flow", "Diffusion", "3D"],
    image: molecularBlobsImg
  },
  {
    id: 7,
    title: "Weathering & Aging",
    description: "Time-based data represented through erosion, decay, and environmental wear patterns.",
    tags: ["Weathering", "Decay", "Time"]
  },
  {
    id: 8,
    title: "Particle Swarms",
    description: "Collective behavior and emergent patterns from many independent data points.",
    tags: ["Particles", "Swarms", "Emergence", "Spatial"]
  },
  {
    id: 9,
    title: "Fracture & Breaking",
    description: "Disruption, segmentation, and fragmentation as visual metaphors for data discontinuities.",
    tags: ["Fracture", "Break", "Discontinuity", "3D"],
    image: breakBlobsImg
  },
  {
    id: 10,
    title: "Environmental Context",
    description: "Using natural environments and spatial settings to provide context and narrative for data.",
    tags: ["Environment", "Spatial", "Context", "3D"],
    image: environmentBlobsImg
  },
  {
    id: 11,
    title: "Torsional Forces",
    description: "Twisting and spiral patterns representing rotational data, cycles, or iterative processes.",
    tags: ["Deformation", "Twist", "Structure", "3D"],
    image: twistBlobsImg
  },
  {
    id: 12,
    title: "Material Bonding",
    description: "Connections and relationships visualized through physical bonding and molecular structures.",
    tags: ["Materials", "Connection", "Structure", "3D"],
    image: glassSpheresImg
  },
  {
    id: 13,
    title: "Surface Iridescence",
    description: "Color-shifting and optical effects on surfaces to encode multi-dimensional data.",
    tags: ["Optics", "Materials", "Surface", "3D"],
    image: iridescentMeshImg
  }
];

// Extract all unique tags
const allTags = Array.from(new Set(inspirationItems.flatMap(item => item.tags))).sort();

export function InspirationSetPage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredItems = selectedTags.length === 0
    ? inspirationItems
    : inspirationItems.filter(item =>
        selectedTags.every(tag => item.tags.includes(tag))
      );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl mb-4">Inspiration Set</h1>
        <p className="text-muted-foreground max-w-4xl">
          A curated collection of physical phenomena and natural processes that can inspire new approaches to data visualization. 
          Each concept demonstrates unique physical attributes that can be mapped to data variables.
        </p>
      </div>

      {/* Filter Tags */}
      <div className="mb-8">
        <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-3">Filter by Tags</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        {selectedTags.length > 0 && (
          <button
            onClick={() => setSelectedTags([])}
            className="mt-3 text-sm text-muted-foreground hover:text-foreground underline"
          >
            Clear filters ({filteredItems.length} {filteredItems.length === 1 ? 'result' : 'results'})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:border-foreground transition-colors cursor-pointer">
            <CardHeader>
              <div className="aspect-video bg-muted rounded mb-4 flex items-center justify-center text-muted-foreground text-sm overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  "Image placeholder"
                )}
              </div>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{item.description}</CardDescription>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`inline-block px-2 py-1 text-xs rounded transition-colors cursor-pointer ${
                      selectedTags.includes(tag)
                        ? "bg-foreground text-background"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}