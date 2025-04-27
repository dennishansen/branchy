import { useState } from "react";
import { useTreeContext } from "@/context/TreeContext";
import { toast } from "@/components/ui/use-toast";
import { streamTreeContent, parseStreamedContent, convertToTreeState } from "@/lib/openai";
import { getChildKeys, getFullPathText } from "@/hooks/useTreeState";

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
      // Check if API key exists
      if (!localStorage.getItem("openai-api-key")) {
        toast({
          title: "API key missing",
          description: "Please add your OpenAI API key in the settings.",
          variant: "destructive",
        });
        return;
      }

      // Get the full path text for context
      const fullPathText = getFullPathText(state, parentPath);

      // Set loading state and reset streaming content
      setIsLoading(true);
      let streamingContent = "";
      setStreamContent("");

      // If we already have children, add them to the prompt context
      let contextPrompt = additionalPrompt;
      if (hasChildren) {
        const existingChildren = childKeys
          .map((key) => {
            const childPath = `${parentPath}.${key}`;
            return state[childPath]?.text || "";
          })
          .filter(Boolean)
          .join(", ");

        contextPrompt = `${additionalPrompt} Please generate more children different from the existing ones: [${existingChildren}]`;
      }

      // Calculate starting index for new nodes
      let startIndex = 0;
      if (appendToExisting && childKeys.length > 0) {
        // Get the highest existing child key and add 1
        startIndex = Math.max(...childKeys.map((key) => parseInt(key))) + 1;
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
            const newTreeState = convertToTreeState(parsedNodes, state);

            // Dispatch action to update tree state
            dispatch({
              type: "MERGE_REMOTE_CHILDREN",
              payload: { newState: newTreeState },
            });
          }
        },
        () => {
          setIsLoading(false);

          // Mark this node as having generated children
          dispatch({
            type: "SET_GENERATED",
            payload: { nodePath: parentPath, hasGenerated: true },
          });
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
    generateChildren("Please generate additional children for this topic.", true);
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
