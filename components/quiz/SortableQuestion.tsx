"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, Typography, Button, Space, Tag } from "antd"
import { EditOutlined, DeleteOutlined, MenuOutlined } from "@ant-design/icons"
import type { Question } from "@/lib/types"

const { Title, Text } = Typography

interface SortableQuestionProps {
  question: Question
  index: number
  onEdit: (question: Question) => void
  onDelete: (questionId: string) => void
}

export function SortableQuestion({ question, index, onEdit, onDelete }: SortableQuestionProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "two_choices":
        return <Tag color="blue">Two Choices</Tag>
      case "four_choices":
        return <Tag color="purple">Four Choices</Tag>
      case "input":
        return <Tag color="green">Text Input</Tag>
      default:
        return <Tag>Unknown</Tag>
    }
  }

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card
        className={`border-2 ${isDragging ? "border-blue-400 shadow-lg" : "border-gray-200"} 
                   hover:border-blue-300 transition-all rounded-lg overflow-hidden`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start">
            <Button
              type="text"
              icon={<MenuOutlined />}
              className="cursor-grab mr-2 text-gray-400 hover:text-blue-500 mt-1"
              {...attributes}
              {...listeners}
            />
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 mr-3 font-medium">
                  {index + 1}
                </div>
                <Title level={5} className="mb-0 mr-2">
                  {question.question_text}
                </Title>
                {getQuestionTypeLabel(question.question_type)}
              </div>

              {(question.question_type === "two_choices" || question.question_type === "four_choices") && (
                <div className="mt-3 ml-11">
                  <Text className="text-sm text-gray-500 block mb-1">Options:</Text>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(question.options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-2 rounded-md ${
                          key === question.correct_answer
                            ? "bg-green-50 border border-green-200"
                            : "bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <span className="inline-block w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mr-2">
                          {key.toUpperCase()}
                        </span>
                        <span className={key === question.correct_answer ? "font-medium" : ""}>{value as string}</span>
                        {key === question.correct_answer && <span className="ml-1 text-green-600">✓</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {question.question_type === "input" && (
                <div className="mt-3 ml-11">
                  <Text className="text-sm text-gray-500 block mb-1">Correct Answer:</Text>
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md font-medium text-green-700">
                    {question.correct_answer}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Space>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(question)}
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(question.id)}
              className="hover:bg-red-50"
            />
          </Space>
        </div>
      </Card>
    </div>
  )
}
