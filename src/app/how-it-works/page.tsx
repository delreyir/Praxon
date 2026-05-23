import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-16 text-center">
      <Badge variant="outline" className="mb-3">
        <BookOpen className="h-3 w-3" /> Documentation
      </Badge>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        How it works
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-[var(--muted-foreground)]">
        Detailed walkthrough of the lifecycle, contracts, and PoPW pipeline
        coming soon. For now, the home page summarizes each step and links to
        the official Konnex docs.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">Back to overview</Link>
        </Button>
        <Button variant="outline" asChild>
          <a
            href="https://docs.konnex.world/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Konnex docs <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
