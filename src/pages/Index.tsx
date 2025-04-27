import TreeViewer from "@/components/TreeViewer";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("openai-api-key") || "");

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

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="w-full p-4 pb-1 flex justify-center">
        <Input
          id="apiKey"
          placeholder="Enter your OpenAI API key"
          type="password"
          value={apiKey}
          onChange={(e) => handleApiKeyChange(e.target.value)}
          className="max-w-md bg-white/90 rounded-xl max-w-[244px]"
        />
      </div>
      <div className="flex-1 overflow-hidden">
        <TreeViewer />
      </div>
    </div>
  );
};

export default Index;
