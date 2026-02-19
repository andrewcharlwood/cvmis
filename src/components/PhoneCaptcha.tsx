import { useState, useCallback, useRef, useEffect } from 'react'

interface PhoneCaptchaProps {
  phone: string
}

function generateChallenge() {
  const a = Math.floor(Math.random() * 10) + 2
  const b = Math.floor(Math.random() * 8) + 1
  return { question: `${a} + ${b}`, answer: a + b }
}

export function PhoneCaptcha({ phone }: PhoneCaptchaProps) {
  const [state, setState] = useState<'masked' | 'challenge' | 'revealed'>('masked')
  const [challenge, setChallenge] = useState(generateChallenge)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const maskedPhone = phone.slice(0, 2) + '\u2022\u2022\u2022 \u2022\u2022\u2022\u2022\u2022\u2022'

  useEffect(() => {
    if (state === 'challenge') {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [state])

  const handleRevealClick = useCallback(() => {
    setChallenge(generateChallenge())
    setInput('')
    setError(false)
    setState('challenge')
  }, [])

  const handleSubmit = useCallback(() => {
    const parsed = parseInt(input.trim(), 10)
    if (parsed === challenge.answer) {
      setState('revealed')
    } else {
      setError(true)
      setTimeout(() => {
        setError(false)
        setChallenge(generateChallenge())
        setInput('')
      }, 600)
    }
  }, [input, challenge.answer])

  const handleDismiss = useCallback(() => {
    setState('masked')
    setInput('')
    setError(false)
  }, [])

  if (state === 'revealed') {
    return (
      <a
        href={`tel:${phone}`}
        style={{
          color: 'var(--accent)',
          fontWeight: 500,
          textDecoration: 'none',
          textAlign: 'right',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
      >
        {phone.replace(/(\d{5})(\d{6})/, '$1 $2')}
      </a>
    )
  }

  if (state === 'challenge') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
        <span
          style={{
            fontSize: '11px',
            color: error ? 'var(--alert, #e53935)' : 'var(--text-tertiary)',
            fontFamily: 'var(--font-geist-mono)',
            transition: 'color 150ms',
          }}
        >
          {error ? 'Try again' : `${challenge.question} = ?`}
        </span>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit()
              if (e.key === 'Escape') handleDismiss()
            }}
            style={{
              width: '36px',
              padding: '3px 4px',
              fontSize: '12px',
              fontFamily: 'var(--font-geist-mono)',
              border: `1px solid ${error ? 'var(--alert, #e53935)' : 'var(--border)'}`,
              borderRadius: '4px',
              background: 'var(--surface)',
              color: 'var(--text-primary)',
              textAlign: 'center',
              outline: 'none',
              transition: 'border-color 150ms',
            }}
            aria-label={`Solve: ${challenge.question}`}
          />
          <button
            type="button"
            onClick={handleSubmit}
            style={{
              padding: '3px 8px',
              fontSize: '11px',
              fontWeight: 600,
              border: '1px solid var(--accent-border)',
              borderRadius: '4px',
              background: 'var(--accent-light)',
              color: 'var(--accent)',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            OK
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={handleRevealClick}
      style={{
        color: 'var(--text-secondary)',
        fontWeight: 500,
        textAlign: 'right',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        fontSize: 'inherit',
        fontFamily: 'inherit',
      }}
      aria-label="Reveal phone number"
      title="Click to verify and reveal"
    >
      {maskedPhone}
    </button>
  )
}
