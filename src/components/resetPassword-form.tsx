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

const formSchema = z
  .object({
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

export function ResetPasswordForm({
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
      // Simule un délai réseau ou remplace par ton appel API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Réinitialiser votre mot de passe
          </CardTitle>
          <CardDescription>
            Veuillez remplir les informations ci-dessous pour réinitialiser
            votre mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">Votre nouveau mot de passe</Label>
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
                    Confirmer votre nouveau mot de passe
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
                  {loading
                    ? "Réinitialisation..."
                    : "Réinitialiser le mot de passe"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Vous avez retrouvé votre mot de passe ?{" "}
                <Link href="/sign-in" className="underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
