import { 
  Activity, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  User, 
  PhoneCall, 
  ShieldCheck 
} from 'lucide-react';

export const NAVIGATION_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
  { id: 'chat', label: 'AI Health Chat', icon: MessageSquare, badge: 'AI' },
  { id: 'symptoms', label: 'Symptom Checker', icon: Activity, badge: null },
  { id: 'reminders', label: 'Reminders & Schedule', icon: Clock, badge: null },
  { id: 'tips', label: 'Health Library', icon: BookOpen, badge: null },
  { id: 'profile', label: 'My Health Profile', icon: User, badge: null },
  { id: 'emergency', label: 'Emergency Protocol', icon: PhoneCall, badge: '24/7' }
];

export const ADMIN_NAV_ITEM = {
  id: 'admin', label: 'Admin Portal', icon: ShieldCheck, badge: 'Admin'
};
