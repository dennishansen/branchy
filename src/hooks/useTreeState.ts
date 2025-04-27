import { useReducer } from "react";

// Node data interface
export interface NodeData {
  text: string;
  isExpanded: boolean;
  children: { [key: string]: boolean };
  hasGeneratedChildren: boolean;
}

// Tree state interface
export interface TreeState {
  [nodePath: string]: NodeData;
}

// Define action types
export type TreeAction =
  | { type: "SET_TEXT"; payload: { nodePath: string; text: string } }
  | { type: "TOGGLE_EXPANDED"; payload: { nodePath: string; value?: boolean } }
  | {
      type: "UPDATE_CHILD_STATE";
      payload: { parentPath: string; childKey: string; expanded: boolean };
    }
  | { type: "MERGE_REMOTE_CHILDREN"; payload: { newState: TreeState } }
  | { type: "SET_GENERATED"; payload: { nodePath: string; hasGenerated: boolean } }
  | { type: "ADD_NODE"; payload: { nodePath: string; text: string } };

// Initial state
const initialState: TreeState = {
  root: {
    text: "Root",
    isExpanded: false,
    children: {},
    hasGeneratedChildren: false,
  },
};

// Helper to get node text
const getNodeText = (state: TreeState, nodePath: string): string => {
  return state[nodePath]?.text || `Node ${nodePath}`;
};

// Reducer function
const treeReducer = (state: TreeState, action: TreeAction): TreeState => {
  switch (action.type) {
    case "SET_TEXT": {
      const { nodePath, text } = action.payload;

      // Create a new state object
      const newState = { ...state };

      // Initialize node if it doesn't exist
      if (!newState[nodePath]) {
        newState[nodePath] = {
          text,
          isExpanded: false,
          children: {},
          hasGeneratedChildren: false,
        };
      } else {
        // If text has changed, we need to reset hasGeneratedChildren
        const hasTextChanged = newState[nodePath].text !== text;

        // Update the text for the existing node
        newState[nodePath] = {
          ...newState[nodePath],
          text,
          // Reset hasGeneratedChildren if text changed
          hasGeneratedChildren: hasTextChanged ? false : newState[nodePath].hasGeneratedChildren,
        };
      }

      return newState;
    }

    case "TOGGLE_EXPANDED": {
      const { nodePath, value } = action.payload;
      const newState = { ...state };

      // Initialize node if it doesn't exist
      if (!newState[nodePath]) {
        newState[nodePath] = {
          text: getNodeText(state, nodePath),
          isExpanded: value !== undefined ? value : true,
          children: {},
          hasGeneratedChildren: false,
        };
      } else {
        // Update expansion state
        newState[nodePath] = {
          ...newState[nodePath],
          isExpanded: value !== undefined ? value : !newState[nodePath].isExpanded,
        };
      }

      return newState;
    }

    case "UPDATE_CHILD_STATE": {
      const { parentPath, childKey, expanded } = action.payload;
      const newState = { ...state };

      // Ensure parent entry exists
      if (!newState[parentPath]) {
        newState[parentPath] = {
          text: getNodeText(state, parentPath),
          isExpanded: false,
          children: {},
          hasGeneratedChildren: false,
        };
      }

      // Update the child tracking
      newState[parentPath] = {
        ...newState[parentPath],
        children: {
          ...newState[parentPath].children,
          [childKey]: expanded,
        },
      };

      return newState;
    }

    case "SET_GENERATED": {
      const { nodePath, hasGenerated } = action.payload;
      const newState = { ...state };

      // Initialize node if it doesn't exist
      if (!newState[nodePath]) {
        newState[nodePath] = {
          text: getNodeText(state, nodePath),
          isExpanded: false,
          children: {},
          hasGeneratedChildren: hasGenerated,
        };
      } else {
        // Update hasGeneratedChildren state
        newState[nodePath] = {
          ...newState[nodePath],
          hasGeneratedChildren: hasGenerated,
        };
      }

      return newState;
    }

    case "MERGE_REMOTE_CHILDREN": {
      const { newState: incomingState } = action.payload;

      // Create a merged state
      const mergedState = { ...state };

      // Add new nodes from the incoming state
      Object.entries(incomingState).forEach(([path, nodeData]) => {
        // If this node already exists, preserve its expansion state
        if (mergedState[path]) {
          mergedState[path] = {
            ...nodeData,
            isExpanded: mergedState[path].isExpanded,
            // Preserve existing children states and add new ones
            children: { ...mergedState[path].children, ...nodeData.children },
            // Keep the existing hasGeneratedChildren value
            hasGeneratedChildren: mergedState[path].hasGeneratedChildren,
          };
        } else {
          // New node, just add it
          mergedState[path] = {
            ...nodeData,
            // New nodes don't have generated children yet
            hasGeneratedChildren: false,
          };
        }

        // Also make sure all parent nodes have correct children references
        const pathParts = path.split(".");
        if (pathParts.length > 1) {
          // Remove the last part to get the parent path
          const parentPath = pathParts.slice(0, -1).join(".");
          const childKey = pathParts[pathParts.length - 1];

          // Make sure parent exists
          if (!mergedState[parentPath]) {
            mergedState[parentPath] = {
              text: getNodeText(state, parentPath),
              isExpanded: false,
              children: {},
              hasGeneratedChildren: false,
            };
          }

          // Add this child to the parent's children map
          if (!mergedState[parentPath].children[childKey]) {
            mergedState[parentPath] = {
              ...mergedState[parentPath],
              children: {
                ...mergedState[parentPath].children,
                [childKey]: true,
              },
              // Mark parent as having generated children for its level
              hasGeneratedChildren: true,
            };
          }
        }
      });

      return mergedState;
    }

    case "ADD_NODE": {
      const { nodePath, text } = action.payload;
      const newState = { ...state };

      // Add the new node
      newState[nodePath] = {
        text,
        isExpanded: false,
        children: {},
        hasGeneratedChildren: false,
      };

      // Update parent to include this child
      const pathParts = nodePath.split(".");
      if (pathParts.length > 1) {
        const parentPath = pathParts.slice(0, -1).join(".");
        const childKey = pathParts[pathParts.length - 1];

        // Ensure parent exists
        if (!newState[parentPath]) {
          newState[parentPath] = {
            text: getNodeText(state, parentPath),
            isExpanded: true, // Expand parent when adding a new child
            children: {},
            hasGeneratedChildren: false,
          };
        } else {
          // Make sure parent is expanded
          newState[parentPath] = {
            ...newState[parentPath],
            isExpanded: true,
          };
        }

        // Add child to parent's children
        newState[parentPath] = {
          ...newState[parentPath],
          children: {
            ...newState[parentPath].children,
            [childKey]: true,
          },
        };
      }

      return newState;
    }

    default:
      return state;
  }
};

