import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const HeaderAdmin = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [foto, setFoto] = useState("");

  useEffect(() => {
    const nombreGuardado = localStorage.getItem("username");
    const fotoGuardada = localStorage.getItem("foto_usuario");

    if (nombreGuardado) setUsername(nombreGuardado);
    if (fotoGuardada) setFoto(fotoGuardada);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("username");
    localStorage.removeItem("foto_usuario");

    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <header 
      className="header-container"
      style={{
        background: '#f8f5ec',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 40px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: '65px',
        boxSizing: 'border-box'
      }}
    >
      <div 
        className="logo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Link 
          to="/AdminDashboard"
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {foto ? (
            <img
              src={`http://localhost:5000/uploads/${foto}`}
              alt="Perfil"
              className="profile-pic"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #8b7355'
              }}
            />
          ) : (
            <span 
              className="profile-placeholder"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#8b7355',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}
            >👤</span>
          )}
        </Link>

        <span 
          className="username"
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: '24px',
            fontWeight: 700,
            color: '#6b4a2b',
            fontStyle: 'italic',
            marginLeft: '10px'
          }}
        >{username || "Administrador"}</span>
      </div>

      <div 
        className="icons"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}
      >
        <button 
          className="icon-btn" 
          title="Cerrar Sesión" 
          onClick={handleLogout}
          style={{
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
};

export default HeaderAdmin;
