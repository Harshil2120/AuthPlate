import { Spinner as UISpinner } from "@/components/ui/spinner"

export default function Spinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex items-center gap-6">
        <UISpinner className="size-10 text-indigo-600" />
      </div>
    </div>
  )
}
