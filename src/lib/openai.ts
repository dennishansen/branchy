import OpenAI from "openai";
import { TreeState, NodeData } from "@/hooks/useTreeState";

// Define the format for node parsing
export const NODE_MARKERS = {
  BEGIN_NODE: "<NODE>",
  END_NODE: "</NODE>",
  BEGIN_CHILDREN: "<CHILDREN>",
  END_CHILDREN: "</CHILDREN>",
};

// Function to get OpenAI API client with the API key
export const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === "your-openai-api-key-here") {
    throw new Error(
      "OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env.local file."
    );
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // Allow client-side usage
  });
};

// Function to generate tree nodes with streaming
export const streamTreeContent = async (
  prompt: string,
  parentText: string,
  onToken: (token: string) => void,
  onComplete?: () => void
) => {
  const openai = getOpenAIClient();

  try {
    const systemPrompt = `You are a tool that generates logical breakdowns of topics. Your goal is to predict what a user would naturally expect when they want to explore a topic.

    ## Core Principle
    When someone enters a topic, they want to see the most logical way to break it down - the main categories, types, or areas that naturally exist within that topic.

    ## Guidelines
    - Think: "What would someone naturally expect to see when exploring this topic?"
    - Provide the most obvious, logical subdivision
    - Use clear, specific names that immediately make sense
    - Generate 4-6 children that cover the main areas
    - Keep it simple and predictable

    ## Formatting Rules
    1. For each node, wrap its content between ${NODE_MARKERS.BEGIN_NODE} and ${NODE_MARKERS.END_NODE}
    2. When a node has children, place them between ${NODE_MARKERS.BEGIN_CHILDREN} and ${NODE_MARKERS.END_CHILDREN}
    3. Keep node names clear and specific (2-5 words)
    4. Generate ONLY direct children for the parent node
    
    Example format:
    ${NODE_MARKERS.BEGIN_CHILDREN}
      ${NODE_MARKERS.BEGIN_NODE}Logical Category 1${NODE_MARKERS.END_NODE}
      ${NODE_MARKERS.BEGIN_NODE}Logical Category 2${NODE_MARKERS.END_NODE}
      ${NODE_MARKERS.BEGIN_NODE}Logical Category 3${NODE_MARKERS.END_NODE}
    ${NODE_MARKERS.END_CHILDREN}`;

    // Check if the parent text contains path context (indicated by " > ")
    const hasPathContext = parentText.includes(" > ");
    let userPrompt;

    if (hasPathContext) {
      // Extract the actual node text (the last part after ">")
      const lastNodeText = parentText.split(" > ").pop() || parentText;

      userPrompt = `What are the main types or categories within "${lastNodeText}"?
      
      Context: ${parentText}
      Additional guidance: ${prompt}
      
      Generate the logical breakdown that someone would naturally expect when exploring "${lastNodeText}".`;
    } else {
      userPrompt = `What are the main types or categories within "${parentText}"?
      
      Additional guidance: ${prompt}
      
      Generate the logical breakdown that someone would naturally expect when exploring "${parentText}".`;
    }

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      stream: true,
    });

    let totalContent = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      totalContent += content;
      if (content) {
        onToken(content);
      }
    }

    if (onComplete) {
      onComplete();
    }
  } catch (error) {
    console.error("Error streaming from OpenAI:", error);
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

  // Incremental parsing logic - look for complete node patterns regardless of the full structure
  if (content.includes(NODE_MARKERS.BEGIN_CHILDREN)) {
    // Extract content between CHILDREN tags, or just get everything after BEGIN_CHILDREN if END_CHILDREN not found yet
    const childrenStartIndex = content.indexOf(NODE_MARKERS.BEGIN_CHILDREN);
    let childrenContent;
    const childrenEndIndex = content.lastIndexOf(NODE_MARKERS.END_CHILDREN);

    if (childrenEndIndex !== -1) {
      childrenContent = content.substring(
        childrenStartIndex + NODE_MARKERS.BEGIN_CHILDREN.length,
        childrenEndIndex
      );
    } else {
      childrenContent = content.substring(childrenStartIndex + NODE_MARKERS.BEGIN_CHILDREN.length);
    }

    // Look for completed nodes <NODE>text</NODE>
    let nodeIndex = startIndex;
    let searchPosition = 0;

    while (searchPosition < childrenContent.length) {
      const nodeStartPos = childrenContent.indexOf(NODE_MARKERS.BEGIN_NODE, searchPosition);
      if (nodeStartPos === -1) break;

      const nodeEndPos = childrenContent.indexOf(NODE_MARKERS.END_NODE, nodeStartPos);
      if (nodeEndPos === -1) break; // No complete node found

      // Extract node text
      const nodeText = childrenContent
        .substring(nodeStartPos + NODE_MARKERS.BEGIN_NODE.length, nodeEndPos)
        .trim();

      // Create the node
      const nodePath = `${rootPath}.${nodeIndex}`;
      result.push({
        text: nodeText,
        children: [],
        parentPath: rootPath,
        path: nodePath,
      });

      // Move search position past this node
      searchPosition = nodeEndPos + NODE_MARKERS.END_NODE.length;
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
