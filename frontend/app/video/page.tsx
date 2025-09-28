import Link from "next/link"
import { UploadAnalyzer } from "@/components/upload-analyzer"
import { Button } from "@/components/ui/button"

export default function VideoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Video Detector</h1>
        <Button asChild variant="ghost" size="sm">
          <Link href="/">Back to Home</Link>
        </Button>
      </header>
      <p className="mb-4 text-sm text-muted-foreground">Upload an MP4/WebM to estimate authenticity.</p>
      <UploadAnalyzer kind="video" />
    </main>
  )
}
