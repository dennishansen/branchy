
import TreeViewer from '@/components/TreeViewer';
import { Settings } from 'lucide-react';

const Index = () => {
  return (
    <div className="w-full">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-semibold text-[#1A1F2C]">Mind Map</h1>
        <button className="p-2 rounded-lg hover:bg-[#F1F0FB] transition-colors">
          <Settings className="w-6 h-6 text-[#8E9196]" />
        </button>
      </header>
      <TreeViewer />
    </div>
  );
};

export default Index;
