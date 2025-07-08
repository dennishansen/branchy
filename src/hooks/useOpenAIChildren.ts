import { useState, useEffect, useCallback } from "react";
import { useTreeContext } from "@/context/TreeContext";
import { toast } from "@/components/ui/use-toast";
import { streamTreeContent, parseStreamedContent, convertToTreeState } from "@/lib/openai";
import { getChildKeys, getFullPathText } from "@/hooks/useTreeState";
import { scrollTreeToRight } from "@/hooks/useTreeScroll";

export const useOpenAIChildren = (parentPath: string, parentText: string) => {
  const { state, dispatch } = useTreeContext();
  const [isLoading, setIsLoading] = useState(false);
  const [streamContent, setStreamContent] = useState("");

  // Get hasGenerated from state instead of using a ref
  const hasGenerated = state[parentPath]?.hasGeneratedChildren || false;

  // Check if this node already has children
  const childKeys = getChildKeys(state, parentPath);
  const hasChildren = childKeys.length > 0;

  const generateChildren = async (
    additionalPrompt: string = "",
    appendToExisting: boolean = false
  ) => {
    try {
      // Get the full path text for context
      const fullPathText = getFullPathText(state, parentPath);

      // Set loading state and reset streaming content
      setIsLoading(true);

      // Scroll immediately when loading starts
      scrollTreeToRight();

      let streamingContent = "";
      setStreamContent("");

      // If we already have children, add them to the prompt context
      let contextPrompt = additionalPrompt;
      // IMPORTANT: Re-calculate childKeys based on CURRENT state inside the async function
      const currentChildKeys = getChildKeys(state, parentPath);
      if (currentChildKeys.length > 0) {
        const existingChildren = currentChildKeys
          .map((key) => {
            const childPath = `${parentPath}.${key}`;
            return state[childPath]?.text || "";
          })
          .filter(Boolean)
          .join(", ");

        if (appendToExisting) {
          contextPrompt = `${additionalPrompt}

Existing categories: [${existingChildren}]

Generate additional different categories that aren't already covered.`;
        } else {
          contextPrompt = `${additionalPrompt}

Previous categories were: [${existingChildren}]
Generate a fresh logical breakdown.`;
        }
      }

      // Calculate starting index for new nodes
      let startIndex = 0;
      if (appendToExisting && currentChildKeys.length > 0) {
        // Get the highest existing child key and add 1
        startIndex = Math.max(...currentChildKeys.map((key) => parseInt(key))) + 1;
      }

      await streamTreeContent(
        contextPrompt,
        fullPathText,
        (token) => {
          // Update streaming content as tokens arrive
          streamingContent += token;
          setStreamContent(streamingContent);

          // Parse content and update tree state with the next available index
          const parsedNodes = parseStreamedContent(
            streamingContent,
            parentPath,
            appendToExisting ? startIndex : 0
          );

          if (parsedNodes.length > 0) {
            // Pass the CURRENT state to convertToTreeState
            const newTreeState = convertToTreeState(parsedNodes, state);

            // Dispatch action to update tree state
            dispatch({
              type: "MERGE_REMOTE_CHILDREN",
              payload: { newState: newTreeState },
            });

            // Scroll again when the first nodes are parsed
            if (parsedNodes.length === 1) {
              scrollTreeToRight();
            }
          }
        },
        () => {
          setIsLoading(false);

          // Mark this node as having generated children
          dispatch({
            type: "SET_GENERATED",
            payload: { nodePath: parentPath, hasGenerated: true },
          });

          // Scroll to the right after generation completes
          setTimeout(() => {
            scrollTreeToRight();
          }, 100);
        }
      );
    } catch (error) {
      console.error("Error generating node children:", error);
      setIsLoading(false);

      // Display error toast
      toast({
        title: "Error generating node children",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const generateMoreChildren = async () => {
    generateChildren(
      "Generate additional categories or types that are different from the existing ones.",
      true
    );
  };

  return {
    isLoading,
    streamContent,
    hasGenerated,
    hasChildren,
    generateChildren,
    generateMoreChildren,
  };
};
