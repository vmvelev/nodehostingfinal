import { NavBar } from "@/components/ui/navbar";

export default function Nodes() {
  return (
    <div className="w-full">
      <section className="w-full relative bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat min-h-screen">
        <div className="flex flex-col min-h-[100vh]">
          <NavBar />
          <main className="flex-1"></main>
        </div>
      </section>
    </div>
  );
}
