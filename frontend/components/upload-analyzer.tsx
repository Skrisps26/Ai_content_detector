"use client"

import * as React from "react"
import { SemiCircleGauge } from "./semicircle-gauge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { UploadCloud } from "lucide-react"

type Kind = "image" | "video" | "audio"

type UploadAnalyzerProps = {
  kind: Kind
  // Optionally pass your own analyzer to replace the placeholder:
  // Must return a number 0..100 representing "Real likelihood".
  analyze?: (file: File) => Promise<number>
  className?: string
}

async function defaultAnalyze(file: File): Promise<number> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/analyze', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Assuming your API returns a realLikelihood value between 0-100
    return data.realLikelihood;
  } catch (error) {
    console.error('Error analyzing file:', error);
    throw error;
  }
}

export function UploadAnalyzer({ kind, analyze = defaultAnalyze, className }: UploadAnalyzerProps) {
  const [file, setFile] = React.useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)
  const [percent, setPercent] = React.useState<number | null>(null)
  const [status, setStatus] = React.useState<"real" | "fake" | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [dragOver, setDragOver] = React.useState(false)

  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFiles = async (f: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(f)
    setFile(f)
    setPreviewUrl(url)
    setLoading(true)
    try {
      const realLikelihood = await analyze(f)
      const clamped = Math.max(0, Math.min(100, Math.round(realLikelihood)))
      setPercent(clamped)
      setStatus(clamped >= 50 ? "real" : "fake")
    } catch (err) {
      console.error("[v0] Analysis failed:", err)
      setPercent(null)
      setStatus(null)
    } finally {
      setLoading(false)
    }
  }

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    await handleFiles(f)
  }

  const accept = kind === "image" ? "image/*" : kind === "video" ? "video/*" : "audio/*"
  const noun = kind
  const caption = percent == null || status == null ? "" : `This ${noun} is likely ${status}.`

  return (
    <Card className={cn("border-border", className)}>
      <CardHeader>
        <CardTitle className="text-pretty">Upload {noun.charAt(0).toUpperCase() + noun.slice(1)} to Analyze</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Dropzone */}
        <div
          className={cn(
            "rounded-lg border-2 border-dashed p-6 transition-colors",
            dragOver ? "border-primary bg-accent" : "border-border bg-card",
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={async (e) => {
            e.preventDefault()
            setDragOver(false)
            const f = e.dataTransfer.files?.[0]
            if (f) await handleFiles(f)
          }}
          role="region"
          aria-label={`Drop a ${noun} file here`}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <UploadCloud className="h-6 w-6 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">
              Drag & drop your {noun} here, or{" "}
              <label className="font-medium text-primary underline underline-offset-4">
                choose a file
                <input type="file" accept={accept} onChange={onChange} className="sr-only" aria-label="Choose file" />
              </label>
            </p>
            {file ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl)
                  setFile(null)
                  setPreviewUrl(null)
                  setPercent(null)
                  setStatus(null)
                }}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>

        {/* Preview */}
        {previewUrl ? (
          <div className="rounded-lg border border-border bg-card p-3">
            {kind === "image" ? (
              <img
                src={previewUrl || "/placeholder.svg?height=320&width=480&query=uploaded%20image%20preview"}
                alt="Uploaded image preview"
                className="mx-auto h-auto max-h-80 w-auto rounded-md"
              />
            ) : kind === "video" ? (
              <video src={previewUrl} controls className="mx-auto max-h-80 w-full rounded-md" />
            ) : (
              <audio src={previewUrl} controls className="w-full" />
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No file selected yet.</p>
        )}

        {/* Gauge + Verdict */}
        {loading ? (
          <div className="text-center text-muted-foreground">Analyzing…</div>
        ) : percent != null && status != null ? (
          <div className="space-y-2">
            <SemiCircleGauge percent={percent} status={status} caption={caption} />
            <div className="flex items-center justify-center">
              <Badge variant={status === "real" ? "default" : "destructive"} className="px-3 py-1 text-sm">
                {status === "real" ? "Likely Real" : "Likely Fake"}
              </Badge>
            </div>
          </div>
        ) : null}

        {/* Developer note */}
        <p className="text-xs text-muted-foreground">
          Note: Replace the placeholder analyzer by passing your model result to the{" "}
          <span className="font-mono">analyze(file)</span> prop, returning a 0–100 real-likelihood.
        </p>
      </CardContent>
    </Card>
  )
}
