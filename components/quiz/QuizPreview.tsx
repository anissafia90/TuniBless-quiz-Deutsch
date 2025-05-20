"use client"

import type React from "react"
import { useState } from "react"
import { Card, Typography, Radio, Input, Button, Space, Progress, Result } from "antd"
import type { Quiz, Question } from "@/lib/types"
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"

const { Title, Paragraph, Text } = Typography

interface QuizPreviewProps {
  quiz: Quiz
  questions: Question[]
  readOnly?: boolean
}

const QuizPreview: React.FC<QuizPreviewProps> = ({ quiz, questions, readOnly = false }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    })
  }

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true)
      // Simulate a small delay for better UX
      setTimeout(() => {
        setShowResults(true)
        setIsSubmitting(false)
      }, 500)
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1)
  }

  const calculateScore = () => {
    let correctAnswers = 0

    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++
      }
    })

    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    }
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowResults(false)
  }

  if (questions.length === 0) {
    return <Result status="warning" title="No Questions" subTitle="This quiz doesn't have any questions yet." />
  }

  if (showResults) {
    const { score, total, percentage } = calculateScore()

    return (
      <Card className="max-w-3xl mx-auto shadow-lg rounded-lg overflow-hidden">
        <Result
          status={percentage >= 70 ? "success" : "warning"}
          title={`Quiz Results: ${score}/${total} (${percentage}%)`}
          subTitle={percentage >= 70 ? "Great job!" : "Keep practicing!"}
          extra={[
            <Button key="reset" type="primary" onClick={resetQuiz} size="large">
              Try Again
            </Button>,
          ]}
        />

        <div className="mt-8">
          <Title level={4}>Question Review</Title>
          {questions.map((question, index) => (
            <Card key={question.id} className="mb-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    answers[question.id] === question.correct_answer
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {answers[question.id] === question.correct_answer ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                </div>
                <div className="flex-grow">
                  <Title level={5}>Question {index + 1}</Title>
                  <Paragraph>{question.question_text}</Paragraph>

                  {(question.question_type === "two_choices" || question.question_type === "four_choices") && (
                    <ul className="pl-5 mt-1 space-y-1">
                      {Object.entries(question.options).map(([key, value]) => (
                        <li
                          key={key}
                          className={`p-2 rounded ${
                            key === question.correct_answer
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : key === answers[question.id] && key !== question.correct_answer
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : ""
                          }`}
                        >
                          <span className="font-medium">{key.toUpperCase()}: </span>
                          {value as string}
                          {key === question.correct_answer && <CheckCircleOutlined className="ml-2 text-green-600" />}
                          {key === answers[question.id] && key !== question.correct_answer && (
                            <CloseCircleOutlined className="ml-2 text-red-600" />
                          )}
                        </li>
                      ))}
                    </ul>
                  )}

                  {question.question_type === "input" && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <div className="mb-2">
                        <Text strong>Your answer: </Text>
                        <Text
                          className={
                            answers[question.id] === question.correct_answer
                              ? "text-green-600 font-bold"
                              : "text-red-600 font-bold"
                          }
                        >
                          {answers[question.id] || "No answer"}
                        </Text>
                      </div>
                      {answers[question.id] !== question.correct_answer && (
                        <div>
                          <Text strong>Correct answer: </Text>
                          <Text className="text-green-600 font-bold">{question.correct_answer}</Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="mb-6 shadow-md rounded-lg overflow-hidden">
        <Progress
          percent={Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}
          showInfo={false}
          status="active"
          className="mb-4"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
        <div className="flex justify-between items-center mb-2">
          <Text className="text-gray-500">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Text>
          <Text className="text-gray-500">
            {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
          </Text>
        </div>
      </Card>

      <Card className="shadow-lg rounded-lg overflow-hidden">
        <Title level={4} className="mb-6">
          {currentQuestion.question_text}
        </Title>

        {(currentQuestion.question_type === "two_choices" || currentQuestion.question_type === "four_choices") && (
          <Radio.Group
            onChange={(e) => handleAnswer(e.target.value)}
            value={answers[currentQuestion.id]}
            className="w-full mt-4"
            disabled={readOnly}
          >
            <Space direction="vertical" className="w-full">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <Radio
                  key={key}
                  value={key}
                  className="w-full p-3 border rounded-lg transition-all hover:border-blue-300 hover:bg-blue-50"
                >
                  <div className="flex items-center">
                    <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 font-medium">
                      {key.toUpperCase()}
                    </span>
                    <span>{value as string}</span>
                  </div>
                  {readOnly && key === currentQuestion.correct_answer && (
                    <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
                  )}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        )}

        {currentQuestion.question_type === "input" && (
          <div className="mt-4">
            <Input
              placeholder="Type your answer here"
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              disabled={readOnly}
              className="mb-2 p-3"
              size="large"
            />
            {readOnly && <Text className="block text-green-600">Correct answer: {currentQuestion.correct_answer}</Text>}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button onClick={handlePrevious} disabled={currentQuestionIndex === 0} size="large" className="min-w-[100px]">
            Previous
          </Button>
          <Button
            type="primary"
            onClick={handleNext}
            disabled={!readOnly && !answers[currentQuestion.id]}
            loading={isSubmitting}
            size="large"
            className="min-w-[100px]"
          >
            {isLastQuestion ? "Finish" : "Next"}
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default QuizPreview
