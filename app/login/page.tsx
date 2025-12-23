"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Card, Form, Input, Button, Typography, Divider, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createUserRole } from "@/api/supabase/users";

const { Title, Text } = Typography;

export default function LoginPage() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      if (isSignUp) {
        const { error, data } = await signUp(values.email, values.password);
        if (error) {
          message.error(error.message);
        } else {
          // Create user role record - always "user" for new signups
          if (data?.user?.id) {
            await createUserRole(data.user.id, "user");
          }
          message.success(
            "تم إنشاء الحساب! يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك."
          );
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(values.email, values.password);
        if (error) {
          message.error(error.message);
        } else {
          message.success("تم تسجيل الدخول بنجاح!");
          router.push("/");
        }
      }
    } catch (error: any) {
      message.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50">
      <Card
        className="w-full max-w-md shadow-2xl rounded-3xl border-0 overflow-hidden"
        dir="rtl"
      >
        <div className="text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 -mx-6 -mt-6 px-6 py-8 text-white">
          <Title level={2} className="text-white mb-3 font-bold">
            {isSignUp ? "إنشاء حساب جديد" : "مرحباً بك"}
          </Title>
          <Text className="text-white text-base opacity-90">
            {isSignUp
              ? "سجل للوصول إلى الاختبارات"
              : "سجل دخولك للوصول إلى الاختبارات"}
          </Text>
        </div>

        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          className="px-2"
        >
          <Form.Item
            name="email"
            label={
              <span className="font-bold text-gray-700">
                📧 البريد الإلكتروني
              </span>
            }
            rules={[
              { required: true, message: "الرجاء إدخال بريدك الإلكتروني!" },
              {
                type: "email",
                message: "الرجاء إدخال عنوان بريد إلكتروني صحيح",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="أدخل بريدك الإلكتروني"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span className="font-bold text-gray-700">🔒 كلمة المرور</span>
            }
            rules={[
              { required: true, message: "الرجاء إدخال كلمة المرور!" },
              { min: 6, message: "يجب أن تكون كلمة المرور 6 أحرف على الأقل" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="أدخل كلمة المرور"
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              className="h-12 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-xl font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              {isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
            </Button>
          </Form.Item>
        </Form>

        <Divider plain className="text-gray-400 font-medium">
          أو
        </Divider>

        <div className="text-center pb-2">
          <Button
            type="link"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-600 hover:text-purple-600 font-medium text-base"
          >
            {isSignUp
              ? "هل لديك حساب بالفعل؟ سجل الدخول"
              : "ليس لديك حساب؟ سجل الآن"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
