import CenteredTreeViewer from "@/components/CenteredTreeViewer";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const [clearCounter, setClearCounter] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);

  const handleClearTree = useCallback(() => {
    // Increment counter to trigger tree reset
    setClearCounter((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="max-w-[276px] w-full p-4 pb-1 flex justify-between items-center gap-2 mx-auto">
        <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl bg-white/90 text-gray-700 hover:bg-gray-50 font-semibold flex items-center gap-1"
            >
              Branchy
              <Info className="h-3 w-3 text-gray-400" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>About Branchy</DialogTitle>
              <DialogDescription className="space-y-4">
                <p>
                  Branchy is an interactive tree visualization tool that lets you explore topics by
                  generating branching content. Start with any topic, click the arrow to expand, and
                  watch as AI generates related subtopics that branch out into an explorable
                  knowledge tree.
                </p>
                <p>Made by Dennis Hansen</p>
                <div className="flex flex-col gap-2">
                  <a
                    href="https://github.com/dennishansen/branchy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    GitHub Repository
                  </a>
                  <a
                    href="https://x.com/dennizor?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Twitter/X Profile
                  </a>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearTree}
          title="Clear tree"
          className="rounded-xl bg-white/90 text-gray-500 hover:text-red-500"
        >
          Clear
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <CenteredTreeViewer shouldClear={clearCounter} />
      </div>
    </div>
  );
};

export default Index;
