import React, { useRef, useEffect } from "react";
import { ChevronRight, Loader2, Plus, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { useTreeContext } from "@/context/TreeContext";
import { useOpenAIChildren } from "@/hooks/useOpenAIChildren";
import { getChildKeys } from "@/hooks/useTreeState";

interface TreeNodeProps {
  text: string;
  depth: number;
  nodePath: string;
}

const TreeNode: React.FC<TreeNodeProps> = ({ text, depth, nodePath }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { state, dispatch } = useTreeContext();
  const isExpanded = state[nodePath]?.isExpanded || false;
  const hasGeneratedChildren = state[nodePath]?.hasGeneratedChildren || false;

  // Use the OpenAI hook for this node
  const { isLoading, hasChildren, generateChildren, generateMoreChildren } = useOpenAIChildren(
    nodePath,
    text
  );

  // Get all child keys for this node
  const childKeys = getChildKeys(state, nodePath);

  const handleClick = async () => {
    // Get current expansion state
    const currentlyExpanded = isExpanded;

    // Toggle the expansion state
    dispatch({
      type: "TOGGLE_EXPANDED",
      payload: { nodePath },
    });

    // If we're opening the node and it doesn't have children yet, generate them
    if (!currentlyExpanded && !hasChildren) {
      generateChildren();
    }
  };

  const handleAddNode = () => {
    // Create a new child key based on existing children
    const newChildKey =
      childKeys.length > 0 ? Math.max(...childKeys.map((key) => parseInt(key))) + 1 : 1;

    const newChildPath = `${nodePath}.${newChildKey}`;

    // Add the new node to the state
    dispatch({
      type: "ADD_NODE",
      payload: {
        nodePath: newChildPath,
        text: "New node",
      },
    });
  };

  // Auto-resize textarea based on content
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize();
    dispatch({
      type: "SET_TEXT",
      payload: { nodePath, text: e.target.value },
    });

    // When text changes, reset the hasGeneratedChildren flag
    // since the content is now different from what was previously generated
    if (hasGeneratedChildren) {
      dispatch({
        type: "SET_GENERATED",
        payload: { nodePath, hasGenerated: false },
      });
    }
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center gap-2 min-w-[200px] relative">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          className="resize-none overflow-hidden min-h-[40px] rounded-xl border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter text..."
        />
        <motion.button
          onClick={handleClick}
          className={cn(
            "p-2 rounded-lg bg-[#9b87f5] hover:bg-[#8B5CF6] text-white",
            "flex items-center justify-center",
            "absolute right-3 top-0 bottom-0 my-auto h-8"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <motion.div
              initial={false}
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-2"
          >
            {childKeys.length > 0 ? (
              childKeys.map((childKey) => {
                const childPath = `${nodePath}.${childKey}`;
                const childText = state[childPath]?.text || `Node ${childPath}`;

                return (
                  <TreeNode
                    key={childPath}
                    text={childText}
                    nodePath={childPath}
                    depth={depth + 1}
                  />
                );
              })
            ) : (
              <div className="pl-6 text-sm text-gray-500">
                {isLoading ? "Generating content..." : "No children available"}
              </div>
            )}

            {/* Button row */}
            <div className="flex gap-2">
              {/* Add node button */}
              <motion.button
                onClick={handleAddNode}
                className={cn(
                  "p-2 rounded-lg bg-[#9b87f5] hover:bg-[#8B5CF6] text-white self-start ml-0",
                  "flex items-center justify-center"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4" />
              </motion.button>

              {/* Get more button - only show if we already have children */}
              {childKeys.length > 0 && (
                <motion.button
                  onClick={generateMoreChildren}
                  className={cn(
                    "p-2 rounded-lg bg-[#9b87f5] hover:bg-[#8B5CF6] text-white self-start",
                    "flex items-center justify-center"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <MoreHorizontal className="w-4 h-4" />
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreeNode;
