"use client";

interface ImportHeaderProps {
  step: "upload" | "mapping" | "validation" | "progress" | "summary";
}

export function ImportHeader({ step }: ImportHeaderProps) {
  const steps: { key: ImportHeaderProps["step"]; label: string }[] = [
    { key: "upload", label: "Upload" },
    { key: "mapping", label: "Mapping" },
    { key: "validation", label: "Validation" },
    { key: "progress", label: "Import" },
    { key: "summary", label: "Summary" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 mb-10 px-2 transition-all">
      {steps.map((s, i) => {
        const isActive = i === currentIndex;
        const isCompleted = i < currentIndex;

        return (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border ${
                isCompleted
                  ? "bg-blue-600 text-white border-blue-600"
                  : isActive
                    ? "bg-blue-50 text-blue-700 border-blue-600"
                    : "bg-gray-100 text-gray-400 border-gray-300"
              }`}
            >
              {i + 1}
            </div>

            <span
              className={`text-sm ${
                isActive
                  ? "text-blue-700 font-semibold"
                  : isCompleted
                    ? "text-blue-500"
                    : "text-gray-500"
              }`}
            >
              {s.label}
            </span>

            {i < steps.length - 1 && (
              <div
                className={`hidden sm:block w-6 h-px ${
                  isCompleted ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
