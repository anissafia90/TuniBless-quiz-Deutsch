"use client";

import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  ConfigProvider,
  Layout,
  Menu,
  Typography,
  Button,
  Dropdown,
} from "antd";
import {
  BookOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { theme } from "@/lib/theme";
import { useAuth, AuthGuard } from "@/lib/auth";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function AppHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const userMenu = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: signOut,
    },
  ];

  return (
    <Header className="flex items-center justify-between px-6 bg-white border-b">
      <div className="flex items-center">
        <Title level={3} className="m-0 mr-8">
          Quiz Platform
        </Title>
        <Menu
          mode="horizontal"
          selectedKeys={[pathname || "/"]}
          className="border-b-0 flex-1"
          items={[
            {
              key: "/",
              icon: <HomeOutlined />,
              label: <Link href="/">Home</Link>,
            },
            {
              key: "/quizzes",
              icon: <BookOutlined />,
              label: <Link href="/quizzes">Quizzes</Link>,
            },
          ]}
        />
      </div>
      <div className="flex items-center">
        {user ? (
          <>
            <Link href="/quizzes/new" className="mr-4">
              <Button type="primary" icon={<PlusOutlined />}>
                New Quiz
              </Button>
            </Link>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
              <Button icon={<UserOutlined />} shape="circle" />
            </Dropdown>
          </>
        ) : (
          <Link href="/login">
            <Button type="primary">Login</Button>
          </Link>
        )}
      </div>
    </Header>
  );
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <AuthGuard>
          <Layout className="min-h-screen">
            <AppHeader />
            <Content className="p-6 bg-gray-50">
              <div className="max-w-7xl mx-auto">{children}</div>
            </Content>
            <Footer className="text-center">
              Quiz Platform ©{new Date().getFullYear()} Created with Next.js
            </Footer>
          </Layout>
        </AuthGuard>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
