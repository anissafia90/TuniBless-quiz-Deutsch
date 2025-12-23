"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Typography,
  Button,
  Form,
  Input,
  Card,
  message,
  Upload,
  Modal,
  Empty,
} from "antd";
import { useCreateQuiz } from "@/api/hooks/useAdminQuizzes";
import { useAuth } from "@/lib/auth";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from "uuid";
import { uploadCoverImage } from "@/lib/storage";
import Image from "next/image";

const { Title } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function NewQuizPage() {
  const router = useRouter();
  const createQuizMutation = useCreateQuiz();
  const { user, isAdmin } = useAuth();
  const [form] = Form.useForm();
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Redirect non-admins
  if (!isAdmin()) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
        dir="rtl"
      >
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
            <Empty
              description="غير مسموح بالدخول"
              style={{ marginTop: 48, marginBottom: 24 }}
            >
              <div className="text-center mb-6">
                <p className="text-lg text-gray-700 mb-4">
                  فقط المسؤولون يمكنهم إنشاء الاختبارات. إذا كنت مستخدمًا عاديًا
                  فيمكنك إجراء الاختبارات المنشورة.
                </p>
                <Button
                  type="primary"
                  size="large"
                  className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl font-bold"
                  onClick={() => router.push("/quizzes")}
                >
                  العودة إلى صفحة الاختبارات
                </Button>
              </div>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  const handleCreateQuiz = async (values: any) => {
    try {
      setUploading(true);
      const start = performance.now();
      console.log("Starting quiz creation...", {
        values,
        user,
        role: isAdmin(),
      });

      // Pre-generate quiz ID so we can avoid waiting for a returning select
      // Generate a valid UUID for the quiz id to satisfy DB uuid type
      const quizId = uuidv4();

      let coverImageUrl = null;

      // رفع صورة الغلاف إن تم اختيارها
      if (coverImage && user) {
        const uploadStart = performance.now();
        console.log("Uploading cover image...");
        coverImageUrl = await uploadCoverImage(coverImage, user.id);
        if (!coverImageUrl) {
          message.error("فشل رفع صورة الغلاف");
          console.error("Cover image upload failed");
          return;
        }
        console.log(
          "Cover image uploaded:",
          coverImageUrl,
          "in",
          `${(performance.now() - uploadStart).toFixed(0)}ms`
        );
      }

      const mutationStart = performance.now();
      console.log("Creating quiz with mutation...");
      const newQuiz = await createQuizMutation.mutateAsync({
        id: quizId,
        title: values.title,
        description: values.description,
        published: false,
        cover_image: coverImageUrl,
        author_id: user?.id || "",
      });

      console.log(
        "Quiz created successfully:",
        newQuiz,
        "in",
        `${(performance.now() - mutationStart).toFixed(0)}ms`
      );
      console.log(
        "Total creation time:",
        `${(performance.now() - start).toFixed(0)}ms`
      );
      message.success("تم إنشاء الاختبار بنجاح");
      router.push(`/quizzes/${newQuiz.id}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      const err = error as { message?: string };
      if (err?.message?.toLowerCase().includes("row-level security")) {
        message.error(
          "ليس لديك صلاحية لإدراج الاختبارات. تأكد أن دورك 'admin' في جدول المستخدمين."
        );
      } else {
        message.error(err?.message || "فشل إنشاء الاختبار");
      }
    } finally {
      console.log("Setting uploading to false");
      setUploading(false);
    }
  };

  const handleImageChange = (info: any) => {
    // We're not actually uploading here, just storing the file
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
        message.error("يمكنك فقط رفع ملفات الصور!");
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("يجب أن تكون الصورة أصغر من 2MB!");
      }
      return isImage && isLt2M ? false : Upload.LIST_IGNORE;
    },
    customRequest: ({ onSuccess }: any) => {
      setTimeout(() => {
        onSuccess("ok", null);
      }, 0);
    },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      dir="rtl"
    >
      <Card className="shadow-2xl rounded-3xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 -mx-6 -mt-6 px-6 py-8 text-white">
          <Title level={2} className="text-white mb-2 font-bold">
            إنشاء اختبار جديد
          </Title>
          <p className="opacity-90">قم بإضافة عنوان ووصف وصورة غلاف للاختبار</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateQuiz}
          className="px-2 py-6"
        >
          <Form.Item
            label={<span className="font-bold text-gray-700">العنوان</span>}
            name="title"
            rules={[{ required: true, message: "الرجاء إدخال العنوان" }]}
          >
            <Input placeholder="عنوان الاختبار" className="rounded-xl" />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-gray-700">الوصف</span>}
            name="description"
            rules={[{ required: true, message: "الرجاء إدخال الوصف" }]}
          >
            <TextArea
              rows={4}
              placeholder="وصف الاختبار"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={<span className="font-bold text-gray-700">صورة الغلاف</span>}
          >
            {previewImage ? (
              <div className="relative">
                <div
                  className="relative w-full h-48 mb-4 cursor-pointer"
                  onClick={() => setPreviewVisible(true)}
                >
                  <Image
                    src={previewImage || "/placeholder.svg"}
                    alt="معاينة الغلاف"
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCoverImage(null);
                    setPreviewImage(null);
                  }}
                  className="font-bold"
                >
                  تغيير الصورة
                </Button>
              </div>
            ) : (
              <Dragger
                {...uploadProps}
                onChange={handleImageChange}
                className="rounded-xl border-2 border-dashed hover:border-blue-400 bg-white"
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  انقر أو اسحب الصورة إلى هنا للتحميل
                </p>
                <p className="ant-upload-hint">
                  يدعم تحميل صورة واحدة فقط. يرجى رفع صورة أصغر من 2MB.
                </p>
              </Dragger>
            )}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl font-bold"
            >
              إنشاء الاختبار
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Modal
        open={previewVisible}
        title="معاينة صورة الغلاف"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        {previewImage && (
          <img
            alt="معاينة الغلاف"
            style={{ width: "100%" }}
            src={previewImage || "/placeholder.svg"}
          />
        )}
      </Modal>
    </div>
  );
}
