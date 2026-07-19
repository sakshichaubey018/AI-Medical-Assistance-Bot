// Default Health Articles for the Library
const DEFAULT_ARTICLES = [
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

// Initialize localStorage on module load
const initLocalStorage = () => {
  if (!localStorage.getItem("medbot_users")) {
    localStorage.setItem("medbot_users", JSON.stringify([]));
  }
  if (!localStorage.getItem("medbot_articles")) {
    localStorage.setItem("medbot_articles", JSON.stringify(DEFAULT_ARTICLES));
  }
  if (!localStorage.getItem("medbot_reminders")) {
    localStorage.setItem("medbot_reminders", JSON.stringify({}));
  }
  if (!localStorage.getItem("medbot_appointments")) {
    localStorage.setItem("medbot_appointments", JSON.stringify({}));
  }
  if (!localStorage.getItem("medbot_flagged_chats")) {
    localStorage.setItem("medbot_flagged_chats", JSON.stringify([]));
  }
};

initLocalStorage();

// --- Auth Operations ---
export const registerUser = (name, email, password) => {
  const users = JSON.parse(localStorage.getItem("medbot_users"));
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error("User with this email already exists");
  }
  const newUser = {
    id: "usr-" + Math.random().toString(36).substr(2, 9),
    name,
    email,
    password,
    profile: {
      age: "",
      gender: "",
      allergies: "",
      currentMedications: ""
    }
  };
  users.push(newUser);
  localStorage.setItem("medbot_users", JSON.stringify(users));
  return newUser;
};

export const loginUser = (email, password) => {
  const users = JSON.parse(localStorage.getItem("medbot_users"));
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  return user;
};

export const updateUserProfile = (userId, profileData) => {
  const users = JSON.parse(localStorage.getItem("medbot_users"));
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");
  
  users[userIndex].profile = { ...users[userIndex].profile, ...profileData };
  localStorage.setItem("medbot_users", JSON.stringify(users));
  return users[userIndex];
};

// --- Reminders Operations ---
export const getReminders = (userId) => {
  const allReminders = JSON.parse(localStorage.getItem("medbot_reminders"));
  return allReminders[userId] || [];
};

export const addReminder = (userId, medicineName, dosage, time) => {
  const allReminders = JSON.parse(localStorage.getItem("medbot_reminders"));
  if (!allReminders[userId]) allReminders[userId] = [];
  
  const newReminder = {
    id: "rem-" + Math.random().toString(36).substr(2, 9),
    medicineName,
    dosage,
    time,
    status: "Pending" // Pending, Taken, Skipped, Snoozed
  };
  allReminders[userId].push(newReminder);
  localStorage.setItem("medbot_reminders", JSON.stringify(allReminders));
  return newReminder;
};

export const updateReminderStatus = (userId, reminderId, status) => {
  const allReminders = JSON.parse(localStorage.getItem("medbot_reminders"));
  if (!allReminders[userId]) return;
  
  const remIndex = allReminders[userId].findIndex(r => r.id === reminderId);
  if (remIndex !== -1) {
    allReminders[userId][remIndex].status = status;
    localStorage.setItem("medbot_reminders", JSON.stringify(allReminders));
  }
};

export const deleteReminder = (userId, reminderId) => {
  const allReminders = JSON.parse(localStorage.getItem("medbot_reminders"));
  if (!allReminders[userId]) return;
  
  allReminders[userId] = allReminders[userId].filter(r => r.id !== reminderId);
  localStorage.setItem("medbot_reminders", JSON.stringify(allReminders));
};

// --- Appointments Operations ---
export const getAppointments = (userId) => {
  const allAppointments = JSON.parse(localStorage.getItem("medbot_appointments"));
  return allAppointments[userId] || [];
};

export const addAppointment = (userId, doctorName, date, time, location) => {
  const allAppointments = JSON.parse(localStorage.getItem("medbot_appointments"));
  if (!allAppointments[userId]) allAppointments[userId] = [];
  
  const newAppt = {
    id: "appt-" + Math.random().toString(36).substr(2, 9),
    doctorName,
    date,
    time,
    location
  };
  allAppointments[userId].push(newAppt);
  localStorage.setItem("medbot_appointments", JSON.stringify(allAppointments));
  return newAppt;
};

