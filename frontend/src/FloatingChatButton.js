import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useNotificaciones } from "./hooks/useNotificaciones";

const FloatingChatButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mensajesNoLeidos } = useNotificaciones();

  // No mostrar el botón si ya estamos en páginas de chat
  const chatPages = ["/mensajes", "/chat"];
  const isOnChatPage = chatPages.some(page => location.pathname.startsWith(page));

  if (isOnChatPage) {
    return null;
  }

  return (
    <button
      className="floating-chat-btn"
      onClick={() => navigate("/mensajes")}
      title="Ir a Mensajes"
    >
      💬
      {mensajesNoLeidos > 0 && (
        <span className="floating-notification-badge">{mensajesNoLeidos}</span>
      )}
    </button>
  );
};

export default FloatingChatButton;