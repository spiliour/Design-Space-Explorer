import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

// Import images
import simpleMaterialImg from "figma:asset/6362e389c8a728ae1830297b9ea9948f0cbca058.png";
import materialTransformationImg from "figma:asset/743cf4dcf7721caf166e5433c9540a3ba94d4a53.png";
import positionImg from "figma:asset/0a69474d8d9934ead49ce6e0738b0d47c5dbbe18.png";
import positionGif from "figma:asset/cbd941ec692e49df8c68954722b917e3bcb36a12.png";
import shapeImg from "figma:asset/dbbcb5a982e20362f164c7ed421dbf96643a7dc2.png";
import surfaceImg from "figma:asset/29560b1f5730601bad807930f57e7350cf0f6e5d.png";
import orientationImg from "figma:asset/211d508245369a7a427318129d924baccc2f1871.png";
import sizeImg from "figma:asset/022343713b857f2cf80f3bdd2b94710b07a5dc5f.png";
import cameraImg from "figma:asset/18aee70ec96df71ef68964d3d5a8d6cb9609d550.png";
import lightingImg from "figma:asset/cd57dfcf04c44cf695118a5fad3cb54c65470f7f.png";
import environmentImg from "figma:asset/5f96707deb1f75d22ddf5cdb32f563c99a77cf67.png";
import stretchingImg from "figma:asset/92bf95632dcedf99383c25e7ffb8e1318be33e53.png";
import twistImg from "figma:asset/6bd82f095f0e1c2cbf86db632a368f8e993bd1bf.png";
import breakImg from "figma:asset/f55f1c33cb1c7616ac5384550188f0718c76e4ca.png";

// Import category icons
import spatialIcon from "figma:asset/807025439e3512ddcbee1acb29cee807ea3ba963.png";
import geometryIcon from "figma:asset/e6567b13a22bef74e2bcc3704f4058b8667e5a0f.png";
import materialIcon from "figma:asset/a87832e1d9a0e3d4a5a91d2d05e306233d49066d.png";
import framingIcon from "figma:asset/ac31d7eba07b121d47b7d7987805167b71a70f50.png";
import dataIcon from "figma:asset/efaefe177f5c5624d020d676197b98fbbd053b77.png";
import timeIcon from "figma:asset/99e24b46429271e9a7a5e9d559a8a4f86af9a6e1.png";
import realityIcon from "figma:asset/a6c675d7361c93dd0221d0e1e42f364ef7aeb5a0.png";
import populationsIcon from "figma:asset/1bfde59c8d5983b550af28062669d50b6c7835d9.png";
import biologicalIcon from "figma:asset/3d986b01b2fe3874d7a1f17a61c7e4080223400f.png";
import physicsIcon from "figma:asset/a3b754cf6d2c146173c02f13c601e73d86609c8f.png";
import structuralIcon from "figma:asset/a16e39052f17171d5b24a942543ea50d9e41f261.png";

interface DimensionCard {
  id: string;
  title: string;
  description: string;
  details?: string[];
  examples?: string;
  image?: string;
  video?: string; // GIF URL
  source?: string;
  url?: string;
}

interface Dimension {
  id: string;
  label: string;
  category: string;
  color: string;
  cards: DimensionCard[];
  categoryIcon?: string;
}

