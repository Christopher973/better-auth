"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import Link from "next/link";
import { signIn } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { CircleAlert, XIcon } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Veuillez saisir votre adresse email." })
    .email({
      message: "Veuillez entrer une adresse email valide.",
    }),
  password: z.string().min(1, {
    message: "Veuillez saisir votre mot de passe.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            redirect("/");
          },
          onError: (error) => {
            console.error("Erreur lors de l'inscription :", error);

            if (error.error.code === "INVALID_EMAIL_OR_PASSWORD") {
              toast.custom((t) => (
                <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
                  <div className="flex gap-2">
                    <div className="flex grow gap-3">
                      <CircleAlert
                        className="mt-0.5 shrink-0 text-red-500"
                        size={16}
                        aria-hidden="true"
                      />
                      <div className="flex flex-col">
                        <p>Une erreur est survenue</p>
                        <div className="text-sm whitespace-nowrap text-muted-foreground">
                          Email ou mot de passe incorrect.
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent cursor-pointer"
                      onClick={() => toast.dismiss(t)}
                      aria-label="Close banner"
                    >
                      <XIcon
                        size={16}
                        className="opacity-60 transition-opacity group-hover:opacity-100 "
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              ));
            } else {
              toast.custom((t) => (
                <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
                  <div className="flex gap-2">
                    <div className="flex grow gap-3">
                      <CircleAlert
                        className="mt-0.5 shrink-0 text-red-500"
                        size={16}
                        aria-hidden="true"
                      />
                      <div className="flex flex-col">
                        <p>Une erreur est survenue</p>
                        <div className="text-sm whitespace-nowrap text-muted-foreground">
                          Veuillez réessayer plus tard.
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent cursor-pointer"
                      onClick={() => toast.dismiss(t)}
                      aria-label="Close banner"
                    >
                      <XIcon
                        size={16}
                        className="opacity-60 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Button>
                  </div>
                </div>
              ));
            }
          },
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Connexion</CardTitle>
          <CardDescription>
            Veuillez remplir les informations ci-dessous pour vous connecter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Votre adresse email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Votre mot de passe</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Connexion..." : "Se connecter"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Vous n'avez pas de compte ?{" "}
                <Link href="/sign-up" className="underline underline-offset-4">
                  S'inscrire
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
