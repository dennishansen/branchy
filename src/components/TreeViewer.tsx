import React, { useRef, useEffect, useState } from "react";
import TreeNode from "./TreeNode";
import { TreeProvider } from "@/context/TreeContext";
import { useTreeContext } from "@/context/TreeContext";

// List of interesting prompts
const interestingPrompts = [
  "Maximize human flourishing",
  "Industries of the world",
  "Jobs to be done of the economy",
  "How to make civilization sustainable",
  "The future of education",
  "AI's long-term societal impact",
  "Promising ways to extend healthspan",
  "Building compassionate economic systems",
  "Meaningful life in the digital age",
  "Humanity as a multi-planetary species",
  "Strategies to address climate change",
  "Creating beautiful, life-giving cities",
  "Technologies transforming consciousness",
];

// A separate component that uses the context
const Tree = ({ shouldClear }: { shouldClear: number }) => {
  const { state, dispatch } = useTreeContext();
  const [randomExamples, setRandomExamples] = useState<string[]>([]);

  // Effect to reset the tree when shouldClear changes
  useEffect(() => {
    if (shouldClear > 0) {
      dispatch({
        type: "RESET_STATE",
        payload: {
          state: {
            root: {
              text: "",
              isExpanded: false,
              children: {},
              hasGeneratedChildren: false,
            },
          },
        },
      });
    }
  }, [shouldClear, dispatch]);

  // Generate 5 random examples on initial render
  useEffect(() => {
    // Shuffle array and take the first 5
    const shuffled = [...interestingPrompts].sort(() => Math.random() - 0.5);
    setRandomExamples(shuffled.slice(0, 5));
  }, []);

  // Function to set a prompt as root text
  const setPromptAsRoot = (text: string) => {
    dispatch({
      type: "SET_TEXT",
      payload: {
        nodePath: "root",
        text,
      },
    });
  };

  // Check if root has any children
  const childKeys = Object.keys(state.root?.children || {});
  const hasChildren = childKeys.length > 0;
  const shouldShowRandomTopics = !hasChildren && !state.root.hasGeneratedChildren;

  return (
    <div className="min-w-max p-4 mb-4">
      <div className="relative">
        <TreeNode text={state.root.text} nodePath="root" depth={1} />
        <div className="relative">
          {shouldShowRandomTopics && (
            <div className="absolute left-0 top-4 w-64 bg-transparent overflow-hidden">
              {randomExamples.map((prompt, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <div className="h-px bg-gray-200 mx-0"></div>}
                  <button
                    onClick={() => setPromptAsRoot(prompt)}
                    className="w-full text-left px-3 py-3 text-sm hover:bg-black/5 transition-colors text-gray-700"
                  >
                    {prompt}
                  </button>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface TreeViewerProps {
  shouldClear?: number;
}

const TreeViewer: React.FC<TreeViewerProps> = ({ shouldClear = 0 }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the right
  const scrollToRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        left: scrollContainerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
  };

  return (
    <TreeProvider>
      <div
        className="w-full overflow-auto h-full"
        ref={scrollContainerRef}
        id="tree-scroll-container"
      >
        <div className="inline-block min-w-full px-[calc(50%-138px)]">
          <Tree shouldClear={shouldClear} />
        </div>
      </div>
    </TreeProvider>
  );
};

export default TreeViewer;