// Hook to manage tree state
export const useTreeState = () => {
  const [state, dispatch] = useReducer(treeReducer, initialState);

  return {
    state,
    dispatch,
  };
};

// Helper functions that use the state
export const getChildKeys = (state: TreeState, nodePath: string): string[] => {
  // Check if this node has children in the tree state
  const nodePathPrefix = `${nodePath}.`;
  const childPaths = Object.keys(state).filter(
    (path) =>
      path.startsWith(nodePathPrefix) && path.split(".").length === nodePath.split(".").length + 1
  );

  if (childPaths.length > 0) {
    // Extract just the child keys (the last part of each path)
    return childPaths.map((path) => path.split(".").pop() || "");
  }

  // Get actual child keys by checking the childState
  const actualKeys: string[] = [];
  const parentNode = state[nodePath];

  if (parentNode && parentNode.children) {
    return Object.keys(parentNode.children);
  }

  return actualKeys;
};

// Helper function to get the full path text representation for a node
// For example: "How to garden > Choosing plants"
export const getFullPathText = (state: TreeState, nodePath: string): string => {
  if (nodePath === "root") {
    return state.root.text;
  }

  const pathParts = nodePath.split(".");
  const pathTexts: string[] = [];

  // Build the path from root to current node
  let currentPath = "";
  for (let i = 0; i < pathParts.length; i++) {
    if (i === 0) {
      currentPath = pathParts[i];
    } else {
      currentPath = `${currentPath}.${pathParts[i]}`;
    }

    if (state[currentPath]) {
      pathTexts.push(state[currentPath].text);
    }
  }

  return pathTexts.join(" > ");
};
