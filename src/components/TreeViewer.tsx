
import React, { useState } from 'react';
import TreeNode from './TreeNode';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';

// Define the central state type for tracking expanded nodes
interface ExpandedState {
  [key: string]: {
    isExpanded: boolean;
    children: { [key: string]: boolean };
  };
}

const TreeViewer = () => {
  const [projectTitle, setProjectTitle] = useState('Untitled Project');
  const [isOutlineView, setIsOutlineView] = useState(true);
  // Central state to track expanded nodes throughout the entire tree
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    'root': { isExpanded: false, children: {} }
  });

  // Function to toggle node expansion
  const toggleNodeExpansion = (nodePath: string, value?: boolean) => {
    setExpandedState(prevState => {
      const newState = { ...prevState };
      
      // If the node doesn't exist in state yet, initialize it
      if (!newState[nodePath]) {
        newState[nodePath] = { isExpanded: false, children: {} };
      }
      
      // Set the expanded state based on the value parameter or toggle it
      newState[nodePath].isExpanded = value !== undefined ? value : !newState[nodePath].isExpanded;
      
      console.log(`Node ${nodePath} set to ${newState[nodePath].isExpanded}`);
      return newState;
    });
  };

  // Function to check if a node is expanded
  const isNodeExpanded = (nodePath: string): boolean => {
    return !!expandedState[nodePath]?.isExpanded;
  };

  // Function to track child node state
  const updateChildState = (parentPath: string, childKey: string, expanded: boolean) => {
    setExpandedState(prevState => {
      const newState = { ...prevState };
      
      // Ensure parent entry exists
      if (!newState[parentPath]) {
        newState[parentPath] = { isExpanded: false, children: {} };
      }
      
      // Update the child tracking
      newState[parentPath].children = {
        ...newState[parentPath].children,
        [childKey]: expanded
      };
      
      return newState;
    });
  };

  return (
    <div className="w-full overflow-x-auto p-8 bg-[#F1F0FB] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <Input
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="w-64 text-lg font-semibold bg-white/50"
          placeholder="Enter project title..."
        />
        <Toggle
          pressed={isOutlineView}
          onPressedChange={setIsOutlineView}
          className="bg-white/50 data-[state=on]:bg-[#9b87f5] data-[state=on]:text-white"
        >
          {isOutlineView ? 'Outline View' : 'Tree View'}
        </Toggle>
      </div>
      
      <div className={cn(
        "min-w-max",
        isOutlineView ? "" : "flex flex-row gap-8 overflow-x-auto"
      )}>
        <TreeNode 
          text="Root" 
          nodePath="root"
          depth={1} 
          isExpanded={isNodeExpanded("root")}
          toggleExpansion={() => toggleNodeExpansion("root")}
          updateChildState={(childKey, expanded) => updateChildState("root", childKey, expanded)}
          getChildState={(childKey) => !!expandedState["root"]?.children[childKey]}
        />
      </div>
    </div>
  );
};

export default TreeViewer;
