import { Card } from "@/components/ui/card"

export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
      {/* Image Placeholder */}
      <div className="h-48 bg-slate-200 animate-pulse" />
      
      {/* Content Placeholder */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
        <div className="h-6 w-3/4 bg-slate-200 rounded animate-pulse" />
        <div className="mt-auto flex justify-between">
          <div className="h-6 w-16 bg-slate-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  )
}