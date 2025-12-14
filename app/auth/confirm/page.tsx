import { Suspense } from "react"
import { ConfirmEmailContent } from "@/components/confirm-email-content"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <Suspense fallback={<div>Загрузка...</div>}>
        <ConfirmEmailContent />
      </Suspense>
    </div>
  )
}
