
import TreeViewer from '@/components/TreeViewer';
import { Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Index = () => {
  return (
    <div className="w-full">
      <header className="flex items-center gap-4 p-4">
        <Input
          defaultValue="Mind Map"
          className="max-w-[200px] bg-background border-input hover:border-muted-foreground/50 transition-colors"
        />
        <button className="p-2 rounded-lg hover:bg-[#F1F0FB] transition-colors">
          <Settings className="w-6 h-6 text-[#8E9196]" />
        </button>
      </header>
      <TreeViewer />
    </div>
  );
};

export default Index;
