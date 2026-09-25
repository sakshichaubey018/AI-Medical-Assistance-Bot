import { getItem, setItem, STORAGE_KEYS } from './storage';

// --- Reminders CRUD Operations ---
export const getReminders = (userId) => {
  const allReminders = getItem(STORAGE_KEYS.REMINDERS, {});
  return allReminders[userId] || [];
};

export const addReminder = (userId, medicineName, dosage, time) => {
  const allReminders = getItem(STORAGE_KEYS.REMINDERS, {});
  if (!allReminders[userId]) allReminders[userId] = [];
  
  const newReminder = {
    id: "rem-" + Math.random().toString(36).substr(2, 9),
    medicineName,
    dosage,
    time,
    status: "Pending" // Pending, Taken, Skipped, Snoozed
  };
  allReminders[userId].push(newReminder);
  setItem(STORAGE_KEYS.REMINDERS, allReminders);
  return newReminder;
};

export const updateReminderStatus = (userId, reminderId, status) => {
  const allReminders = getItem(STORAGE_KEYS.REMINDERS, {});
  if (!allReminders[userId]) return;
  
  const remIndex = allReminders[userId].findIndex(r => r.id === reminderId);
  if (remIndex !== -1) {
    allReminders[userId][remIndex].status = status;
    setItem(STORAGE_KEYS.REMINDERS, allReminders);
  }
};

export const deleteReminder = (userId, reminderId) => {
  const allReminders = getItem(STORAGE_KEYS.REMINDERS, {});
  if (!allReminders[userId]) return;
  
  allReminders[userId] = allReminders[userId].filter(r => r.id !== reminderId);
  setItem(STORAGE_KEYS.REMINDERS, allReminders);
};

// --- Appointments CRUD Operations ---
export const getAppointments = (userId) => {
  const allAppointments = getItem(STORAGE_KEYS.APPOINTMENTS, {});
  return allAppointments[userId] || [];
};

export const addAppointment = (userId, doctorName, date, time, location) => {
  const allAppointments = getItem(STORAGE_KEYS.APPOINTMENTS, {});
  if (!allAppointments[userId]) allAppointments[userId] = [];
  
  const newAppt = {
    id: "appt-" + Math.random().toString(36).substr(2, 9),
    doctorName,
    date,
    time,
    location
  };
  allAppointments[userId].push(newAppt);
  setItem(STORAGE_KEYS.APPOINTMENTS, allAppointments);
  return newAppt;
};

export const deleteAppointment = (userId, apptId) => {
  const allAppointments = getItem(STORAGE_KEYS.APPOINTMENTS, {});
  if (!allAppointments[userId]) return;
  
  allAppointments[userId] = allAppointments[userId].filter(a => a.id !== apptId);
  setItem(STORAGE_KEYS.APPOINTMENTS, allAppointments);
};
