import { useState } from "react";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "design-space", label: "Design Space" },
  { id: "corpus", label: "Corpus" },
  { id: "coding-interface", label: "Coding Interface" },
  { id: "inspiration-set", label: "Inspiration Set" },
  { id: "about", label: "About" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-full px-6">
        <div className="flex items-center h-16 gap-12">
          <h1 className="text-lg font-semibold tracking-tight whitespace-nowrap">
            Physically-inspired Visualization Explorer
          </h1>
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
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