"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@/lib/mapping/types";

interface ValidationStepProps {
  data: Row[];
  mappings: Record<string, string>;
  onBack: () => void;
  onNext: () => void;
}

export function ValidationStep({
  data,
  mappings,
  onBack,
  onNext,
}: ValidationStepProps) {
  const [invalidRows, setInvalidRows] = useState<number[]>([]);

  useEffect(() => {
    const invalids: number[] = [];
    data.forEach((row, index) => {
      const email = row[mappings["email"]];
      const phone = row[mappings["phone"]];
      if (!email && !phone) invalids.push(index);
    });
    setInvalidRows(invalids);
  }, [data, mappings]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-sm rounded-xl border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Validation Summary</h2>

      {invalidRows.length > 0 ? (
        <p className="text-red-600 text-sm mb-4">
          ⚠️ {invalidRows.length} rows are missing both <b>email</b> and{" "}
          <b>phone</b> and will be skipped.
        </p>
      ) : (
        <p className="text-green-600 text-sm mb-4">
          ✅ All rows look valid. Ready to import!
        </p>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button onClick={onNext}>Start Import</Button>
      </div>
    </div>
  );
}
