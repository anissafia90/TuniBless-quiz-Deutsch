"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Typography,
  Button,
  Spin,
  Input,
  Form,
  Card,
  Space,
  Modal,
  message,
  Upload,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EyeOutlined,
  CheckOutlined,
  InboxOutlined,
  StopOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { useQuiz } from "@/api/hooks/useQuiz";
import { useQuizQuestions } from "@/api/hooks/useQuestions";
import { useUpdateQuiz, useTogglePublishQuiz } from "@/api/hooks/useQuizzes";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useReorderQuestions,
} from "@/api/hooks/useQuestions";
import QuestionForm from "@/components/quiz/QuestionForm";
import SortableQuestionList from "@/components/quiz/SortableQuestionList";
import type { Question } from "@/lib/types";
import { useAuth } from "@/lib/auth";
import { uploadCoverImage } from "@/lib/storage";
import Image from "next/image";
import { CopyToClipboard } from "react-copy-to-clipboard";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function EditQuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;
  const { user } = useAuth();

  const { data: quiz, isLoading: isLoadingQuiz } = useQuiz(quizId);
  const { data: questions = [], isLoading: isLoadingQuestions } =
    useQuizQuestions(quizId);

  const updateQuizMutation = useUpdateQuiz();
  const togglePublishMutation = useTogglePublishQuiz();
  const createQuestionMutation = useCreateQuestion();
  const updateQuestionMutation = useUpdateQuestion();
  const deleteQuestionMutation = useDeleteQuestion(quizId);
  const reorderQuestionsMutation = useReorderQuestions(quizId);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form] = Form.useForm();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Set initial preview image from quiz data
  useEffect(() => {
    if (quiz?.cover_image) {
      setPreviewImage(quiz.cover_image);
    }

    // Set share URL
    if (quiz) {
      const baseUrl = window.location.origin;
      setShareUrl(`${baseUrl}/quizzes/${quizId}/published`);
    }
  }, [quiz, quizId]);

  // Check if user is the owner of the quiz
  useEffect(() => {
    if (quiz && user && quiz.author_id !== user.id) {
      message.error("You don't have permission to edit this quiz");
      router.push("/quizzes");
    }
  }, [quiz, user, router]);

  const handleUpdateQuiz = async (values: any) => {
    try {
      setUploading(true);
      let coverImageUrl = quiz?.cover_image || null;

      // Upload cover image if a new one was selected
      if (coverImage && user) {
        const newCoverImageUrl = await uploadCoverImage(coverImage, user.id);
        if (newCoverImageUrl) {
          coverImageUrl = newCoverImageUrl;
        } else {
          message.error("Failed to upload cover image");
          setUploading(false);
          return;
        }
      }

      await updateQuizMutation.mutateAsync({
        id: quizId,
        updates: {
          ...values,
          cover_image: coverImageUrl,
        },
      });

      message.success("Quiz updated successfully");
      setUploading(false);
    } catch (error) {
      message.error("Failed to update quiz");
      setUploading(false);
    }
  };

  const handleTogglePublish = async () => {
    if (!quiz?.published && questions.length === 0) {
      message.error("Cannot publish a quiz with no questions");
      return;
    }

    try {
      await togglePublishMutation.mutateAsync({
        id: quizId,
        publish: !quiz?.published,
      });

      message.success(
        quiz?.published
          ? "Quiz unpublished successfully"
          : "Quiz published successfully"
      );

      if (!quiz?.published) {
        // If we just published the quiz, redirect to the published view
        router.push(`/quizzes/${quizId}/published`);
      }
    } catch (error) {
      message.error(
        quiz?.published ? "Failed to unpublish quiz" : "Failed to publish quiz"
      );
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this question?",
      content: "This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteQuestionMutation.mutateAsync(questionId);
          message.success("Question deleted successfully");
        } catch (error) {
          message.error("Failed to delete question");
        }
      },
    });
  };

  const handleQuestionSubmit = async (data: any) => {
    try {
      if (editingQuestion) {
        await updateQuestionMutation.mutateAsync({
          id: editingQuestion.id,
          updates: data,
        });
        message.success("Question updated successfully");
      } else {
        await createQuestionMutation.mutateAsync({
          ...data,
          quiz_id: quizId,
          order: questions.length + 1,
        });
        message.success("Question added successfully");
      }
      setShowQuestionForm(false);
    } catch (error) {
      message.error("Failed to save question");
    }
  };

  const handleReorderQuestions = async (reorderedQuestions: Question[]) => {
    try {
      await reorderQuestionsMutation.mutateAsync(
        reorderedQuestions.map((q) => q.id)
      );
      message.success("Questions reordered successfully");
    } catch (error) {
      message.error("Failed to reorder questions");
    }
  };

  const handleImageChange = (info: any) => {
    setCoverImage(info.file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(info.file);
  };

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: "image/*",
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
      }
      return isImage && isLt2M ? false : Upload.LIST_IGNORE;
    },
    customRequest: ({ onSuccess }: any) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
  };

  if (isLoadingQuiz || isLoadingQuestions) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center">
        <Title level={4} className="text-red-500">
          Quiz not found
        </Title>
        <Paragraph>
          The quiz you're looking for doesn't exist or has been removed.
        </Paragraph>
        <Button type="primary" onClick={() => router.push("/quizzes")}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Edit Quiz</Title>
        <Space>
          {quiz.published && (
            <div className="flex items-center mr-4">
              <span className="mr-2">Share:</span>
              <CopyToClipboard
                text={shareUrl}
                onCopy={() => message.success("Link copied to clipboard!")}
              >
                <Tooltip title="Copy link">
                  <Button icon={<LinkOutlined />} />
                </Tooltip>
              </CopyToClipboard>
            </div>
          )}
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              router.push(
                `/quizzes/${quizId}/${quiz.published ? "published" : "preview"}`
              )
            }
          >
            {quiz.published ? "View" : "Preview"}
          </Button>
          <Button
            type={quiz.published ? "default" : "primary"}
            icon={quiz.published ? <StopOutlined /> : <CheckOutlined />}
            danger={quiz.published}
            onClick={handleTogglePublish}
            disabled={!quiz.published && questions.length === 0}
          >
            {quiz.published ? "Unpublish" : "Publish"}
          </Button>
        </Space>
      </div>

      <Card className="mb-8 shadow-sm hover:shadow-md transition-shadow">
        <Form
          layout="vertical"
          initialValues={{
            title: quiz.title,
            description: quiz.description,
          }}
          onFinish={handleUpdateQuiz}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input placeholder="Quiz title" className="text-lg" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please enter a description" }]}
          >
            <TextArea rows={4} placeholder="Quiz description" />
          </Form.Item>

          <Form.Item label="Cover Image">
            {previewImage ? (
              <div className="relative">
                <div
                  className="relative w-full h-48 mb-4 cursor-pointer rounded-lg overflow-hidden"
                  onClick={() => setPreviewVisible(true)}
                >
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCoverImage(null);
                    setPreviewImage(quiz?.cover_image || null);
                  }}
                >
                  Change Image
                </Button>
              </div>
            ) : (
              <Dragger
                {...uploadProps}
                onChange={handleImageChange}
                className="rounded-lg"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single image upload. Please upload an image
                  smaller than 2MB.
                </p>
              </Dragger>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading}>
              Update Quiz Details
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Questions (Drag to reorder)</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddQuestion}
        >
          Add Question
        </Button>
      </div>

      {showQuestionForm && (
        <QuestionForm
          initialData={editingQuestion || undefined}
          onSubmit={handleQuestionSubmit}
          onCancel={() => setShowQuestionForm(false)}
        />
      )}

      <SortableQuestionList
        questions={questions}
        onEdit={handleEditQuestion}
        onDelete={handleDeleteQuestion}
        onReorder={handleReorderQuestions}
      />

      <Modal
        open={previewVisible}
        title="Cover Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && (
          <img
            alt="Cover preview"
            style={{ width: "100%" }}
            src={previewImage || "/placeholder.svg"}
          />
        )}
      </Modal>
    </div>
  );
}
