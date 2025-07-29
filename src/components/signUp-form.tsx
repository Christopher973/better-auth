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
import { signUp } from "../lib/auth-client";
import { redirect } from "next/navigation";
import { CircleAlert, XIcon } from "lucide-react";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z.string().min(1, {
      message: "Votre nom complet est requis.",
    }),
    email: z
      .string()
      .min(1, { message: "Votre adresse email est requise." })
      .email({ message: "Veuillez entrer une adresse email valide." }),
    password: z
      .string()
      .min(8, {
        message: "Le mot de passe doit contenir au moins 8 caractères.",
      })
      .regex(/[A-Z]/, {
        message: "Le mot de passe doit contenir au moins une majuscule.",
      })
      .regex(/[0-9]/, {
        message: "Le mot de passe doit contenir au moins un chiffre.",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Le mot de passe doit contenir au moins un caractère spécial.",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "La confirmation du mot de passe est requise." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export function SignUpForm({
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
      await signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            redirect("/");
          },
          onError: (error) => {
            console.error("Erreur lors de l'inscription :", error);

            if (error.error.code === "USER_ALREADY_EXISTS") {
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
                          L'adresse email est déjà utilisée.
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
          <CardTitle className="text-xl">Inscription</CardTitle>
          <CardDescription>
            Veuillez remplir les informations ci-dessous pour vous inscrire.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Votre nom complet</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>
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
                <div className="grid gap-3">
                  <Label htmlFor="confirm-password">
                    Confirmer votre mot de passe
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="w-full cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Inscription..." : "S'inscrire"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Vous avez déjà un compte ?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        En cliquant sur s'inscrire, vous acceptez nos{" "}
        <Link href="#">Conditions d'utilisation</Link> et{" "}
        <Link href="#">Politique de confidentialité</Link>.
      </div>
    </div>
  );
}
