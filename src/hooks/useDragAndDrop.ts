import { useMemo, useState } from 'react';
import { PointerSensor, KeyboardSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';

export type UseDragAndDropReturn = {
  sensors: ReturnType<typeof useSensors>;
  collisionDetection: typeof closestCenter;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
};

export function useDragAndDrop(): UseDragAndDropReturn {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const collisionDetection = useMemo(() => closestCenter, []);

  return { sensors, collisionDetection, activeId, setActiveId };
}
