import { useQuery } from "@tanstack/react-query";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type MeResponse = {
  user: AuthUser;
};

async function fetchMe(): Promise<MeResponse | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
    { credentials: "include" }
  );

  if (res.status === 401) return null;

  const data = await res.json();
  return data;
}

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: 0,          // 🔥 IMPORTANT
    refetchOnWindowFocus: true,
  });
}
