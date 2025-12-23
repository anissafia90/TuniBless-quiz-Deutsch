"use client";

import type React from "react";
import { List, Typography, Button, Card, Space, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Question } from "@/lib/types";

const { Title, Text } = Typography;

interface QuestionListProps {
  questions: Question[];
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  onEdit,
  onDelete,
}) => {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "two_choices":
        return (
          <Tag color="blue" className="font-bold px-3 py-1 text-sm rounded-lg">
            خياران
          </Tag>
        );
      case "four_choices":
        return (
          <Tag
            color="purple"
            className="font-bold px-3 py-1 text-sm rounded-lg"
          >
            أربعة خيارات
          </Tag>
        );
      case "input":
        return (
          <Tag color="green" className="font-bold px-3 py-1 text-sm rounded-lg">
            إدخال نصي
          </Tag>
        );
      default:
        return (
          <Tag className="font-bold px-3 py-1 text-sm rounded-lg">
            غير معروف
          </Tag>
        );
    }
  };

  return (
    <div dir="rtl">
      <List
        dataSource={questions}
        renderItem={(question, index) => (
          <Card className="mb-6 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 p-4 border-b-2 border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {index + 1}
                  </div>
                  <Title level={5} className="mb-0 text-gray-900 font-bold">
                    السؤال {index + 1}
                  </Title>
                  {getQuestionTypeLabel(question.question_type)}
                </div>
                <Space size="small">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(question)}
                    className="hover:bg-blue-100 hover:text-blue-600 transition-all rounded-lg h-9 w-9 flex items-center justify-center"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onDelete(question.id)}
                    className="hover:bg-red-100 transition-all rounded-lg h-9 w-9 flex items-center justify-center"
                  />
                </Space>
              </div>
            </div>

            <div className="p-6">
              <Text className="text-lg text-gray-800 font-medium leading-relaxed block mb-4">
                {question.question_text}
              </Text>

              {(question.question_type === "two_choices" ||
                question.question_type === "four_choices") && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Text className="text-sm text-gray-600 font-bold mb-3 block">
                    الخيارات:
                  </Text>
                  <ul className="space-y-2 pr-5">
                    {Object.entries(question.options).map(([key, value]) => (
                      <li
                        key={key}
                        className={`text-base p-3 rounded-lg transition-all ${
                          key === question.correct_answer
                            ? "font-bold text-green-700 bg-green-50 border-2 border-green-300"
                            : "text-gray-700 bg-white border border-gray-200"
                        }`}
                      >
                        <span className="font-bold">{key.toUpperCase()}:</span>{" "}
                        {value as string}
                        {key === question.correct_answer && (
                          <span className="mr-2 text-green-600">✓ صحيح</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {question.question_type === "input" && (
                <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
                  <Text className="text-sm text-gray-600 font-bold mb-2 block">
                    الإجابة الصحيحة:
                  </Text>
                  <div className="pr-5 mt-2 font-bold text-green-700 text-lg flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    {question.correct_answer}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      />
    </div>
  );
};

export default QuestionList;