const dimensions: Dimension[] = [
  // Visual Elements
  {
    id: "element-type",
    label: "Element Type",
    category: "Visual Elements",
    color: "#f06951",
    cards: [
      {
        id: "mark",
        title: "Mark",
        description:
          "An atomic element that supports data encodings. It can do so directly, when its own visual properties map to data.",
        details: [
          "Supports data encodings directly or indirectly",
          "Functions as a unit within a Collection",
          "Data mapping occurs at mark or collection level",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "collection",
        title: "Collection",
        description:
          "A meaningful grouping of marks or collections that encodes data.",
        details: [
          "Groups marks or other collections",
          "The grouping itself encodes data",
          "Creates hierarchical structures",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "annotation",
        title: "Annotation",
        description:
          "A non-encoding element that explicitly attaches to a target to explain, emphasize, or direct attention.",
        details: [
          "Attaches to marks, collections, or guides",
          "Non-encoding element",
          "Can be shapes, highlights, or images",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "guide",
        title: "Guide",
        description:
          "A non-encoding element that supports interpretation of the scale of the encodings.",
        details: [
          "Axes, legends, or anchor elements",
          "Provides reference by comparison",
          "Supports scale interpretation",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "decoration",
        title: "Decoration",
        description:
          "A non-encoding element that supports interpretation of the context of the dataset or message.",
        details: [
          "Supports context and message",
          "Does not attach to targets",
          "Can be removed without affecting data reading",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "scene",
        title: "Scene",
        description:
          "A non-encoding element providing the 'framing' for other elements in the visualization.",
        details: [
          "Includes environment and background",
          "Defines point of view and lighting",
          "Creates overall framing",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "element-hierarchy",
    label: "Element Hierarchy",
    category: "Visual Elements",
    color: "#f06951",
    cards: [
      {
        id: "level-1",
        title: "Level 1",
        description: "Individual Marks (atomic items/links)",
        details: [
          "Atomic level elements",
          "Individual marks",
          "Base building blocks",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "level-2",
        title: "Level 2",
        description:
          "A Collection of Level-1 items (first grouping)",
        details: [
          "First grouping of marks",
          "Collection of atomic elements",
          "Creates initial hierarchy",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "level-3-5",
        title: "Level 3-5",
        description:
          "Nested groupings (Collection of Collections, etc.)",
        details: [
          "Multiple levels of nesting",
          "Collections of collections",
          "Complex hierarchical structures",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "no-hierarchy",
        title: "No Hierarchy",
        description:
          "Element applies to the entire visualization (e.g., global background)",
        details: [
          "Applies globally",
          "No specific level assignment",
          "Whole-scene elements",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "proximity-data",
    label: "Metaphorical Proximity to Data",
    category: "Visual Elements",
    color: "#f06951",
    categoryIcon: dataIcon,
    cards: [
      {
        id: "low-symbolic",
        title: "Low Proximity (Symbolic)",
        description:
          "The visual element does not resemble the associated data/theme, the connection must be learned from conventions.",
        details: [
          "No resemblance to data",
          "Requires learned conventions",
          "Abstract relationship",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "intermediate-iconic",
        title: "Intermediate Proximity (Iconic)",
        description:
          "The visual element shares some similar qualities or resembles in an intuitive way the associated data/theme.",
        details: [
          "Shares similar qualities",
          "Intuitive resemblance",
          "Some visual connection",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "high-literal",
        title: "High Proximity (Literal)",
        description:
          "The visual element is closely (physically/causally) connected to the data/theme.",
        details: [
          "Close physical connection",
          "Causal relationship",
          "Direct representation",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "proximity-reality",
    label: "Metaphorical Proximity to Reality",
    category: "Visual Elements",
    color: "#f06951",
    categoryIcon: realityIcon,
    cards: [
      {
        id: "low-unfamiliar",
        title: "Low Proximity (Slightly Familiar)",
        description:
          "The visual element is only slightly familiar / feels more abstract or unfamiliar.",
        details: [
          "Abstract feeling",
          "Unfamiliar to most",
          "Limited real-world connection",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "intermediate-moderate",
        title: "Intermediate Proximity (Moderately Familiar)",
        description:
          "The visual element is moderately familiar.",
        details: [
          "Some familiarity",
          "Known but not common",
          "Moderate recognition",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "high-familiar",
        title: "High Proximity (Very Familiar)",
        description:
          "The visual element is very familiar from everyday experience.",
        details: [
          "Everyday experience",
          "Highly recognizable",
          "Strong real-world knowledge",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  // Physical Attributes
  {
    id: "spatial-attributes",
    label: "Spatial Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: spatialIcon,
    cards: [
      {
        id: "position",
        title: "Position",
        description:
          "The object's location within the composition.",
        details: [
          "X, Y, Z coordinates",
          "Relative or absolute positioning",
          "Spatial encoding of data values",
        ],
        image: positionImg,
        video: positionGif,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "orientation",
        title: "Orientation",
        description:
          "The angular rotation or facing direction of an object.",
        details: [
          "Rotation angles",
          "Directional encoding",
          "Angular data representation",
        ],
        image: orientationImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "size",
        title: "Size",
        description:
          "The size of an object, which can be in length, surface or volume.",
        details: [
          "Length, width, height",
          "Area or volume",
          "Magnitude representation",
        ],
        image: sizeImg,
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "geometry-attributes",
    label: "Geometry Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: geometryIcon,
    cards: [
      {
        id: "shape",
        title: "Shape",
        description:
          "The geometry's overall shape. It can be a recognizable shape (e.g. a star or a hand) or an abstract one.",
        details: [
          "Recognizable forms",
          "Abstract geometries",
          "Shape-based categorization",
        ],
        image: shapeImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "surface",
        title: "Surface",
        description:
          "Data is mapped to localized deformations on the object's surface, such as bumps, folds or extrusions.",
        details: [
          "Bumps and depressions",
          "Surface deformations",
          "Texture-based encoding",
        ],
        image: surfaceImg,
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "material-attributes",
    label: "Material Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: materialIcon,
    cards: [
      {
        id: "simple-materials",
        title: "Simple Materials",
        description:
          "Clearly separated materials applied to different areas or objects, often indicating distinct categories.",
        details: [
          "Distinct material types",
          "Categorical differentiation",
          "Clear material boundaries",
        ],
        image: simpleMaterialImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "material-transformations",
        title: "Material Transformations",
        description:
          "From isolated material changes to complex changes that communicate physical processes.",
        details: [
          "Color / Pattern changes",
          "Surface Texture variations",
          "Reflectance modifications",
          "Opacity / Refraction effects",
          "Emission properties",
          "Organic transformations",
        ],
        image: materialTransformationImg,
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "structural-attributes",
    label: "Structural Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: structuralIcon,
    cards: [
      {
        id: "stretching",
        title: "Stretching",
        description:
          "Extension or elongation of an object's form.",
        details: [
          "Elastic deformation",
          "Length increase",
          "Tension representation",
        ],
        image: stretchingImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "twist",
        title: "Twist",
        description: "Rotational deformation along an axis.",
        details: [
          "Torsional deformation",
          "Spiral patterns",
          "Angular distortion",
        ],
        image: twistImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "break",
        title: "Break / Shatter",
        description: "Fragmentation into separate pieces.",
        details: [
          "Fracture patterns",
          "Discontinuity",
          "Fragment distribution",
        ],
        image: breakImg,
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "groups-populations",
    label: "Groups and Populations",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: populationsIcon,
    cards: [
      {
        id: "count",
        title: "Count",
        description:
          "Focus is on the number of objects that make up the population.",
        details: [
          "Discrete counting",
          "Quantity representation",
          "Numerical encoding",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "density",
        title: "Density",
        description:
          "Focus is on how closely or widely the objects are distributed.",
        details: [
          "Spatial distribution",
          "Concentration patterns",
          "Sparse vs. dense regions",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "spatial-arrangement",
        title: "Spatial Arrangement",
        description:
          "The spatial arrangement or topological patterns applied to objects inside the population.",
        details: [
          "Stacking patterns",
          "Packing efficiency",
          "Geographical distribution",
          "Concentration areas",
          "Scattering patterns",
          "Path following",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "framing-attributes",
    label: "Framing Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: framingIcon,
    cards: [
      {
        id: "lighting",
        title: "Lighting",
        description:
          "Light sources and illumination affecting the scene.",
        details: [
          "Light direction and intensity",
          "Shadow creation",
          "Mood and emphasis",
        ],
        image: lightingImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "camera",
        title: "Camera",
        description: "Point of view, angle, lens distortion.",
        details: [
          "Perspective choice",
          "Viewing angle",
          "Lens effects and distortion",
        ],
        image: cameraImg,
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "environment",
        title: "Environment",
        description:
          "Spatial and contextual elements surrounding a subject.",
        details: [
          "Background elements",
          "Contextual setting",
          "Atmospheric effects",
        ],
        image: environmentImg,
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "time-attributes",
    label: "Time Attributes",
    category: "Physical Attributes",
    color: "#3f4adb",
    categoryIcon: timeIcon,
    cards: [
      {
        id: "progression",
        title: "Progression",
        description:
          "Sequential changes over time, showing stages or phases of development.",
        details: [
          "Sequential stages",
          "Temporal ordering",
          "Phase transitions",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "speed",
        title: "Speed",
        description:
          "The rate of change or motion, representing velocity or pace.",
        details: [
          "Motion velocity",
          "Rate of change",
          "Tempo representation",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "rhythm",
        title: "Rhythm",
        description:
          "Periodic or recurring patterns in time, creating temporal structure.",
        details: [
          "Cyclic patterns",
          "Periodic repetition",
          "Temporal regularity",
        ],
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "biological-mechanisms",
    label: "Biological Mechanisms",
    category: "Physical Mechanisms",
    color: "#436d41",
    categoryIcon: biologicalIcon,
    cards: [
      {
        id: "growth",
        title: "Growth",
        description:
          "Structures that emerge, enlarge, branch, or differentiate over time.",
        examples:
          "Examples: blooming flowers, branching trees or corals, cell division",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "decay",
        title: "Decay",
        description:
          "Degradation caused by breakdown, death, or deterioration of living matter.",
        examples:
          "Examples: rotting, biodegradation, wrinkling, decomposition",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "living-movement",
        title: "Living Movement",
        description:
          "Movement caused by internal, biological processes.",
        examples:
          "Examples: breathing, pulse/heartbeat dilations, tremor, bioluminescent pulsing",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "infection",
        title: "Infection",
        description:
          "Spread of living agents across an object or host.",
        examples:
          "Examples: mold / mycelium, bacterial growth, moss / lichen",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "self-organization",
        title: "Self-Organization & Patterns",
        description:
          "Pattern formation arising from local interactions without centralized control.",
        examples:
          "Examples: flocking / swarming, Turing patterns, phyllotaxis packing",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "life-cycle",
        title: "Life-Cycle Events",
        description:
          "Biological stage transitions that change appearance, structure, or function.",
        examples:
          "Examples: germination, metamorphosis, flowering / fruiting / seeding",
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  {
    id: "physics-mechanisms",
    label: "Physics & Chemical Mechanisms",
    category: "Physical Mechanisms",
    color: "#436d41",
    categoryIcon: physicsIcon,
    cards: [
      {
        id: "rigid-body",
        title: "Rigid-Body Mechanics",
        description:
          "Motion of bodies treated as undeformable solids under forces, constraints, and collisions.",
        examples:
          "Examples: gravity-driven fall, bouncing balls, projectile motion, stacking and toppling",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "deformable",
        title: "Deformable Solid Mechanics",
        description:
          "Shape changes and fracture of solids under stress, including elastic and plastic deformation.",
        examples:
          "Examples: twisting or bending beams, stretching, compression, tearing, cracking",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "fluids",
        title: "Fluids",
        description:
          "Phenomena related to liquid and gaseous flows, including diffusion and mixing.",
        examples:
          "Examples: ripples, droplets, mixing of liquids, flow, turbulence, vortices, jets",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "burning",
        title: "Burning & Smoke",
        description:
          "Oxidation-driven emission and transformation of matter producing flames or smoke.",
        examples:
          "Examples: smoke, burning, fire, explosion, heat",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "thermodynamics",
        title: "Thermodynamics",
        description:
          "Appearance and shape changes caused by heat transfer and phase transformations.",
        examples:
          "Examples: melting, freezing, evaporation, steam, frosting",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "force-fields",
        title: "Force Fields & Particles",
        description:
          "Motion and structure shaped by force fields (electromagnetic, wind, etc.).",
        examples:
          "Examples: magnetic attraction/repulsion, wind, dust/pollen diffusion",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "waves",
        title: "Waves & Oscillations",
        description:
          "Repeating disturbances over time, traveling through space or cycling in place.",
        examples:
          "Examples: ripples on water, vibrating strings, springs, pulses",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "optics",
        title: "Optics",
        description:
          "Effects arising from light–matter interaction and light transport.",
        examples:
          "Examples: shadows, volumetric lighting, subsurface scattering, caustics, refraction",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "weathering",
        title: "Weathering",
        description:
          "Long-term alteration of surfaces by environmental exposure.",
        examples:
          "Examples: erosion, oxidation, decomposition, frosting",
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
  // Semantic Congruence
  {
    id: "semantic-congruence",
    label: "Semantic Congruence",
    category: "Semantic Congruence",
    color: "#d494ff",
    categoryIcon: dataIcon,
    cards: [
      {
        id: "weak-congruence",
        title: "Weak Congruence",
        description:
          "There is a weak semantic congruence between the data variable and the representation.",
        details: [
          "High semantic distance",
          "Arbitrary or conventional mapping",
          "Requires legend or training to interpret",
        ],
        examples:
          'Examples: Count → bar length, Category → arbitrary colors. "I need the legend (or training) to know what this means."',
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "intermediate-congruence",
        title: "Intermediate Congruence",
        description:
          "There is an intermediate semantic congruence between the data variable and the representation.",
        details: [
          "Moderate semantic distance",
          "Partial intuitive connection",
          "Some inference required",
        ],
        examples:
          "Examples: Mappings that have some logical connection but aren't immediately obvious without context.",
        source: "Example Source",
        url: "https://example.com",
      },
      {
        id: "strong-congruence",
        title: "Strong Congruence",
        description:
          "There is a strong semantic connection between the data variable and the representation.",
        details: [
          "Low semantic distance",
          "Immediately interpretable",
          "Direct perceived meaning",
        ],
        examples:
          'Examples: Count → number of units, Physical size → object size, Damage → cracks/breakage. "I can guess what this means."',
        source: "Example Source",
        url: "https://example.com",
      },
    ],
  },
];

// Flippable Card Component
function FlippableCard({
  card,
  categoryIcon,
  dimensionColor,
  isPhysicalAttribute,
}: {
  card: DimensionCard;
  categoryIcon?: string;
  dimensionColor: string;
  isPhysicalAttribute?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div
      className="flip-container w-full"
      style={{ aspectRatio: "4 / 6", perspective: "1000px" }}
    >
      <div
        className={`flip-inner relative w-full h-full transition-transform duration-600 ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}
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
                  />
                </div>
              )}
              <CardTitle className="text-lg mb-3 pr-12">
                {card.title}
              </CardTitle>

              {(card.image || card.video) && (
                <div className="space-y-2">
                  <div className="rounded-lg border-2 border-border overflow-hidden bg-muted">
                    {showVideo && card.video ? (
                      <img
                        src={card.video}
                        alt={`${card.title} animation`}
                        className="w-full h-auto"
                      />
                    ) : card.image ? (
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-auto"
                      />
                    ) : null}
                  </div>

                  {/* Image/Video Toggle - only show if both exist and is Physical Attribute */}
                  {isPhysicalAttribute &&
                    card.image &&
                    card.video && (
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
                <CardDescription className="text-sm">
                  {card.description}
                </CardDescription>

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

                {card.examples && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground italic">
                      {card.examples}
                    </p>
                  </div>
                )}
              </div>

              {/* View Example Button */}
              <div className="pt-4 flex justify-end flex-shrink-0">
                <button
                  onClick={() => setIsFlipped(true)}
                  className="px-4 py-2 bg-yellow-400 text-black rounded-full text-sm font-medium hover:bg-yellow-500 transition-colors"
                >
                  View example
                </button>
              </div>
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
                  />
                </div>
              )}
              <CardTitle className="text-lg mb-3 pr-12">
                {card.title}
              </CardTitle>

              {card.image && (
                <div className="rounded-lg border-2 border-border overflow-hidden bg-muted">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 card-scroll">
                <div>
                  <h3 className="font-bold text-sm mb-1">
                    TITLE
                  </h3>
                  <p className="text-sm">{card.title}</p>
                </div>

                <div>
                  <h3 className="font-bold text-sm mb-1">
                    SOURCE
                  </h3>
                  <p className="text-sm">{card.source}</p>
                </div>
              </div>

              {/* URL and Back Button */}
              <div className="pt-4 flex justify-between items-center flex-shrink-0">
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                >
                  <span>🔗</span> URL
                </a>
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

export function DesignSpacePage() {
  // Group dimensions by category
  const groupedDimensions = dimensions.reduce(
    (acc, dim) => {
      if (!acc[dim.category]) {
        acc[dim.category] = [];
      }
      acc[dim.category].push(dim);
      return acc;
    },
    {} as Record<string, Dimension[]>,
  );

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const scrollContainer = document.getElementById(
      "design-space-scroll-container",
    );

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

            {Object.entries(groupedDimensions).map(
              ([category, dims]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-3">
                    {category}
                  </h3>
                  <div className="space-y-1">
                    {dims.map((dimension) => (
                      <button
                        key={dimension.id}
                        onClick={() =>
                          scrollToSection(dimension.id)
                        }
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-colors hover:bg-muted"
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: dimension.color,
                          }}
                        />
                        <span className="flex-1">
                          {dimension.label} (
                          {dimension.cards.length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right Content Area - Scrollable One Pager */}
        <div
          id="design-space-scroll-container"
          className="flex-1 overflow-y-auto right-panel-scrollbar"
        >
          <div className="p-8">
            {dimensions.map((dimension, dimIndex) => (
              <div
                key={dimension.id}
                id={dimension.id}
                className="mb-16"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: dimension.color,
                      }}
                    />
                    <h1 className="text-3xl">
                      {dimension.label}
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {dimension.category}
                  </p>
                </div>

                <div
                  className="grid gap-6"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, 360px)",
                    justifyContent: "start",
                  }}
                >
                  {dimension.cards.map((card) => (
                    <FlippableCard
                      key={card.id}
                      card={card}
                      categoryIcon={dimension.categoryIcon}
                      dimensionColor={dimension.color}
                      isPhysicalAttribute={
                        dimension.category ===
                        "Physical Attributes"
                      }
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
          <footer className="border-t border-border mt-8">
            <div className="px-8 py-8 text-center text-sm text-muted-foreground">
              <p>Physically-inspired Visualization Explorer</p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}