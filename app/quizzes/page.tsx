"use client";

import { useState } from "react";
import {
  Typography,
  Row,
  Col,
  Spin,
  Pagination,
  Button,
  Input,
  Tabs,
} from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import QuizCard from "@/components/quiz/QuizCard";
import { useQuizzes } from "@/api/hooks/useQuizzes";
import { useAdminQuizzes } from "@/api/hooks/useAdminQuizzes";
import { useAuth } from "@/lib/auth";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function QuizzesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [adminPage, setAdminPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminSearchTerm, setAdminSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("public");
  const pageSize = 9;
  const { user, isAdmin } = useAuth();

  // Public quizzes hook
  const {
    data: paginatedQuizzes,
    isLoading,
    error,
    isFetching,
  } = useQuizzes(currentPage, pageSize, true, searchTerm);

  // Admin quizzes hook
  const {
    data: adminQuizzes,
    isLoading: adminLoading,
    isFetching: adminFetching,
  } = useAdminQuizzes(adminPage, pageSize, adminSearchTerm);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAdminPageChange = (page: number) => {
    setAdminPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex justify-center items-center"
        dir="rtl"
      >
        <div className="text-center">
          <Title level={4} className="text-red-500 mb-4">
            عذراً! حدث خطأ ما
          </Title>
          <Paragraph className="text-gray-600">
            يرجى المحاولة مرة أخرى لاحقاً.
          </Paragraph>
        </div>
      </div>
    );
  }

  const quizzes = paginatedQuizzes?.data || [];
  const total = paginatedQuizzes?.total || 0;
  const adminQuizzesData = adminQuizzes?.data || [];
  const adminTotal = adminQuizzes?.total || 0;

  const showEmptyState =
    !isLoading &&
    quizzes.length === 0 &&
    (!isAdmin() || adminQuizzesData.length === 0);

  if (showEmptyState) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
        dir="rtl"
      >
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center py-20">
            <div className="mb-8">
              <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">📚</span>
              </div>
              <Title level={2} className="mb-4 text-gray-800">
                لا توجد اختبارات
              </Title>
              <Paragraph className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
                {isAdmin()
                  ? "هل أنت مستعد لإنشاء اختبارك الأول؟ لنبدأ!"
                  : "اكتشف اختبارات رائعة تم إنشاؤها من قبل مجتمعنا!"}
              </Paragraph>
            </div>
            {isAdmin() && (
              <Link href="/quizzes/new">
                <Button
                  type="primary"
                  size="large"
                  icon={<PlusOutlined />}
                  className="h-14 px-8 bg-gradient-to-r from-blue-500 to-purple-600 border-0 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  إنشاء اختبارك الأول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: "public",
      label: "الاختبارات المتاحة",
      children: (
        <div>
          <div className="text-center mb-12">
            <Paragraph className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              اختبر معرفتك، تحدى أصدقاءك، وتعلم شيئاً جديداً مع اختباراتنا
              التفاعلية
            </Paragraph>

            <div className="max-w-md mx-auto mb-8">
              <Input
                size="large"
                placeholder="ابحث عن الاختبارات..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-2xl hover:border-blue-400 focus:border-blue-500 transition-all duration-300 shadow-sm focus:shadow-lg"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Spin size="large" className="mb-4" />
                <Paragraph className="text-gray-600">
                  جارٍ تحميل الاختبارات الرائعة...
                </Paragraph>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {total}
                    </div>
                    <div className="text-sm text-gray-600">
                      الاختبارات المنشورة
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isFetching && <Spin className="ml-2" />}
                  <span className="text-sm text-gray-500">
                    عرض {(currentPage - 1) * pageSize + 1}-
                    {Math.min(currentPage * pageSize, total)} من {total}
                  </span>
                </div>
              </div>

              <div
                className={`transition-all duration-500 ${
                  isFetching ? "opacity-60" : "opacity-100"
                }`}
              >
                <Row gutter={[32, 32]}>
                  {quizzes.map((quiz, index) => (
                    <Col xs={24} md={12} lg={8} key={quiz.id}>
                      <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <QuizCard quiz={quiz} isPublic={true} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {total > pageSize && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={total}
                      onChange={handlePageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      disabled={isFetching}
                      className="custom-pagination"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  // Add admin tab if user is admin
  if (isAdmin()) {
    tabs.push({
      key: "my-quizzes",
      label: "اختباراتي",
      children: (
        <div>
          <div className="flex justify-between items-center mb-8">
            <div>
              <Input
                style={{ width: "300px" }}
                size="large"
                placeholder="ابحث في اختباراتك..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={adminSearchTerm}
                onChange={(e) => setAdminSearchTerm(e.target.value)}
                className="border-2 border-gray-200 rounded-lg"
              />
            </div>
            <Link href="/quizzes/new">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 font-bold"
              >
                إنشاء اختبار
              </Button>
            </Link>
          </div>

          {adminLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <Spin size="large" className="mb-4" />
                <Paragraph className="text-gray-600">
                  جارٍ تحميل اختباراتك...
                </Paragraph>
              </div>
            </div>
          ) : null}

          {!adminLoading && adminQuizzesData.length === 0 ? (
            <div dir="rtl" className="text-center py-20">
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">✍️</span>
                </div>
                <Title level={3} className="text-gray-800">
                  لم يتم إنشاء اختبارات بعد
                </Title>
                <Paragraph className="text-gray-600 mb-6">
                  ابدأ بإنشاء اختبارك الأول للبدء
                </Paragraph>
                <Link href="/quizzes/new">
                  <Button
                    type="primary"
                    size="large"
                    icon={<PlusOutlined />}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 font-bold"
                  >
                    إنشاء اختبارك الأول
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-sm">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {adminTotal}
                    </div>
                    <div className="text-sm text-gray-600">اختباراتي</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {adminFetching && <Spin className="ml-2" />}
                  <span className="text-sm text-gray-500">
                    عرض {(adminPage - 1) * pageSize + 1}-
                    {Math.min(adminPage * pageSize, adminTotal)} من {adminTotal}
                  </span>
                </div>
              </div>

              <div
                className={`transition-all duration-500 ${
                  adminFetching ? "opacity-60" : "opacity-100"
                }`}
              >
                <Row gutter={[32, 32]}>
                  {adminQuizzesData.map((quiz, index) => (
                    <Col xs={24} md={12} lg={8} key={quiz.id}>
                      <div
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <QuizCard quiz={quiz} isAdmin={true} />
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {adminTotal > pageSize && (
                <div className="flex justify-center mt-12">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 shadow-sm">
                    <Pagination
                      current={adminPage}
                      pageSize={pageSize}
                      total={adminTotal}
                      onChange={handleAdminPageChange}
                      showSizeChanger={false}
                      showQuickJumper
                      disabled={adminFetching}
                      className="custom-pagination"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ),
    });
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 shadow-2xl -mx-4">
          <Title
            level={1}
            className="!text-white !mb-4 !text-5xl !font-bold"
            style={{ color: "white" }}
          >
            {isAdmin() ? "إدارة الاختبارات" : "اكتشف الاختبارات الرائعة"}
          </Title>
          <Paragraph
            className="!text-white/90 !text-xl !mb-0"
            style={{ color: "white" }}
          >
            {isAdmin()
              ? "أنشئ، حرّر، وأدر اختباراتك في مكان واحد"
              : "اختبر معرفتك وتعلم مع مجتمعنا"}
          </Paragraph>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabs}
          size="large"
          className="bg-white/50 rounded-2xl p-6 border border-gray-200/50"
        />
      </div>
    </div>
  );
}
