
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';

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
  const [nodeText, setNodeText] = useState(text);
  
  const handleClick = () => {
    toggleExpansion();
  };
  
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 w-full">
        <Textarea 
          value={nodeText}
          onChange={(e) => setNodeText(e.target.value)}
          className="min-h-[40px] resize-none py-2"
          placeholder="Enter text..."
        />
        <motion.button
          onClick={handleClick}
          className={cn(
            "flex items-center justify-center p-2 rounded-lg",
            "bg-[#9b87f5] hover:bg-[#8B5CF6] text-white shadow-sm",
            "relative shrink-0"
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </div>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex flex-col gap-4 pl-8"
          >
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreeNode;
