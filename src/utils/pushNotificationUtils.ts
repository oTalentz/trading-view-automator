
// Push notification utilities

export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      return registration;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return null;
    }
  } else {
    console.info('Push notifications not supported in this browser');
    return null;
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.info('This browser does not support notifications');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.warn('Notification permission denied');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const sendNotification = (title: string, options: NotificationOptions = {}) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }
  
  // Use notification API directly
  try {
    new Notification(title, {
      icon: '/favicon.ico',
      ...options
    });
    return true;
  } catch (error) {
    console.error('Error creating notification:', error);
    return false;
  }
};

export const initializeNotifications = async () => {
  const permission = await requestNotificationPermission();
  if (permission) {
    await registerServiceWorker();
    return true;
  }
  return false;
};

// Simple adapter to store notification settings
export const getNotificationSettings = () => {
  try {
    const settings = localStorage.getItem('trading-automator-notification-settings');
    return settings ? JSON.parse(settings) : { enabled: false };
  } catch (error) {
    console.error('Error loading notification settings', error);
    return { enabled: false };
  }
};

export const saveNotificationSettings = (settings: { enabled: boolean }) => {
  localStorage.setItem('trading-automator-notification-settings', JSON.stringify(settings));
};