export const deleteAppointment = (userId, apptId) => {
  const allAppointments = JSON.parse(localStorage.getItem("medbot_appointments"));
  if (!allAppointments[userId]) return;
  
  allAppointments[userId] = allAppointments[userId].filter(a => a.id !== apptId);
  localStorage.setItem("medbot_appointments", JSON.stringify(allAppointments));
};

// --- Articles Operations (CMS) ---
export const getArticles = () => {
  return JSON.parse(localStorage.getItem("medbot_articles"));
};

export const addArticle = (title, category, content, author) => {
  const articles = JSON.parse(localStorage.getItem("medbot_articles"));
  const newArt = {
    id: "art-" + Math.random().toString(36).substr(2, 9),
    title,
    category,
    content,
    author: author || "Staff Admin",
    date: new Date().toLocaleDateString("en-US", { day: 'numeric', month: 'long', year: 'numeric' })
  };
  articles.unshift(newArt);
  localStorage.setItem("medbot_articles", JSON.stringify(articles));
  return newArt;
};

export const deleteArticle = (artId) => {
  let articles = JSON.parse(localStorage.getItem("medbot_articles"));
  articles = articles.filter(a => a.id !== artId);
  localStorage.setItem("medbot_articles", JSON.stringify(articles));
};

// --- Flagged Chats Operations ---
export const getFlaggedChats = () => {
  return JSON.parse(localStorage.getItem("medbot_flagged_chats"));
};

export const flagChatSession = (userName, userEmail, messages, reason) => {
  const flagged = JSON.parse(localStorage.getItem("medbot_flagged_chats"));
  flagged.unshift({
    id: "flag-" + Math.random().toString(36).substr(2, 9),
    userName,
    userEmail,
    messages,
    reason,
    timestamp: new Date().toLocaleString()
  });
  localStorage.setItem("medbot_flagged_chats", JSON.stringify(flagged));
};

