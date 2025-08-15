import { NextResponse } from "next/server"
dev
export async function GET() {
  return NextResponse.json({
    message: "API fonctionne !",
    timestamp: new Date().toISOString()
  })
}
