self.addEventListener('push', function(event) {
  let payload = {};
  try { payload = event.data.json(); } catch(e) { payload = { title: 'Notification', body: event.data.text() }; }
  const title = payload.title || 'Notification';
  const options = {
    body: payload.body || payload.message || '',
    data: payload.data || {},
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
