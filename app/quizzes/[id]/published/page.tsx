"use client";

import { useParams, useRouter } from "next/navigation";
import { Typography, Button, Spin, Result, Card } from "antd";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { useQuiz } from "@/api/hooks/useQuiz";
import { useQuizQuestions } from "@/api/hooks/useQuestions";
import QuizPreview from "@/components/quiz/QuizPreview";
import Link from "next/link";
import Image from "next/image";

const { Title, Paragraph } = Typography;

export default function PublishedQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId, true); // Pass true to indicate this is a public route
  const { data: questions = [], isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId, true); // Pass true to indicate this is a public route

  if (isLoadingQuiz || isLoadingQuestions) {
    return (
      <div dir="rtl" className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div dir="rtl" className="text-center">
        <Result
          status="404"
          title="الاختبار غير موجود"
          subTitle="الاختبار الذي تبحث عنه غير موجود أو تم حذفه."
          extra={
            <Link href="/quizzes">
              <Button type="primary" icon={<HomeOutlined />}>
                العودة إلى الاختبارات
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (!quiz.published) {
    return (
      <div dir="rtl" className="text-center">
        <Result
          status="warning"
          title="الاختبار غير منشور"
          subTitle="هذا الاختبار لم يتم نشره بعد."
          extra={
            <Link href="/quizzes">
              <Button type="primary" icon={<HomeOutlined />}>
                العودة إلى الاختبارات
              </Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-right"
    >
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/quizzes">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              className="h-12 px-6 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-blue-300 transition-all duration-200 rounded-xl shadow-sm"
            >
              <span className="ml-2">العودة إلى الاختبارات</span>
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        {quiz.cover_image ? (
          <Card className="mb-8 shadow-xl border-0 rounded-3xl overflow-hidden bg-white">
            <div className="relative h-80 w-full">
              <Image
                src={quiz.cover_image || "/placeholder.svg"}
                alt={quiz.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-3xl text-right">
                  <Title
                    level={1}
                    className="text-white mb-4 text-4xl md:text-5xl font-bold leading-tight"
                  >
                    {quiz.title}
                  </Title>
                  <Paragraph className="text-white/90 text-xl mb-4 leading-relaxed">
                    {quiz.description}
                  </Paragraph>
                  <div className="flex items-center gap-4 text-white/80">
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      📅 {new Date(quiz.created_at).toLocaleDateString()}
                    </span>
                    <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      ✨ اختبار منشور
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="mb-8 shadow-xl border-0 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="p-12 text-center text-white">
              <Title
                level={1}
                className="text-white mb-6 text-4xl md:text-5xl font-bold"
              >
                {quiz.title}
              </Title>
              <Paragraph className="text-white/90 text-xl mb-6 max-w-3xl mx-auto leading-relaxed">
                {quiz.description}
              </Paragraph>
              <div className="flex items-center justify-center gap-4 text-white/80">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  📅 {new Date(quiz.created_at).toLocaleDateString()}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                  ✨ اختبار منشور
                </span>
              </div>
            </div>
          </Card>
        )}

        {/* Quiz Content */}
        <QuizPreview quiz={quiz} questions={questions} />
      </div>
    </div>
  );
}
