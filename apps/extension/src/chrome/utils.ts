import type {
  RuntimeMessageResponseTypeMap,
  RuntimeMessageType,
} from "@/lib/types";

export const sendRuntimeMessage = <T extends RuntimeMessageType>(
  type: T,
): Promise<RuntimeMessageResponseTypeMap[T]> => {
  return chrome.runtime.sendMessage<{ type: RuntimeMessageType }>({
    type,
  });
};
