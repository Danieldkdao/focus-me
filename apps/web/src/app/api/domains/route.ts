import { db } from "@/db/db";
import { getCurrentUser } from "@/lib/auth/helpers";
import { UNAUTHED_ERROR_MESSAGE } from "@/lib/constants";
import { DomainTable } from "@focus-me/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const { userId } = await getCurrentUser({ externalHeaders: req.headers });
  if (!userId) {
    return NextResponse.json(
      {
        error: true,
        message: UNAUTHED_ERROR_MESSAGE,
      },
      { status: 401 },
    );
  }

  const domains = await db
    .select()
    .from(DomainTable)
    .where(eq(DomainTable.userId, userId));

  return NextResponse.json({
    data: domains,
    error: false,
  });
};
