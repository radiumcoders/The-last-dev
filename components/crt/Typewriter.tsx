'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function Typewriter({
  lines,
  charDelay = 28,
  lineDelay = 420,
  onComplete,
  className,
}: {
  lines: string[]
  charDelay?: number
  lineDelay?: number
  onComplete?: () => void
  className?: string
}) {
  const [lineIndex, setLineIndex] = useState(0)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setLineIndex(0)
    setText('')
    setDone(false)
  }, [lines])

  useEffect(() => {
    if (done) return
    if (lineIndex >= lines.length) {
      setDone(true)
      onComplete?.()
      return
    }

    const line = lines[lineIndex] ?? ''
    if (text.length < line.length) {
      const t = window.setTimeout(() => {
        setText(line.slice(0, text.length + 1))
      }, charDelay)
      return () => window.clearTimeout(t)
    }

    const t = window.setTimeout(() => {
      setLineIndex((i) => i + 1)
      setText('')
    }, lineDelay)
    return () => window.clearTimeout(t)
  }, [charDelay, done, lineDelay, lineIndex, lines, onComplete, text])

  const completed = lines.slice(0, lineIndex)

  return (
    <div className={className}>
      {completed.map((line, i) => (
        <div key={`${i}-${line}`} className="crt-line">
          {line.length ? line : '\u00a0'}
        </div>
      ))}
      {lineIndex < lines.length && (
        <div className="crt-line">
          {text}
          <motion.span
            className="crt-cursor"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          >
            █
          </motion.span>
        </div>
      )}
    </div>
  )
}
