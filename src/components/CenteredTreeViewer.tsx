import React, { useRef, useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
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
  "How to build compassionate economic systems",
  "What to do in the post AGI world",
  "Parts of the multi-planetary economy",
  "Technical problems for solving climate change",
  "How to create beautiful, life-giving cities",
  "Technologies for the transcendence of human consciousness",
];

// The actual tree content component
const TreeContent = ({ shouldClear }: { shouldClear: number }) => {
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
    <div className="p-4 mb-4">
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

interface CenteredTreeViewerProps {
  shouldClear?: number;
}

const CenteredTreeViewer: React.FC<CenteredTreeViewerProps> = ({ shouldClear = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [treeWidth, setTreeWidth] = useState(0);

  // Spring for smooth animation
  const centerOffset = useSpring(0, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Update viewport width on resize
  useEffect(() => {
    const updateViewportWidth = () => {
      if (containerRef.current) {
        setViewportWidth(containerRef.current.offsetWidth);
      }
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);
    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  // Observe tree width changes
  useEffect(() => {
    if (!treeRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        setTreeWidth(width);
      }
    });

    resizeObserver.observe(treeRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Calculate and animate center offset
  useEffect(() => {
    if (!treeRef.current) return;

    // Find rightmost column center
    const treeRect = treeRef.current.getBoundingClientRect();
    const columnNodes = Array.from(
      treeRef.current.querySelectorAll("[data-column-node]")
    ) as HTMLElement[];

    if (columnNodes.length === 0) {
      centerOffset.set(0);
      return;
    }

    let rightmostCenter = 0;
    columnNodes.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const center = rect.left - treeRect.left + rect.width / 2; // relative to tree
      if (center > rightmostCenter) rightmostCenter = center;
    });

    const desiredOffset = viewportWidth / 2 - rightmostCenter;
    centerOffset.set(desiredOffset);
  }, [viewportWidth, treeWidth, centerOffset]);

  return (
    <TreeProvider>
      <div ref={containerRef} className="w-full h-full overflow-x-auto overflow-y-auto relative">
        {/* CenterTrack layer - animates translation */}
        <motion.div style={{ x: centerOffset }} className="inline-block">
          {/* Tree wrapper - left-anchored, intrinsic width */}
          <div ref={treeRef} className="inline-block">
            <TreeContent shouldClear={shouldClear} />
          </div>
        </motion.div>
      </div>
    </TreeProvider>
  );
};

export default CenteredTreeViewer;
