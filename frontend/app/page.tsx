import { Button } from "@/components/ui/button"
import { ImageIcon, VideoIcon, MusicIcon } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-14">
      <header className="mb-10 text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="sr-only">Logo</span>
          <ImageIcon className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <h1 className="text-balance text-4xl font-semibold md:text-5xl">AI‑Generated Media Detector</h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Analyze images, videos, and audio for authenticity. Get a clear percentage and verdict with a semi‑circular
          gauge.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/image">Analyze Image</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/video">Analyze Video</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/audio">Analyze Audio</Link>
          </Button>
        </div>
      </header>

      <nav className="grid gap-4 md:grid-cols-3">
        <Link
          href="/image"
          className="group block rounded-lg border border-border bg-card p-6 hover:bg-accent transition-colors"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <ImageIcon className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <h2 className="text-lg font-medium">Image Detector</h2>
          <p className="mt-1 text-sm text-muted-foreground">Analyze photos and artwork</p>
        </Link>
        <Link
          href="/video"
          className="group block rounded-lg border border-border bg-card p-6 hover:bg-accent transition-colors"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <VideoIcon className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <h2 className="text-lg font-medium">Video Detector</h2>
          <p className="mt-1 text-sm text-muted-foreground">Inspect videos and clips</p>
        </Link>
        <Link
          href="/audio"
          className="group block rounded-lg border border-border bg-card p-6 hover:bg-accent transition-colors"
        >
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <MusicIcon className="h-5 w-5 text-primary" aria-hidden />
          </div>
          <h2 className="text-lg font-medium">Audio Detector</h2>
          <p className="mt-1 text-sm text-muted-foreground">Check voices and sounds</p>
        </Link>
      </nav>

      <section className="mt-12 rounded-lg border border-border bg-card p-6">
        <h3 className="text-xl font-medium">How it works</h3>
        <p className="mt-2 text-muted-foreground">
          Upload a file on its page. We compute a likelihood percentage and show a semi‑circular gauge. The verdict
          appears below, e.g., “This image is likely real” or “This audio is likely fake.”
        </p>
      </section>
    </main>
  )
}
