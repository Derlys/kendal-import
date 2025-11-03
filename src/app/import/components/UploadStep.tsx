"use client";

import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { UploadCloud } from "lucide-react";
import { autoMapHeaders } from "@/lib/mapping/heuristics";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type {FieldSuggestion, ImportPayload} from "@/lib/mapping/types";

interface UploadStepProps {
    onNext: (data: { columns: string[]; data: unknown[]; suggestions: FieldSuggestion[] }) => void;
}

export function UploadStep({ onNext }: UploadStepProps) {
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFile = (file: File) => {
        setFileName(file.name);

        const ext = file.name.split(".").pop()?.toLowerCase();
        if (ext === "csv") {
            Papa.parse(file, {
                header: true,
                complete: (results) => {
                    const columns = Object.keys(results.data[0] as Record<string, unknown>);
                    const suggestions = autoMapHeaders(columns);
                    onNext({ columns, data: results.data, suggestions });
                },
            });
        } else if (ext === "xlsx") {
            const reader = new FileReader();
            reader.onload = (e) => {
                const workbook = XLSX.read(e.target?.result, { type: "binary" });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const columns = Object.keys(jsonData[0] as Record<string, unknown>);
                const suggestions = autoMapHeaders(columns);
                onNext({ columns, data: jsonData, suggestions });
            };
            reader.readAsBinaryString(file);
        }
    };

    return (
        <Card className="max-w-lg mx-auto border-dashed border-2 border-gray-300 hover:border-indigo-400 transition-colors p-10 text-center bg-gray-50/50">
            <CardHeader>
                <UploadCloud className="w-10 h-10 mx-auto text-indigo-500 mb-2" />
                <h2 className="text-lg font-semibold text-gray-800">Upload Your File</h2>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                    Drag and drop your file here, or click the button below to browse.
                </p>

                <label className="inline-block cursor-pointer">
                    <input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx"
                        className="hidden"
                        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                    />

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        Choose File
                    </Button>

                </label>

                {fileName && (
                    <p className="text-sm text-gray-600 mt-3">
                        Selected file: <span className="font-medium">{fileName}</span>
                    </p>
                )}

                <p className="text-xs text-gray-400 mt-4">
                    Supported formats: <code>.csv</code> or <code>.xlsx</code>
                </p>
            </CardContent>
        </Card>
    );
}
