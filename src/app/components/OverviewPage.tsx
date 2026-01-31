export function OverviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl mb-4">Overview</h1>
        <p className="text-muted-foreground max-w-4xl">
          Design Space Tree
        </p>
      </div>

      <div className="w-full">
        <iframe 
          width="100%" 
          height="649" 
          frameBorder="0"
          src="https://observablehq.com/embed/b6464df7b0b5e757@157?cells=main"
          className="border border-border rounded-lg"
        />
      </div>
    </div>
  );
}