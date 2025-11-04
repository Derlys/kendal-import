"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ProgressStep({
  total,
  onFinish,
}: {
  total: number;
  onFinish: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 10;
        return next <= 100 ? next : 100;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  // 🔧 Llamamos onFinish SOLO cuando el progreso llega a 100
  useEffect(() => {
    if (progress >= 100) {
      const delay = setTimeout(() => {
        onFinish();
      }, 400);
      return () => clearTimeout(delay);
    }
  }, [progress, onFinish]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-lg font-semibold mb-4">Importing Contacts...</h2>
      <div className="w-2/3 bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-sm text-gray-500">{progress}% completed</p>
      <Button variant="outline" disabled className="mt-6">
        Please wait...
      </Button>
    </div>
  );
}
