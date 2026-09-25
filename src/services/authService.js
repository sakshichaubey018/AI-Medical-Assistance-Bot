import { getItem, setItem, STORAGE_KEYS } from './storage';

export const registerUser = (name, email, password) => {
  const users = getItem(STORAGE_KEYS.USERS, []);
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
  setItem(STORAGE_KEYS.USERS, users);
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getItem(STORAGE_KEYS.USERS, []);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  return user;
};

export const updateUserProfile = (userId, profileData) => {
  const users = getItem(STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) throw new Error("User not found");
  
  users[userIndex].profile = { ...users[userIndex].profile, ...profileData };
  setItem(STORAGE_KEYS.USERS, users);
  return users[userIndex];
};

export const getActiveUserSession = () => {
  const activeUserId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  const users = getItem(STORAGE_KEYS.USERS, []);
  if (activeUserId && users.length > 0) {
    return users.find(u => u.id === activeUserId) || null;
  }
  return null;
};

export const setActiveUserSession = (userId) => {
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
};

export const clearUserSession = () => {
  localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
};
