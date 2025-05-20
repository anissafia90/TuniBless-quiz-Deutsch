"use client"

import type React from "react"
import { List, Typography, Button, Card, Space, Tag } from "antd"
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"
import type { Question } from "@/lib/types"

const { Title, Text } = Typography

interface QuestionListProps {
  questions: Question[]
  onEdit: (question: Question) => void
  onDelete: (questionId: string) => void
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, onEdit, onDelete }) => {
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
    <List
      dataSource={questions}
      renderItem={(question, index) => (
        <Card className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-2">
                <Title level={5} className="mb-0 mr-2">
                  Question {index + 1}
                </Title>
                {getQuestionTypeLabel(question.question_type)}
              </div>
              <Text>{question.question_text}</Text>

              {(question.question_type === "two_choices" || question.question_type === "four_choices") && (
                <div className="mt-2">
                  <Text className="text-sm text-gray-500">Options:</Text>
                  <ul className="pl-5 mt-1">
                    {Object.entries(question.options).map(([key, value]) => (
                      <li key={key} className={key === question.correct_answer ? "font-bold text-green-600" : ""}>
                        {key.toUpperCase()}: {value as string} {key === question.correct_answer && "✓"}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {question.question_type === "input" && (
                <div className="mt-2">
                  <Text className="text-sm text-gray-500">Correct Answer:</Text>
                  <div className="pl-5 mt-1 font-bold text-green-600">{question.correct_answer}</div>
                </div>
              )}
            </div>

            <Space>
              <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(question)} />
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(question.id)} />
            </Space>
          </div>
        </Card>
      )}
    />
  )
}

export default QuestionList
