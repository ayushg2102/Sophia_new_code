// API Configuration Constants
export const API_CONFIG = {
  // Base URL for the main API server
  BASE_URL: 'http://74.225.189.243:4001',
  
  // Base URL for external services
  EXTERNAL_BASE_URL: 'https://sophia.xponance.com',
  
  // API Endpoints
  ENDPOINTS: {
    // Main API endpoints (proxied through /api)
    TASKS: '/api/tasks',
    SUB_TASK_DETAILS: (taskId: string) => `/api/sub-task-details/${taskId}`,
    ACTION_DETAILS: (actionId: string) => `/api/action-details/${actionId}`,
    COLLECTION_POLITICAL_CONTRIBUTIONS: '/api/collection/political-contributions',
    COLLECTION_SOCIAL_MEDIA_COMPLIANCE: '/api/collection/social-media-compliance',
    COLLECTION_POLITICAL_CONTRIBUTIONS_RUN: (runId: string) => `/api/collection/political-contributions/${runId}`,
    COLLECTION_BY_NAME: (collectionName: string) => `/api/collection/${collectionName}`,
    
    // External API endpoints (direct calls)
    AUTH_LOGIN: 'https://sophia.xponance.com/api/auth/login',
    CALENDAR_INVITES: 'https://sophia.xponance.com/api/calendar-invites',
    CALENDAR_LOGS: 'https://sophia.xponance.com/api/logs/calendar-invites',
    PROCESS_AGENT: '/api/process-agent',
  }
} as const;

// Helper function to build full URLs for external calls when needed
export const buildExternalUrl = (endpoint: string): string => {
  return `${API_CONFIG.EXTERNAL_BASE_URL}${endpoint}`;
};

// Helper function to get collection endpoint with run_id query parameter
export const getCollectionWithRunId = (collectionType: string, runId: string): string => {
  return `${API_CONFIG.EXTERNAL_BASE_URL}/api/collection/${collectionType}?run_id=${runId}`;
};