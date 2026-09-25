import { getItem, setItem, STORAGE_KEYS } from './storage';

export const getFlaggedChats = () => {
  return getItem(STORAGE_KEYS.FLAGGED_CHATS, []);
};

export const flagChatSession = (userName, userEmail, messages, reason) => {
  const flagged = getItem(STORAGE_KEYS.FLAGGED_CHATS, []);
  flagged.unshift({
    id: "flag-" + Math.random().toString(36).substr(2, 9),
    userName,
    userEmail,
    messages,
    reason,
    timestamp: new Date().toLocaleString()
  });
  setItem(STORAGE_KEYS.FLAGGED_CHATS, flagged);
};

export const getAdminStats = () => {
  const users = getItem(STORAGE_KEYS.USERS, []);
  const flagged = getItem(STORAGE_KEYS.FLAGGED_CHATS, []);
  const allRem = getItem(STORAGE_KEYS.REMINDERS, {});
  
  let remCount = 0;
  Object.keys(allRem).forEach(k => {
    remCount += allRem[k].length;
  });

  return {
    totalUsers: users.length,
    activeChatsToday: Math.floor(users.length * 1.5 + 4),
    flaggedSessions: flagged.length,
    activeReminders: remCount,
    topSymptoms: [
      { name: "Headache", percentage: 42 },
      { name: "Fever", percentage: 28 },
      { name: "Cough & Cold", percentage: 18 },
      { name: "Allergies / Rash", percentage: 12 }
    ]
  };
};
