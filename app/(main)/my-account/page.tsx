import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";

export default async function MyAccountPage() {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">My Account Page</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
}
