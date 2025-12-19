import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { useRouter } from "next/router";
import Navbar from "./Navbar";

const queryClient = new QueryClient();

function AppInitializer({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { data: user, isLoading } = useAuth();

  // ✅ Connect socket ONLY if logged in
  useSocket(user?.user?.id);

  // ⛔ Redirect unauthenticated users
  if (
    !isLoading &&
    !user &&
    !["/login", "/signup"].includes(router.pathname)
  ) {
    router.replace("/login");
    return null;
  }

  return (
    <>
      <Navbar user={user?.user ?? null} />
      <Component {...pageProps} />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppInitializer {...props} />
    </QueryClientProvider>
  );
}
