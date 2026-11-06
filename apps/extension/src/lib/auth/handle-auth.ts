import { API_BASE_URL, AUTH_TOKEN_KEY, USER_ID_KEY } from "../constants";
import type { ExtensionAuthSession } from "../types";
import { serverURL } from "../utils";
import { authClient } from "./auth-client";

const createRandomState = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(32));

  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

const getBearerToken = async () => {
  const result = await chrome.storage.local.get(AUTH_TOKEN_KEY);
  return result[AUTH_TOKEN_KEY] as string | undefined;
};

const clearLocalAuth = async () => {
  await chrome.storage.local.remove([AUTH_TOKEN_KEY, USER_ID_KEY]);
};

export const fetchWithAuth = async (url: string, init?: RequestInit) => {
  const token = await getBearerToken();
  if (!token) throw new Error("You are not authenticated.");

  const response = await fetch(url, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    await clearLocalAuth();
  }

  return response;
};

const exchangeOneTimeToken = async (token: string) => {
  let bearerToken: string | null = null;

  const result = await authClient.oneTimeToken.verify(
    { token },
    {
      onSuccess(context) {
        bearerToken = context.response.headers.get("set-auth-token");
      },
    },
  );
  if (result.error) throw new Error(result.error.message);

  if (!bearerToken)
    throw new Error("The server did not return an extension session.");

  await chrome.storage.local.set({
    focusMeAuthToken: bearerToken,
    focusMeUserId: result.data.user.id,
  });

  return result.data;
};

export const getAuthSession = async () => {
  const response = await fetchWithAuth(serverURL("/api/auth/get-session"));
  if (!response.ok)
    throw new Error(
      `Failed to check authentication status: ${response.status}`,
    );

  const session = (await response.json()) as ExtensionAuthSession | null;
  if (!session) {
    await clearLocalAuth();
    return null;
  }

  return session;
};

export const startWebSignIn = async () => {
  const state = createRandomState();

  const startURL = new URL("/extension/connect", API_BASE_URL);

  startURL.searchParams.set("state", state);

  const finalURL = await chrome.identity.launchWebAuthFlow({
    url: startURL.toString(),
    interactive: true,
  });

  if (!finalURL) throw new Error("Authentication was cancelled.");

  const callback = new URL(finalURL);
  const expectedCallback = new URL(chrome.identity.getRedirectURL("auth"));

  if (
    callback.origin !== expectedCallback.origin ||
    callback.pathname !== expectedCallback.pathname
  )
    throw new Error("Authentication returned to an invalid callback.");

  if (callback.searchParams.get("state") !== state)
    throw new Error("Authentication state mismatch.");

  const token = callback.searchParams.get("token");
  if (!token) throw new Error("Authentication did not return a token.");

  return exchangeOneTimeToken(token);
};

export const signOutExtension = async () => {
  const response = await fetchWithAuth(serverURL("/api/auth/sign-out"), {
    method: "POST",
  });
  if (!response.ok) throw new Error(`Sign out failed: ${response.status}`);

  await clearLocalAuth();
};
