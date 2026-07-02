export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

export interface CurrentUser {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  isProfileCompleted: boolean
}

export interface AuthResponse {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
  accessToken: string
  refreshToken: string
}

export interface ProfileResponse {
  id: number
  linkedinUrl: string | null
  summary: string | null
  skillsJson: string | null
  experiencesJson: string | null
  projectsJson: string | null
  isCompleted: boolean
}

export interface CvExtractResponse {
  preview: string
  fullText: string
  looksLikeCv: boolean
  cvWarning: string | null
}

export interface StartInterviewResponse {
  sessionId: number
  question: string
}

export interface AnswerResponse {
  question: string
  complete: boolean
}

export interface InterviewSessionResponse {
  id: number
  status: string
  messages: Array<{ id: number; role: string; content: string; createdAt: string }>
}

export interface RecommendationResponse {
  id: number
  jobTitle: string
  company: string
  location: string
  applyUrl: string | null
  matchReason: string
  strengths: string
  gaps: string
}

export interface ModelOption {
  id: string
  label: string
}

export interface AdminUser {
  id: number
  email: string
  name: string
  role: 'USER' | 'ADMIN'
}

export interface InterestStat {
  skill: string
  count: number
}

export interface DailyCount {
  date: string
  count: number
}

export interface OverviewStats {
  totalUsers: number
  totalAdmins: number
  totalSessions: number
  completedSessions: number
  totalRecommendations: number
  completedProfiles: number
  totalProfiles: number
  signups: DailyCount[]
  sessions: DailyCount[]
}

export interface GlobalSettings {
  model: string
  temperature: number
  systemPrompt: string
}
