// BASE_URL-safe helper (works on GitHub Pages subpaths)
const withBase = (relPath: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

export function CodingInterfacePage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="rounded-lg overflow-hidden shadow-lg">
        <img
          src={withBase("resources/interface screenshot.png")}
          alt="Coding Interface Preview"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
