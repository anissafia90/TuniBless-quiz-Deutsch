"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { Session, User } from "@supabase/supabase-js"
import { Spin } from "antd"

type AuthContextType = {
  user: User | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any; data: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get session from Supabase
    const getSession = async () => {
      setIsLoading(true)
      const { data, error } = await supabase.auth.getSession()

      if (!error) {
        setSession(data.session)
        setUser(data.session?.user || null)
      }

      setIsLoading(false)
    }

    getSession()

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user || null)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (!error) {
      router.push("/quizzes")
    }
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isCheckingPublishedQuiz, setIsCheckingPublishedQuiz] = useState(false)
  const [isPublishedQuiz, setIsPublishedQuiz] = useState(false)

  useEffect(() => {
    // Check if the route is a published quiz route
    const checkIfPublishedQuiz = async () => {
      // Check if the route matches the pattern /quizzes/[id]/published
      const publishedQuizMatch = pathname.match(/\/quizzes\/([^/]+)\/published/)

      if (publishedQuizMatch) {
        setIsCheckingPublishedQuiz(true)
        const quizId = publishedQuizMatch[1]

        try {
          // Check if the quiz is published
          const { data, error } = await supabase.from("quizzes").select("published").eq("id", quizId).single()

          if (!error && data && data.published) {
            setIsPublishedQuiz(true)
          } else {
            setIsPublishedQuiz(false)
          }
        } catch (error) {
          console.error("Error checking if quiz is published:", error)
          setIsPublishedQuiz(false)
        }

        setIsCheckingPublishedQuiz(false)
      } else {
        setIsPublishedQuiz(false)
        setIsCheckingPublishedQuiz(false)
      }
    }

    checkIfPublishedQuiz()
  }, [pathname])

  useEffect(() => {
    // Only redirect if we're not checking a published quiz and we're not loading
    if (!isLoading && !isCheckingPublishedQuiz) {
      // Check if the route should be protected
      const isPublicRoute =
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname === "/" ||
        pathname.startsWith("/_next") ||
        isPublishedQuiz // Allow access to published quizzes

      if (!user && !isPublicRoute) {
        router.push("/login")
      }
    }
  }, [user, isLoading, router, pathname, isCheckingPublishedQuiz, isPublishedQuiz])

  if (isLoading || isCheckingPublishedQuiz) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    )
  }

  // For protected routes, only render children if authenticated or if it's a published quiz
  const isProtectedRoute =
    pathname !== "/login" &&
    pathname !== "/signup" &&
    !pathname.startsWith("/_next") &&
    pathname !== "/" &&
    !isPublishedQuiz

  if (isProtectedRoute && !user) {
    return null
  }

  return <>{children}</>
}
