import express from 'express'
import nodemailer from 'nodemailer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(express.json())

// Serve static files from Vite build (dist/ is at project root, one level up from dist-server/)
app.use(express.static(path.join(__dirname, '..', 'dist')))

// Contact API endpoint
app.post('/api/contact', async (req, res) => {
  const { name, organisation, email, subject, message } = req.body

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const contactEmail = process.env.CONTACT_EMAIL || 'andy@charlwood.xyz'

  try {
    // Admin notification
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      replyTo: email,
      to: contactEmail,
      subject: `Portfolio Referral: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00897B; border-bottom: 2px solid #00897B; padding-bottom: 10px;">
            New Patient Referral
          </h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Referring Clinician:</strong> ${name}</p>
            <p><strong>Organisation:</strong> ${organisation || 'Not specified'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="padding: 20px 0;">
            <h3 style="color: #333;">Clinical Details:</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    })

    // Auto-reply
    await transporter.sendMail({
      from: `"Andy Charlwood" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thanks for getting in touch!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00897B; border-bottom: 2px solid #00897B; padding-bottom: 10px;">
            Thanks for your message, ${name}!
          </h2>
          <p style="line-height: 1.6;">
            I've received your referral and will get back to you as soon as possible.
          </p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Your message:</strong></p>
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
          <p style="line-height: 1.6;">
            Best regards,<br/>
            <strong>Andy Charlwood</strong><br/>
            Informatics Pharmacist &middot; NHS Norfolk &amp; Waveney ICB
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            This is an automated confirmation. Please do not reply to this email.
          </p>
        </div>
      `,
    })

    return res.status(200).json({ success: true, message: 'Referral sent successfully!' })
  } catch (error) {
    console.error('Email error:', error)
    return res.status(500).json({ success: false, message: 'Failed to send referral. Please try again.' })
  }
})

// Chat proxy endpoint — keeps API key server-side
app.post('/api/chat', async (req, res) => {
  const apiKey = process.env.OPEN_ROUTER_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'LLM API key not configured' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': req.headers.origin || req.headers.referer || '',
        'X-Title': 'Andy Charlwood Portfolio',
      },
      body: JSON.stringify(req.body),
    })

    if (!response.ok) {
      return res.status(response.status).json({ error: `LLM API error: ${response.status}` })
    }

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const reader = response.body?.getReader()
    if (!reader) {
      return res.status(500).json({ error: 'No response body' })
    }

    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
      res.end()
    }
    await pump()
  } catch (error) {
    console.error('Chat proxy error:', error)
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Failed to proxy chat request' })
    }
    res.end()
  }
})

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
