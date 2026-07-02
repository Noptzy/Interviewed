export interface ApiResponse<T> {
  success: boolean
  data: T
  error: string | null
}

export interface CurrentUser {
  id: number
  email: string
  name: string
  isProfileCompleted: boolean
}

export interface AuthResponse {
  id: number
  email: string
  name: string
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

export interface SettingsResponse {
  userId: number
  model: string | null
  temperature: number | null
}

export interface ModelOption {
  id: string
  label: string
}
