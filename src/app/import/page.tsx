"use client";

import { useState } from "react";
import {MappingStep} from "@/app/import/components/MappingStep";
import {UploadStep} from "@/app/import/components/UploadStep";

export default function ImportPage() {
    const [step, setStep] = useState<"upload" | "mapping">("upload");
    const [importData, setImportData] = useState<any>(null);

    return (
        <div className="p-8 min-h-screen bg-gray-50">
            {step === "upload" && (
                <UploadStep
                    onNext={(data) => {
                        setImportData(data);
                        setStep("mapping");
                    }}
                />
            )}

            {step === "mapping" && importData && (
                <MappingStep
                    columns={importData.columns}
                    data={importData.data}
                    suggestions={importData.suggestions}
                    onBack={() => setStep("upload")}
                />
            )}
        </div>
    );
}
