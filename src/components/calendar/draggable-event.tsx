import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DraggableEventProps {
  id: string
  title: string
}

function DraggableEvent({ id, title }: DraggableEventProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="truncate rounded px-1.5 py-0.5 text-xs font-medium bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20 cursor-grab active:cursor-grabbing"
    >
      {title}
    </div>
  )
}