import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";

// BASE_URL-safe helper (works on GitHub Pages subpaths)
const withBase = (relPath: string) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "/")}${relPath.replace(/^\/+/, "")}`;
};

const PLACEHOLDER_SVG = encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#e5e7eb"/>
      <stop offset="1" stop-color="#f3f4f6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#g)"/>
  <g fill="#9ca3af" font-family="ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" text-anchor="middle">
    <text x="200" y="140" font-size="24">Image placeholder</text>
    <text x="200" y="170" font-size="14">Add image to public/resources/</text>
  </g>
</svg>
`);
const PLACEHOLDER_IMG = `data:image/svg+xml;charset=utf-8,${PLACEHOLDER_SVG}`;

export function AboutPage() {
  const openLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* <h1 className="text-4xl mb-8">About</h1> */}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Codebook Panel */}
        <Card
          className="hover:border-foreground transition-colors shadow-md cursor-pointer"
          // onClick={() => openLink("https://drive.google.com/file/d/1NkwVguDk3kPv9HAtPov2vl-b_qLoTKwT/view?usp=sharing")}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Codebook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted rounded overflow-hidden mb-4">
              <img
                src={withBase("resources/codebook.png")}
                alt="Codebook"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Corpus Panel */}
        <Card
          className="hover:border-foreground transition-colors shadow-md cursor-pointer"
          // onClick={() => openLink("https://docs.google.com/spreadsheets/d/1WzuKZAbW-v9hJH_1lvXCY17qIhDfIDQb3Ez8t7Wvf1I/edit?usp=sharing")}
        >
          <CardHeader>
            <CardTitle className="text-2xl">Corpus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-[4/3] bg-muted rounded overflow-hidden mb-4">
              <img
                src={withBase("resources/corpus.png")}
                alt="Corpus"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG;
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
