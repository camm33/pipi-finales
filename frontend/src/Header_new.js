import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Header.css";

const Header = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Obtener datos del usuario desde el backend
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/mi_perfil", {
          credentials: "include"
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.perfil) {
            setUserProfile(data.perfil);
          }
        }
      } catch (error) {
        console.error("Error al obtener perfil del usuario:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("username");
    localStorage.removeItem("foto_usuario");

    setIsLoggedIn(false);
    navigate("/");
  };

  // Construir nombre completo para mostrar
  const getDisplayName = () => {
    if (!userProfile) return "Usuario";
    
    const firstName = userProfile.PrimerNombre || "";
    const lastName = userProfile.PrimerApellido || "";
    
    return `${firstName} ${lastName}`.trim() || userProfile.username_usuario || "Usuario";
  };

  return (
    <header className="main-header">
      <div className="logo-section">
        <Link to="/MiPerfil" className="profile-link">
          {userProfile?.foto_usuario ? (
            <img
              src={`http://localhost:5000/uploads/${userProfile.foto_usuario.startsWith("/") ? userProfile.foto_usuario.slice(1) : userProfile.foto_usuario}`}
              alt="Perfil"
              className="profile-avatar"
              style={{backgroundImage: 'none'}}
            />
          ) : (
            <div className="profile-avatar">
              {getDisplayName().charAt(0).toUpperCase()}
            </div>
          )}
        </Link>
        <span className="user-name">{getDisplayName()}</span>
      </div>

      <div className="header-actions">
        <Link to="/agregar">
          <button className="header-btn" title="Agregar prenda">
            ➕
          </button>
        </Link>

        <Link to="/lista_deseos">
          <button className="header-btn" title="Lista de Deseos">
            ♡
          </button>
        </Link>

        <Link to="/configuracion">
          <button className="header-btn" title="Configuración">
            ⚙️
          </button>
        </Link>

        <button 
          className="header-btn primary" 
          title="Cerrar Sesión" 
          onClick={handleLogout}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default Header;