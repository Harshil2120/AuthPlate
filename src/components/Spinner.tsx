import { Spinner as UISpinner } from "@/components/ui/spinner"

export default function Spinner() {
  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center">
      <div className="flex items-center gap-6">
        <UISpinner className="size-10 text-indigo-600" />
      </div>
    </div>
  )
}
