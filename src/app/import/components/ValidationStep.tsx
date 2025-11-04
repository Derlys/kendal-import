"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Row } from "@/lib/mapping/types";

interface ValidationStepProps {
  data: Row[];
  mappings: Record<string, string>;
  onBack: () => void;
}

export function ValidationStep({
  data,
  mappings,
  onBack,
}: ValidationStepProps) {
  const [invalidRows, setInvalidRows] = useState<number[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    created: number;
    merged: number;
    skipped: number;
  } | null>(null);

  useEffect(() => {
    const invalids: number[] = [];
    data.forEach((row, index) => {
      const email = row[mappings["email"]];
      const phone = row[mappings["phone"]];
      if (!email && !phone) invalids.push(index);
    });
    setInvalidRows(invalids);
  }, [data, mappings]);

  const handleImport = async () => {
    setIsImporting(true);
    try {
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, mappings }),
      });
      const result = await response.json();
      setImportSummary(result.summary || null);
    } catch (error) {
      console.error("Import error:", error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-sm rounded-xl border">
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

      {importSummary ? (
        <div className="bg-gray-50 p-4 rounded-md mt-4 text-sm">
          <p>
            <b>Created:</b> {importSummary.created}
          </p>
          <p>
            <b>Merged:</b> {importSummary.merged}
          </p>
          <p>
            <b>Skipped:</b> {importSummary.skipped}
          </p>
        </div>
      ) : (
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? "Importing..." : "Start Import"}
          </Button>
        </div>
      )}
    </div>
  );
}
