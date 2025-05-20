"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Form, Input, Radio } from "antd"
import { MenuOutlined } from "@ant-design/icons"

interface SortableOptionProps {
  id: string
  field: any
  error?: any
  isCorrect: boolean
  onCorrectChange: () => void
  label: string
}

export function SortableOption({ id, field, error, isCorrect, onCorrectChange, label }: SortableOptionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Form.Item validateStatus={error ? "error" : ""} help={error?.message}>
        <div className="flex items-center">
          <div
            className="cursor-grab mr-2 text-gray-400 hover:text-blue-500 p-2 flex items-center justify-center"
            {...attributes}
            {...listeners}
          >
            <MenuOutlined />
          </div>
          <Input
            {...field}
            addonBefore={<Radio checked={isCorrect} onChange={onCorrectChange} />}
            placeholder={`Option ${label}`}
            addonAfter={label}
          />
        </div>
      </Form.Item>
    </div>
  )
}
