import { TreeState, NodeData } from "@/hooks/useTreeState";
import { supabase } from "@/integrations/supabase/client";

// Define the format for bullet parsing
export const BULLET_MARKERS = {
  BEGIN_BULLET: "<BULLET>",
  END_BULLET: "</BULLET>",
  BEGIN_CHILDREN: "<CHILDREN>",
  END_CHILDREN: "</CHILDREN>",
};

// Function to generate tree nodes using Supabase edge function
export const streamTreeContent = async (
  prompt: string,
  parentText: string,
  onToken: (token: string) => void,
  onComplete?: () => void
) => {
  try {
    const { data, error } = await supabase.functions.invoke("generate-tree-content", {
      body: { prompt, parentText },
    });

    if (error) {
      throw error;
    }

    if (data?.content) {
      // Simulate streaming by gradually emitting the content
      const content = data.content;
      let currentIndex = 0;

      const emitChunk = () => {
        if (currentIndex < content.length) {
          const chunkSize = Math.min(10, content.length - currentIndex);
          const chunk = content.slice(currentIndex, currentIndex + chunkSize);
          onToken(chunk);
          currentIndex += chunkSize;
          setTimeout(emitChunk, 50); // Small delay to simulate streaming
        } else {
          if (onComplete) {
            onComplete();
          }
        }
      };

      emitChunk();
    }
  } catch (error) {
    console.error("Error generating tree content:", error);
    throw error;
  }
};

// Interfaces for node parsing
interface ParsedNode {
  text: string;
  children: ParsedNode[];
  parentPath: string;
  path: string;
}

// Helper function to parse streamed node content
export const parseStreamedContent = (
  content: string,
  rootPath: string = "root",
  startIndex: number = 0
): ParsedNode[] => {
  const result: ParsedNode[] = [];

  // Incremental parsing logic - look for complete bullet patterns regardless of the full structure
  if (content.includes(BULLET_MARKERS.BEGIN_CHILDREN)) {
    // Extract content between CHILDREN tags, or just get everything after BEGIN_CHILDREN if END_CHILDREN not found yet
    const childrenStartIndex = content.indexOf(BULLET_MARKERS.BEGIN_CHILDREN);
    let childrenContent;
    const childrenEndIndex = content.lastIndexOf(BULLET_MARKERS.END_CHILDREN);

    if (childrenEndIndex !== -1) {
      childrenContent = content.substring(
        childrenStartIndex + BULLET_MARKERS.BEGIN_CHILDREN.length,
        childrenEndIndex
      );
    } else {
      childrenContent = content.substring(
        childrenStartIndex + BULLET_MARKERS.BEGIN_CHILDREN.length
      );
    }

    // Look for completed bullets <BULLET>text</BULLET>
    let nodeIndex = startIndex;
    let searchPosition = 0;

    while (searchPosition < childrenContent.length) {
      const bulletStartPos = childrenContent.indexOf(BULLET_MARKERS.BEGIN_BULLET, searchPosition);
      if (bulletStartPos === -1) break;

      const bulletEndPos = childrenContent.indexOf(BULLET_MARKERS.END_BULLET, bulletStartPos);
      if (bulletEndPos === -1) break; // No complete bullet found

      // Extract bullet text
      const bulletText = childrenContent
        .substring(bulletStartPos + BULLET_MARKERS.BEGIN_BULLET.length, bulletEndPos)
        .trim();

      // Create the node
      const nodePath = `${rootPath}.${nodeIndex}`;
      result.push({
        text: bulletText,
        children: [],
        parentPath: rootPath,
        path: nodePath,
      });

      // Move search position past this bullet
      searchPosition = bulletEndPos + BULLET_MARKERS.END_BULLET.length;
      nodeIndex++;
    }
  }

  return result;
};

// Converter function to transform parsed nodes to the TreeState format
export const convertToTreeState = (
  parsedNodes: ParsedNode[],
  existingState: TreeState = {}
): TreeState => {
  const newState: TreeState = { ...existingState };

  const processNode = (node: ParsedNode) => {
    // Create node data
    newState[node.path] = {
      text: node.text,
      isExpanded: newState[node.path]?.isExpanded || false,
      children: newState[node.path]?.children || {},
      hasGeneratedChildren: newState[node.path]?.hasGeneratedChildren || false,
    };

    // Process parent's children map
    if (node.parentPath) {
      const parentPath = node.parentPath;
      if (!newState[parentPath]) {
        newState[parentPath] = {
          text: "",
          isExpanded: false,
          children: {},
          hasGeneratedChildren: false,
        };
      }

      // Get the last part of the path (the index)
      const childKey = node.path.split(".").pop() || "";
      newState[parentPath].children[childKey] = newState[parentPath].children[childKey] || true;
    }

    // Process children recursively
    node.children.forEach(processNode);
  };

  parsedNodes.forEach(processNode);

  return newState;
};
