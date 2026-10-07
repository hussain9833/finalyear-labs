import { Suspense } from "react";
import { LogoMark } from "@/components/layout/logo";
import { siteConfig } from "@/lib/site";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  return (
    <main className="grid min-h-dvh place-items-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LogoMark className="size-11" />
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">Sign in to {siteConfig.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Admin access only</p>
        </div>
        <Suspense>
          <LoginForm nextPromise={searchParams.then((sp) => (typeof sp.next === "string" ? sp.next : undefined))} />
        </Suspense>
      </div>
    </main>
  );
}
