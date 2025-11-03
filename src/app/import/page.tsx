"use client";

import { useState } from "react";
import { MappingStep } from "@/app/import/components/MappingStep";
import { UploadStep } from "@/app/import/components/UploadStep";
import { ImportPayload } from "@/lib/mapping/types";

export default function ImportPage() {
  const [step, setStep] = useState<"upload" | "mapping">("upload");
  const [importData, setImportData] = useState<ImportPayload | null>(null);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {step === "upload" && (
        <UploadStep
          onNext={(data: ImportPayload) => {
            setImportData(data);
            setStep("mapping");
          }}
        />
      )}

      {step === "mapping" && importData && (
        <MappingStep
          columns={importData.columns}
          suggestions={importData.suggestions}
          onBack={() => setStep("upload")}
        />
      )}
    </div>
  );
}
