import type { CSSProperties } from 'react'

export const detailRootStyle: CSSProperties = {
  fontFamily: 'var(--font-ui)',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
}

export const sectionHeadingStyle: CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  marginBottom: '8px',
}

export const bulletListStyle: CSSProperties = {
  margin: 0,
  paddingLeft: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  listStyleType: 'disc',
}

export const bodyTextStyle: CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: 'var(--text-primary)',
}

export const paragraphStyle: CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: 'var(--text-primary)',
  margin: 0,
}
