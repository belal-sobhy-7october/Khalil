/** Desktop (system) notifications — shown by the OS even when the tab is hidden. */

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!notificationsSupported()) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}

export function systemNotify(title: string, body: string, tag = 'khalil') {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    const n = new Notification(title, { body, tag, icon: '/favicon.svg', requireInteraction: false });
    n.onclick = () => {
      window.focus();
      n.close();
    };
  } catch {
    // some platforms only allow notifications from a service worker
  }
}
