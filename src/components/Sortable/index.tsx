'use client'

import { useRef, useState } from 'react'

import {
  Announcements,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  MouseSensor,
  ScreenReaderInstructions,
  TouchSensor,
  UniqueIdentifier,
  closestCenter,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  useSortable,
  SortableContext,
  sortableKeyboardCoordinates,
  SortingStrategy,
  rectSortingStrategy,
  AnimateLayoutChanges,
  NewIndexGetter,
} from '@dnd-kit/sortable'

import * as S from './styles'
import { SortableItem } from '../SortableItem'
import { createPortal } from 'react-dom'
import { Item } from '../Item'

const INITIAL_ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const Sortable = () => {
  const [items, setItems] = useState<UniqueIdentifier[]>(INITIAL_ITEMS)
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

  const isFirstAnnouncement = useRef(true)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const getIndex = (id: UniqueIdentifier) => items.indexOf(id)
  const getPosition = (id: UniqueIdentifier) => getIndex(id) + 1
  const activeIndex = activeId ? getIndex(activeId) : -1

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (!active) {
      return
    }

    setActiveId(active.id)
  }

  const handleDragEnd = ({ over }: DragEndEvent) => {
    setActiveId(null)

    if (over) {
      const overIndex = getIndex(over.id)
      if (activeIndex !== overIndex) {
        setItems((items) => arrayMove(items, activeIndex, overIndex))
      }
    }
  }

  // those are the announcements for screen readers
  const announcements: Announcements = {
    onDragStart({ active: { id } }) {
      return `Picked up sortable item ${String(
        id,
      )}. Sortable item ${id} is in position ${getPosition(id)} of ${
        items.length
      }`
    },
    onDragOver({ active, over }) {
      // In this specific use-case, the picked up item's `id` is always the same as the first `over` id.
      // The first `onDragOver` event therefore doesn't need to be announced, because it is called
      // immediately after the `onDragStart` announcement and is redundant.
      if (isFirstAnnouncement.current === true) {
        isFirstAnnouncement.current = false
        return
      }

      if (over) {
        return `Sortable item ${
          active.id
        } was moved into position ${getPosition(over.id)} of ${items.length}`
      }
    },
    onDragEnd({ active, over }) {
      if (over) {
        return `Sortable item ${
          active.id
        } was dropped at position ${getPosition(over.id)} of ${items.length}`
      }
    },
    onDragCancel({ active: { id } }) {
      return `Sorting was cancelled. Sortable item ${id} was dropped and returned to position ${getPosition(
        id,
      )} of ${items.length}.`
    },
  }

  const screenReaderInstructions: ScreenReaderInstructions = {
    draggable: `
      To pick up a sortable item, press the space bar.
      While sorting, use the arrow keys to move the item.
      Press space again to drop the item in its new position, or press escape to cancel.
    `,
  }

  const dropAnimationConfig: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveId(null)}
      accessibility={{
        announcements,
        screenReaderInstructions,
      }}
    >
      <S.Wrapper>
        <SortableContext items={items} strategy={rectSortingStrategy}>
          <S.Container>
            {items.map((value) => (
              <SortableItem key={value} id={value} useDragOverlay />
            ))}
          </S.Container>
        </SortableContext>
      </S.Wrapper>
      {createPortal(
        <DragOverlay adjustScale dropAnimation={dropAnimationConfig}>
          {activeId && <Item id={items[activeIndex]} dragOverlay />}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )
}
