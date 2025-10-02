"use server"

import { signIn as nextAuthSignIn } from "next-auth/react"
import { redirect } from "next/navigation"

// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const result = await nextAuthSignIn("credentials", {
      email: email.toString(),
      password: password.toString(),
      redirect: false,
    })

    if (result?.error) {
      return { error: "Invalid credentials" }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("fullName")

  if (!email || !password || !fullName) {
    return { error: "Email, password, and full name are required" }
  }

  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toString(),
        password: password.toString(),
        name: fullName.toString(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error }
    }

    return { success: "Account created successfully. Please sign in." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  redirect("/api/auth/signout")
}
