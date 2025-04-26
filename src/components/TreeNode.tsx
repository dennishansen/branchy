
import React, { useRef, useEffect } from 'react';
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
  onTextChange: (text: string) => void;
}

const TreeNode: React.FC<TreeNodeProps> = ({
  text,
  depth,
  nodePath,
  isExpanded,
  toggleExpansion,
  updateChildState,
  getChildState,
  onTextChange
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = () => {
    toggleExpansion();
  };

  // Auto-resize textarea based on content
  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    autoResize();
  }, [text]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize();
    onTextChange(e.target.value);
  };
  
  return (
    <div className="flex items-start gap-4">
      <div className="flex items-center gap-2 min-w-[200px]">
        <Textarea 
          ref={textareaRef}
          value={text}
          onChange={handleInput}
          className="resize-none overflow-hidden min-h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter text..."
        />
        <motion.button
          onClick={handleClick}
          className={cn(
            "p-2 rounded-lg bg-[#9b87f5] hover:bg-[#8B5CF6] text-white",
            "flex items-center justify-center"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
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
            className="flex flex-col gap-4"
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
                  onTextChange={(newText) => onTextChange(`${childKey}:${newText}`)}
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
