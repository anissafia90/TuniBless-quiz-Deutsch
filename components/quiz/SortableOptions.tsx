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
import { SortableOption } from "./SortableOption";
import { Controller, useWatch } from "react-hook-form";

interface SortableOptionsProps {
  options: Record<string, string>;
  control: any;
  correctAnswer: string;
  onCorrectAnswerChange: (value: string) => void;
  questionType: "two_choices" | "four_choices";
}

export default function SortableOptions({
  options,
  control,
  correctAnswer,
  onCorrectAnswerChange,
  questionType,
}: SortableOptionsProps) {
  const optionKeys =
    questionType === "two_choices" ? ["a", "b"] : ["a", "b", "c", "d"];
  const [items, setItems] = useState(optionKeys);

  // Watch the options to update when they change
  const watchedOptions = useWatch({
    control,
    name: "options",
  });

  // Reset items when question type changes
  useEffect(() => {
    setItems(
      questionType === "two_choices" ? ["a", "b"] : ["a", "b", "c", "d"]
    );
  }, [questionType]);

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
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        console.log({ oldIndex, newIndex });
        console.log(items, arrayMove(items, oldIndex, newIndex));
        // Create a new array with the updated order
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <div className="space-y-4">
          {items.map((key) => (
            <Controller
              key={key}
              name={`options.${key}`}
              control={control}
              rules={{ required: `Option ${key.toUpperCase()} is required` }}
              render={({ field, fieldState }) => (
                <SortableOption
                  id={key}
                  field={field}
                  error={fieldState.error}
                  isCorrect={correctAnswer === key}
                  onCorrectChange={() => onCorrectAnswerChange(key)}
                  label={key.toUpperCase()}
                />
              )}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
