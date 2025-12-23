"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableQuestion } from "./SortableQuestion";
import type { Question } from "@/lib/types";
import { Empty } from "antd";

interface SortableQuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onReorder: (reorderedQuestions: Question[]) => void;
}

export default function SortableQuestionList({
  questions,
  onEdit,
  onDelete,
  onReorder,
}: SortableQuestionListProps) {
  const [items, setItems] = useState<Question[]>(questions);

  // Update items when questions prop changes
  useEffect(() => {
    setItems(questions);
  }, [questions]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Minimum distance required before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        // Create a new array with the updated order
        const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            order: index + 1,
          })
        );

        // Call the onReorder callback with the new order
        onReorder(reorderedItems);

        return reorderedItems;
      });
    }
  }

  if (questions.length === 0) {
    return (
      <div dir="rtl">
        <Empty
          description="لا توجد أسئلة حتى الآن. أضف سؤالك الأول للبدء."
          className="my-8 p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:border-blue-400 transition-all duration-300 shadow-sm hover:shadow-md"
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((q) => q.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-6" dir="rtl">
          {items.map((question, index) => (
            <SortableQuestion
              key={question.id}
              question={question}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
