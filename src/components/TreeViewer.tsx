
import React from 'react';
import TreeNode from './TreeNode';

const TreeViewer = () => {
  return (
    <div className="w-full overflow-x-auto p-8 bg-[#F1F0FB] min-h-screen">
      <div className="min-w-max">
        <TreeNode text="Root" depth={1} />
      </div>
    </div>
  );
};

export default TreeViewer;
