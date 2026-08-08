// src/lib/websocket/websocket.ts

const WS_URL = process.env.NEXT_PUBLIC_WS_URL!;

export const createWebSocket = () => {
  return new WebSocket(WS_URL);
};
