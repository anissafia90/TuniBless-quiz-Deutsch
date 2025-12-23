"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Form, Input, Select, Button, Card, Typography, Radio } from "antd";
import { useForm, Controller } from "react-hook-form";
import type { Question } from "@/lib/types";

const { Title, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface QuestionFormProps {
  initialData?: Question;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      question_text: initialData?.question_text || "",
      question_type: initialData?.question_type || "four_choices",
      option_a: initialData?.options?.a || "",
      option_b: initialData?.options?.b || "",
      option_c: initialData?.options?.c || "",
      option_d: initialData?.options?.d || "",
      correct_answer: initialData?.correct_answer || "",
    },
  });

  const questionType = watch("question_type");
  const [correctAnswer, setCorrectAnswer] = useState(
    initialData?.correct_answer || ""
  );

  useEffect(() => {
    setValue("correct_answer", correctAnswer);
  }, [correctAnswer, setValue]);

  const handleFormSubmit = (data: any) => {
    const options: Record<string, string> = {};

    if (questionType === "two_choices") {
      options.a = data.option_a;
      options.b = data.option_b;
    } else if (questionType === "four_choices") {
      options.a = data.option_a;
      options.b = data.option_b;
      options.c = data.option_c;
      options.d = data.option_d;
    }

    const formattedData = {
      question_text: data.question_text,
      question_type: data.question_type,
      options: options,
      correct_answer: data.correct_answer,
    };

    onSubmit(formattedData);
  };

  return (
    <Card
      dir="rtl"
      className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white animate-fade-in-up"
    >
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-8 border-b border-gray-200">
        <Title level={3} className="mb-3 text-gray-900 font-bold">
          {initialData ? "✏️ تعديل السؤال" : "➕ إضافة سؤال جديد"}
        </Title>
        <Paragraph className="text-gray-600 mb-0 text-lg">
          أنشئ أسئلة جذابة لاختبارك
        </Paragraph>
      </div>

      <div className="p-8">
        <Form layout="vertical" onFinish={handleSubmit(handleFormSubmit)}>
          <div className="space-y-8">
            {/* Question Text */}
            <Controller
              name="question_text"
              control={control}
              rules={{ required: "نص السؤال مطلوب" }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={
                    <span className="text-gray-800 font-bold text-lg flex items-center gap-2">
                      📝 نص السؤال
                    </span>
                  }
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <TextArea
                    {...field}
                    rows={4}
                    placeholder="اكتب سؤالك هنا..."
                    className="text-lg border-2 border-gray-300 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-md"
                  />
                </Form.Item>
              )}
            />

            {/* Question Type */}
            <Controller
              name="question_type"
              control={control}
              rules={{ required: "نوع السؤال مطلوب" }}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={
                    <span className="text-gray-800 font-bold text-lg flex items-center gap-2">
                      🎯 نوع السؤال
                    </span>
                  }
                  validateStatus={fieldState.error ? "error" : ""}
                  help={fieldState.error?.message}
                >
                  <Select
                    {...field}
                    placeholder="اختر نوع السؤال"
                    size="large"
                    className="rounded-2xl"
                    onChange={(value) => {
                      field.onChange(value);
                      setCorrectAnswer("");
                    }}
                  >
                    <Option value="two_choices">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-semibold">
                          خياران (اختيار ثنائي)
                        </span>
                      </div>
                    </Option>
                    <Option value="four_choices">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="font-semibold">
                          أربعة خيارات (اختيار متعدد)
                        </span>
                      </div>
                    </Option>
                    <Option value="input">
                      <div className="flex items-center gap-3 py-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold">إدخال نصي</span>
                      </div>
                    </Option>
                  </Select>
                </Form.Item>
              )}
            />

            {/* Answer Options */}
            {(questionType === "two_choices" ||
              questionType === "four_choices") && (
              <div className="space-y-6 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
                <div className="flex justify-between items-center">
                  <Title level={4} className="mb-0 text-gray-900 font-bold">
                    🎨 خيارات الإجابة
                  </Title>
                  <Paragraph className="text-sm text-gray-600 mb-0 font-medium">
                    اختر الإجابة الصحيحة أدناه
                  </Paragraph>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Option A */}
                  <Controller
                    name="option_a"
                    control={control}
                    rules={{ required: "الخيار أ مطلوب" }}
                    render={({ field, fieldState }) => (
                      <Form.Item
                        validateStatus={fieldState.error ? "error" : ""}
                        help={fieldState.error?.message}
                      >
                        <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                          <div className="flex items-center gap-3">
                            <Radio
                              checked={correctAnswer === "a"}
                              onChange={() => setCorrectAnswer("a")}
                              className="text-lg"
                            />
                            <span className="font-bold text-gray-800 text-base">
                              الخيار أ
                            </span>
                          </div>
                          <Input
                            {...field}
                            placeholder="أدخل الخيار أ"
                            size="large"
                            className="border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                      </Form.Item>
                    )}
                  />

                  {/* Option B */}
                  <Controller
                    name="option_b"
                    control={control}
                    rules={{ required: "الخيار ب مطلوب" }}
                    render={({ field, fieldState }) => (
                      <Form.Item
                        validateStatus={fieldState.error ? "error" : ""}
                        help={fieldState.error?.message}
                      >
                        <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                          <div className="flex items-center gap-3">
                            <Radio
                              checked={correctAnswer === "b"}
                              onChange={() => setCorrectAnswer("b")}
                              className="text-lg"
                            />
                            <span className="font-bold text-gray-800 text-base">
                              الخيار ب
                            </span>
                          </div>
                          <Input
                            {...field}
                            placeholder="أدخل الخيار ب"
                            size="large"
                            className="border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                          />
                        </div>
                      </Form.Item>
                    )}
                  />

                  {/* Option C - Only for four choices */}
                  {questionType === "four_choices" && (
                    <Controller
                      name="option_c"
                      control={control}
                      rules={{ required: "الخيار ج مطلوب" }}
                      render={({ field, fieldState }) => (
                        <Form.Item
                          validateStatus={fieldState.error ? "error" : ""}
                          help={fieldState.error?.message}
                        >
                          <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3">
                              <Radio
                                checked={correctAnswer === "c"}
                                onChange={() => setCorrectAnswer("c")}
                                className="text-lg"
                              />
                              <span className="font-bold text-gray-800 text-base">
                                الخيار ج
                              </span>
                            </div>
                            <Input
                              {...field}
                              placeholder="أدخل الخيار ج"
                              size="large"
                              className="border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </div>
                        </Form.Item>
                      )}
                    />
                  )}

                  {/* Option D - Only for four choices */}
                  {questionType === "four_choices" && (
                    <Controller
                      name="option_d"
                      control={control}
                      rules={{ required: "الخيار د مطلوب" }}
                      render={({ field, fieldState }) => (
                        <Form.Item
                          validateStatus={fieldState.error ? "error" : ""}
                          help={fieldState.error?.message}
                        >
                          <div className="space-y-3 bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all">
                            <div className="flex items-center gap-3">
                              <Radio
                                checked={correctAnswer === "d"}
                                onChange={() => setCorrectAnswer("d")}
                                className="text-lg"
                              />
                              <span className="font-bold text-gray-800 text-base">
                                الخيار د
                              </span>
                            </div>
                            <Input
                              {...field}
                              placeholder="أدخل الخيار د"
                              size="large"
                              className="border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300"
                            />
                          </div>
                        </Form.Item>
                      )}
                    />
                  )}
                </div>

                {/* Correct Answer Validation */}
                <Controller
                  name="correct_answer"
                  control={control}
                  rules={{ required: "يرجى اختيار الإجابة الصحيحة" }}
                  render={({ fieldState }) => (
                    <Form.Item
                      validateStatus={fieldState.error ? "error" : ""}
                      help={fieldState.error?.message}
                    >
                      <input type="hidden" value={correctAnswer} />
                    </Form.Item>
                  )}
                />
              </div>
            )}

            {/* Text Input Answer */}
            {questionType === "input" && (
              <Controller
                name="correct_answer"
                control={control}
                rules={{
                  required: "الإجابة الصحيحة مطلوبة لأسئلة الإدخال النصي",
                }}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label={
                      <span className="text-gray-800 font-bold text-lg flex items-center gap-2">
                        ✅ الإجابة الصحيحة
                      </span>
                    }
                    validateStatus={fieldState.error ? "error" : ""}
                    help={fieldState.error?.message}
                  >
                    <Input
                      {...field}
                      placeholder="أدخل الإجابة الصحيحة"
                      size="large"
                      className="border-2 border-gray-300 rounded-xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-md"
                    />
                  </Form.Item>
                )}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-8 border-t-2 border-gray-200 mt-8">
            <Button
              onClick={onCancel}
              size="large"
              className="h-12 px-10 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 rounded-xl font-bold text-base"
            >
              إلغاء
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="h-12 px-10 bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-xl font-bold text-base"
            >
              {initialData ? "✏️ تحديث السؤال" : "➕ إضافة السؤال"}
            </Button>
          </div>
        </Form>
      </div>
    </Card>
  );
};

export default QuestionForm;
