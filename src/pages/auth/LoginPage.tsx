import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { login } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type Form = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-agri-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-agri-border bg-agri-card p-8">
        <h1 className="text-2xl font-semibold text-agri-primary">Sign in</h1>
        <p className="mt-2 text-sm text-white/70">AgriVision XAI</p>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              const res = await login(values);
              setAuth(res.user, res.accessToken);
              toast.success("Welcome back");
              navigate("/dashboard");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Login failed");
            }
          })}
        >
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2" {...register("email")} />
            {formState.errors.email && (
              <p className="mt-1 text-xs text-agri-red">{formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              {...register("password")}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-agri-primary px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            disabled={formState.isSubmitting}
          >
            Continue
          </button>
        </form>
        <p className="mt-4 text-sm text-white/60">
          New here?{" "}
          <Link className="text-agri-primary" to="/register">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
