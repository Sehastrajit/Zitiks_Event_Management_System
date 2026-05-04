import { NextResponse } from "next/server";
import { powerLines } from "@/lib/power-lines";

export function GET() {
  return NextResponse.json(powerLines);
}
