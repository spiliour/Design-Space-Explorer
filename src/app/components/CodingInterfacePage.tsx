import { useState, useRef } from "react";
import "./coding-interface/CodingInterfaceStyles.css";

// Schemas and constants
const ATTRIBUTE_SCHEMA: Record<string, any> = {
  spatial: ["Position", "Orientation", "Size", "Other"],
  geometry: ["Shape", "Surface", "Other"],
  material: {
    categories: ["Simple Materials", "Material Transformations", "Other"],
    properties: [
      "Color / Pattern", "Surface Texture", "Reflectance",
      "Opacity / Refraction", "Emission", "Organic Properties", "Other"
    ]
  },
  structural: [
    "Stretch", "Twist", "Fold / Unfold", "Segment / Cut", "Compress",
    "Inflate / Deflate", "Bend", "Break / Shatter", "Shrink", "Other"
  ],
  groups: ["Count", "Density", "Spatial Arrangement - Alignment", "Spatial Arrangement - Stacking", 
           "Spatial Arrangement - Packing", "Spatial Arrangement - Geographical", 
           "Spatial Arrangement - Concentration", "Spatial Arrangement - Scattering", 
           "Spatial Arrangement - Path", "Spatial Arrangement - Other", "Other"],
  framing: ["Lighting", "Camera", "Environment / Background", "Other"],
  time: [],
  other: ["Other"]
};

interface VisualElementType {
  id: string;
  description: string;
  elementType: string;
  elementDistData: string;
  elementDistReality: string;
  elementHierarchy: string;
  comment: string;
  thumbnail: string;
  visualChannels: AttributeType[];
  contextualAttributes: AttributeType[];
}

interface AttributeType {
  id: string;
  physicalAttribute: string;
  type: string;
  materialProperty?: string | string[];
  animated: boolean;
  dataVariable?: string;
  semanticCongruence?: string;
  mechanismCategory?: string;
  mechanismSubcategory?: string;
  comment: string;
  compoundId?: string | number;
}

