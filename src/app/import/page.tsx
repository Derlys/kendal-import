"use client";

import { useState } from "react";
import { MappingStep } from "@/app/import/components/MappingStep";
import { UploadStep } from "@/app/import/components/UploadStep";
import { ValidationStep } from "@/app/import/components/ValidationStep";
import { ImportPayload } from "@/lib/mapping/types";

export default function ImportPage() {
  const [step, setStep] = useState<"upload" | "mapping" | "validation">(
    "upload",
  );
  const [importData, setImportData] = useState<ImportPayload | null>(null);
  const [finalMappings, setFinalMappings] = useState<Record<string, string>>(
    {},
  );

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
          onNext={(mappings) => {
            setFinalMappings(mappings);
            setStep("validation");
          }}
        />
      )}

      {step === "validation" && importData && (
        <ValidationStep
          data={importData.data}
          mappings={finalMappings}
          onBack={() => setStep("mapping")}
        />
      )}
    </div>
  );
}
