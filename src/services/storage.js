// Centralized Storage Keys & Initializer
export const STORAGE_KEYS = {
  USERS: 'medbot_users',
  ACTIVE_USER_ID: 'medbot_active_user_id',
  ARTICLES: 'medbot_articles',
  REMINDERS: 'medbot_reminders',
  APPOINTMENTS: 'medbot_appointments',
  FLAGGED_CHATS: 'medbot_flagged_chats'
};

export const DEFAULT_ARTICLES = [
  {
    id: "art-1",
    title: "Healthy Eating Made Simple",
    category: "Daily Habits",
    content: "Eating healthy doesn't have to be complicated. Focus on adding more 'whole foods' to your plate — things like vegetables, fruits, whole grains, and lean proteins. Try to fill half your plate with veggies and fruits, a quarter with lean protein, and a quarter with whole grains. Drink water instead of sugary sodas, and try to cook at home more often so you know exactly what is in your food.",
    author: "Dr. Sarah Mitchell",
    date: "10 June 2026"
  },
  {
    id: "art-2",
    title: "The Magic of 8 Hours of Sleep",
    category: "Daily Habits",
    content: "Sleep is when your body repairs itself, fights off infections, and organizes your memories. Getting 7 to 8 hours of quality sleep each night helps you stay focused, lowers your risk of chronic health conditions, and keeps your mood balanced. To sleep better, try to go to bed at the same time every day, turn off screens 1 hour before bed, and keep your room cool and dark.",
    author: "Sleep Health Foundation",
    date: "08 June 2026"
  },
  {
    id: "art-3",
    title: "Understanding High Blood Pressure",
    category: "Common Illnesses",
    content: "Blood pressure is the force of your blood pushing against the walls of your blood vessels. If it stays too high (known as hypertension), it can strain your heart. High blood pressure is often called a 'silent warning' because it usually has no symptoms. You can manage or prevent it by eating less salt, exercising regularly, managing stress, and checking your pressure with a doctor yearly.",
    author: "Heart & Wellness Center",
    date: "05 June 2026"
  },
  {
    id: "art-4",
    title: "Dealing with the Common Cold",
    category: "Common Illnesses",
    content: "The common cold is caused by viruses. Symptoms usually include a runny nose, sneezing, cough, and a mild sore throat. Antibiotics do NOT cure colds because they only kill bacteria, not viruses. The best treatments are simple: get lots of rest, drink plenty of warm water or broth, and wash your hands frequently to avoid spreading the cold to others. Most colds clear up in 7 to 10 days.",
    author: "Family Care Clinic",
    date: "01 June 2026"
  },
  {
    id: "art-5",
    title: "Breathing Exercises for Quick Anxiety Relief",
    category: "Mental Wellness",
    content: "When you feel anxious or stressed, your breathing can become shallow and fast. This tells your brain there is a danger, making you feel more anxious. You can quickly calm your nervous system using the '4-7-8 breathing' method: Breathe in quietly through your nose for 4 seconds, hold your breath for 7 seconds, and blow out fully through your mouth for 8 seconds. Repeat this 4 times.",
    author: "Mindfulness Group",
    date: "28 May 2026"
  },
  {
    id: "art-6",
    title: "Why Regular Movement Boosts Your Mood",
    category: "Mental Wellness",
    content: "Exercise isn't just about building muscles; it is also one of the best ways to improve your mental health. When you move your body, your brain releases natural chemicals called endorphins. These chemicals boost your mood, reduce stress, and can even act as natural pain relievers. Even a simple 20-minute daily walk can make a huge difference in how happy and energetic you feel.",
    author: "Mental Health Alliance",
    date: "20 May 2026"
  }
];

export const getItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading key ${key} from storage`, e);
    return fallback;
  }
};

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing key ${key} to storage`, e);
  }
};

export const initStorage = () => {
  if (!getItem(STORAGE_KEYS.USERS)) setItem(STORAGE_KEYS.USERS, []);
  if (!getItem(STORAGE_KEYS.ARTICLES)) setItem(STORAGE_KEYS.ARTICLES, DEFAULT_ARTICLES);
  if (!getItem(STORAGE_KEYS.REMINDERS)) setItem(STORAGE_KEYS.REMINDERS, {});
  if (!getItem(STORAGE_KEYS.APPOINTMENTS)) setItem(STORAGE_KEYS.APPOINTMENTS, {});
  if (!getItem(STORAGE_KEYS.FLAGGED_CHATS)) setItem(STORAGE_KEYS.FLAGGED_CHATS, []);
};

initStorage();
