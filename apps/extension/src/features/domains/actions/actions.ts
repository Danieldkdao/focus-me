import { sendRuntimeMessage } from "@/chrome/utils";

export const getDomains = async () => {
  const response = await sendRuntimeMessage("GET_DOMAINS");
  if (response.error) throw new Error(response.message);

  return response.data;
};
