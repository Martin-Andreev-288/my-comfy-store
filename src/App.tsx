import { Button } from "@/components/ui/button";
// lecture 127. Shadcn/ui Install -> first example how to use it with button
// there was some differences with the instructor, so we adjusted them according to its appearance
function App() {
  return (
    <div>
      <h1 className="text-7xl font-bold">App</h1>
      <Button
        variant="destructive"
        size="lg"
        onClick={() => console.log("it worked!!!")}
      >
        Click me
      </Button>
    </div>
  );
}

export default App;
