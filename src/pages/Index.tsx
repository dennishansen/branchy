import TreeViewer from "@/components/TreeViewer";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Index = () => {
  const [clearCounter, setClearCounter] = useState(0);

  const handleClearTree = useCallback(() => {
    // Increment counter to trigger tree reset
    setClearCounter((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="max-w-[276px] w-full p-4 pb-1 flex justify-center items-center gap-2 mx-auto">
        <div className="flex-1" /> {/* Spacer to center the button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleClearTree}
          title="Clear tree"
          className="h-10 w-10 rounded-xl bg-white/90 text-gray-500 hover:text-red-500"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <TreeViewer shouldClear={clearCounter} />
      </div>
    </div>
  );
};

export default Index;
