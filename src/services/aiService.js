// Heuristic AI & Emergency Detection Engine
export const getAIResponse = async (userMessage, userProfile = {}) => {
  // Simulate network latency
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
  
  const msg = userMessage.toLowerCase().trim();
  
  // 1. Emergency Detection Heuristics
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

  // 2. Greetings
  if (msg === "hi" || msg === "hello" || msg.includes("hey ") || msg === "hey") {
    const namePrefix = userProfile.name ? ` ${userProfile.name}` : "";
    return {
      text: `Hello${namePrefix}! I am your AI Medical Assistant. I can help answer health-related questions in simple terms, search wellness tips, or help schedule your medicine reminders.\n\n*What health topics would you like to discuss today?*`,
      isEmergency: false
    };
  }
  
  // 3. Symptom Advice Catalog
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

  // 4. Personalized Health Context Integrations
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

  // 5. Default Response & Safety Audit Flagging
  const flaggedWords = ["kill", "suicide", "depressed", "hurt myself", "abuse"];
  const isFlagged = flaggedWords.some(fw => msg.includes(fw));

  return {
    text: `I understand you are inquiring about health/wellness. \n\nTo give you the best information, please feel free to clarify your symptoms or ask a specific general health question (such as about hydration, sleep, headaches, or common colds).\n\nRemember to keep drinking water, eating fresh food, and getting adequate rest!`,
    isEmergency: false,
    flagged: isFlagged,
    reason: isFlagged ? "Flagged mental health/crisis keyword" : undefined
  };
};
