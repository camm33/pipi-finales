import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./perfiles.css";

function MiPerfil() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const [activeTab, setActiveTab] = useState("prendas");
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = "http://localhost:5000";

  // 🔹 Cargar datos del perfil al montar el componente
  useEffect(() => {
    console.log('MiPerfil: useEffect ejecutándose');
    
    // Intentar obtener usuario de localStorage primero
    const userData = localStorage.getItem('user');
    console.log('MiPerfil: userData desde localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('MiPerfil: usuario parseado:', user);
        
        // Cargar perfil usando el ID del usuario desde localStorage
        cargarPerfilPorId(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Si falla localStorage, intentar con sesión
        cargarPerfilPorSesion();
      }
    } else {
      // No hay usuario en localStorage, intentar con sesión
      console.log('MiPerfil: No hay usuario en localStorage, intentando con sesión');
      cargarPerfilPorSesion();
    }
  }, []);

  const cargarPerfilPorId = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/perfil_usuario/${userId}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("📥 Datos del perfil por ID:", data);
        procesarDatosPerfil(data);
      } else {
        console.error('Error al cargar perfil por ID:', response.status);
        cargarPerfilPorSesion();
      }
    } catch (error) {
      console.error('Error cargando perfil por ID:', error);
      cargarPerfilPorSesion();
    }
  };

  const cargarPerfilPorSesion = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/mi_perfil`, { 
        credentials: "include" 
      });
      
      if (response.status === 401) {
        console.log('Usuario no autenticado - redirigiendo al login');
        setLoading(false);
        navigate('/iniciar');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log("📥 Datos del perfil por sesión:", data);
        procesarDatosPerfil(data);
      } else {
        throw new Error("Error al cargar el perfil");
      }
    } catch (error) {
      console.error("❌ Error al cargar el perfil:", error);
      setLoading(false);
    }
  };

  const procesarDatosPerfil = (data) => {
    if (!data || data.perfil == null) {
      setPerfil(null);
      setLoading(false);
      return;
    }

    if (Array.isArray(data.perfil) && data.perfil.length > 0) {
      const usuario = data.perfil[0];
      setPerfil(usuario);
      setRating(usuario.promedio_valoracion || 0);
    } else if (typeof data.perfil === 'object') {
      setPerfil(data.perfil);
      setRating(data.perfil.promedio_valoracion || 0);
    }
    
    setLoading(false);
  };

  // 🔹 Renderizar estrellas
  const renderStars = (promedio) => {
    const rounded = Math.round(promedio);
    return (
      <span className="stars-text">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={`star-black ${i <= rounded ? "active" : ""}`}>
            {i <= rounded ? "★" : "☆"}
          </span>
        ))}
      </span>
    );
  };

  // 🔹 Render principal
  return (
    <>
      <Header />
      <div className="profile-container">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando perfil...</p>
          </div>
        ) : perfil ? (
          <>
            {/* Background Hero Section */}
            <div className="profile-hero">
              <div className="hero-background"></div>
            </div>

            {/* Single Profile Card */}
            <div className="profile-content">
              <div className="profile-card">
                {/* Profile Info Section */}
                <div className="profile-info-section">
                  <div className="profile-avatar">
                    <img
                      src={
                        perfil.foto_usuario
                          ? `${BACKEND_URL}/uploads${
                              perfil.foto_usuario.startsWith("/")
                                ? perfil.foto_usuario
                                : "/" + perfil.foto_usuario
                            }`
                          : "/default-user.png"
                      }
                      alt="Foto del usuario"
                      className="avatar-image"
                    />
                  </div>
                  
                  <div className="profile-header">
                    <h1 className="profile-name">
                      {perfil.PrimerNombre || "Usuario"} {perfil.PrimerApellido || ""}
                    </h1>
                    <p className="profile-title">
                      Usuario de Double P - Marketplace de Moda
                    </p>
                    
                    <div className="profile-contact-info">
                      <div className="contact-item">
                        <span className="contact-icon">📍</span>
                        <span>Colombia</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">📧</span>
                        <span>{perfil.email_usuario || "correo@ejemplo.com"}</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">�</span>
                        <span>@{perfil.username_usuario || "usuario"}</span>
                      </div>
                      <div className="contact-item">
                        <span className="contact-icon">🗓️</span>
                        <span>Miembro desde {perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).getFullYear() : "2024"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="profile-actions-row">
                    <div className="rating-display">
                      <span className="rating-number">{rating.toFixed(1)}</span>
                      <div className="rating-stars">
                        {renderStars(rating)}
                      </div>
                      <span className="rating-text">valoración</span>
                    </div>
                    
                    <button className="chat-button" onClick={() => navigate("/chat")}>
                      💬 Chat
                    </button>
                    
                    <button className="visit-site-btn" onClick={() => navigate("/editar")}>
                      ✏️ Editar Perfil
                    </button>
                  </div>
                </div>

                {/* Content Grid */}
                <div className="profile-content-grid">
                  {/* Main Content Area */}
                  <div className="profile-main-content">
                    <div className="intro-section">
                      <h2 className="intro-title">Mi Perfil en Double P</h2>
                      <p className="intro-description">
                        Explora mis publicaciones y descubre las prendas que tengo disponibles para intercambio. 
                        En Double P creemos en dar una segunda vida a la moda.
                      </p>
                      <button className="play-button" onClick={() => setActiveTab("prendas")}>
                        ▶
                      </button>
                    </div>

                    {/* Timeline Navigation */}
                    <div className="timeline-nav">
                      <button 
                        className={`nav-tab ${activeTab === "prendas" ? "active" : ""}`}
                        onClick={() => setActiveTab("prendas")}
                      >
                        Prendas & Info
                      </button>
                      <button 
                        className={`nav-tab ${activeTab === "intercambios" ? "active" : ""}`}
                        onClick={() => setActiveTab("intercambios")}
                      >
                        Intercambios
                      </button>
                      <button 
                        className={`nav-tab ${activeTab === "media" ? "active" : ""}`}
                        onClick={() => setActiveTab("media")}
                      >
                        Media
                      </button>
                    </div>

                    {/* Content based on active tab */}
                    <div className="timeline-content">
                      {activeTab === "prendas" && (
                        <div className="prendas-section">
                          {/* User Info Posts */}
                          <div className="info-post">
                            <div className="post-header">
                              <img src={perfil.foto_usuario ? `${BACKEND_URL}/uploads${perfil.foto_usuario.startsWith("/") ? perfil.foto_usuario : "/" + perfil.foto_usuario}` : "/default-user.png"} alt="Avatar" className="post-avatar" />
                              <div className="post-meta">
                                <span className="post-name">{perfil.PrimerNombre} {perfil.PrimerApellido}</span>
                                <span className="post-username">@{perfil.username_usuario}</span>
                                <span className="post-time">Información del perfil</span>
                              </div>
                            </div>
                            <div className="post-content">
                              <p><strong>Email:</strong> {perfil.email_usuario || "No disponible"}</p>
                              {perfil.talla_usuario && <p><strong>Talla preferida:</strong> {perfil.talla_usuario}</p>}
                              <p><strong>Miembro desde:</strong> {perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).getFullYear() : "2024"}</p>
                            </div>
                          </div>

                          {/* Prendas Posts */}
                          {perfil.prendas && perfil.prendas.length > 0 ? (
                            perfil.prendas.map((prenda) => (
                              <div key={prenda.id_prenda} className="prenda-post">
                                <div className="post-header">
                                  <img src={perfil.foto_usuario ? `${BACKEND_URL}/uploads${perfil.foto_usuario.startsWith("/") ? perfil.foto_usuario : "/" + perfil.foto_usuario}` : "/default-user.png"} alt="Avatar" className="post-avatar" />
                                  <div className="post-meta">
                                    <span className="post-name">{perfil.PrimerNombre} {perfil.PrimerApellido}</span>
                                    <span className="post-username">@{perfil.username_usuario}</span>
                                    <span className="post-time">Publicación</span>
                                  </div>
                                </div>
                                <div className="post-content">
                                  <p>{prenda.nombre_prenda}</p>
                                  {prenda.foto_prenda && (
                                    <img
                                      src={`${BACKEND_URL}/uploads/${prenda.foto_prenda}`}
                                      alt={prenda.nombre_prenda}
                                      className="prenda-image"
                                      onClick={() => navigate(`/gestion_prendas/${prenda.id_prenda}`)}
                                    />
                                  )}
                                </div>
                                <div className="post-actions">
                                  <button className="action-icon">💬</button>
                                  <button className="action-icon">🔄</button>
                                  <button className="action-icon">❤️</button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="empty-state">
                              <div className="empty-state-icon">👕</div>
                              <h3 className="empty-state-title">No hay prendas publicadas</h3>
                              <p className="empty-state-text">Comienza a compartir tu ropa para intercambiar</p>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "intercambios" && (
                        <div className="empty-state">
                          <div className="empty-state-icon">🔄</div>
                          <h3 className="empty-state-title">Intercambios</h3>
                          <p className="empty-state-text">Sección de intercambios próximamente</p>
                        </div>
                      )}

                      {activeTab === "media" && (
                        <div className="media-grid">
                          {perfil.prendas && perfil.prendas.length > 0 ? (
                            perfil.prendas.map((prenda) => (
                              prenda.foto_prenda && (
                                <img
                                  key={prenda.id_prenda}
                                  src={`${BACKEND_URL}/uploads/${prenda.foto_prenda}`}
                                  alt={prenda.nombre_prenda}
                                  className="media-item"
                                  onClick={() => navigate(`/gestion_prendas/${prenda.id_prenda}`)}
                                />
                              )
                            ))
                          ) : (
                            <div className="empty-state">
                              <div className="empty-state-icon">📷</div>
                              <h3 className="empty-state-title">No hay imágenes</h3>
                              <p className="empty-state-text">No hay imágenes para mostrar</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sidebar Calculator */}
                  <div className="profile-sidebar-right">
                    <div className="calculator-card">
                      <h3 className="calculator-title">Double P Calculator</h3>
                      <p className="calculator-description">
                        Calcula el valor estimado de tus prendas y encuentra los mejores intercambios.
                      </p>
                      <div className="calculator-icon">
                        👕
                      </div>
                      <button className="calculate-btn" onClick={() => navigate("/publicar")}>
                        Calcular →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading-state">
            <div className="empty-state-icon">👤</div>
            <h3 className="empty-state-title">No se encontró información del usuario</h3>
            <p className="empty-state-text">
              Por favor, inicia sesión para ver tu perfil.
            </p>
            <button 
              className="action-btn primary" 
              onClick={() => navigate('/iniciar')}
              style={{marginTop: '20px'}}
            >
              Ir al Inicio
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default MiPerfil;
