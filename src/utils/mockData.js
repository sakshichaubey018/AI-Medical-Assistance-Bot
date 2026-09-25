// Re-export services for backward compatibility
export {
  registerUser,
  loginUser,
  updateUserProfile
} from '../services/authService';

export {
  getReminders,
  addReminder,
  updateReminderStatus,
  deleteReminder,
  getAppointments,
  addAppointment,
  deleteAppointment
} from '../services/reminderService';

export {
  getArticles,
  addArticle,
  deleteArticle
} from '../services/articleService';

export {
  getFlaggedChats,
  flagChatSession,
  getAdminStats
} from '../services/adminService';

export {
  getAIResponse
} from '../services/aiService';
