import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotificaciones } from "./hooks/useNotificaciones";
import "./Chat.css";

function Chat() {
  const { id_destinatario } = useParams();
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [destinatario, setDestinatario] = useState(null);
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const navigate = useNavigate();
  const { marcarComoLeidos, cargarNoLeidos } = useNotificaciones();
  
  // Referencia para hacer scroll automático
  const mensajesEndRef = useRef(null);
  const mensajesContainerRef = useRef(null);

  const BACKEND_URL = "http://localhost:5000";
  const id_remitente = localStorage.getItem("id_usuario");

  // Función simple para hacer scroll al final 
  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Cargar información del destinatario
  useEffect(() => {
    if (id_destinatario) {
      fetch(`${BACKEND_URL}/api/perfil_usuario/${id_destinatario}`, {
        credentials: "include"
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.perfil) {
            if (Array.isArray(data.perfil) && data.perfil.length > 0) {
              setDestinatario({
                id_usuario: data.perfil[0].id_usuario,
                username_usuario: data.perfil[0].username_usuario,
                foto_usuario: data.perfil[0].foto_usuario,
              });
            } else {
              setDestinatario(data.perfil);
            }
          }
        })
        .catch((err) => console.error("Error al cargar destinatario:", err));
    }
  }, [id_destinatario]);

  // Cargar mensajes entre los usuarios
  useEffect(() => {
    if (id_remitente && id_destinatario) {
      cargarMensajes();
      // Marcar mensajes como leídos al abrir el chat
      marcarComoLeidos(id_destinatario);
      
      // Recargar mensajes cada 3 segundos y actualizar notificaciones
      const interval = setInterval(() => {
        cargarMensajes(); // Sin scroll automático
        // Marcar como leídos en cada actualización para mantener actualizado
        marcarComoLeidos(id_destinatario);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [id_remitente, id_destinatario]);

  // Actualizar tiempo cada 10 segundos para que "ahora" cambie a hora exacta rápidamente
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoActual(new Date());
    }, 10000); // Cada 10 segundos para detectar cambios rápidamente
    
    return () => clearInterval(interval);
  }, []);

  const cargarMensajes = async () => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/chat/mensajes?id_remitente=${id_remitente}&id_destinatario=${id_destinatario}`
      );
      const data = await response.json();
      
      // Asegurar que los mensajes estén ordenados correctamente por fecha
      const mensajesOrdenados = data.sort((a, b) => {
        const fechaA = new Date(a.fecha_envio);
        const fechaB = new Date(b.fecha_envio);
        return fechaA - fechaB; // Orden ascendente (más antiguos primero)
      });
      
      setMensajes(mensajesOrdenados);
      
      // Actualizar el tiempo actual para recalcular las diferencias
      setTiempoActual(new Date());
      
      // Marcar como leídos cada vez que se cargan mensajes
      await marcarComoLeidos(id_destinatario);
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };

  // Enviar mensaje
  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim()) return;

    try {
      const res = await fetch(`${BACKEND_URL}/chat/mensajes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_remitente: parseInt(id_remitente),
          id_destinatario: parseInt(id_destinatario),
          mensaje: nuevoMensaje,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Asegurar que los mensajes estén ordenados después de enviar
        const mensajesOrdenados = data.mensajes.sort((a, b) => {
          const fechaA = new Date(a.fecha_envio);
          const fechaB = new Date(b.fecha_envio);
          return fechaA - fechaB; // Orden ascendente
        });
        
        setMensajes(mensajesOrdenados);
        setNuevoMensaje("");
        // Actualizar el tiempo actual para que se recalcule la diferencia
        setTiempoActual(new Date());
        // Actualizar el conteo de no leídos después de enviar
        cargarNoLeidos();
        // SOLO hacer scroll cuando envías un mensaje
        setTimeout(scrollToBottom, 100);
      }
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      enviarMensaje();
    }
  };

  // Función para formatear la hora de manera exacta
  const formatearTiempo = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = tiempoActual;
    const diferencia = ahora - fecha;
    
    console.log(`Debug - Fecha: ${fecha}, Ahora: ${ahora}, Diferencia: ${Math.floor(diferencia/1000)}s`);
    
    // Solo mostrar "ahora" si el mensaje es de hace menos de 30 segundos
    if (diferencia < 30000) {
      return "ahora";
    }
    
    // Si es del mismo día, mostrar solo la hora (sin segundos)
    if (fecha.toDateString() === ahora.toDateString()) {
      return fecha.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    }
    
    // Si es de otro día, mostrar fecha y hora (sin segundos)
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button 
          className="back-button"
          onClick={() => navigate("/mensajes")}
        >
          ← Mensajes
        </button>
        
        {destinatario && (
          <div className="destinatario-info">
            <img
              src={
                destinatario.foto_usuario
                  ? `${BACKEND_URL}/uploads${
                      destinatario.foto_usuario.startsWith("/")
                        ? destinatario.foto_usuario
                        : "/" + destinatario.foto_usuario
                    }`
                  : "/default-user.png"
              }
              alt="Foto del usuario"
              className="destinatario-foto"
            />
            <h3>Chat con {destinatario.username_usuario}</h3>
          </div>
        )}
      </div>

      <div 
        className="mensajes-container" 
        ref={mensajesContainerRef}
      >
        {mensajes.length > 0 ? (
          mensajes.map((mensaje, index) => (
            <div
              key={index}
              className={`mensaje ${
                mensaje.id_remitente === parseInt(id_remitente) ? "propio" : "ajeno"
              }`}
            >
              <div className="mensaje-contenido">
                <p>{mensaje.mensaje}</p>
                <div className="mensaje-meta">
                  <small className="mensaje-fecha">
                    {formatearTiempo(mensaje.fecha_envio)}
                  </small>
                  {mensaje.id_remitente === parseInt(id_remitente) && (
                    <span className="estado-lectura">
                      {mensaje.leido ? "✓✓" : "✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="sin-mensajes">
            <p>No hay mensajes aún. ¡Inicia la conversación!</p>
          </div>
        )}
        {/* Elemento invisible para hacer scroll automático */}
        <div ref={mensajesEndRef} />
      </div>

      <div className="mensaje-input-container">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
          className="mensaje-input"
        />
        <button 
          onClick={enviarMensaje}
          className="enviar-button"
          disabled={!nuevoMensaje.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Chat;