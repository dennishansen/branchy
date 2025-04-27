import React from "react";
import TreeNode from "./TreeNode";
import { TreeProvider } from "@/context/TreeContext";
import { useTreeContext } from "@/context/TreeContext";

// A separate component that uses the context
const Tree = () => {
  const { state } = useTreeContext();

  return (
    <div className="min-w-max">
      <TreeNode text={state.root.text} nodePath="root" depth={1} />
    </div>
  );
};

const TreeViewer = () => {
  return (
    <TreeProvider>
      <div className="w-full overflow-x-auto p-8 bg-[#F1F0FB] min-h-screen">
        <Tree />
      </div>
    </TreeProvider>
  );
};

export default TreeViewer;
