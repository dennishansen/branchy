
import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  text: string;
  depth: number;
}

// Define the ref type for TreeNode
export interface TreeNodeRef {
  isExpanded: boolean;
  expand: (value: boolean) => void;
  getChildState: () => boolean[];
}

const TreeNode: React.FC<TreeNodeProps> = ({ text, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // Store both expanded state and references to child nodes
  const [childNodes, setChildNodes] = useState<{expanded: boolean, ref: React.RefObject<TreeNodeRef>}[]>(
    Array(5).fill(null).map(() => ({
      expanded: false,
      ref: React.createRef<TreeNodeRef>()
    }))
  );
  
  const handleClick = () => {
    console.log(`Toggling ${text} from ${isExpanded} to ${!isExpanded}`);
    setIsExpanded(!isExpanded);
  };
  
  // Method to be called by child nodes to update their state in parent
  const updateChildState = (index: number, expanded: boolean) => {
    console.log(`Child ${index} of ${text} changed to ${expanded}`);
    setChildNodes(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], expanded };
      return updated;
    });
  };
  
  // Method that can be called by parent to force expansion state
  const expand = (value: boolean) => {
    setIsExpanded(value);
  };
  
  // Method that gets the child states for deeper preservation
  const getChildState = () => {
    return childNodes.map(node => node.expanded);
  };
  
  // When parent expands this node, recursively restore child states
  useEffect(() => {
    if (isExpanded) {
      // When expanding, propagate the expanded state to children that were previously expanded
      childNodes.forEach((child, idx) => {
        if (child.expanded && child.ref.current) {
          child.ref.current.expand(true);
        }
      });
    }
  }, [isExpanded, childNodes]);
  
  // Log for debugging
  useEffect(() => {
    console.log(`${text} rendered, expanded: ${isExpanded}, childStates:`, 
      childNodes.map(c => c.expanded));
  }, [isExpanded, childNodes, text]);

  return (
    <div className="flex items-start gap-4">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
          "bg-[#9b87f5] hover:bg-[#8B5CF6] text-white shadow-sm",
          "relative group"
        )}
      >
        <span>{text}</span>
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isExpanded ? "rotate-90" : ""
          )}
        />
      </button>
      
      {isExpanded && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {Array.from({ length: 5 }).map((_, index) => (
            <ChildTreeNode
              key={`${depth}-${index}`}
              text={`Node ${depth}.${index + 1}`}
              depth={depth + 1}
              index={index}
              isInitiallyExpanded={childNodes[index].expanded}
              onExpandChange={(expanded) => updateChildState(index, expanded)}
              ref={childNodes[index].ref}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// A specialized version of TreeNode that accepts additional props for state management
interface ChildTreeNodeProps extends TreeNodeProps {
  index: number;
  isInitiallyExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
}

// We'll create a proper forwardRef version for the child node
const ChildTreeNode = forwardRef<TreeNodeRef, ChildTreeNodeProps>(({ 
  text, 
  depth, 
  index,
  isInitiallyExpanded,
  onExpandChange
}, ref) => {
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded);
  const [childNodes, setChildNodes] = useState<{expanded: boolean, ref: React.RefObject<TreeNodeRef>}[]>(
    Array(5).fill(null).map(() => ({
      expanded: false,
      ref: React.createRef<TreeNodeRef>()
    }))
  );
  
  // Expose methods to parent through ref
  useImperativeHandle(ref, () => ({
    isExpanded,
    expand: (value: boolean) => {
      setIsExpanded(value);
      
      // When expanding, recursively restore child states for deep preservation
      if (value) {
        setTimeout(() => {
          childNodes.forEach((child, idx) => {
            if (child.expanded && child.ref.current) {
              child.ref.current.expand(true);
            }
          });
        }, 0);
      }
    },
    getChildState: () => childNodes.map(node => node.expanded)
  }));
  
  // Notify parent when our expanded state changes
  useEffect(() => {
    onExpandChange(isExpanded);
  }, [isExpanded, onExpandChange]);

  const handleClick = () => {
    console.log(`Toggling child ${index} ${text} from ${isExpanded} to ${!isExpanded}`);
    setIsExpanded(!isExpanded);
  };
  
  const updateChildState = (childIndex: number, expanded: boolean) => {
    console.log(`Child ${childIndex} of ${text} changed to ${expanded}`);
    setChildNodes(prev => {
      const updated = [...prev];
      updated[childIndex] = { ...updated[childIndex], expanded };
      return updated;
    });
  };
  
  // When parent expands this node, recursively restore child states
  useEffect(() => {
    if (isExpanded) {
      // When expanding, propagate the expanded state to children that were previously expanded
      childNodes.forEach((child, idx) => {
        if (child.expanded && child.ref.current) {
          child.ref.current.expand(true);
        }
      });
    }
  }, [isExpanded, childNodes]);

  return (
    <div className="flex items-start gap-4">
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300",
          "bg-[#9b87f5] hover:bg-[#8B5CF6] text-white shadow-sm",
          "relative group"
        )}
      >
        <span>{text}</span>
        <ChevronRight
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            isExpanded ? "rotate-90" : ""
          )}
        />
      </button>
      
      {isExpanded && (
        <div className="flex flex-col gap-4 animate-fade-in">
          {Array.from({ length: 5 }).map((_, childIndex) => (
            <ChildTreeNode
              key={`${depth}-${childIndex}`}
              text={`Node ${depth}.${childIndex + 1}`}
              depth={depth + 1}
              index={childIndex}
              isInitiallyExpanded={childNodes[childIndex].expanded}
              onExpandChange={(expanded) => updateChildState(childIndex, expanded)}
              ref={childNodes[childIndex].ref}
            />
          ))}
        </div>
      )}
    </div>
  );
});

ChildTreeNode.displayName = 'ChildTreeNode';

export default TreeNode;
