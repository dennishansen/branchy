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
import { TreeProvider, useTreeContext } from "@/context/TreeContext";

const IndexContent = () => {
  const [clearCounter, setClearCounter] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { state } = useTreeContext();

  const handleClearTree = useCallback(() => {
    // Increment counter to trigger tree reset
    setClearCounter((prev) => prev + 1);
  }, []);

  // Check if there's data to clear - either root text or children
  const hasDataToClear =
    (state.root?.text && state.root.text.trim() !== "") ||
    Object.keys(state.root?.children || {}).length > 0 ||
    Object.keys(state).filter((key) => key !== "root").length > 0;

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="max-w-[276px] w-full pb-1 flex items-center mx-auto relative">
        <div className="p-4">
          <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src="/logo.svg"
                  alt="Branchy Logo"
                  width="20"
                  height="20"
                  className="flex-shrink-0"
                />
                <span className="text-lg font-bold text-gray-900">Branchy</span>
                <Info className="h-3 w-3 text-gray-400 ml-0.5" />
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <img
                    src="/logo.svg"
                    alt="Branchy Logo"
                    width="32"
                    height="32"
                    className="flex-shrink-0"
                  />
                  Branchy who?
                </DialogTitle>
                <DialogDescription className="space-y-4">
                  <p>
                    Branchy is an experimental interactive information diver. Enter a topic, click
                    the button, and watch it expand. And expand again. Then come up for air and dive
                    back into a new branch. It's for those who like me that like diving in and out,
                    quickly.
                  </p>
                  <p>
                    <em>Made by Dennis Hansen</em>
                  </p>
                  <div className="flex flex-col gap-2">
                    <a
                      href="https://x.com/dennizor?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Twitter/X Profile
                    </a>
                    <a
                      href="https://github.com/dennishansen/branchy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      GitHub Repository
                    </a>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
        {hasDataToClear && (
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearTree}
              title="Clear tree"
              className="text-gray-500 hover:text-red-500 hover:bg-transparent"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <CenteredTreeViewer shouldClear={clearCounter} />
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <TreeProvider>
      <IndexContent />
    </TreeProvider>
  );
};

export default Index;
