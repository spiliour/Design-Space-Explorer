import { useState, useRef, useEffect } from "react";

// BASE_URL-safe helper (works on GitHub Pages subpaths)
const withBase = (relPath: string) => {
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env?.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

// Dummy element data with more complex curved shapes
// Using SVG path commands: M=move, L=line, Q=quadratic curve, C=cubic curve
const DUMMY_ELEMENTS = [
  {
    id: "element-1",
    name: "Primary Mark",
    type: "Mark",
    // Curved blob shape using quadratic beziers
    path: "M 15 20 Q 12 25 15 32 Q 18 38 25 35 Q 32 32 30 25 Q 28 18 22 18 Q 16 18 15 20 Z",
    center: { x: 22, y: 26 },
    attributes: {
      visualElement: "Mark",
      hierarchy: "1",
      proximityToData: "High (Literal)",
      proximityToReality: "Intermediate",
      encodings: ["Position", "Size", "Color"],
      mechanisms: ["Rigid-Body Mechanics"],
    },
  },
  {
    id: "element-2",
    name: "Data Collection",
    type: "Collection",
    // Organic blob shape
    path: "M 38 22 Q 35 18 42 16 Q 52 14 55 22 Q 58 30 52 38 Q 46 44 40 40 Q 34 36 36 28 Q 37 24 38 22 Z",
    center: { x: 46, y: 28 },
    attributes: {
      visualElement: "Collection",
      hierarchy: "1",
      proximityToData: "High (Literal)",
      proximityToReality: "High",
      encodings: ["Position", "Count", "Density"],
      mechanisms: ["Fluids", "Self-organization"],
    },
  },
  {
    id: "element-3",
    name: "Annotation Label",
    type: "Annotation",
    // Rounded rectangle-ish shape
    path: "M 65 12 Q 62 12 62 15 L 62 22 Q 62 25 65 25 L 82 25 Q 85 25 85 22 L 85 15 Q 85 12 82 12 Z",
    center: { x: 73, y: 18 },
    attributes: {
      visualElement: "Annotation",
      hierarchy: "2",
      proximityToData: "Low (Symbolic)",
      proximityToReality: "Low",
      encodings: ["Position"],
      mechanisms: [],
    },
  },
  {
    id: "element-4",
    name: "Secondary Mark",
    type: "Mark",
    // Irregular curved shape
    path: "M 70 35 C 65 32 68 28 75 30 C 82 32 88 35 85 42 C 82 50 78 52 72 48 C 66 44 68 38 70 35 Z",
    center: { x: 76, y: 40 },
    attributes: {
      visualElement: "Mark",
      hierarchy: "1",
      proximityToData: "Intermediate (Iconic)",
      proximityToReality: "Intermediate",
      encodings: ["Size", "Shape"],
      mechanisms: ["Deformable Solid Mechanics"],
    },
  },
  {
    id: "element-5",
    name: "Guide Element",
    type: "Guide",
    // Wavy shape
    path: "M 8 52 Q 12 48 18 52 Q 24 56 22 62 Q 20 68 14 68 Q 8 68 6 62 Q 4 56 8 52 Z",
    center: { x: 14, y: 60 },
    attributes: {
      visualElement: "Guide",
      hierarchy: "2",
      proximityToData: "None",
      proximityToReality: "Low",
      encodings: [],
      mechanisms: [],
    },
  },
  {
    id: "element-6",
    name: "Environment",
    type: "Scene",
    // Large organic background shape
    path: "M 32 58 Q 28 55 35 52 Q 45 48 55 52 Q 62 56 58 65 Q 54 75 45 78 Q 36 80 32 72 Q 28 64 32 58 Z",
    center: { x: 45, y: 65 },
    attributes: {
      visualElement: "Scene",
      hierarchy: "3",
      proximityToData: "None",
      proximityToReality: "High",
      encodings: [],
      mechanisms: ["Lighting", "Environment"],
    },
  },
  {
    id: "element-7",
    name: "Decoration",
    type: "Decoration",
    // Small curved decoration
    path: "M 75 62 Q 72 58 78 56 Q 88 54 92 62 Q 95 70 88 76 Q 80 82 75 76 Q 70 70 75 62 Z",
    center: { x: 82, y: 68 },
    attributes: {
      visualElement: "Decoration",
      hierarchy: "3",
      proximityToData: "None",
      proximityToReality: "Intermediate",
      encodings: [],
      mechanisms: ["Weathering", "Optics"],
    },
  },
];

type ElementData = typeof DUMMY_ELEMENTS[0];

export function OverviewPage() {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementData | null>(null);
  const [bubblePosition, setBubblePosition] = useState<{ x: number; y: number } | null>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Calculate bubble position when element is selected
  useEffect(() => {
    if (selectedElement && imageContainerRef.current) {
      const container = imageContainerRef.current;
      const rect = container.getBoundingClientRect();

      // Convert element center (0-100 scale) to pixel position
      const x = (selectedElement.center.x / 100) * rect.width;
      const y = (selectedElement.center.y / 100) * rect.height;

      setBubblePosition({ x, y });
    } else {
      setBubblePosition(null);
    }
  }, [selectedElement]);

  const handleElementClick = (element: ElementData) => {
    if (selectedElement?.id === element.id) {
      setSelectedElement(null);
    } else {
      setSelectedElement(element);
    }
  };

  return (
    <div className="h-[calc(100vh-65px)] p-8 overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Interactive Demonstration</h1>
        <p className="text-muted-foreground text-sm">
          Hover over the highlighted regions to see them, click to view details in a popup bubble.
        </p>
      </div>

      {/* Image container with overlay */}
      <div className="relative inline-block" ref={imageContainerRef}>
        {/* The visualization image */}
        <img
          src={withBase("demonstration/demo-01.png")}
          alt="Demonstration visualization"
          className="max-w-full h-auto rounded-lg shadow-lg"
          style={{ maxHeight: "70vh" }}
        />

        {/* SVG overlay for interactive regions */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {DUMMY_ELEMENTS.map((element) => (
            <path
              key={element.id}
              d={element.path}
              fill={
                selectedElement?.id === element.id
                  ? "rgba(59, 130, 246, 0.4)"
                  : hoveredElement === element.id
                  ? "rgba(59, 130, 246, 0.25)"
                  : "rgba(59, 130, 246, 0.08)"
              }
              stroke={
                selectedElement?.id === element.id
                  ? "#2563eb"
                  : "#3b82f6"
              }
              strokeWidth={selectedElement?.id === element.id ? "0.8" : "0.4"}
              strokeDasharray={selectedElement?.id === element.id ? "none" : "1 0.5"}
              strokeOpacity={
                selectedElement?.id === element.id
                  ? 1
                  : hoveredElement === element.id
                  ? 0.7
                  : 0.3
              }
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => handleElementClick(element)}
            />
          ))}
        </svg>

        {/* Floating bubble panel */}
        {selectedElement && bubblePosition && (
          <div
            className="absolute z-50 pointer-events-auto"
            style={{
              left: bubblePosition.x,
              top: bubblePosition.y,
              transform: bubblePosition.x > 50 * (imageContainerRef.current?.offsetWidth || 0) / 100
                ? "translate(-110%, -50%)"
                : "translate(10%, -50%)",
            }}
          >
            {/* Arrow pointing to element */}
            <div
              className="absolute w-0 h-0"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                ...(bubblePosition.x > 50 * (imageContainerRef.current?.offsetWidth || 0) / 100
                  ? {
                      right: "-8px",
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderLeft: "8px solid white",
                    }
                  : {
                      left: "-8px",
                      borderTop: "8px solid transparent",
                      borderBottom: "8px solid transparent",
                      borderRight: "8px solid white",
                    }),
              }}
            />

            {/* Bubble content */}
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-72 max-h-96 overflow-auto">
              {/* Close button */}
              <button
                onClick={() => setSelectedElement(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-lg leading-none"
              >
                ×
              </button>

              {/* Element name and type */}
              <div className="mb-3 pr-4">
                <h3 className="text-lg font-bold text-gray-900">{selectedElement.name}</h3>
                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                  {selectedElement.type}
                </span>
              </div>

              {/* Attributes */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-xs text-gray-500">Visual Element Type</span>
                  <p className="font-medium text-gray-800">{selectedElement.attributes.visualElement}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Hierarchy Level</span>
                  <p className="font-medium text-gray-800">{selectedElement.attributes.hierarchy}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Proximity to Data</span>
                  <p className="font-medium text-gray-800">{selectedElement.attributes.proximityToData}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Proximity to Reality</span>
                  <p className="font-medium text-gray-800">{selectedElement.attributes.proximityToReality}</p>
                </div>

                {/* Encodings */}
                {selectedElement.attributes.encodings.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">Data Encodings</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedElement.attributes.encodings.map((encoding) => (
                        <span
                          key={encoding}
                          className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700"
                        >
                          {encoding}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mechanisms */}
                {selectedElement.attributes.mechanisms.length > 0 && (
                  <div>
                    <span className="text-xs text-gray-500">Physical Mechanisms</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedElement.attributes.mechanisms.map((mechanism) => (
                        <span
                          key={mechanism}
                          className="px-2 py-0.5 text-xs rounded bg-purple-100 text-purple-700"
                        >
                          {mechanism}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend / Element list */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">
          Visual Elements
        </h3>
        <div className="flex flex-wrap gap-2">
          {DUMMY_ELEMENTS.map((element) => (
            <button
              key={element.id}
              onClick={() => handleElementClick(element)}
              onMouseEnter={() => setHoveredElement(element.id)}
              onMouseLeave={() => setHoveredElement(null)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                selectedElement?.id === element.id
                  ? "bg-blue-500 text-white border-blue-500"
                  : hoveredElement === element.id
                  ? "bg-blue-100 border-blue-300"
                  : "bg-muted border-border hover:border-blue-300"
              }`}
            >
              {element.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
