"use client";
import { Card } from "./ui/card";

export default function ServiceSkeleton() {
  return (
    <Card className="rounded-[2.5rem] p-3.5 border border-slate-50 bg-white animate-pulse">
      <div className="w-full aspect-video bg-slate-100 rounded-[1.8rem] mb-2.5" />
      
      <div className="space-y-1.5 px-0.5">
        <div className="h-4 w-3/4 bg-slate-100 rounded-lg" />
        <div className="space-y-1">
          <div className="h-2 w-full bg-slate-50 rounded" />
          <div className="h-2 w-4/5 bg-slate-50 rounded" />
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-50 space-y-2">
        <div className="h-3 w-14 bg-blue-50/50 rounded-md" />
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="h-7 w-7 bg-slate-50 rounded-xl" />
            <div className="h-7 w-7 bg-slate-50 rounded-xl" />
          </div>
          <div className="h-7 w-16 bg-slate-50 rounded-xl" />
        </div>
      </div>
    </Card>
  );
}