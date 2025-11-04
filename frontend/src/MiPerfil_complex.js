import React, { useState, useEffect } from 'react';
import Header from './Header';
import './perfiles.css';

function MiPerfil() {
  const [activeTab, setActiveTab] = useState('posts');
  const [usuario, setUsuario] = useState(null);
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('MiPerfil: useEffect ejecutándose');
    const userData = localStorage.getItem('user');
    console.log('MiPerfil: userData desde localStorage:', userData);
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log('MiPerfil: usuario parseado:', user);
        setUsuario(user);
        cargarPublicaciones(user.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoading(false);
      }
    } else {
      // No hay usuario en localStorage
      console.log('MiPerfil: No hay usuario en localStorage');
      setLoading(false);
    }
  }, []);

  const cargarPublicaciones = async (userId) => {
    console.log('MiPerfil: Cargando publicaciones para userId:', userId);
    try {
      const response = await fetch(`http://localhost:5000/publicaciones/usuario/${userId}`);
      console.log('MiPerfil: Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('MiPerfil: Publicaciones cargadas:', data);
        setPublicaciones(data);
      } else {
        console.error('Error al cargar publicaciones:', response.status);
        setPublicaciones([]);
      }
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
      setPublicaciones([]);
    } finally {
      console.log('MiPerfil: Finalizando carga, setting loading to false');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="loading-spinner"></div>
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="loading-state">
        <div className="empty-state-icon">👤</div>
        <h3 className="empty-state-title">No se encontró información del usuario</h3>
        <p className="empty-state-text">
          Por favor, inicia sesión para ver tu perfil.
        </p>
        <button 
          className="action-btn primary" 
          onClick={() => window.location.href = '/login'}
          style={{marginTop: '20px'}}
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Header />
      
      {/* Left Navigation Sidebar */}
      <div className="profile-sidebar-nav">
        <div className="nav-icon active">
          <i className="fas fa-user"></i>
        </div>
        <div className="nav-icon">
          <i className="fas fa-heart"></i>
        </div>
        <div className="nav-icon">
          <i className="fas fa-bookmark"></i>
        </div>
        <div className="nav-icon">
          <i className="fas fa-cog"></i>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Hero Section */}
        <div className="profile-hero">
          <div className="hero-background"></div>
        </div>

        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-top-section">
            <div className="profile-avatar-section">
              <img 
                src={usuario.foto_perfil || '/api/placeholder/120/120'} 
                alt={usuario.nombre}
                className="avatar-image"
              />
            </div>
            
            <div className="profile-info-main">
              <h1 className="profile-name">{usuario.nombre} {usuario.apellido}</h1>
              
              <div className="profile-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span 
                      key={star} 
                      className={`star ${star <= (usuario.valoracion || 0) ? '' : 'empty'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-text">{usuario.valoracion || 0}/5 reviews</span>
              </div>

              <div className="profile-actions-top">
                <button className="action-btn primary">
                  <i className="fas fa-comment"></i>
                  Enviar Mensaje
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-user-plus"></i>
                  Seguir
                </button>
                <button className="action-btn secondary">
                  <i className="fas fa-share"></i>
                  Compartir
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="profile-stats-section">
            <div className="stat-group">
              <span className="stat-number">{publicaciones.length}</span>
              <span className="stat-label">Publicaciones</span>
            </div>
            <div className="stat-group">
              <span className="stat-number">147</span>
              <span className="stat-label">Siguiendo</span>
            </div>
            <div className="stat-group">
              <span className="stat-number">320</span>
              <span className="stat-label">Seguidores</span>
            </div>
            <div className="stat-group">
              <span className="stat-number">56</span>
              <span className="stat-label">Reseñas</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="profile-content-grid">
          {/* Main Content */}
          <div className="profile-main-content">
            {/* Projects Section */}
            <div className="projects-section">
              <div className="section-header">
                <h3 className="section-title">
                  <i className="fas fa-tshirt"></i>
                  Prendas
                  <span className="section-count">{publicaciones.length}</span>
                </h3>
              </div>
              
              <div className="projects-grid">
                {publicaciones.slice(0, 6).map((pub) => (
                  <div key={pub.id} className="project-item">
                    <img 
                      src={`http://localhost:5000/uploads/${pub.imagen}`}
                      alt={pub.titulo}
                      className="project-image"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Section */}
            <div className="timeline-section">
              <div className="timeline-header">
                <div className="timeline-nav">
                  <button 
                    className={`nav-tab ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                  >
                    Posts
                  </button>
                  <button 
                    className={`nav-tab ${activeTab === 'media' ? 'active' : ''}`}
                    onClick={() => setActiveTab('media')}
                  >
                    Media
                  </button>
                  <button 
                    className={`nav-tab ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                  >
                    Reseñas
                  </button>
                </div>
              </div>

              <div className="timeline-content">
                {activeTab === 'posts' && (
                  <div>
                    {publicaciones.length > 0 ? (
                      publicaciones.map((pub) => (
                        <div key={pub.id} className="timeline-post">
                          <div className="post-header">
                            <img 
                              src={usuario.foto_perfil || '/api/placeholder/50/50'}
                              alt={usuario.nombre}
                              className="post-avatar"
                            />
                            <div className="post-meta">
                              <div className="post-author">{usuario.nombre} {usuario.apellido}</div>
                              <div className="post-time">{new Date(pub.fecha_publicacion).toLocaleDateString()}</div>
                            </div>
                          </div>
                          
                          <div className="post-content">
                            <p className="post-text">{pub.descripcion}</p>
                            <img 
                              src={`http://localhost:5000/uploads/${pub.imagen}`}
                              alt={pub.titulo}
                              className="post-image"
                            />
                          </div>

                          <div className="post-actions">
                            <div className="post-action">
                              <i className="far fa-heart"></i>
                              <span>Me gusta</span>
                            </div>
                            <div className="post-action">
                              <i className="far fa-comment"></i>
                              <span>Comentar</span>
                            </div>
                            <div className="post-action">
                              <i className="far fa-share"></i>
                              <span>Compartir</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-state">
                        <div className="empty-state-icon">📸</div>
                        <h3 className="empty-state-title">Aún no hay publicaciones</h3>
                        <p className="empty-state-text">Cuando compartas prendas, aparecerán aquí.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'media' && (
                  <div className="media-grid" style={{padding: '20px', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px'}}>
                    {publicaciones.map((pub) => (
                      <div key={pub.id} className="media-item">
                        <img 
                          src={`http://localhost:5000/uploads/${pub.imagen}`}
                          alt={pub.titulo}
                          className="media-image"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="empty-state">
                    <div className="empty-state-icon">⭐</div>
                    <h3 className="empty-state-title">Reseñas próximamente</h3>
                    <p className="empty-state-text">Las reseñas de otros usuarios aparecerán aquí.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="profile-sidebar-right">
            {/* Performance Widget */}
            <div className="sidebar-widget performance-widget">
              <h4 className="widget-title">Rendimiento</h4>
              <div className="performance-score">
                <span className="score-number">{usuario.valoracion || 0}</span>
                <div className="score-label">Puntuación Total</div>
                <div className="score-details">basado en {usuario.total_reseñas || 0} reviews</div>
              </div>
            </div>

            {/* Who to Follow Widget */}
            <div className="sidebar-widget">
              <h4 className="widget-title">Personas que seguir</h4>
              <div className="following-item">
                <img src="/api/placeholder/40/40" alt="Usuario" className="following-avatar" />
                <div className="following-info">
                  <div className="following-name">María García</div>
                  <div className="following-title">Diseñadora de Moda</div>
                </div>
                <button className="follow-btn">Seguir</button>
              </div>
              <div className="following-item">
                <img src="/api/placeholder/40/40" alt="Usuario" className="following-avatar" />
                <div className="following-info">
                  <div className="following-name">Carlos Ruiz</div>
                  <div className="following-title">Estilista</div>
                </div>
                <button className="follow-btn">Seguir</button>
              </div>
            </div>

            {/* Recent Activity Widget */}
            <div className="sidebar-widget">
              <h4 className="widget-title">Actividad Reciente</h4>
              <div className="media-grid">
                {publicaciones.slice(0, 4).map((pub) => (
                  <div key={pub.id} className="media-item">
                    <img 
                      src={`http://localhost:5000/uploads/${pub.imagen}`}
                      alt={pub.titulo}
                      className="media-image"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MiPerfil;