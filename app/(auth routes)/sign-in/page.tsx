"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthRequest, login } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignInPage.module.css";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const SignInPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
 
    setError("");

    const formValues = Object.fromEntries(formData) as AuthRequest;


    try {
  const response = await login(formValues);
      if (response) {
        setUser(response);
        router.push("/profile");
  }
  
  
} catch (err: unknown) {
  const apiErr = err as ApiError;
  setError(apiErr.response?.data?.message || "Login failed");
}

  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
};

export default SignInPage;