"use client";

import type React from "react";
import { useState } from "react";
import { Card, Typography, Radio, Input, Button, Progress, Result } from "antd";
import type { Quiz, Question } from "@/lib/types";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  MehOutlined,
  SmileOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

interface QuizPreviewProps {
  quiz: Quiz;
  questions: Question[];
  readOnly?: boolean;
}

const QuizPreview: React.FC<QuizPreviewProps> = ({
  quiz,
  questions,
  readOnly = false,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswer = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: value,
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsSubmitting(true);
      // Simulate a small delay for better UX
      setTimeout(() => {
        setShowResults(true);
        setIsSubmitting(false);
      }, 1000);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const calculateScore = () => {
    let correctAnswers = 0;

    questions.forEach((question) => {
      if (answers[question.id] === question.correct_answer) {
        correctAnswers++;
      }
    });

    return {
      score: correctAnswers,
      total: questions.length,
      percentage: Math.round((correctAnswers / questions.length) * 100),
    };
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
  };

  // Helper function to sort options by key alphabetically
  const getSortedOptions = (options: Record<string, string>) => {
    return Object.entries(options).sort((a, b) => a[0].localeCompare(b[0]));
  };

  const getResultIcon = (percentage: number) => {
    if (percentage >= 80)
      return <TrophyOutlined className="text-6xl text-yellow-500" />;
    if (percentage >= 60)
      return <SmileOutlined className="text-6xl text-green-500" />;
    return <MehOutlined className="text-6xl text-orange-500" />;
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 80)
      return {
        title: "رائع! 🎉",
        subtitle: "أنت أسطورة الاختبارات!",
        color: "text-yellow-600",
      };
    if (percentage >= 60)
      return {
        title: "عمل رائع! 😊",
        subtitle: "مبروك، استمر على هذا النحو!",
        color: "text-green-600",
      };
    return {
      title: "استمر بالتمرين! 💪",
      subtitle: "ستتحسن النتائج مع المراجعة!",
      color: "text-orange-600",
    };
  };

  if (questions.length === 0) {
    return (
      <Result
        status="warning"
        title="لا توجد أسئلة"
        subTitle="هذا الاختبار لا يحتوي على أي أسئلة حتى الآن."
      />
    );
  }

  if (showResults) {
    const { score, total, percentage } = calculateScore();
    const resultMessage = getResultMessage(percentage);

    return (
      <div
        dir="rtl"
        className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          {/* Results Header */}
          <Card className="mb-8 shadow-2xl border-0 rounded-3xl overflow-hidden bg-white">
            <div className="text-center py-12">
              <div className="animate-bounce mb-6">
                {getResultIcon(percentage)}
              </div>

              <Title
                level={1}
                className={`mb-4 ${resultMessage.color} font-bold`}
              >
                {resultMessage.title}
              </Title>

              <Paragraph className="text-xl text-gray-600 mb-8 font-medium">
                {resultMessage.subtitle}
              </Paragraph>

              {/* Score Display */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl">
                  <div className="text-5xl font-bold text-blue-600 mb-2">
                    {score}
                  </div>
                  <div className="text-gray-600 font-bold">صحيح</div>
                </div>
                <div className="text-5xl text-gray-300 font-bold">/</div>
                <div className="text-center bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
                  <div className="text-5xl font-bold text-gray-600 mb-2">
                    {total}
                  </div>
                  <div className="text-gray-600 font-bold">الإجمالي</div>
                </div>
              </div>

              {/* Percentage Circle */}
              <div className="flex justify-center mb-8">
                <div className="relative w-40 h-40">
                  <Progress
                    type="circle"
                    percent={percentage}
                    size={160}
                    strokeColor={{
                      "0%": "#3b82f6",
                      "100%": "#8b5cf6",
                    }}
                    strokeWidth={6}
                    className="animate-pulse"
                  />
                </div>
              </div>

              <Button
                type="primary"
                onClick={resetQuiz}
                size="large"
                className="h-14 px-10 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                🔄 حاول مرة أخرى
              </Button>
            </div>
          </Card>

          {/* Question Review */}
          <Card className="shadow-xl border-0 rounded-3xl overflow-hidden bg-white">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-6 border-b-2 border-gray-200">
              <Title level={3} className="mb-2 text-gray-900 font-bold">
                📋 مراجعة الأسئلة
              </Title>
              <Paragraph className="text-gray-600 mb-0 font-medium">
                انظر كيف كان أداؤك على كل سؤال
              </Paragraph>
            </div>

            <div className="p-6 space-y-6">
              {questions.map((question, index) => {
                const isCorrect =
                  answers[question.id] === question.correct_answer;
                return (
                  <Card
                    key={question.id}
                    className={`border-2 rounded-2xl transition-all duration-300 ${
                      isCorrect
                        ? "border-green-300 bg-green-50 shadow-lg shadow-green-200"
                        : "border-red-300 bg-red-50 shadow-lg shadow-red-200"
                    } hover:shadow-xl`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                          isCorrect
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-red-400 to-red-600"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-3">
                          <Title level={5} className="mb-0 font-bold">
                            السؤال {index + 1}
                          </Title>
                          <div
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              isCorrect
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {isCorrect ? "✓ صحيح" : "✗ خاطئ"}
                          </div>
                        </div>

                        <Paragraph className="text-gray-800 mb-4 text-lg font-medium text-right">
                          {question.question_text}
                        </Paragraph>

                        {(question.question_type === "two_choices" ||
                          question.question_type === "four_choices") && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {getSortedOptions(question.options).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                                    key === question.correct_answer
                                      ? "border-green-400 bg-green-100"
                                      : key === answers[question.id] &&
                                        key !== question.correct_answer
                                      ? "border-red-400 bg-red-100"
                                      : "border-gray-300 bg-gray-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                        key === question.correct_answer
                                          ? "bg-green-500 text-white"
                                          : key === answers[question.id] &&
                                            key !== question.correct_answer
                                          ? "bg-red-500 text-white"
                                          : "bg-gray-400 text-gray-600"
                                      }`}
                                    >
                                      {key.toUpperCase()}
                                    </div>
                                    <span className="flex-1 font-medium text-gray-800">
                                      {value}
                                    </span>
                                    {key === question.correct_answer && (
                                      <CheckCircleOutlined className="text-green-600 text-xl" />
                                    )}
                                    {key === answers[question.id] &&
                                      key !== question.correct_answer && (
                                        <CloseCircleOutlined className="text-red-600 text-xl" />
                                      )}
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                        {question.question_type === "input" && (
                          <div className="space-y-3">
                            <div className="p-4 bg-gray-100 rounded-xl">
                              <Text strong className="text-gray-800">
                                إجابتك:{" "}
                              </Text>
                              <Text
                                className={`font-bold ${
                                  isCorrect ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {answers[question.id] || "لم تقدم إجابة"}
                              </Text>
                            </div>
                            {!isCorrect && (
                              <div className="p-4 bg-green-100 rounded-xl border-2 border-green-300">
                                <Text strong className="text-green-800">
                                  الإجابة الصحيحة:{" "}
                                </Text>
                                <Text className="text-green-800 font-bold">
                                  {question.correct_answer}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Card */}
        <Card className="mb-8 shadow-xl border-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white font-bold text-2xl">
                    {currentQuestionIndex + 1}
                  </span>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm font-bold">
                    تقدم السؤال
                  </Text>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentQuestionIndex + 1} من {questions.length}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <Text className="text-gray-600 text-sm font-bold">الإنجاز</Text>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {Math.round(
                    ((currentQuestionIndex + 1) / questions.length) * 100
                  )}
                  %
                </div>
              </div>
            </div>

            <Progress
              percent={Math.round(
                ((currentQuestionIndex + 1) / questions.length) * 100
              )}
              showInfo={false}
              status="active"
              strokeColor={{
                "0%": "#3b82f6",
                "100%": "#8b5cf6",
              }}
              trailColor="#f1f5f9"
              strokeWidth={12}
              className="mb-0"
            />
          </div>
        </Card>

        {/* Question Card */}
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white animate-fade-in-up">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white">
            <h1 className="text-white mb-6 leading-relaxed text-2xl font-bold animate-slide-in text-right">
              {currentQuestion.question_text}
            </h1>
            <div className="flex items-center gap-4 opacity-95 flex-wrap">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                {currentQuestion.question_type === "two_choices" && "🔄 خياران"}
                {currentQuestion.question_type === "four_choices" &&
                  "📋 اختيار متعدد"}
                {currentQuestion.question_type === "input" && "✍️ إجابة نصية"}
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-bold">
                السؤال {currentQuestionIndex + 1}
              </span>
            </div>
          </div>

          <div className="p-8">
            {(currentQuestion.question_type === "two_choices" ||
              currentQuestion.question_type === "four_choices") && (
              <Radio.Group
                onChange={(e) => handleAnswer(e.target.value)}
                value={answers[currentQuestion.id]}
                className="w-full"
                disabled={readOnly}
              >
                <div className="space-y-4">
                  {getSortedOptions(currentQuestion.options).map(
                    ([key, value], index) => (
                      <div
                        key={key}
                        className="group animate-slide-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <Radio value={key} className="w-full p-0 m-0">
                          <div
                            className={`
                          w-full p-6 border-2 rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.01]
                          ${
                            answers[currentQuestion.id] === key
                              ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-200"
                              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                          }
                          ${
                            readOnly && key === currentQuestion.correct_answer
                              ? "border-green-500 bg-green-50"
                              : ""
                          }
                        `}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`
                              w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300
                              ${
                                answers[currentQuestion.id] === key
                                  ? "bg-blue-500 text-white shadow-lg"
                                  : "bg-gray-200 text-gray-700 group-hover:bg-blue-100 group-hover:text-blue-700"
                              }
                              ${
                                readOnly &&
                                key === currentQuestion.correct_answer
                                  ? "bg-green-500 text-white"
                                  : ""
                              }
                            `}
                              >
                                {key.toUpperCase()}
                              </div>
                              <span className="text-lg text-gray-900 flex-1 font-medium text-right">
                                {value}
                              </span>
                              {readOnly &&
                                key === currentQuestion.correct_answer && (
                                  <CheckCircleOutlined className="text-green-600 text-2xl animate-bounce" />
                                )}
                            </div>
                          </div>
                        </Radio>
                      </div>
                    )
                  )}
                </div>
              </Radio.Group>
            )}

            {currentQuestion.question_type === "input" && (
              <div className="space-y-4 animate-fade-in">
                <Input
                  placeholder="اكتب إجابتك هنا..."
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  disabled={readOnly}
                  className="h-16 text-lg border-2 border-gray-300 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-lg"
                  size="large"
                />
                {readOnly && (
                  <div className="p-4 bg-green-50 border-2 border-green-300 rounded-2xl animate-slide-in">
                    <Text className="text-green-800 font-bold text-lg">
                      ✅ الإجابة الصحيحة: {currentQuestion.correct_answer}
                    </Text>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 pb-8">
            <div className="flex justify-between items-center gap-4">
              <Button
                onClick={handleNext}
                disabled={!readOnly && !answers[currentQuestion.id]}
                loading={isSubmitting}
                size="large"
                type="primary"
                className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:shadow-xl hover:scale-105 transition-all duration-300 rounded-xl font-bold text-base"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>{isLastQuestion ? "انهي الاختبار" : "التالي"}</span>
                  <span>{isLastQuestion ? "🎯" : "←"}</span>
                </span>
              </Button>

              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                size="large"
                className="flex-1 h-14 border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 rounded-xl font-bold text-base disabled:opacity-50"
              >
                <span className="flex items-center justify-center gap-2">
                  <span>→</span>
                  <span>السابق</span>
                </span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuizPreview;
