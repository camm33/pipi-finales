import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import "./perfiles.css";

function MiPerfil() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [perfil, setPerfil] = useState(null);
  const [activeTab, setActiveTab] = useState("prendas"); // "prendas", "intercambios", "media"

  const BACKEND_URL = "http://localhost:5000";

  // 🔹 Cargar datos del perfil al montar el componente
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/mi_perfil`, { credentials: "include" })
      .then((res) => {
        if (res.status === 401) {
          // No autenticado: redirigir al login
          navigate('/iniciar');
          throw new Error('No autenticado');
        }
        if (!res.ok) throw new Error("Error al cargar el perfil");
        return res.json();
      })
      .then((data) => {
        console.log("📥 Datos del perfil:", data);

        if (!data || data.perfil == null) {
          // Perfil vacío
          setPerfil(null);
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
      })
      .catch((err) => console.error("❌ Error al cargar el perfil:", err));
  }, []);

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
        {perfil ? (
          <>
            {/* Background Hero Section */}
            <div className="profile-hero">
              <div className="hero-background"></div>
            </div>

            {/* Main Content */}
            <div className="profile-content">
              {/* Left Sidebar - Profile Card */}
              <div className="profile-sidebar">
                <div className="profile-card">
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
                  
                  <div className="profile-info">
                    <h2 className="profile-name">
                      {perfil.PrimerNombre || "Usuario"} {perfil.PrimerApellido || ""}
                      <span className="verified-badge">✓</span>
                    </h2>
                    <p className="profile-username">@{perfil.username_usuario || "usuario"}</p>
                    
                    <div className="profile-description">
                      <p>{perfil.descripcion || "Wannabe employee"}</p>
                      <p className="profile-link">@double_p</p>
                    </div>
                    
                    <div className="profile-stats">
                      <div className="stat-item">
                        <span className="stat-icon">📍</span>
                        <span>Colombia</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">🗓️</span>
                        <span>{perfil.fecha_nacimiento ? new Date(perfil.fecha_nacimiento).getFullYear() : "2024"}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-icon">⭐</span>
                        <span>{rating.toFixed(1)} valoración</span>
                      </div>
                    </div>
                    
                    <div className="profile-actions">
                      <button className="action-btn primary" onClick={() => navigate("/editar")}>
                        ✏️ Editar Perfil
                      </button>
                      <button className="action-btn secondary" onClick={() => navigate("/chat")}>
                        💬 Mensaje
                      </button>
                    </div>
                    
                    <div className="followers-info">
                      <span className="followers-count">{perfil.prendas?.length || 0} publicaciones</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Content - Timeline */}
              <div className="profile-timeline">
                {/* Navigation Tabs */}
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
                          <p>No hay prendas publicadas</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "intercambios" && (
                    <div className="empty-state">
                      <p>Sección de intercambios próximamente</p>
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
                          <p>No hay imágenes para mostrar</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar - Promotional Content */}
              <div className="profile-sidebar-right">
                <div className="promo-card">
                  <h3>Double P está creciendo</h3>
                  <p>Nuevas funciones y un nuevo look están llegando pronto. Marcadores, cambio de cuenta, modo oscuro, y mucho más - antes de que te des cuenta, podrás ver lo que está pasando.</p>
                  <div className="promo-image">
                    <div className="promo-icon">👕</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading-state">
            <p>Cargando perfil...</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MiPerfil;
