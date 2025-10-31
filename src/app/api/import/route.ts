import { NextResponse } from "next/server";
export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const summary = {
            created: 23,
            merged: 5,
            skipped: 2,
            total: 30,
        };

        return NextResponse.json(
            {
                success: true,
                message: "Mock import completed successfully.",
                fileName: body.fileName || "mock_contacts.csv",
                summary,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Mock Import Error:", error);
        return NextResponse.json(
            { success: false, message: "Mock import failed", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const mockImports = [
            {
                id: "imp_001",
                createdOn: "2025-10-31T10:32:00Z",
                created: 12,
                merged: 3,
                skipped: 1,
            },
            {
                id: "imp_002",
                createdOn: "2025-11-01T08:47:00Z",
                created: 23,
                merged: 5,
                skipped: 2,
            },
        ];

        return NextResponse.json(
            { success: true, imports: mockImports },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
