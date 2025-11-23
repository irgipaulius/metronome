import { Feed } from "@/components/Feed";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center pt-8 pb-24">
      <div className="w-full max-w-2xl px-4 mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white">News Feed</h1>
        <Button variant="premium" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Post
        </Button>
      </div>
      
      <Feed />
    </main>
  );
}
