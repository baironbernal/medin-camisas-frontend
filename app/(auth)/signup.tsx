import Link from "next/link";

export default function SignupPage() {
  return (
    <section className="mx-auto w-full max-w-md space-y-4">
      <h1 className="text-2xl font-semibold">Sign up</h1>
      <p className="text-sm text-foreground/70">
        This page is a placeholder. Connect it to your registration flow.
      </p>
      <div className="text-sm">
        <Link className="underline" href="/login">
          Already have an account?
        </Link>
      </div>
    </section>
  );
}

