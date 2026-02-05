import { useState } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  // { id: "overview", label: "Overview" },
  { id: "design-space", label: "Design Space" },
  { id: "corpus", label: "Corpus" },
  { id: "coding-interface", label: "Coding Interface" },
  // { id: "inspiration-set", label: "Inspiration Set" },
  { id: "about", label: "Resources" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-slate-800 sticky top-0 z-50">
      <div className="max-w-full px-6">
        <div className="flex items-center h-16 gap-12">
          <div className="flex items-center gap-3">
            <img
              src="/Design-Space-Explorer/icons/website_icon_rocks.png"
              alt="Website Icon"
              className="h-20 w-20 object-contain"
            />
            <h1 className="text-lg font-semibold tracking-tight whitespace-nowrap text-white">
              Physically-inspired Visualization Explorer
            </h1>
          </div>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}