import Link from "next/link";
import { Button } from "./button";

export const AuthButton = () => {
  // const user = null;

  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://example.com/avatar.jpg",
  };

  if (!user) {
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
  return (
    <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit">
      <Button asChild variant="outline" size="sm">
        <Link href="/my-account">
          <span>Mon compte</span>
        </Link>
      </Button>
      <Button
        asChild
        size="sm"
        className="cursor-pointer"
        onClick={() => console.log("déconnexion réussite")}
      >
        <span>Se déconnecter</span>
      </Button>
    </div>
  );
};
