import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import "./VerPrenda.css";

const BACKEND_URL = "http://localhost:5000";

function VerPrenda() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    cargarDetallePrenda();
  }, [id]);

  const cargarDetallePrenda = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/detalle_prenda/${id}`, {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.prenda && data.prenda.length > 0) {
          setPrenda(data.prenda[0]);
        } else {
          setError("Prenda no encontrada");
        }
      } else {
        setError("Error al cargar la prenda");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  // Obtener todas las imágenes disponibles
  const getImagenes = () => {
    if (!prenda) return [];
    const imagenes = [];
    if (prenda.foto) imagenes.push(prenda.foto);
    if (prenda.foto2) imagenes.push(prenda.foto2);
    if (prenda.foto3) imagenes.push(prenda.foto3);
    if (prenda.foto4) imagenes.push(prenda.foto4);
    return imagenes;
  };

  const imagenes = getImagenes();

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="ver-prenda-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando detalles de la prenda...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !prenda) {
    return (
      <>
        <Header />
        <div className="ver-prenda-container">
          <div className="error-state">
            <div className="error-icon">❌</div>
            <h3>Error al cargar la prenda</h3>
            <p>{error}</p>
            <button className="btn-back" onClick={() => navigate(-1)}>
              ← Volver
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="ver-prenda-container">
        <div className="ver-prenda-content">
          {/* Galería de Imágenes */}
          <div className="prenda-gallery">
            <div className="main-image-container">
              {imagenes.length > 0 ? (
                <>
                  <img
                    src={`${BACKEND_URL}/uploads/${imagenes[currentImageIndex]}`}
                    alt={prenda.nombre}
                    className="main-image"
                    onError={(e) => {
                      e.target.src = '/LOGO.png';
                    }}
                  />
                  {imagenes.length > 1 && (
                    <>
                      <button className="nav-btn prev-btn" onClick={prevImage}>
                        ‹
                      </button>
                      <button className="nav-btn next-btn" onClick={nextImage}>
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="no-image">
                  <img src="/LOGO.png" alt="Sin imagen" className="main-image" />
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {imagenes.length > 1 && (
              <div className="thumbnails">
                {imagenes.map((imagen, index) => (
                  <img
                    key={index}
                    src={`${BACKEND_URL}/uploads/${imagen}`}
                    alt={`${prenda.nombre} ${index + 1}`}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                    onError={(e) => {
                      e.target.src = '/LOGO.png';
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Información de la Prenda */}
          <div className="prenda-info">
            <div className="prenda-header">
              <h1 className="prenda-title">{prenda.nombre}</h1>
              <div className="prenda-price">
                {prenda.tipo_publicacion === 'Venta' ? (
                  <span className="price-tag">
                    💰 ${prenda.valor?.toLocaleString('es-CO') || '0'} COP
                  </span>
                ) : (
                  <span className="exchange-tag">
                    🔄 Disponible para intercambio
                  </span>
                )}
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="user-info-section">
              <div className="user-profile">
                <img
                  src={
                    prenda.foto_usuario
                      ? `${BACKEND_URL}/uploads/${prenda.foto_usuario}`
                      : "/LOGO.png"
                  }
                  alt={prenda.username}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.src = '/LOGO.png';
                  }}
                />
                <div className="user-details">
                  <h3 className="user-name">{prenda.username}</h3>
                  <div className="user-rating-container">
                    <div className="user-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="rating-star">
                          {star <= Math.round(prenda.promedio_valoraciones || 0) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="rating-score">
                      ({(prenda.promedio_valoraciones || 0).toFixed(1)})
                    </span>
                  </div>
                </div>
              </div>
              <button 
                className="btn-contact"
                onClick={() => navigate("/chat")}
              >
                💬 Contactar
              </button>
            </div>

            {/* Detalles de la Prenda */}
            <div className="prenda-details">
              <div className="detail-section">
                <h4>Descripción</h4>
                <p className="description">
                  {prenda.descripcion || "Sin descripción disponible"}
                </p>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Talla</span>
                  <span className="detail-value">{prenda.talla || "No especificada"}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Categoría</span>
                  <span className="detail-value">Ropa</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Estado</span>
                  <span className="detail-value">Usado</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Ubicación</span>
                  <span className="detail-value">Colombia</span>
                </div>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="action-buttons">
              {prenda.tipo_publicacion === 'Venta' ? (
                <button className="btn-primary action-btn">
                  💳 Comprar ahora
                </button>
              ) : (
                <button className="btn-primary action-btn">
                  🔄 Proponer intercambio
                </button>
              )}
              <button className="btn-secondary action-btn" onClick={() => navigate(-1)}>
                ← Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VerPrenda;