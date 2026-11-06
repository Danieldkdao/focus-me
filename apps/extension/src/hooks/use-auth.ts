import { sendRuntimeMessage } from "@/chrome/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const response = await sendRuntimeMessage("GET_AUTH_SESSION");

      if (response.error) throw new Error(response.message);

      return response.data;
    },
  });

  const signInMutation = useMutation({
    mutationFn: async () => {
      const response = await sendRuntimeMessage("START_WEB_SIGN_IN");
      if (response.error) throw new Error(response.message);

      return response.data;
    },
    onSuccess: (session) => {
      queryClient.setQueryData(["auth-session"], session);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await sendRuntimeMessage("SIGN_OUT");
      if (response.error) throw new Error(response.message);
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth-session"], null);
      queryClient.removeQueries({ queryKey: ["domains"] });
    },
  });

  return {
    session: data,
    isSessionPending: isPending,
    signIn: signInMutation,
    signOut: signOutMutation,
  };
};
