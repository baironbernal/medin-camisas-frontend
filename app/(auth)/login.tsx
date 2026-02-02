import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Login</h1>
      <p className="text-sm text-foreground/70">
        This page is a placeholder. Connect it to your auth flow.
      </p>
      <div className="text-sm">
        <Link className="underline" href="/signup">
          Create an account
        </Link>
      </div>
    </section>
  );
}

