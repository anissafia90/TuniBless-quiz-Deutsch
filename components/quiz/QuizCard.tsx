"use client";

import type React from "react";
import { Card, Typography, Badge, Button } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  CalendarOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import type { Quiz } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import {
  useDeleteQuiz,
  useTogglePublishQuiz,
} from "@/api/hooks/useAdminQuizzes";
import { message, Modal } from "antd";

const { Title, Paragraph, Text } = Typography;

interface QuizCardProps {
  quiz: Quiz;
  isAdmin?: boolean;
  isPublic?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  isAdmin = false,
  isPublic = false,
}) => {
  const { user, isAdmin: userIsAdmin } = useAuth();
  const isOwner = user?.id === quiz.author_id;
  const deleteQuizMutation = useDeleteQuiz();
  const togglePublishMutation = useTogglePublishQuiz();

  const handleDelete = () => {
    Modal.confirm({
      title: "حذف الاختبار",
      content:
        "هل أنت متأكد أنك تريد حذف هذا الاختبار؟ لا يمكن التراجع عن هذا الإجراء.",
      okText: "حذف",
      okType: "danger",
      cancelText: "إلغاء",
      onOk() {
        deleteQuizMutation.mutate(quiz.id, {
          onSuccess: () => {
            message.success("تم حذف الاختبار بنجاح");
          },
          onError: () => {
            message.error("فشل حذف الاختبار");
          },
        });
      },
    });
  };

  const handleTogglePublish = () => {
    togglePublishMutation.mutate(
      { id: quiz.id, publish: !quiz.published },
      {
        onSuccess: () => {
          message.success(
            quiz.published ? "تم إلغاء نشر الاختبار" : "تم نشر الاختبار بنجاح"
          );
        },
        onError: () => {
          message.error("فشل تحديث الاختبار");
        },
      }
    );
  };

  return (
    <div className="group" dir="rtl">
      <Card
        hoverable
        className="h-full flex flex-col overflow-hidden rounded-3xl border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white"
        cover={
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={quiz.cover_image || "/placeholder.svg?height=200&width=400"}
              alt={quiz.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              {quiz.published ? (
                <Badge.Ribbon
                  text="منشور"
                  color="green"
                  className="animate-pulse font-bold"
                />
              ) : (
                isOwner && (
                  <Badge.Ribbon
                    text="مسودة"
                    color="orange"
                    className="font-bold"
                  />
                )
              )}
            </div>

            {/* Overlay Actions */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="flex gap-3">
                {isAdmin && isOwner && (
                  <Link href={`/quizzes/${quiz.id}`}>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      size="large"
                      className="bg-white/30 backdrop-blur-md border-white/40 text-white hover:bg-white/40 rounded-xl shadow-lg font-bold h-12 px-6"
                    >
                      تعديل
                    </Button>
                  </Link>
                )}
                {!isPublic && (
                  <Link
                    href={
                      quiz.published
                        ? `/quizzes/${quiz.id}/published`
                        : `/quizzes/${quiz.id}/preview`
                    }
                  >
                    <Button
                      type="primary"
                      icon={
                        quiz.published ? (
                          <PlayCircleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      size="large"
                      className="bg-white/30 backdrop-blur-md border-white/40 text-white hover:bg-white/40 rounded-xl shadow-lg font-bold h-12 px-6"
                    >
                      {quiz.published ? "ابدأ الاختبار" : "معاينة"}
                    </Button>
                  </Link>
                )}
                {isPublic && quiz.published && (
                  <Link href={`/quizzes/${quiz.id}/published`}>
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      size="large"
                      className="bg-white/30 backdrop-blur-md border-white/40 text-white hover:bg-white/40 rounded-xl shadow-lg font-bold h-12 px-6"
                    >
                      ابدأ الاختبار
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        }
        styles={{ body: { padding: 0 } }}
      >
        <div className="p-6 flex flex-col h-full">
          <div className="flex-grow">
            <Title
              level={4}
              className="mb-3 line-clamp-2 text-gray-900 font-bold group-hover:text-blue-600 transition-colors duration-300 text-right"
            >
              {quiz.title}
            </Title>
            <Paragraph className="text-gray-600 mb-4 line-clamp-3 leading-relaxed text-base text-right">
              {quiz.description}
            </Paragraph>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarOutlined className="text-base" />
              <Text className="text-sm font-medium">
                {new Date(quiz.created_at).toLocaleDateString("ar-EG")}
              </Text>
            </div>

            <div className="flex items-center gap-2">
              {isAdmin && isOwner ? (
                <div className="flex gap-2">
                  <Button
                    type="text"
                    size="middle"
                    onClick={handleTogglePublish}
                    loading={togglePublishMutation.isPending}
                    className="font-bold text-sm hover:bg-blue-50 hover:text-blue-600 rounded-lg px-4 h-9"
                  >
                    {quiz.published ? "إلغاء النشر" : "نشر"}
                  </Button>
                  <Button
                    type="text"
                    danger
                    size="middle"
                    icon={<DeleteOutlined />}
                    onClick={handleDelete}
                    loading={deleteQuizMutation.isPending}
                    className="font-bold hover:bg-red-50 rounded-lg h-9 w-9 flex items-center justify-center"
                  />
                </div>
              ) : quiz.published ? (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>مباشر</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuizCard;
