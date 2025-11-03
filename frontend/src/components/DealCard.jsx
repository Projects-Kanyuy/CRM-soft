import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PencilSquareIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const stageStyles = {
  'Won': 'border-l-4 border-status-won',
  'Lost': 'border-l-4 border-status-lost',
  'Proposal': 'border-l-4 border-status-proposal',
  'Default': 'border-l-4 border-slate-300',
};

export default function DealCard({ deal, organizationName, onEdit, onMove, stages }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal._id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.8 : 1, zIndex: isDragging ? 20 : 'auto' }; // Increase z-index while dragging
  const borderClass = stageStyles[deal.stage] || stageStyles['Default'];

  const handleEditClick = (e) => { e.stopPropagation(); onEdit(deal); };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`group relative bg-white rounded-md shadow-sm p-4 mb-3 ${borderClass} cursor-grab`}>
      <div className="absolute top-2 right-2 flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={handleEditClick} className="p-1 rounded-full bg-white/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800" title="Edit Deal">
          <PencilSquareIcon className="h-5 w-5" />
        </button>
        
        {/* --- THE FIX --- */}
        {/* The key is to make the Popover itself relative, so its panel is positioned relative to it, and give the panel a high z-index. */}
        <Popover as="div" className="relative">
          <Popover.Button onClick={(e) => e.stopPropagation()} className="p-1 rounded-full bg-white/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus:outline-none" title="Move Deal">
            <ArrowsRightLeftIcon className="h-5 w-5" />
          </Popover.Button>
          <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
            {/* Add z-50 to ensure the panel appears above everything else */}
            <Popover.Panel className="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <p className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Move to</p>
                {stages.filter(s => s !== deal.stage).map(stage => (
                    <Popover.Button as="button" key={stage} onClick={() => onMove(deal._id, stage)} className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-theme-accent">
                      {stage}
                    </Popover.Button>
                ))}
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>
      
      <h3 className="font-semibold text-slate-800 pr-12">{deal.title}</h3>
      <p className="text-sm text-slate-500 mt-1">{organizationName}</p>
      <p className="text-sm font-bold text-slate-700 mt-2">${deal.value.toLocaleString()}</p>
    </div>
  );
}