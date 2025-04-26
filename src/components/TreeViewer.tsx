
import React, { useState } from 'react';
import TreeNode from './TreeNode';

// Define the central state types
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
  // Central state to track expanded nodes throughout the entire tree
  const [expandedState, setExpandedState] = useState<ExpandedState>({
    'root': { isExpanded: false, children: {} }
  });

  // New state to track text for all nodes
  const [textState, setTextState] = useState<TextState>({
    'root': 'Root'
  });

  // Function to toggle node expansion
  const toggleNodeExpansion = (nodePath: string, value?: boolean) => {
    setExpandedState(prevState => {
      const newState = { ...prevState };
      
      if (!newState[nodePath]) {
        newState[nodePath] = { isExpanded: false, children: {} };
      }
      
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
      
      if (!newState[parentPath]) {
        newState[parentPath] = { isExpanded: false, children: {} };
      }
      
      newState[parentPath].children = {
        ...newState[parentPath].children,
        [childKey]: expanded
      };
      
      return newState;
    });
  };

  // Function to get text for a node
  const getNodeText = (nodePath: string): string => {
    return textState[nodePath] || `Node ${nodePath}`;
  };

  // Function to update text for a node
  const updateNodeText = (nodePath: string, text: string) => {
    console.log(`Updating node text for path: "${nodePath}" to "${text}"`);
    setTextState(prevState => ({
      ...prevState,
      [nodePath]: text
    }));
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
