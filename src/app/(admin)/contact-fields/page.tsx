"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

interface ContactField {
  id: string;
  label: string;
  key: string;
  type: string;
}

export default function ContactFieldsPage() {
  const [fields, setFields] = useState<ContactField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const snapshot = await getDocs(collection(db, "contactFields"));
        const fieldList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ContactField, "id">),
        }));
        setFields(fieldList);
      } catch (error) {
        console.error("Error fetching contact fields:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">📇 Contact Fields</h1>
      {loading ? (
        <p>Loading fields...</p>
      ) : fields.length === 0 ? (
        <p>No contact fields found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Label</th>
              <th className="border p-2 text-left">Key</th>
              <th className="border p-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((f) => (
              <tr key={f.id}>
                <td className="border p-2">{f.label}</td>
                <td className="border p-2">{f.key}</td>
                <td className="border p-2">{f.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
