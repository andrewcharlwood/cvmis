export interface Skill {
  name: string
  level: number
  category: 'Technical' | 'Clinical' | 'Strategic'
  color: 'teal' | 'coral'
}

export interface Experience {
  role: string
  org: string
  date: string
  bullets: string[]
  isCurrent?: boolean
}

export interface Education {
  degree: string
  institution: string
  period: string
  detail: string
}

export interface Project {
  title: string
  description: string
  link?: string
}

export interface ContactItem {
  icon: 'phone' | 'mail' | 'linkedin' | 'mapPin'
  value: string
  label: string
  href?: string
}

export type Phase = 'boot' | 'ecg' | 'login' | 'content'

export interface BootLine {
  html: string
  delay: number
}
