import { useQuery } from "@tanstack/react-query";

/* =========================
   TYPES
========================= */
export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type MeResponse = {
  user: AuthUser | null;
};

/* =========================
   FETCH /auth/me
========================= */
async function fetchMe(): Promise<MeResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`,
    {
      credentials: "include",
    }
  );

  // ✅ Not logged in is a valid state
  if (res.status === 401) {
    return { user: null };
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch auth user");
  }

  return data as MeResponse;
}

/* =========================
   AUTH HOOK
========================= */
export function useAuth() {
  return useQuery<MeResponse>({
    queryKey: ["me"], // 🔥 SINGLE SOURCE OF TRUTH
    queryFn: fetchMe,
    staleTime: 30_000, // 30s cache
    retry: false,      // don't retry on 401
  });
}
