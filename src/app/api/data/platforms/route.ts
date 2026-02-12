import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const dir = path.join(process.cwd(), "data", "platforms");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const platforms = files.map((f) => {
    const content = fs.readFileSync(path.join(dir, f), "utf-8");
    return JSON.parse(content);
  });
  return NextResponse.json(platforms);
}
