
import React, { useState } from 'react';
import TreeNode from './TreeNode';

// Define the central state type for tracking expanded nodes and text content
interface ExpandedState {
  [key: string]: {
    isExpanded: boolean;
    children: { [key: string]: boolean };
  };
}

interface TextState {
  [key: string]: string;
}

const TreeViewer = () => {
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    'root': { isExpanded: false, children: {} }
  });
  
  // Add state for text content
  const [textState, setTextState] = useState<TextState>({
    'root': 'Root'
  });

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

  const isNodeExpanded = (nodePath: string): boolean => {
    return !!expandedState[nodePath]?.isExpanded;
  };

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

  // Update function to handle text content properly
  const updateNodeText = (nodePath: string, text: string) => {
    setTextState(prevState => ({
      ...prevState,
      [nodePath]: text
    }));
  };

  // Function to get text content for a node
  const getNodeText = (nodePath: string): string => {
    return textState[nodePath] || `Node ${nodePath.split('.').pop()}`;
  };

  return (
    <div className="w-full overflow-x-auto p-8 bg-[#F1F0FB] min-h-screen">
      <div className="min-w-max">
        <TreeNode 
          text={getNodeText("root")}
          nodePath="root"
          depth={1} 
          isExpanded={isNodeExpanded("root")}
          toggleExpansion={() => toggleNodeExpansion("root")}
          updateChildState={(childKey, expanded) => updateChildState("root", childKey, expanded)}
          getChildState={(childKey) => !!expandedState["root"]?.children[childKey]}
          onTextChange={(text) => updateNodeText("root", text)}
        />
      </div>
    </div>
  );
};

export default TreeViewer;
