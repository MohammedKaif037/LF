"use client"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { useEffect, useState } from "react"

interface CodeEditorProps {
  defaultValue?: string
  onChange?: (value: string) => void
  onExecute?: (code: string) => Promise<void>
}

export function CodeEditor({ defaultValue = "", onChange, onExecute }: CodeEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [value, setValue] = useState(defaultValue)
  const [isExecuting, setIsExecuting] = useState(false)

  // This is to prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (onChange) {
      onChange(value)
    }
  }, [value, onChange])

  const handleExecute = async () => {
    if (onExecute) {
      setIsExecuting(true)
      try {
        await onExecute(value)
      } finally {
        setIsExecuting(false)
      }
    }
  }

  if (!mounted) {
    return <div className="w-full h-80 border rounded-md bg-secondary/30 p-4 font-mono text-sm">{defaultValue}</div>
  }

  // In a real implementation, you would use a proper code editor like Monaco Editor
  // For simplicity, we're using a textarea with some basic styling
  return (
    <div className="space-y-4">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-80 border rounded-md bg-secondary/30 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        spellCheck={false}
      />
      <div className="flex justify-end">
        <Button onClick={handleExecute} disabled={isExecuting} className="gap-2">
          <Play className="h-4 w-4" />
          {isExecuting ? "Running..." : "Run Code"}
        </Button>
      </div>
    </div>
  )
}
