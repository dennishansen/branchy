import TreeViewer from "@/components/TreeViewer";
import { Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    <div className="w-full">
      <header className="flex items-center gap-4 p-4">
        <Input
          defaultValue="Mind Map"
          className="max-w-[200px] bg-background border-input hover:border-muted-foreground/50 transition-colors"
        />
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-lg hover:bg-[#F1F0FB] transition-colors"
        >
          <Settings className="w-6 h-6 text-[#8E9196]" />
        </button>
      </header>

      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
              Configure your OpenAI API key. This will be saved locally in your browser.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="apiKey"
                placeholder="Enter your OpenAI API key"
                type="password"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <TreeViewer />
    </div>
  );
};

export default Index;
