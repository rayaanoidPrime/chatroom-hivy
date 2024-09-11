import { getNewAccessToken } from "@/features/auth/auth.service"; // TODO
import { config } from "@/config";

const GUEST_USER = {
  user: {
    id: 0,
    username: "Guest",
    email: "guest@email.com",
  },
  token: "guesttoken",
};

export const useAuth = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["userToken"],
    queryFn: () => getNewAccessToken(),
    refetchInterval: config.accessTokenExpiry, // mark the cache as stale after access token expiry
    staleTime: config.accessTokenExpiry,
  });

  return { auth: data?.user || GUEST_USER.user, isLoading, error };
};

export const useAuthSetter = () => {
  const queryClient = useQueryClient();

  const setAuth = useCallback(
    (userResponse) => {
      queryClient.setQueryData(["userToken"], () => userResponse);
    },
    [queryClient]
  );

  const clearAuth = useCallback(() => {
    queryClient.setQueryData(["userToken"], () => null);
  }, [queryClient]);

  const loginAsGuest = useCallback(() => {
    queryClient.setQueryData(["userToken"], () => GUEST_USER);
  }, [queryClient]);

  return { setAuth, clearAuth, loginAsGuest };
};
