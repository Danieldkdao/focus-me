import { db } from "@/db/db";
import { DomainTable } from "@focus-me/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  // todo: check auth permissions
  // todo: add more filtered query

  const domains = await db.select().from(DomainTable);

  return NextResponse.json({
    data: domains,
    error: false,
  });
};
