"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { useSession, signOut } from "@/src/lib/auth-client";
import { redirect } from "next/navigation";
import { Spinner } from "./spinner";

export const AuthButton = () => {
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(false);

  if (isPending) {
    return (
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit">
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-in">
            Chargement... <Spinner variant="circle" />
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-in">
            Chargement... <Spinner variant="circle" />
          </Link>
        </Button>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit">
        <Button asChild variant="outline" size="sm">
          <Link href="/sign-in">
            <span>Se connecter</span>
          </Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/sign-up">
            <span>S'inscrire</span>
          </Link>
        </Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      redirect("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit">
      <Button asChild variant="outline" size="sm">
        <Link href="/my-account">
          <span>Mon compte</span>
        </Link>
      </Button>
      <Button
        size="sm"
        className="cursor-pointer"
        onClick={handleSignOut}
        disabled={loading}
      >
        <span>{loading ? "Déconnexion..." : "Se déconnecter"}</span>
      </Button>
    </div>
  );
};
