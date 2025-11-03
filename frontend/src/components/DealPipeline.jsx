import { DndContext, PointerSensor, KeyboardSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import DealCard from './DealCard';

export default function DealPipeline({ stages, deals, organizations, onDragEnd, onEditDeal, onMoveDeal }) {
  const getOrgName = (orgId) => orgId?.name || organizations.find(o => o._id === orgId)?.name || 'N/A';
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto p-1">
        {stages.map(stage => {
          const dealsInStage = deals.filter(deal => deal.stage === stage);
          const dealIds = dealsInStage.map(d => d._id);

          return (
            <div key={stage} className="flex-shrink-0 w-72 bg-slate-100 rounded-lg">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-800">{stage}</h2>
                <span className="text-sm text-slate-500">{dealsInStage.length} deals</span>
              </div>
              <SortableContext id={stage} items={dealIds} strategy={verticalListSortingStrategy}>
                <div className="p-4 space-y-3">
                  {dealsInStage.map(deal => (
                    <DealCard
                      key={deal._id}
                      deal={deal}
                      organizationName={getOrgName(deal.organizationId)}
                      onEdit={onEditDeal}
                      onMove={onMoveDeal} // <-- Pass the move handler
                      stages={stages}      // <-- Pass all available stages
                    />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
}