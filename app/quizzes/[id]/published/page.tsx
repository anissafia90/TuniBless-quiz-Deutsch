"use client"

import { useParams, useRouter } from "next/navigation"
import { Typography, Button, Spin, Result, Card } from "antd"
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons"
import { useQuiz } from "@/api/hooks/useQuiz"
import { useQuizQuestions } from "@/api/hooks/useQuestions"
import QuizPreview from "@/components/quiz/QuizPreview"
import Link from "next/link"
import Image from "next/image"

const { Title, Paragraph } = Typography

export default function PublishedQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId, true) // Pass true to indicate this is a public route
  const { data: questions = [], isLoading: isLoadingQuestions } = useQuizQuestions(quizId, true) // Pass true to indicate this is a public route

  if (isLoadingQuiz || isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="text-center">
        <Result
          status="404"
          title="Quiz Not Found"
          subTitle="The quiz you're looking for doesn't exist or has been removed."
          extra={
            <Link href="/quizzes">
              <Button type="primary" icon={<HomeOutlined />}>
                Back to Quizzes
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  if (!quiz.published) {
    return (
      <div className="text-center">
        <Result
          status="warning"
          title="Quiz Not Published"
          subTitle="This quiz has not been published yet."
          extra={
            <Link href="/quizzes">
              <Button type="primary" icon={<HomeOutlined />}>
                Back to Quizzes
              </Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/quizzes">
          <Button type="text" icon={<ArrowLeftOutlined />} className="hover:bg-gray-100 transition-colors">
            Back to Quizzes
          </Button>
        </Link>
      </div>

      {quiz.cover_image && (
        <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden shadow-lg">
          <Image src={quiz.cover_image || "/placeholder.svg"} alt={quiz.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="p-6">
              <Title level={1} className="text-white m-0">
                {quiz.title}
              </Title>
            </div>
          </div>
        </div>
      )}

      {!quiz.cover_image && (
        <Title level={1} className="mb-4">
          {quiz.title}
        </Title>
      )}

      <Card className="mb-8 shadow-md">
        <Paragraph className="text-lg">{quiz.description}</Paragraph>
        <div className="flex items-center text-gray-500 text-sm">
          <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
        </div>
      </Card>

      <QuizPreview quiz={quiz} questions={questions} />
    </div>
  )
}
