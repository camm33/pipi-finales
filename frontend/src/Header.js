import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";

const Header = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [foto, setFoto] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Array con las rutas de navegación
  const navItems = [
    { path: "/catalogo", label: "Inicio" },
    { path: "/agregar", label: "Publicar" },
    { path: "/lista_deseos", label: "Deseos" },
    { path: "/configuracion", label: "Configuración" }
  ];

  useEffect(() => {
    const nombreGuardado = localStorage.getItem("username");
    const fotoGuardada = localStorage.getItem("foto_usuario");

    if (nombreGuardado) setUsername(nombreGuardado);
    if (fotoGuardada) setFoto(fotoGuardada);
  }, []);

  // Detectar página activa y actualizar índice de la barra
  useEffect(() => {
    const currentIndex = navItems.findIndex(item => 
      location.pathname === item.path || 
      (location.pathname === "/" && item.path === "/catalogo") ||
      (location.pathname.includes("/detalle_prenda") && item.path === "/catalogo")
    );
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("username");
    localStorage.removeItem("foto_usuario");

    // Si setIsLoggedIn está disponible, usarlo, sino navegar directamente
    if (setIsLoggedIn && typeof setIsLoggedIn === 'function') {
      setIsLoggedIn(false);
    }
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
      {/* Logo */}
      <div 
        className="logo"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 2
        }}
      >
        <img
          src="/LOGO.png"
          alt="Double P Logo"
          className="logo-img"
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid #8b7355'
          }}
        />
        <span 
          className="site-name"
          style={{
            fontFamily: '"Dancing Script", cursive',
            fontSize: '24px',
            fontWeight: 700,
            color: '#6b4a2b',
            fontStyle: 'italic',
            textDecoration: 'none'
          }}
        >Double_P</span>
      </div>

      {/* Navegación central con barra deslizante */}
      <nav 
        className="nav-links"
        style={{
          display: 'flex',
          gap: '40px',
          alignItems: 'center',
          zIndex: 2
        }}
      >
        {navItems.map((item, index) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-link ${activeIndex === index ? 'active' : ''}`}
            style={{
              color: '#6b4a2b',
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(139, 115, 85, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            onClick={() => setActiveIndex(index)}
          >
            {item.label}
          </Link>
        ))}
        {/* Barra deslizante */}
        <div 
          className={`sliding-bar ${navItems[activeIndex].label.toLowerCase().replace('ó', 'o')}`}
          style={{
            transform: `translateX(${activeIndex * 100 - 18}%)`
          }}
        />
      </nav>

      {/* Usuario */}
      <div 
        className="user-section"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          zIndex: 2
        }}
      >
        <span 
          className="username"
          style={{
            fontWeight: 500,
            fontSize: '16px',
            color: '#fff'
          }}
        >{username}</span>
        <Link 
          to="/MiPerfil" 
          className="profile-link"
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
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          ) : (
            <img
              src="/LOGO.png"
              alt="Default Profile"
              className="profile-pic default-profile"
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            />
          )}
        </Link>
        <button 
          className="logout-btn" 
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

export default Header;