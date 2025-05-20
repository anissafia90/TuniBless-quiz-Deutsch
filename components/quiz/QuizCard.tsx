"use client"

import type React from "react"
import { Card, Typography, Space, Badge } from "antd"
import { EditOutlined, EyeOutlined, CalendarOutlined } from "@ant-design/icons"
import Link from "next/link"
import Image from "next/image"
import type { Quiz } from "@/lib/types"
import { useAuth } from "@/lib/auth"

const { Title, Paragraph } = Typography

interface QuizCardProps {
  quiz: Quiz
}

const QuizCard: React.FC<QuizCardProps> = ({ quiz }) => {
  const { user } = useAuth()
  const isOwner = user?.id === quiz.author_id

  return (
    <Card
      hoverable
      className="h-full flex flex-col overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
      cover={
        <div className="relative h-48 w-full">
          <Image
            src={quiz.cover_image || "/placeholder.svg?height=200&width=400"}
            alt={quiz.title}
            fill
            className="object-cover"
          />
          {quiz.published && <Badge.Ribbon text="Published" color="green" className="z-10" />}
          {!quiz.published && isOwner && <Badge.Ribbon text="Draft" color="orange" className="z-10" />}
        </div>
      }
      actions={[
        isOwner && (
          <Link href={`/quizzes/${quiz.id}`} key="edit" className="text-blue-500 hover:text-blue-700">
            <EditOutlined /> Edit
          </Link>
        ),
        <Link
          href={quiz.published ? `/quizzes/${quiz.id}/published` : `/quizzes/${quiz.id}/preview`}
          key="view"
          className="text-green-500 hover:text-green-700"
        >
          <EyeOutlined /> {quiz.published ? "Take Quiz" : "Preview"}
        </Link>,
      ].filter(Boolean)}
      bodyStyle={{ flexGrow: 1 }}
    >
      <div className="flex flex-col h-full">
        <Title level={4} className="mb-2 line-clamp-2" style={{ minHeight: "3rem" }}>
          {quiz.title}
        </Title>
        <Paragraph className="text-gray-600 flex-grow mb-4 line-clamp-3" style={{ minHeight: "4.5rem" }}>
          {quiz.description}
        </Paragraph>
        <Space className="text-xs text-gray-500 mt-auto">
          <CalendarOutlined />
          <span>{new Date(quiz.created_at).toLocaleDateString()}</span>
        </Space>
      </div>
    </Card>
  )
}

export default QuizCard
