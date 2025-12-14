import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { ProfileSettings } from "@/components/profile-settings"

export default async function ProfilePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6">
          <ProfileSettings user={user} />
        </div>
      </main>
    </div>
  )
}
