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

/**
 * Shows a system notification. `open` names what a click opens (e.g. "review").
 * Android and installed apps only allow notifications from the service worker,
 * so it is used when the page has one; the worker handles the click there.
 */
export function systemNotify(title: string, body: string, tag = 'khalil', open?: string) {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  const options: NotificationOptions = { body, tag, icon: '/icon-192.png', badge: '/icon-192.png', data: { open } };
  const direct = () => {
    try {
      const n = new Notification(title, options);
      n.onclick = () => {
        window.focus();
        if (open) window.dispatchEvent(new CustomEvent('khalil:open', { detail: open }));
        n.close();
      };
    } catch {
      // some platforms only allow notifications from a service worker
    }
  };
  if (typeof navigator !== 'undefined' && navigator.serviceWorker?.controller) {
    navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, options)).catch(direct);
  } else {
    direct();
  }
}
