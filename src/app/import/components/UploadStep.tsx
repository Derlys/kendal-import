"use client";

import Papa from "papaparse";
import * as XLSX from "xlsx";
import { autoMapHeaders } from "@/lib/mapping/heuristics";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { ImportPayload, FieldSuggestion, Row } from "@/lib/mapping/types";

const SYSTEM_FIELDS = [
  "id",
  "created_on",
  "createdOn",
  "updated_at",
  "updatedOn",
];

export function UploadStep({
  onNext,
}: {
  onNext: (data: ImportPayload) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();

    if (!ext || !["csv", "xlsx"].includes(ext)) {
      alert("Please upload a valid .csv or .xlsx file");
      return;
    }

    if (ext === "csv") {
      Papa.parse<Row>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data.filter(
            (row) => Object.keys(row).length > 0,
          );
          if (!data.length) {
            alert("The file seems empty or invalid.");
            return;
          }

          const rawColumns = Object.keys(data[0]);
          const filteredColumns = rawColumns.filter(
            (col) => !SYSTEM_FIELDS.includes(col),
          );
          const suggestions = autoMapHeaders(filteredColumns);

          const payload: ImportPayload = {
            columns: filteredColumns,
            data,
            suggestions,
          };

          onNext(payload);
        },
      });
    } else if (ext === "xlsx") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target?.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json<Row>(sheet);

        if (!jsonData.length) {
          alert("The file seems empty or invalid.");
          return;
        }

        const rawColumns = Object.keys(jsonData[0]);
        const filteredColumns = rawColumns.filter(
          (col) => !SYSTEM_FIELDS.includes(col),
        );
        const suggestions = autoMapHeaders(filteredColumns);

        const payload: ImportPayload = {
          columns: filteredColumns,
          data: jsonData,
          suggestions,
        };

        onNext(payload);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div className="p-8 border rounded-xl text-center bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <h2 className="text-xl font-semibold mb-3">Upload your contacts file</h2>
      <p className="text-sm text-gray-500 mb-6">
        Supported formats: <strong>.csv</strong> or <strong>.xlsx</strong>
      </p>

      <input
        type="file"
        accept=".csv,.xlsx"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
      >
        Choose File
      </Button>

      <p className="text-xs text-muted-foreground mt-3">
        The system will automatically suggest field mappings after upload.
      </p>
    </div>
  );
}
