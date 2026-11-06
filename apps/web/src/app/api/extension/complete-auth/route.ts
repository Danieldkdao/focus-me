import { serverEnv } from "@/data/env/server";
import { auth } from "@/lib/auth/auth";
import { getCurrentUser } from "@/lib/auth/helpers";
import {
  INVALID_DATA_ERROR_MESSAGE,
  UNAUTHED_ERROR_MESSAGE,
} from "@/lib/constants";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { userId } = await getCurrentUser({ externalHeaders: req.headers });
  if (!userId) {
    return NextResponse.json(
      { message: UNAUTHED_ERROR_MESSAGE },
      { status: 401 },
    );
  }

  const formData = await req.formData();
  const state = formData.get("state");

  if (typeof state !== "string" || state.length < 32 || state.length > 256) {
    return NextResponse.json(
      {
        message: INVALID_DATA_ERROR_MESSAGE,
      },
      { status: 400 },
    );
  }

  const result = await auth.api.generateOneTimeToken({
    headers: req.headers,
  });

  const redirectURL = new URL(serverEnv.EXTENSION_REDIRECT_URL);

  redirectURL.searchParams.set("token", result.token);
  redirectURL.searchParams.set("state", state);

  return NextResponse.redirect(redirectURL, 303);
};
