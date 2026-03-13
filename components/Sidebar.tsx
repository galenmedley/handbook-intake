
import React from 'react';
import { Check } from 'lucide-react';

interface SidebarProps {
  steps: { id: number; title: string }[];
  currentStepId: number;
  onStepClick: (id: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ steps, currentStepId, onStepClick }) => {
  return (
    <aside className="hidden md:flex flex-col w-72 lg:w-80 bg-slate-900 text-slate-300 h-screen sticky top-0 border-r border-slate-800 overflow-y-auto">
      <div className="p-8">
        <h1 className="text-xl font-bold text-white flex items-center">
          <span className="bg-indigo-600 p-1.5 rounded mr-2">
            <Check className="w-5 h-5 text-white" />
          </span>
          Intake Wizard
        </h1>
        <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-semibold">Handbook Drafting</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {steps.map((step, index) => {
          const isActive = currentStepId === step.id;
          const isCompleted = steps.findIndex(s => s.id === currentStepId) > index;
          
          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={`w-full flex items-center p-3 text-left rounded-lg transition-colors group ${
                isActive 
                  ? 'bg-indigo-600/10 text-white font-medium border border-indigo-600/30' 
                  : 'hover:bg-slate-800/50 hover:text-slate-100'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2 transition-colors ${
                isActive 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : isCompleted
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-700 text-slate-500 group-hover:border-slate-600'
              }`}>
                {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
              </div>
              <span className="text-sm truncate">{step.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-8 mt-auto border-t border-slate-800">
        <div className="flex items-center text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
          Auto-saving to Local Draft
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
