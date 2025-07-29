import { Header } from "@/src/components/ui/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-20">
      <Header />
      <main className="px-8">{children}</main>
    </div>
  );
}
