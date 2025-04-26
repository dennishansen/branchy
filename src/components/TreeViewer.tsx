
import React, { useState } from 'react';
import TreeNode from './TreeNode';

// Define the node data structure for more comprehensive state tracking
interface NodeData {
  text: string;
  isExpanded: boolean;
  children: { [key: string]: boolean };
}

// Define the state structure for the entire tree
interface TreeState {
  [nodePath: string]: NodeData;
}

const TreeViewer = () => {
  // Unified state to track all node data
  const [treeState, setTreeState] = useState<TreeState>({
    'root': { 
      text: 'Root',
      isExpanded: false,
      children: {}
    }
  });

  // Function to get node text
  const getNodeText = (nodePath: string): string => {
    return treeState[nodePath]?.text || `Node ${nodePath}`;
  };

  // Function to update node text
  const updateNodeText = (nodePath: string, text: string) => {
    setTreeState(prevState => {
      // Create a new state object
      const newState = { ...prevState };
      
      // Initialize node if it doesn't exist
      if (!newState[nodePath]) {
        newState[nodePath] = {
          text: text,
          isExpanded: false,
          children: {}
        };
      } else {
        // Update the text for the existing node
        newState[nodePath] = {
          ...newState[nodePath],
          text: text
        };
      }
      
      console.log(`Updated text for node ${nodePath}: ${text}`);
      return newState;
    });
  };

  // Function to toggle node expansion
  const toggleNodeExpansion = (nodePath: string, value?: boolean) => {
    setTreeState(prevState => {
      const newState = { ...prevState };
      
      // Initialize node if it doesn't exist
      if (!newState[nodePath]) {
        newState[nodePath] = {
          text: getNodeText(nodePath),
          isExpanded: value !== undefined ? value : true,
          children: {}
        };
      } else {
        // Update expansion state
        newState[nodePath] = {
          ...newState[nodePath],
          isExpanded: value !== undefined ? value : !newState[nodePath].isExpanded
        };
      }
      
      console.log(`Node ${nodePath} set to ${newState[nodePath].isExpanded}`);
      return newState;
    });
  };

  // Function to check if a node is expanded
  const isNodeExpanded = (nodePath: string): boolean => {
    return !!treeState[nodePath]?.isExpanded;
  };

  // Function to track child node state
  const updateChildState = (parentPath: string, childKey: string, expanded: boolean) => {
    setTreeState(prevState => {
      const newState = { ...prevState };
      
      // Ensure parent entry exists
      if (!newState[parentPath]) {
        newState[parentPath] = {
          text: getNodeText(parentPath),
          isExpanded: false,
          children: {}
        };
      }
      
      // Update the child tracking
      newState[parentPath] = {
        ...newState[parentPath],
        children: {
          ...newState[parentPath].children,
          [childKey]: expanded
        }
      };
      
      return newState;
    });
  };

  // Function to get child state
  const getChildState = (parentPath: string, childKey: string): boolean => {
    return !!treeState[parentPath]?.children[childKey];
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
          getChildState={(childKey) => getChildState("root", childKey)}
          onTextChange={(text) => updateNodeText("root", text)}
        />
      </div>
    </div>
  );
};

export default TreeViewer;
