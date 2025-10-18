"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { checkSession, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthProvider.module.css";
import type { User } from "@/types/user";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

 
  useEffect(() => {
    setIsClient(true);
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const verifySession = async () => {
      try {
        const response = await checkSession();
        const user: User | null = response?.user ?? null;

        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
            await logout();
            router.push("/sign-in");
          }
        }
      } catch (err) {
        console.error("Session check failed:", err);
        clearIsAuthenticated();
        if (pathname.startsWith("/profile") || pathname.startsWith("/notes")) {
          await logout();
          router.push("/sign-in");
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [isClient, pathname, router, setUser, clearIsAuthenticated]);

  if (!isClient || loading) {
    return (
      <div className={css.loaderWrapper}>
        <span className={css.loader}></span>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
