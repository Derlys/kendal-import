"use client";

import { useState } from "react";
import { MappingStep } from "@/app/import/components/MappingStep";
import { UploadStep } from "@/app/import/components/UploadStep";
import { ValidationStep } from "@/app/import/components/ValidationStep";
import { ImportPayload } from "@/lib/mapping/types";
import { ProgressStep } from "@/app/import/components/ProgressStep";
import { SummaryStep } from "@/app/import/components/SummaryStep";
import { ImportHeader } from "@/app/import/components/ImportHeader";

export default function ImportPage() {
  const [step, setStep] = useState<
    "upload" | "mapping" | "validation" | "progress" | "summary"
  >("upload");
  const [importData, setImportData] = useState<ImportPayload | null>(null);
  const [finalMappings, setFinalMappings] = useState<Record<string, string>>(
    {},
  );
  const [summary, setSummary] = useState<{
    created: number;
    merged: number;
    skipped: number;
  } | null>(null);

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <ImportHeader step={step} />
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
          onNext={async () => {
            setStep("progress");
            const res = await fetch("/api/import", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                data: importData.data,
                mappings: finalMappings,
              }),
            });

            const json = await res.json();
            setSummary(json.summary);
            setStep("summary");
          }}
        />
      )}
      {step === "progress" && (
        <ProgressStep
          total={importData?.data.length ?? 0}
          onFinish={() => setStep("summary")}
        />
      )}

      {step === "summary" && summary && (
        <SummaryStep summary={summary} onRestart={() => setStep("upload")} />
      )}
    </div>
  );
}
