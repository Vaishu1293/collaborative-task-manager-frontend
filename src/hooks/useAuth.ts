import { useQuery } from "@tanstack/react-query";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type MeResponse = { user: AuthUser };

async function fetchMe(): Promise<MeResponse | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
    credentials: "include",
  });

  // ✅ Not logged in is NOT an error
  if (res.status === 401) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch /auth/me");
  }

  return data as MeResponse;
}

export function useAuth() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchMe,
    staleTime: 30_000,
    retry: false, // ✅ don't spam backend with 401 retries
  });
}
