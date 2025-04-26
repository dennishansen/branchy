
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  text: string;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ text, depth }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

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
            <TreeNode
              key={`${depth}-${index}`}
              text={`Node ${depth}.${index + 1}`}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