export function CodingInterfacePage() {
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [showCropModal, setShowCropModal] = useState(false);
  
  const [coder, setCoder] = useState("");
  const [title, setTitle] = useState("");
  const [id, setId] = useState("");
  const [presentation, setPresentation] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [dataVariables, setDataVariables] = useState<string[]>([]);
  const [dataVariableInput, setDataVariableInput] = useState("");
  
  const [visualElements, setVisualElements] = useState<VisualElementType[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddElement = () => {
    if (!uploadedImage) {
      alert("Please upload an image first.");
      return;
    }
    setShowCropModal(true);
  };

  const handleCropConfirm = () => {
    // Simple implementation: use the full image as thumbnail
    // For production, you would implement canvas-based cropping
    const newElement: VisualElementType = {
      id: Date.now().toString(),
      description: "",
      elementType: "",
      elementDistData: "",
      elementDistReality: "",
      elementHierarchy: "",
      comment: "",
      thumbnail: uploadedImage,
      visualChannels: [],
      contextualAttributes: []
    };
    
    setVisualElements([...visualElements, newElement]);
    setShowCropModal(false);
  };

  const handleCropCancel = () => {
    setShowCropModal(false);
  };

  const addDataVariable = () => {
    if (dataVariableInput.trim() && !dataVariables.includes(dataVariableInput.trim())) {
      setDataVariables([...dataVariables, dataVariableInput.trim()]);
      setDataVariableInput("");
    }
  };

  const removeDataVariable = (varToRemove: string) => {
    setDataVariables(dataVariables.filter(v => v !== varToRemove));
  };

  const handleDataVariableKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDataVariable();
    }
  };

  const updateElement = (elementId: string, updates: Partial<VisualElementType>) => {
    setVisualElements(elements =>
      elements.map(el => el.id === elementId ? { ...el, ...updates } : el)
    );
  };

  const deleteElement = (elementId: string) => {
    setVisualElements(elements => elements.filter(el => el.id !== elementId));
  };

  const addAttribute = (elementId: string, isVisual: boolean) => {
    const newAttr: AttributeType = {
      id: Date.now().toString(),
      physicalAttribute: "",
      type: "",
      animated: false,
      comment: "",
      dataVariable: isVisual ? "" : undefined,
      semanticCongruence: isVisual ? "" : undefined
    };
    
    setVisualElements(elements =>
      elements.map(el => {
        if (el.id === elementId) {
          if (isVisual) {
            return { ...el, visualChannels: [...el.visualChannels, newAttr] };
          } else {
            return { ...el, contextualAttributes: [...el.contextualAttributes, newAttr] };
          }
        }
        return el;
      })
    );
  };

  const updateAttribute = (elementId: string, attrId: string, updates: Partial<AttributeType>, isVisual: boolean) => {
    setVisualElements(elements =>
      elements.map(el => {
        if (el.id === elementId) {
          const key = isVisual ? 'visualChannels' : 'contextualAttributes';
          return {
            ...el,
            [key]: el[key].map((attr: AttributeType) => 
              attr.id === attrId ? { ...attr, ...updates } : attr
            )
          };
        }
        return el;
      })
    );
  };

  const deleteAttribute = (elementId: string, attrId: string, isVisual: boolean) => {
    setVisualElements(elements =>
      elements.map(el => {
        if (el.id === elementId) {
          const key = isVisual ? 'visualChannels' : 'contextualAttributes';
          return {
            ...el,
            [key]: el[key].filter((attr: AttributeType) => attr.id !== attrId)
          };
        }
        return el;
      })
    );
  };

  const exportJSON = () => {
    const json = {
      coder,
      title,
      id,
      presentation,
      link,
      description,
      dataVariables,
      visualElements,
      image: uploadedImage
    };

    const idTitle = id.trim().replace(/\s+/g, "_") || "noID";
    const titleTitle = title.trim().replace(/\s+/g, "_") || "noTitle";
    const fileName = `${idTitle}_${titleTitle}_${coder || "noCoder"}_${presentation || "noPresentation"}.json`;

    const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        setCoder(data.coder || "");
        setTitle(data.title || "");
        setId(data.id || "");
        setPresentation(data.presentation || "");
        setLink(data.link || "");
        setDescription(data.description || "");
        setDataVariables(data.dataVariables || []);
        setVisualElements(data.visualElements || []);
        if (data.image) setUploadedImage(data.image);
      } catch (error) {
        alert("Error parsing JSON file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="coding-interface">
      <h1 className="ci-app-title">Physically-inspired Visualizations Coding</h1>

      <div className="ci-main-layout">
        {/* Left Panel */}
        <div className="ci-left-panel">
          <h2 className="ci-section-title">Visualization</h2>
          
          {uploadedImage && (
            <img 
              src={uploadedImage} 
              alt="Uploaded" 
              className="ci-uploaded-image"
            />
          )}

          <div className="ci-control-bar">
            <label className="ci-file-label" onClick={() => fileInputRef.current?.click()}>
              📷 Import Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />

            <button className="ci-button" onClick={handleAddElement}>
              ➕ Add Visual Element
            </button>

            <label className="ci-file-label" onClick={() => jsonInputRef.current?.click()}>
              📁 Import JSON
            </label>
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json"
              onChange={importJSON}
              style={{ display: 'none' }}
            />

            <button className="ci-button" onClick={exportJSON}>
              💾 Export JSON
            </button>

            <a 
              href="https://docs.google.com/document/d/1l9fVNV0WB8G2ko7A7T6pyRBZ33-KIg8rAx7d_QhthsQ/edit?tab=t.0" 
              target="_blank"
              rel="noopener noreferrer"
              className="ci-file-label"
            >
              📖 Code Book <span className="ci-external-icon">↗</span>
            </a>
          </div>

          {/* Metadata Fields */}
          <div className="ci-metadata-inline-group">
            <div className="ci-metadata-field ci-coder-field">
              <label htmlFor="coderSelect">Coder</label>
              <select 
                id="coderSelect" 
                className="ci-select"
                value={coder}
                onChange={(e) => setCoder(e.target.value)}
              >
                <option value="">-- Select Coder --</option>
                <option value="Sotiris">Sotiris</option>
                <option value="Fanis">Fanis</option>
                <option value="Pierre">Pierre</option>
                <option value="Consolidated">Consolidated</option>
              </select>
            </div>

            <div className="ci-metadata-field ci-title-field">
              <label htmlFor="titleInput">Title</label>
              <input 
                type="text" 
                id="titleInput" 
                className="ci-input"
                placeholder="Visualization title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="ci-metadata-field ci-id-field">
              <label htmlFor="idInput">ID</label>
              <input 
                type="text" 
                id="idInput" 
                className="ci-input"
                placeholder="ID..."
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </div>

            <div className="ci-metadata-field ci-presentation-field">
              <label htmlFor="presentationSelect">Presentation</label>
              <select 
                id="presentationSelect" 
                className="ci-select"
                value={presentation}
                onChange={(e) => setPresentation(e.target.value)}
              >
                <option value="">-- Select Type --</option>
                <option value="Static">Static</option>
                <option value="Dynamic">Dynamic</option>
              </select>
            </div>
          </div>

          <div className="ci-link-field">
            <label htmlFor="linkInput">Link</label>
            <input 
              type="text" 
              id="linkInput" 
              className="ci-input"
              placeholder="Insert Link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </div>

          <div className="ci-description-field">
            <label htmlFor="descriptionInput">Description</label>
            <textarea 
              id="descriptionInput" 
              className="ci-textarea"
              placeholder="Any useful information to the coders..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="ci-data-variable-field">
            <label htmlFor="dataVariableInput">Data Variables</label>
            <input 
              type="text" 
              id="dataVariableInput" 
              className="ci-input"
              placeholder="Add variable and press Enter"
              value={dataVariableInput}
              onChange={(e) => setDataVariableInput(e.target.value)}
              onKeyDown={handleDataVariableKeyDown}
            />
            <div className="ci-data-variable-tags">
              {dataVariables.map((variable, idx) => (
                <span 
                  key={idx} 
                  className="ci-data-variable-tag"
                  onClick={() => removeDataVariable(variable)}
                  title="Click to remove"
                >
                  {variable}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="ci-right-panel">
          <h2 className="ci-section-title">Visual Elements</h2>
          
          {visualElements.map((element) => (
            <VisualElement
              key={element.id}
              element={element}
              dataVariables={dataVariables}
              onUpdate={(updates) => updateElement(element.id, updates)}
              onDelete={() => deleteElement(element.id)}
              onAddAttribute={(isVisual) => addAttribute(element.id, isVisual)}
              onUpdateAttribute={(attrId, updates, isVisual) => 
                updateAttribute(element.id, attrId, updates, isVisual)}
              onDeleteAttribute={(attrId, isVisual) => 
                deleteAttribute(element.id, attrId, isVisual)}
            />
          ))}
        </div>
      </div>

      {/* Simple Crop Modal */}
      {showCropModal && (
        <div className="ci-crop-modal">
          <div className="ci-crop-modal-content">
            <h3>Add Visual Element</h3>
            <p style={{ color: '#666', marginBottom: '10px' }}>
              The full image will be added as a visual element. 
              You can crop it later using an external tool if needed.
            </p>
            <img 
              src={uploadedImage} 
              alt="Preview" 
              className="ci-crop-image"
              style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
            <div className="ci-crop-buttons">
              <button className="ci-button" onClick={handleCropConfirm}>Add Element</button>
              <button className="ci-button" onClick={handleCropCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Visual Element Component
interface VisualElementProps {
  element: VisualElementType;
  dataVariables: string[];
  onUpdate: (updates: Partial<VisualElementType>) => void;
  onDelete: () => void;
  onAddAttribute: (isVisual: boolean) => void;
  onUpdateAttribute: (attrId: string, updates: Partial<AttributeType>, isVisual: boolean) => void;
  onDeleteAttribute: (attrId: string, isVisual: boolean) => void;
}

function VisualElement({ 
  element, 
  dataVariables, 
  onUpdate, 
  onDelete, 
  onAddAttribute,
  onUpdateAttribute,
  onDeleteAttribute 
}: VisualElementProps) {
  const [showComment, setShowComment] = useState(false);

  return (
    <div className="ci-element-wrapper">
      <div style={{ display: 'flex', gap: '15px' }}>
        {/* Thumbnail */}
        <div style={{ width: '25%', display: 'flex', alignItems: 'center' }}>
          {element.thumbnail && (
            <img 
              src={element.thumbnail} 
              alt="Visual element" 
              style={{ width: '100%', border: '1px solid #ccc', borderRadius: '6px' }}
            />
          )}
        </div>

        {/* Inputs */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input 
              className="ci-input"
              placeholder="Description"
              value={element.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              style={{ flex: 6 }}
            />
            <button className="ci-button" onClick={onDelete} title="Delete this visual element">
              🗑️
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <select 
              className="ci-select"
              value={element.elementType}
              onChange={(e) => onUpdate({ elementType: e.target.value })}
              style={{ flex: 2 }}
            >
              <option value="">Select Element Type</option>
              {["Mark","Mark + Unit", "Collection", "Annotation","Guide","Decoration","Scene"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select 
              className="ci-select"
              value={element.elementHierarchy}
              onChange={(e) => onUpdate({ elementHierarchy: e.target.value })}
              style={{ flex: 1 }}
            >
              <option value="">Select Hierarchy</option>
              {["1", "2", "3","4","5","No hierarchy"].map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>

            <select 
              className="ci-select"
              value={element.elementDistData}
              onChange={(e) => onUpdate({ elementDistData: e.target.value })}
              style={{ flex: 2 }}
            >
              <option value="">Select Proximity to Data</option>
              <option value="Low">Low Proximity (Symbolic)</option>
              <option value="Intermediate">Intermediate Proximity (Iconic)</option>
              <option value="High">High Proximity (Literal)</option>
            </select>

            <select 
              className="ci-select"
              value={element.elementDistReality}
              onChange={(e) => onUpdate({ elementDistReality: e.target.value })}
              style={{ flex: 2 }}
            >
              <option value="">Select Proximity to Reality</option>
              <option value="Low">Low Proximity (Slightly Familiar)</option>
              <option value="Intermediate">Intermediate Proximity (Moderately Familiar)</option>
              <option value="High">High Proximity (Very Familiar)</option>
            </select>

            <button 
              className="ci-comment-toggle"
              onClick={() => setShowComment(!showComment)}
            >
              💬
            </button>
          </div>

          {showComment && (
            <textarea 
              className="ci-textarea"
              placeholder="Comment about this visual element..."
              value={element.comment}
              onChange={(e) => onUpdate({ comment: e.target.value })}
            />
          )}
        </div>
      </div>

      {/* Visual Channels */}
      <div style={{ marginTop: '15px' }}>
        <div className="ci-category-header">
          Data-encoding Attributes
          <button 
            className="ci-button ci-add-attribute-button"
            onClick={() => onAddAttribute(true)}
          >
            +
          </button>
        </div>
        <div className="ci-attribute-container">
          {element.visualChannels.map(attr => (
            <AttributeRow
              key={attr.id}
              attribute={attr}
              dataVariables={dataVariables}
              isVisual={true}
              onUpdate={(updates) => onUpdateAttribute(attr.id, updates, true)}
              onDelete={() => onDeleteAttribute(attr.id, true)}
            />
          ))}
        </div>
      </div>

      {/* Contextual Attributes */}
      <div style={{ marginTop: '15px' }}>
        <div className="ci-category-header">
          Contextual Attributes
          <button 
            className="ci-button ci-add-attribute-button"
            onClick={() => onAddAttribute(false)}
          >
            +
          </button>
        </div>
        <div className="ci-attribute-container">
          {element.contextualAttributes.map(attr => (
            <AttributeRow
              key={attr.id}
              attribute={attr}
              dataVariables={dataVariables}
              isVisual={false}
              onUpdate={(updates) => onUpdateAttribute(attr.id, updates, false)}
              onDelete={() => onDeleteAttribute(attr.id, false)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Attribute Row Component
interface AttributeRowProps {
  attribute: AttributeType;
  dataVariables: string[];
  isVisual: boolean;
  onUpdate: (updates: Partial<AttributeType>) => void;
  onDelete: () => void;
}

function AttributeRow({ attribute, dataVariables, isVisual, onUpdate, onDelete }: AttributeRowProps) {
  const [showComment, setShowComment] = useState(false);

  const renderSubFields = () => {
    if (!attribute.physicalAttribute) return null;

    if (attribute.physicalAttribute === "material") {
      return (
        <div className="ci-material-fields-row">
          <select 
            className="ci-select"
            value={attribute.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
          >
            <option value="">Select Category</option>
            {ATTRIBUTE_SCHEMA.material.categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select 
            className="ci-select ci-material-props-multi"
            multiple
            value={Array.isArray(attribute.materialProperty) ? attribute.materialProperty : []}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
              onUpdate({ materialProperty: selected });
            }}
          >
            {ATTRIBUTE_SCHEMA.material.properties.map((prop: string) => (
              <option key={prop} value={prop}>{prop}</option>
            ))}
          </select>
        </div>
      );
    }

    const options = ATTRIBUTE_SCHEMA[attribute.physicalAttribute];
    if (Array.isArray(options)) {
      return (
        <select 
          className="ci-select ci-attribute-subcategory-select"
          value={attribute.type}
          onChange={(e) => onUpdate({ type: e.target.value })}
        >
          <option value="">Select Property</option>
          {options.map((opt: string) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    return null;
  };

  return (
    <div className="ci-attribute-row">
      <div className="ci-row-area ci-attr-area">
        <select 
          className="ci-select ci-attribute-type-select"
          value={attribute.physicalAttribute}
          onChange={(e) => onUpdate({ physicalAttribute: e.target.value, type: "" })}
        >
          <option value="">Select Attribute Type</option>
          {Object.keys(ATTRIBUTE_SCHEMA).map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        
        {renderSubFields()}

        <button
          className="ci-icon-toggle ci-anim-btn"
          aria-pressed={attribute.animated}
          onClick={() => onUpdate({ animated: !attribute.animated })}
          title={attribute.animated ? "Animated" : "Not animated"}
        >
          <img src="/icons/animation.svg" alt="Animated" />
        </button>
      </div>

      {isVisual && (
        <div className="ci-row-area ci-support-area">
          <select 
            className="ci-select ci-data-variable-dropdown"
            value={attribute.dataVariable || ""}
            onChange={(e) => onUpdate({ dataVariable: e.target.value })}
          >
            <option value="">Select Data Variable</option>
            {dataVariables.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>

          <select 
            className="ci-select"
            value={attribute.semanticCongruence || ""}
            onChange={(e) => onUpdate({ semanticCongruence: e.target.value })}
            style={{ minWidth: '50px', flex: '0.45' }}
          >
            <option value="">Semantic congruence</option>
            <option value="weak">Weak Congruence</option>
            <option value="intermediate">Intermediate Congruence</option>
            <option value="strong">Strong Congruence</option>
          </select>
        </div>
      )}

      <button 
        className="ci-comment-toggle"
        onClick={() => setShowComment(!showComment)}
      >
        💬
      </button>

      <button className="ci-row-delete" onClick={onDelete} title="Delete this attribute">
        ❌
      </button>

      {showComment && (
        <textarea 
          className="ci-textarea"
          placeholder="Comment about this attribute..."
          value={attribute.comment}
          onChange={(e) => onUpdate({ comment: e.target.value })}
        />
      )}
    </div>
  );
}
