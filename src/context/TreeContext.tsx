import React, { createContext, useContext, ReactNode, useState } from "react";
import { useTreeState, TreeState, TreeAction } from "@/hooks/useTreeState";

// Define the context shape
type TreeContextType = {
  state: TreeState;
  dispatch: React.Dispatch<TreeAction>;
  rootIntent: string | null;
  setRootIntent: (intent: string | null) => void;
};

// Create the context with initial undefined value
const TreeContext = createContext<TreeContextType | undefined>(undefined);

// Provider component
export const TreeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { state, dispatch } = useTreeState();
  const [rootIntent, setRootIntent] = useState<string | null>(null);

  return (
    <TreeContext.Provider value={{ state, dispatch, rootIntent, setRootIntent }}>
      {children}
    </TreeContext.Provider>
  );
};

// Custom hook to use the tree context
export const useTreeContext = () => {
  const context = useContext(TreeContext);
  if (context === undefined) {
    throw new Error("useTreeContext must be used within a TreeProvider");
  }
  return context;
};
