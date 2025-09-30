export default function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="relative">
        {/* Spinner ring */}
        <div className="w-16 h-16 border-4 border-indigo-700 border-t-indigo-200 rounded-full animate-spin"></div>
      </div>
    </div>
  )
}
