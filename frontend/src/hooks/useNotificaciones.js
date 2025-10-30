import { useState, useEffect } from 'react';

export const useNotificaciones = () => {
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const BACKEND_URL = "http://localhost:5000";
  const id_usuario = localStorage.getItem("id_usuario");

  const cargarNoLeidos = async () => {
    if (!id_usuario) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/chat/no_leidos/${id_usuario}`);
      const data = await response.json();
      
      if (data.success) {
        setMensajesNoLeidos(data.mensajes_no_leidos);
      }
    } catch (error) {
      console.error('Error al cargar mensajes no leídos:', error);
    }
  };

  const marcarComoLeidos = async (id_otro_usuario) => {
    if (!id_usuario || !id_otro_usuario) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/chat/marcar_leidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id_usuario: parseInt(id_usuario),
          id_otro_usuario: parseInt(id_otro_usuario)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Recargar el conteo después de marcar como leídos
        cargarNoLeidos();
      }
    } catch (error) {
      console.error('Error al marcar mensajes como leídos:', error);
    }
  };

  useEffect(() => {
    cargarNoLeidos();
    
    // Actualizar cada 5 segundos para que se vea el cambio más rápido
    const interval = setInterval(cargarNoLeidos, 5000);
    
    return () => clearInterval(interval);
  }, [id_usuario]);

  return {
    mensajesNoLeidos,
    cargarNoLeidos,
    marcarComoLeidos
  };
};