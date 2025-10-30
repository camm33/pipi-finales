import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificaciones } from "./hooks/useNotificaciones";
import "./ChatList.css";

function ChatList() {
  const [conversaciones, setConversaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChat, setShowNewChat] = useState(false);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const navigate = useNavigate();
  const { cargarNoLeidos } = useNotificaciones();

  const BACKEND_URL = "http://localhost:5000";
  const id_usuario = localStorage.getItem("id_usuario");

  // Cargar conversaciones existentes
  useEffect(() => {
    if (id_usuario) {
      cargarConversaciones();
      cargarUsuarios();
    }
  }, [id_usuario]);

  // Actualizar tiempo cada 10 segundos para que "Ahora" cambie correctamente
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 10000); // Cada 10 segundos
    
    return () => clearInterval(interval);
  }, []);

  const cargarConversaciones = () => {
    fetch(`${BACKEND_URL}/chat/conversaciones_mejoradas/${id_usuario}`)
      .then((res) => res.json())
      .then((data) => {
        setConversaciones(data);
        setLoading(false);
        // Actualizar el tiempo actual para recalcular las diferencias
        setTiempoActual(new Date());
        // Actualizar el conteo global después de cargar conversaciones
        cargarNoLeidos();
      })
      .catch((err) => {
        console.error("Error al cargar conversaciones:", err);
        setLoading(false);
      });
  };

  const cargarUsuarios = () => {
    fetch(`${BACKEND_URL}/api/usuarios_disponibles`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.usuarios) {
          // Filtrar el usuario actual
          const otrosUsuarios = data.usuarios.filter(
            u => u.id_usuario !== parseInt(id_usuario)
          );
          setUsuarios(otrosUsuarios);
        }
      })
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  const iniciarNuevoChat = (destinatario) => {
    setShowNewChat(false);
    navigate(`/chat/${destinatario.id_usuario}`);
  };

  const formatearFecha = (fecha) => {
    const ahora = tiempoActual;
    const fechaMsg = new Date(fecha);
    const diffMs = ahora - fechaMsg;
    const diffMinutos = Math.floor(diffMs / (1000 * 60));
    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.floor(diffHoras / 24);

    console.log(`Debug ChatList - Fecha: ${fechaMsg}, Ahora: ${ahora}, Diff minutos: ${diffMinutos}`);

    // Solo mostrar "Ahora" si es de hace menos de 1 minuto
    if (diffMinutos < 1) {
      return "Ahora";
    } else if (diffMinutos < 60) {
      return `${diffMinutos}min`;
    } else if (diffHoras < 24) {
      // Si es del mismo día, mostrar la hora exacta
      return fechaMsg.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } else if (diffDias < 7) {
      // Para esta semana, mostrar día y hora
      const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      return `${dias[fechaMsg.getDay()]} ${fechaMsg.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
      })}`;
    } else {
      // Para fechas más antiguas, mostrar fecha completa
      return fechaMsg.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2>💬 Mensajes</h2>
        </div>
        <div className="loading">Cargando conversaciones...</div>
      </div>
    );
  }

  return (
    <div className="chat-list-container">
      <div className="chat-list-header">
        <h2>💬 Mensajes</h2>
        <button 
          className="new-chat-btn"
          onClick={() => setShowNewChat(!showNewChat)}
        >
          ✏️
        </button>
      </div>

      {showNewChat && (
        <div className="new-chat-modal">
          <div className="new-chat-content">
            <div className="new-chat-header">
              <h3>Nuevo Chat</h3>
              <button 
                className="close-btn"
                onClick={() => setShowNewChat(false)}
              >
                ✕
              </button>
            </div>
            <div className="usuarios-list">
              {usuarios.map((usuario) => (
                <div
                  key={usuario.id_usuario}
                  className="usuario-item"
                  onClick={() => iniciarNuevoChat(usuario)}
                >
                  <img
                    src={
                      usuario.foto
                        ? `${BACKEND_URL}/uploads/${usuario.foto}`
                        : "/default-user.png"
                    }
                    alt={usuario.username}
                    className="usuario-foto"
                  />
                  <div className="usuario-info">
                    <span className="usuario-nombre">{usuario.username}</span>
                    <span className="usuario-email">{usuario.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="conversaciones-list">
        {conversaciones.length > 0 ? (
          conversaciones.map((conv) => (
            <div
              key={conv.id_usuario}
              className="conversacion-item"
              onClick={() => navigate(`/chat/${conv.id_usuario}`)}
            >
              <img
                src={
                  conv.foto_usuario
                    ? `${BACKEND_URL}/uploads/${conv.foto_usuario}`
                    : "/default-user.png"
                }
                alt={conv.username}
                className="conversacion-foto"
              />
              <div className="conversacion-info">
                <div className="conversacion-header">
                  <span className="conversacion-nombre">{conv.username}</span>
                  <div className="conversacion-meta">
                    <span className="conversacion-tiempo">
                      {formatearFecha(conv.fecha_ultimo)}
                    </span>
                    {conv.mensajes_no_leidos > 0 && (
                      <span className="mensajes-no-leidos-badge">
                        {conv.mensajes_no_leidos}
                      </span>
                    )}
                  </div>
                </div>
                <p className={`ultimo-mensaje ${conv.mensajes_no_leidos > 0 ? 'no-leido' : ''}`}>
                  {conv.ultimo_mensaje}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-conversaciones">
            <div className="sin-conversaciones-icon">💬</div>
            <h3>No tienes conversaciones</h3>
            <p>Inicia un nuevo chat haciendo clic en el botón de arriba</p>
            <button 
              className="start-chat-btn"
              onClick={() => setShowNewChat(true)}
            >
              Iniciar Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatList;