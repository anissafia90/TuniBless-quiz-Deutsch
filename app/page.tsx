"use client";

import {
  Button,
  Card,
  Row,
  Col,
  Statistic,
  Space,
  Badge,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  RocketOutlined,
  BarChartOutlined,
  TeamOutlined,
  TrophyOutlined,
  BulbOutlined,
  FileTextOutlined,
  GlobalOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const germanLevels = [
  {
    level: "A1",
    title: "المبتدئ",
    description: "الأساسيات والمفردات الأساسية",
    color: "green",
    icon: "🟢",
  },
  {
    level: "A2",
    title: "المبتدئ المتقدم",
    description: "التواصل البسيط والحوارات اليومية",
    color: "blue",
    icon: "🔵",
  },
  {
    level: "B1",
    title: "المتوسط",
    description: "التعبير عن الآراء والقضايا العامة",
    color: "cyan",
    icon: "🔹",
  },
  {
    level: "B2",
    title: "المتوسط المتقدم",
    description: "النقاشات المتقدمة والمجالات المتخصصة",
    color: "purple",
    icon: "🟣",
  },
  {
    level: "C1",
    title: "متقدم",
    description: "التعبير السلس والمرن عن الأفكار المعقدة",
    color: "orange",
    icon: "🟠",
  },
  {
    level: "C2",
    title: "الكفاءة العالية",
    description: "إتقان اللغة والفهم الدقيق للفروقات الدقيقة",
    color: "red",
    icon: "🔴",
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-amber-50"
    >
      {/* Hero Section */}
      <section className="pt-20 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <Badge
              count="جديد"
              style={{ backgroundColor: "#ff4d4f" }}
              className="text-lg"
            />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-amber-600 to-red-600 bg-clip-text text-transparent">
            تعلم اللغة الألمانية مع TuniBless
          </h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            من A1 إلى C2
          </h2>
          <p className="text-xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            منصة متخصصة لاختبار وتطوير مهاراتك في اللغة الألمانية مع أعضاء جمعية
            TuniBless
          </p>
          <Space size="large">
            {user ? (
              <Link href="/quizzes">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-12 text-lg bg-gradient-to-r from-blue-500 to-amber-600 border-0 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  ابدأ الاختبارات
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-12 text-lg bg-gradient-to-r from-blue-500 to-amber-600 border-0 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  دخول / تسجيل
                </Button>
              </Link>
            )}
          </Space>
        </div>

        {/* Association Badge */}
        <div className="mt-16 max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 rounded-2xl bg-gradient-to-r from-blue-50 to-amber-50">
            <div className="text-center">
              <UsergroupAddOutlined className="text-5xl text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                جمعية TuniBless
              </h3>
              <p className="text-gray-600 mb-4">
                منصة تعليمية حصرية لأعضاء الجمعية
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge
                  count="6"
                  showZero
                  style={{ backgroundColor: "#1890ff" }}
                  className="text-lg"
                />
                <span className="text-gray-600 font-medium">
                  مستويات لغة معترف بها دوليًا
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* German Levels Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">
            🎯 اختبر مستواك في اللغة الألمانية
          </h2>
          <p className="text-center text-gray-600 text-lg mb-16">
            6 اختبارات موزعة على جميع المستويات من CEFR
          </p>
          <Row gutter={[32, 32]}>
            {germanLevels.map((levelData, idx) => (
              <Col key={idx} xs={24} sm={12} lg={8}>
                <Link href={user ? "/quizzes" : "/login"}>
                  <Card
                    className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 hover:scale-105 cursor-pointer"
                    hoverable
                    cover={
                      <div className="bg-gradient-to-b from-blue-100 to-blue-50 p-8 text-center">
                        <div className="text-6xl mb-4">{levelData.icon}</div>
                        <h3 className="text-4xl font-bold text-gray-800">
                          {levelData.level}
                        </h3>
                      </div>
                    }
                  >
                    <div className="text-center">
                      <h4 className="text-xl font-bold mb-2 text-gray-900">
                        {levelData.title}
                      </h4>
                      <p className="text-gray-600 mb-6">
                        {levelData.description}
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                          <FileTextOutlined className="text-blue-600" />
                          <span>1 اختبار شامل</span>
                        </div>
                        <Button
                          type="primary"
                          block
                          className="bg-gradient-to-r from-blue-500 to-amber-600 border-0 rounded-lg h-10 font-semibold hover:shadow-lg transition-all"
                        >
                          ابدأ الاختبار
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            ✨ مميزات المنصة
          </h2>
          <Row gutter={[32, 32]}>
            {[
              {
                icon: <TeamOutlined className="text-4xl text-pink-600" />,
                title: "مجتمع تعليمي",
                desc: "تعلم مع أعضاء جمعية تونيبليس الآخرين",
              },
              {
                icon: <BulbOutlined className="text-4xl text-yellow-600" />,
                title: "محتوى حديث",
                desc: "اختبارات محدثة تعكس استخدام اللغة الفعلي",
              },
              {
                icon: (
                  <CheckCircleOutlined className="text-4xl text-teal-600" />
                ),
                title: "نتائج فورية",
                desc: "احصل على نتائجك بشكل فوري مع تحليل تفصيلي",
              },
            ].map((feature, idx) => (
              <Col key={idx} xs={24} sm={12} lg={8}>
                <Card
                  className="h-full shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl border-0 hover:scale-105"
                  hoverable
                >
                  <div className="text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-amber-600">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            📊 إحصائيات المنصة
          </h2>
          <Row gutter={[32, 32]}>
            {[
              { value: "6", label: "مستويات لغة" },
              { value: "6", label: "اختبار متخصص" },
              { value: "جديد", label: "المنصة" },
              { value: "∞", label: "فرصة محاولات" },
            ].map((stat, idx) => (
              <Col key={idx} xs={12} sm={6} lg={6}>
                <div className="text-center text-white">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <p className="text-lg text-blue-100">{stat.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="shadow-2xl rounded-3xl border-0 bg-gradient-to-r from-blue-50 to-amber-50">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">
              🚀 هل أنت مستعد؟
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              اختبر مستواك الحقيقي في اللغة الألمانية واحصل على نتائج موثوقة
            </p>
            {user ? (
              <Link href="/quizzes">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-12 text-lg bg-gradient-to-r from-blue-500 to-amber-600 border-0 rounded-xl font-bold shadow-lg hover:shadow-xl"
                >
                  ابدأ الاختبار الآن
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button
                  type="primary"
                  size="large"
                  className="h-14 px-12 text-lg bg-gradient-to-r from-blue-500 to-amber-600 border-0 rounded-xl font-bold shadow-lg hover:shadow-xl"
                >
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
