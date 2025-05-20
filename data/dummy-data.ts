import type { Quiz, Question } from "@/lib/types"

// Generate more dummy quizzes for pagination testing
const generateDummyQuizzes = (count: number): Quiz[] => {
  const baseQuizzes = [
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description: "Test your knowledge of JavaScript basics",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: true,
      cover_image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2274&auto=format&fit=crop",
      author_id: "user1",
      questions: [
        {
          id: "101",
          quiz_id: "1",
          question_text: "Which of the following is NOT a JavaScript data type?",
          question_type: "four_choices",
          options: {
            a: "String",
            b: "Boolean",
            c: "Float",
            d: "Object",
          },
          correct_answer: "c",
          order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "102",
          quiz_id: "1",
          question_text: "Is JavaScript case-sensitive?",
          question_type: "two_choices",
          options: {
            a: "Yes",
            b: "No",
          },
          correct_answer: "a",
          order: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "103",
          quiz_id: "1",
          question_text: "What does DOM stand for?",
          question_type: "input",
          options: {},
          correct_answer: "Document Object Model",
          order: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: "2",
      title: "React Basics",
      description: "Learn the fundamentals of React",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: true,
      cover_image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop",
      author_id: "user1",
      questions: [
        {
          id: "201",
          quiz_id: "2",
          question_text: "What is JSX?",
          question_type: "four_choices",
          options: {
            a: "JavaScript XML",
            b: "JavaScript Extension",
            c: "Java Syntax XML",
            d: "JavaScript Extra",
          },
          correct_answer: "a",
          order: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
    {
      id: "3",
      title: "CSS Mastery",
      description: "Advanced CSS techniques and tricks",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: false,
      cover_image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?q=80&w=2071&auto=format&fit=crop",
      author_id: "user1",
      questions: [],
    },
    {
      id: "4",
      title: "TypeScript Essentials",
      description: "Everything you need to know about TypeScript",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: false,
      cover_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
      author_id: "user1",
      questions: [],
    },
    {
      id: "5",
      title: "Next.js Deep Dive",
      description: "Advanced concepts in Next.js",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: true,
      cover_image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=2300&auto=format&fit=crop",
      author_id: "user1",
      questions: [],
    },
    {
      id: "6",
      title: "UI/UX Design Principles",
      description: "Learn the fundamentals of good design",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: true,
      cover_image: "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=2080&auto=format&fit=crop",
      author_id: "user1",
      questions: [],
    },
  ]

  // If we need more than the base quizzes, generate additional ones
  if (count <= baseQuizzes.length) {
    return baseQuizzes.slice(0, count)
  }

  const additionalQuizzes: Quiz[] = []
  const topics = [
    "Python Programming",
    "Data Science",
    "Machine Learning",
    "Web Development",
    "Mobile App Development",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Blockchain",
    "Artificial Intelligence",
    "Game Development",
    "Database Management",
    "Network Engineering",
    "UX Research",
    "Product Management",
  ]

  const images = [
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2728&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2940&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1503437313881-503a91226402?q=80&w=2832&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2944&auto=format&fit=crop",
  ]

  for (let i = baseQuizzes.length + 1; i <= count; i++) {
    const topicIndex = (i - baseQuizzes.length - 1) % topics.length
    const imageIndex = (i - baseQuizzes.length - 1) % images.length

    additionalQuizzes.push({
      id: i.toString(),
      title: `${topics[topicIndex]} Quiz`,
      description: `Test your knowledge of ${topics[topicIndex]} with this comprehensive quiz.`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      published: i % 3 === 0, // Every third quiz is published
      cover_image: images[imageIndex],
      author_id: "user1",
      questions: [],
    })
  }

  return [...baseQuizzes, ...additionalQuizzes]
}

export const dummyQuizzes: Quiz[] = generateDummyQuizzes(20) // Generate 20 quizzes for testing pagination

export const getQuizById = (id: string): Quiz | undefined => {
  return dummyQuizzes.find((quiz) => quiz.id === id)
}

export const getQuizQuestions = (quizId: string): Question[] => {
  const quiz = dummyQuizzes.find((q) => q.id === quizId)
  return quiz?.questions || []
}

// This file is now replaced with actual Supabase API calls
