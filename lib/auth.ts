"use server"

import { createClient } from "@/lib/supabase/server"

export type User = {
  id: string
  email: string
  display_name: string
  avatar_url?: string
}

export async function register(
  email: string,
  password: string,
  displayName: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/confirm`,
      data: {
        display_name: displayName,
      },
    },
  })

  if (authError) {
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: "Не удалось создать пользователя" }
  }

  // The profile will be created automatically by the trigger
  return {
    success: true,
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      display_name: displayName,
    },
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const supabase = await createClient()

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    // Проверяем конкретный тип ошибки
    if (authError.message.includes("Invalid login credentials")) {
      return {
        success: false,
        error: "Неверный email или пароль. Если у вас еще нет аккаунта, пожалуйста, зарегистрируйтесь.",
      }
    }
    if (authError.message.includes("Email not confirmed")) {
      return {
        success: false,
        error: "Пожалуйста, подтвердите email перед входом. Проверьте вашу почту.",
      }
    }
    return { success: false, error: authError.message }
  }

  if (!authData.user) {
    return { success: false, error: "Не удалось войти" }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single()

  if (profileError || !profile) {
    return { success: false, error: "Профиль не найден" }
  }

  return {
    success: true,
    user: {
      id: profile.id,
      email: profile.email,
      display_name: profile.display_name || "Пользователь",
      avatar_url: profile.avatar_url,
    },
  }
}

export async function logout(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) {
    return null
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

  if (error || !profile) {
    return null
  }

  return {
    id: profile.id,
    email: profile.email,
    display_name: profile.display_name || "Пользователь",
    avatar_url: profile.avatar_url,
  }
}
