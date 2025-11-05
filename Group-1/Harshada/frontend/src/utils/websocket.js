export function initWebSocket(userId, onMessage) {
  if (!userId) return { close: () => {} };

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname;
  const port = 8000;
  const ws = new WebSocket(`${protocol}://${host}:${port}/ws/notifications/${userId}/`);

  ws.onopen = () => console.log("WS connected:", userId);
  ws.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data);
      onMessage(data);
    } catch (e) { console.error("Invalid ws json", e); }
  };
  ws.onclose = () => console.log("WS closed");
  ws.onerror = (err) => console.error("WS error", err);
  return ws;
}
