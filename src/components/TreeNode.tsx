
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  text: string;
  depth: number;
  nodePath: string;
  isExpanded: boolean;
  toggleExpansion: () => void;
  updateChildState: (childKey: string, expanded: boolean) => void;
  getChildState: (childKey: string) => boolean;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  text,
  depth,
  nodePath,
  isExpanded,
  toggleExpansion,
  updateChildState,
  getChildState
}) => {
  const handleClick = () => {
    toggleExpansion();
  };
  
  // Log for debugging
  React.useEffect(() => {
    console.log(`${text} rendered, expanded: ${isExpanded}, path: ${nodePath}`);
  }, [text, isExpanded, nodePath]);

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
          {Array.from({ length: 5 }).map((_, index) => {
            const childKey = `${index}`;
            const childPath = `${nodePath}.${childKey}`;
            const childIsExpanded = getChildState(childKey);
            
            return (
              <TreeNode
                key={childPath}
                text={`Node ${depth}.${index + 1}`}
                nodePath={childPath}
                depth={depth + 1}
                isExpanded={childIsExpanded}
                toggleExpansion={() => {
                  // When toggling a child, update its state in the parent
                  updateChildState(childKey, !childIsExpanded);
                }}
                updateChildState={(grandchildKey, expanded) => 
                  updateChildState(`${childKey}.${grandchildKey}`, expanded)
                }
                getChildState={(grandchildKey) => 
                  getChildState(`${childKey}.${grandchildKey}`)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
