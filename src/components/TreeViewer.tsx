import React, { useRef, useEffect } from "react";
import TreeNode from "./TreeNode";
import { TreeProvider } from "@/context/TreeContext";
import { useTreeContext } from "@/context/TreeContext";

// A separate component that uses the context
const Tree = () => {
  const { state } = useTreeContext();

  return (
    <div className="min-w-max p-4 mb-4">
      <TreeNode text={state.root.text} nodePath="root" depth={1} />
    </div>
  );
};

const TreeViewer: React.FC = () => {
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
          <Tree />
        </div>
      </div>
    </TreeProvider>
  );
};

export default TreeViewer;
