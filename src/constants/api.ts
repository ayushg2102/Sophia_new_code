// API Configuration Constants
export const API_CONFIG = {
    // Base URL for the main API server
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001',

    // Base URL for external services
    EXTERNAL_BASE_URL: import.meta.env.VITE_EXTERNAL_API_BASE_URL || 'https://sophia.xponance.com',

    // API Endpoints
    ENDPOINTS: {
        // Main API endpoints (direct calls to correct server)
        TASKS: `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/tasks`,
        SUB_TASK_DETAILS: (taskId: string) => `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/sub-task-details/${taskId}`,
        ACTION_DETAILS: (actionId: string) => `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/action-details/${actionId}`,
        COLLECTION_POLITICAL_CONTRIBUTIONS: `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/collection/political-contributions`,
        COLLECTION_SOCIAL_MEDIA_COMPLIANCE: `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/collection/social-media-compliance`,
        COLLECTION_POLITICAL_CONTRIBUTIONS_RUN: (runId: string) => `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/collection/political-contributions/${runId}`,
        COLLECTION_BY_NAME: (collectionName: string) => `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/collection/${collectionName}`,
        REPORT: (runId: string) => `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/report/${runId}`,

        // External API endpoints (direct calls)
        AUTH_LOGIN: `${import.meta.env.VITE_EXTERNAL_API_BASE_URL || 'https://sophia.xponance.com'}/api/auth/login`,
        CALENDAR_INVITES: `${import.meta.env.VITE_EXTERNAL_API_BASE_URL || 'https://sophia.xponance.com'}/api/calendar-invites`,
        CALENDAR_LOGS: `${import.meta.env.VITE_EXTERNAL_API_BASE_URL || 'https://sophia.xponance.com'}/api/logs/calendar-invites`,
        PROCESS_AGENT: `${import.meta.env.VITE_API_BASE_URL || 'http://74.225.189.243:4001'}/api/process-agent`,
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