import React from "react";
import { useNavigate } from "react-router-dom";
import "./BotonPerfilUsuario.css";

/**
 * Componente reutilizable para mostrar un botón de perfil de usuario
 * con diseño minimalista Double P
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.userId - ID del usuario
 * @param {string} props.username - Nombre del usuario a mostrar
 * @param {boolean} props.showLabel - Si mostrar el texto "Publicado por:" (default: true)
 * @param {string} props.customLabel - Texto personalizado en lugar de "Publicado por:"
 * @param {string} props.className - Clase CSS adicional para el contenedor
 * @param {Function} props.onClick - Función personalizada de click (opcional)
 */
function BotonPerfilUsuario({ 
  userId, 
  username, 
  showLabel = true, 
  customLabel = "Publicado por:",
  className = "",
  onClick 
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(userId, username);
    } else {
      navigate(`/perfil/${userId}`);
    }
  };

  return (
    <div className={`boton-perfil-container ${className}`}>
      {showLabel && (
        <span className="boton-perfil-label">{customLabel}</span>
      )}
      <button
        onClick={handleClick}
        className="boton-perfil-btn"
        title="Ver perfil de usuario"
      >
        <span className="boton-perfil-icon">👤</span> 
        <span className="boton-perfil-username">{username}</span>
      </button>
    </div>
  );
}

export default BotonPerfilUsuario;