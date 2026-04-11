import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { register as registerApi } from "../../api/auth.api";
import { useAuthStore } from "../../store/authStore";

const schema = z
  .object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

type Form = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { register, handleSubmit, formState } = useForm<Form>({ resolver: zodResolver(schema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-agri-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-agri-border bg-agri-card p-8">
        <h1 className="text-2xl font-semibold text-agri-primary">Create account</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            try {
              const res = await registerApi(values);
              setAuth(res.user, res.accessToken);
              toast.success("Account created");
              navigate("/dashboard");
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Registration failed");
            }
          })}
        >
          <div>
            <label className="text-sm text-white/70">Full name</label>
            <input className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2" {...register("fullName")} />
          </div>
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2" {...register("email")} />
          </div>
          <div>
            <label className="text-sm text-white/70">Password</label>
            <input type="password" className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2" {...register("password")} />
          </div>
          <div>
            <label className="text-sm text-white/70">Confirm password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border border-agri-border bg-agri-surface px-3 py-2"
              {...register("confirmPassword")}
            />
            {formState.errors.confirmPassword && (
              <p className="mt-1 text-xs text-agri-red">{formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <button type="submit" className="w-full rounded-md bg-agri-primary px-3 py-2 text-sm font-semibold text-black">
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-white/60">
          Already have an account?{" "}
          <Link className="text-agri-primary" to="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
