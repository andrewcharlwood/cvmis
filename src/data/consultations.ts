import type { Consultation } from '@/types/pmr'
import { timelineConsultations } from '@/data/timeline'

// Compatibility export for existing consultation consumers.
export const consultations: Consultation[] = timelineConsultations
