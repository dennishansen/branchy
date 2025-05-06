import TreeViewer from "@/components/TreeViewer";
import { Input } from "@/components/ui/input";
import { useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const Index = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai-api-key") || "");
  const [clearCounter, setClearCounter] = useState(0);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("openai-api-key", value);

    // Show confirmation toast when API key is saved
    if (value) {
      toast({
        title: "API key saved",
        description: "Your OpenAI API key has been saved to local storage.",
      });
    }
  };

  const handleClearTree = useCallback(() => {
    // Increment counter to trigger tree reset
    setClearCounter((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="max-w-[276px] w-full p-4 pb-1 flex justify-center items-center gap-2 mx-auto">
        <Input
          id="apiKey"
          placeholder="Enter your OpenAI API key"
          type="password"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          className="bg-white/90 rounded-xl flex-1"
        />
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