// --- Simulated AI Model Logic ---
export const getAIResponse = async (userMessage, userProfile = {}) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
  
  const msg = userMessage.toLowerCase().trim();
  
  // 1. Emergency Detection
  const emergencyKeywords = ["chest pain", "breathing difficulty", "short of breath", "difficulty breathing", "heart attack", "stroke", "unconscious", "heavy bleeding", "poison"];
  const isEmergency = emergencyKeywords.some(kw => msg.includes(kw));
  
  if (isEmergency) {
    return {
      text: "⚠️ **CRITICAL EMERGENCY DETECTED!** \n\nYou are mentioning symptoms that could be life-threatening (such as chest pain or breathing issues). \n\n**Please call your local emergency services (like 911 or your local ambulance) immediately.** Do not wait for further responses from this AI. Seek professional help right away.",
      isEmergency: true,
      flagged: true,
      reason: "Emergency symptom mentioned (" + emergencyKeywords.filter(kw => msg.includes(kw)).join(", ") + ")"
    };
  }

  // 2. Help/Greeting Responses
  if (msg === "hi" || msg === "hello" || msg.includes("hey ") || msg === "hey") {
    const namePrefix = userProfile.name ? ` ${userProfile.name}` : "";
    return {
      text: `Hello${namePrefix}! I am your AI Medical Assistant. I can help answer health-related questions in simple terms, search wellness tips, or help schedule your medicine reminders.\n\n*What health topics would you like to discuss today?*`,
      isEmergency: false
    };
  }
  
  // 3. Symptom Heuristics
  if (msg.includes("headache")) {
    return {
      text: "A **headache** is common and can have many simple causes like dehydration, stress, lack of sleep, or looking at screens for too long. \n\n**Home Care Tips:**\n1. Drink a large glass of water.\n2. Rest in a dark, quiet room.\n3. Place a cool cloth on your forehead.\n\n*Note: If your headache is sudden and extremely painful (often called a 'thunderclap'), or if you also have a stiff neck and high fever, you should see a doctor immediately.*",
      isEmergency: false
    };
  }
  
  if (msg.includes("fever") || msg.includes("temperature")) {
    return {
      text: "A **fever** is your body's natural way of fighting off viruses or bacteria. \n\n**What you can do:**\n1. Rest as much as possible.\n2. Keep hydrated by drinking plenty of water, broth, or herbal tea.\n3. Dress in light layers and use lightweight blankets.\n\n*Note: If your temperature rises above 103°F (39.4°C) or lasts more than 3 consecutive days, you should consult a healthcare provider.*",
      isEmergency: false
    };
  }
  
  if (msg.includes("cough") || msg.includes("sore throat") || msg.includes("cold")) {
    return {
      text: "Coughs, sore throats, and the **common cold** are usually caused by viruses. \n\n**Simple Remedies:**\n1. Drink warm fluids like lemon water with honey (note: do not give honey to babies under 1 year old).\n2. Gargle with warm salt water for throat relief.\n3. Use a humidifier in your bedroom to keep the air moist.\n\n*Note: If you have difficulty swallowing, a high fever, or if the cough produces blood or thick green mucus, consult a medical professional.*",
      isEmergency: false
    };
  }

  if (msg.includes("stomach") || msg.includes("nausea") || msg.includes("diarrhea")) {
    return {
      text: "Stomach upset or mild **gastroenteritis** can be uncomfortable. \n\n**How to recover:**\n1. Sip fluids slowly (water, electrolyte solutions, clear broth) to avoid dehydration.\n2. Stick to bland foods (the BRAT diet: Bananas, Rice, Applesauce, Toast) once you feel like eating.\n3. Avoid dairy, grease, and caffeine for 24-48 hours.\n\n*Note: If you experience severe, sharp abdominal pain, high fever, or persistent vomiting, contact a clinic immediately.*",
      isEmergency: false
    };
  }

  if (msg.includes("allergy") || msg.includes("rash") || msg.includes("itch")) {
    return {
      text: "Skin **rashes or allergy symptoms** can be triggered by plants, soaps, foods, or changes in weather. \n\n**General Steps:**\n1. Gently wash the area with mild soap and lukewarm water.\n2. Apply a cool compress to soothe itching.\n3. Write down any new foods, soaps, or environments you were exposed to recently.\n\n*Note: If you experience facial/lip swelling, throat tightness, or shortness of breath, this could be a severe allergic reaction (anaphylaxis). Call emergency services immediately.*",
      isEmergency: false
    };
  }

  // 4. Personalized context integrations
  if (msg.includes("allergy") || msg.includes("medication") || msg.includes("medicine")) {
    if (userProfile.allergies || userProfile.currentMedications) {
      let customResponse = "According to your profile details:\n";
      if (userProfile.allergies) customResponse += `- **Known Allergies:** ${userProfile.allergies}\n`;
      if (userProfile.currentMedications) customResponse += `- **Current Medications:** ${userProfile.currentMedications}\n`;
      customResponse += "\nAlways cross-reference any advice with these variables. For instance, do not take medicines that could interact with your active prescription or trigger your known allergies. Consult a pharmacist or doctor to be absolutely certain.";
      
      return {
        text: customResponse,
        isEmergency: false
      };
    }
  }

  // 5. Default generic health bot response
  const flaggedWords = ["kill", "suicide", "depressed", "hurt myself", "abuse"];
  const isFlagged = flaggedWords.some(fw => msg.includes(fw));

  return {
    text: `I understand you are inquiring about health/wellness. \n\nTo give you the best information, please feel free to clarify your symptoms or ask a specific general health question (such as about hydration, sleep, headaches, or common colds).\n\nRemember to keep drinking water, eating fresh food, and getting adequate rest!`,
    isEmergency: false,
    flagged: isFlagged,
    reason: isFlagged ? "Flagged mental health/crisis keyword" : undefined
  };
};

// --- Aggregate Statistics (Admin Dashboard) ---
export const getAdminStats = () => {
  const users = JSON.parse(localStorage.getItem("medbot_users"));
  const flagged = JSON.parse(localStorage.getItem("medbot_flagged_chats"));
  
  // Total reminders count
  const allRem = JSON.parse(localStorage.getItem("medbot_reminders"));
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
