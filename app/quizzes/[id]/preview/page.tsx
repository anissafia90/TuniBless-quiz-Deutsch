"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Typography, Button, Spin, Space, message, Card } from "antd";
import { EditOutlined, CheckOutlined } from "@ant-design/icons";
import { useQuiz } from "@/api/hooks/useQuiz";
import { useQuizQuestions } from "@/api/hooks/useQuestions";
import { useTogglePublishQuiz } from "@/api/hooks/useAdminQuizzes";
import QuizPreview from "@/components/quiz/QuizPreview";
import { useAuth } from "@/lib/auth";
import Image from "next/image";

const { Title, Paragraph } = Typography;

export default function PreviewQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();

  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId);
  const { data: questions = [], isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId);
  const togglePublishMutation = useTogglePublishQuiz();

  useEffect(() => {
    if (quiz && user && quiz.author_id !== user.id) {
      message.error("ليست لديك صلاحية لمعاينة هذا الاختبار");
      router.push("/quizzes");
    }
  }, [quiz, user, router]);

  const handlePublish = async () => {
    if (questions.length === 0) {
      message.error("لا يمكن نشر اختبار بدون أسئلة");
      return;
    }

    await togglePublishMutation.mutateAsync({
      id: quizId,
      publish: true,
    });
    message.success("تم نشر الاختبار بنجاح");
    router.push(`/quizzes/${quizId}/published`);
  };

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
        <Title level={4} className="text-red-500">
          لم يتم العثور على الاختبار
        </Title>
        <Paragraph>الاختبار الذي تبحث عنه غير موجود أو تم حذفه.</Paragraph>
        <Button type="primary" onClick={() => router.push("/quizzes")}>
          العودة إلى الاختبارات
        </Button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="text-right">
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>معاينة الاختبار</Title>
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => router.push(`/quizzes/${quizId}`)}
          >
            تعديل
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handlePublish}
            disabled={questions.length === 0}
          >
            نشر
          </Button>
        </Space>
      </div>

      {quiz.cover_image && (
        <Card className="mb-6 overflow-hidden shadow-sm">
          <div className="relative h-48 w-full">
            <Image
              src={quiz.cover_image || "/placeholder.svg"}
              alt={quiz.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="mt-4">
            <Title level={3}>{quiz.title}</Title>
            <Paragraph>{quiz.description}</Paragraph>
          </div>
        </Card>
      )}

      <QuizPreview quiz={quiz} questions={questions} readOnly={true} />
    </div>
  );
}
