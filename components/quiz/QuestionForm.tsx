"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Form, Input, Select, Button, Card, Typography } from "antd"
import { useForm, Controller } from "react-hook-form"
import type { Question, QuestionType } from "@/lib/types"
import SortableOptions from "./SortableOptions"

const { Title } = Typography
const { Option } = Select
const { TextArea } = Input

interface QuestionFormProps {
  initialData?: Question
  onSubmit: (data: any) => void
  onCancel: () => void
}

const QuestionForm: React.FC<QuestionFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const defaultOptions =
    initialData?.question_type === "two_choices"
      ? { a: initialData.options.a || "", b: initialData.options.b || "" }
      : initialData?.question_type === "four_choices"
        ? {
            a: initialData.options.a || "",
            b: initialData.options.b || "",
            c: initialData.options.c || "",
            d: initialData.options.d || "",
          }
        : { a: "", b: "", c: "", d: "" }

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      question_text: "",
      question_type: "four_choices",
      options: defaultOptions,
      correct_answer: "",
    },
  })

  const questionType = watch("question_type")
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correct_answer || "")

  // Set initial correct answer from initialData
  useEffect(() => {
    if (initialData?.correct_answer) {
      setCorrectAnswer(initialData.correct_answer)
    }
  }, [initialData])

  const handleTypeChange = (type: QuestionType) => {
    if (type === "two_choices") {
      // Preserve existing values if possible
      const currentOptions = watch("options")
      setValue("options", {
        a: currentOptions.a || "",
        b: currentOptions.b || "",
      })

      if (correctAnswer !== "a" && correctAnswer !== "b") {
        setCorrectAnswer("")
        setValue("correct_answer", "")
      }
    } else if (type === "four_choices") {
      // Preserve existing values if possible
      const currentOptions = watch("options")
      setValue("options", {
        a: currentOptions.a || "",
        b: currentOptions.b || "",
        c: currentOptions.c || "",
        d: currentOptions.d || "",
      })
    } else if (type === "input") {
      setValue("options", {})
      setCorrectAnswer("")
    }
  }

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value)
    setValue("correct_answer", value)
  }

  const handleFormSubmit = (data: any) => {
    // Ensure correct_answer is set
    if ((questionType === "two_choices" || questionType === "four_choices") && !data.correct_answer) {
      data.correct_answer = correctAnswer
    }

    onSubmit(data)
  }

  return (
    <Card className="mb-6">
      <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
        <Controller
          name="question_text"
          control={control}
          rules={{ required: "Question text is required" }}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Question Text"
              validateStatus={fieldState.error ? "error" : ""}
              help={fieldState.error?.message}
            >
              <TextArea {...field} rows={2} placeholder="Enter your question here" />
            </Form.Item>
          )}
        />

        <Controller
          name="question_type"
          control={control}
          rules={{ required: "Question type is required" }}
          render={({ field, fieldState }) => (
            <Form.Item
              label="Question Type"
              validateStatus={fieldState.error ? "error" : ""}
              help={fieldState.error?.message}
            >
              <Select
                {...field}
                placeholder="Select question type"
                onChange={(value) => {
                  field.onChange(value)
                  handleTypeChange(value as QuestionType)
                }}
              >
                <Option value="two_choices">Two Choices</Option>
                <Option value="four_choices">Four Choices</Option>
                <Option value="input">Text Input</Option>
              </Select>
            </Form.Item>
          )}
        />

        {questionType === "two_choices" && (
          <>
            <Title level={5}>Options (Drag to reorder)</Title>
            <Controller
              name="correct_answer"
              control={control}
              defaultValue={correctAnswer}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <SortableOptions
              options={watch("options")}
              control={control}
              correctAnswer={correctAnswer}
              onCorrectAnswerChange={handleCorrectAnswerChange}
              questionType="two_choices"
            />
          </>
        )}

        {questionType === "four_choices" && (
          <>
            <Title level={5}>Options (Drag to reorder)</Title>
            <Controller
              name="correct_answer"
              control={control}
              defaultValue={correctAnswer}
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <SortableOptions
              options={watch("options")}
              control={control}
              correctAnswer={correctAnswer}
              onCorrectAnswerChange={handleCorrectAnswerChange}
              questionType="four_choices"
            />
          </>
        )}

        {questionType === "input" && (
          <Controller
            name="correct_answer"
            control={control}
            rules={{ required: "Correct answer is required" }}
            render={({ field, fieldState }) => (
              <Form.Item
                label="Correct Answer"
                validateStatus={fieldState.error ? "error" : ""}
                help={fieldState.error?.message}
              >
                <Input {...field} placeholder="Enter the correct answer" />
              </Form.Item>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {initialData ? "Update Question" : "Add Question"}
          </Button>
        </div>
      </Form>
    </Card>
  )
}

export default QuestionForm
