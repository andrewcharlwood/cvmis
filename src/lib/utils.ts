export function calculateSkillOffset(level: number, radius: number): number {
  const circumference = 2 * Math.PI * radius
  return circumference * (1 - level / 100)
}

export function formatBootLine(text: string): string {
  return text
}
