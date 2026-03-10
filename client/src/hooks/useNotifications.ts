import { useEffect, useState } from 'react';

interface Notification {
  type: string;
  topicId: string;
  topicTitle: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const es = new EventSource(`/api/notifications/events?token=${token}`);

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setNotifications((prev) => [data, ...prev].slice(0, 10));
      } catch {
        // ignore malformed events
      }
    };

    return () => es.close();
  }, []);

  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications };
};
