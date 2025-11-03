import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./GestionPublicaciones.css";

function GestionPrendas() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_prenda: "",
    nombre: "",
    username: "",
    id_usuario: "",
    descripcion: "",
    talla: "",
    tipo_publicacion: "",
    valor: "",
    foto: null,
    foto2: null,
    foto3: null,
    foto4: null,
    foto_actual: "",
    foto2_actual: "",
    foto3_actual: "",
    foto4_actual: "",
  });

  const [preview, setPreview] = useState({
    foto: null,
    foto2: null,
    foto3: null,
    foto4: null,
  });

  // Nuevo estado para controlar cuántos cuadros mostrar
  const [fotosCount, setFotosCount] = useState(1);

  // Referencias para los inputs de archivo
  const fileInputRefs = useRef({
    foto: null,
    foto2: null,
    foto3: null,
    foto4: null
  });

  // --- Cargar datos desde el backend ---
  useEffect(() => {
    if (!id) return;

    const fetchPrenda = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/detalle_prenda/${id}`);
        const data = await res.json();
        const prenda = data.prenda[0] || {};

        setForm({
          id_prenda: prenda.id_prenda || "",
          nombre: prenda.nombre || "",
          username: prenda.username || "",
          id_usuario: prenda.id_usuario || "",
          descripcion: prenda.descripcion || "",
          talla: prenda.talla || "",
          tipo_publicacion: prenda.tipo_publicacion || "",
          valor: prenda.valor || "",
          foto_actual: prenda.foto || "",
          foto2_actual: prenda.foto2 || "",
          foto3_actual: prenda.foto3 || "",
          foto4_actual: prenda.foto4 || "",
          foto: null,
          foto2: null,
          foto3: null,
          foto4: null,
        });

        // Calcular cuántas fotos existen para mostrar los cuadros correctos
        const existingPhotos = [prenda.foto, prenda.foto2, prenda.foto3, prenda.foto4]
          .filter(photo => photo && photo.trim() !== '')
          .length;
        setFotosCount(Math.max(1, existingPhotos + (existingPhotos < 4 ? 1 : 0)));
      } catch (err) {
        alert("Error al cargar la prenda: " + err.message);
      }
    };

    fetchPrenda();
  }, [id]);

  // --- Manejar cambios ---
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
      
      // Actualizar el contador de fotos para mostrar el siguiente cuadro
      const fotoNumbers = ['foto', 'foto2', 'foto3', 'foto4'];
      const currentIndex = fotoNumbers.indexOf(name);
      
      if (currentIndex !== -1 && currentIndex + 1 >= fotosCount && fotosCount < 4) {
        setFotosCount(fotosCount + 1);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // --- Editar prenda ---
  const handleEditar = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") formData.append(key, value);
    });

    try {
      const res = await fetch(`http://localhost:5000/editar/${id}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Editado correctamente");
        navigate("/catalogo");
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch {
      alert("❌ Error del servidor");
    }
  };

  // --- Eliminar prenda ---
  const handleEliminar = async () => {
    if (!window.confirm("¿Eliminar esta prenda?")) return;
    try {
      const res = await fetch(`http://localhost:5000/eliminar/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || "Eliminado correctamente");
        navigate("/catalogo");
      } else {
        alert("❌ Error al eliminar");
      }
    } catch {
      alert("❌ Error del servidor");
    }
  };

  // --- Función para quitar imagen ---
  const handleRemoveImage = (photoKey) => {
    // Limpiar la imagen del formulario y preview
    setForm((prev) => ({ 
      ...prev, 
      [photoKey]: null,
      [`${photoKey}_actual`]: ""
    }));
    setPreview((prev) => ({ 
      ...prev, 
      [photoKey]: null 
    }));

    // Recalcular el contador de fotos
    const updatedForm = { 
      ...form, 
      [photoKey]: null,
      [`${photoKey}_actual`]: ""
    };
    
    const fotoKeys = ['foto', 'foto2', 'foto3', 'foto4'];
    const remainingPhotos = fotoKeys.filter(key => 
      (updatedForm[`${key}_actual`] && updatedForm[`${key}_actual`] !== "") || 
      preview[key]
    ).length;
    
    setFotosCount(Math.max(1, remainingPhotos + (remainingPhotos < 4 ? 1 : 0)));
  };

  // --- Render fotos con nuevo diseño y botón eliminar ---
  const renderFoto = (num) => {
    const key = num === 1 ? 'foto' : `foto${num}`;
    const actual = form[`${key}_actual`];
    const previewUrl = preview[key];
    const hasImage = previewUrl || actual;

    return (
      <div key={key} className="foto-upload-container">
        <div className="foto-upload-box" data-has-image={hasImage}>
          {hasImage ? (
            <>
              <img 
                src={previewUrl || `http://localhost:5000/uploads/${actual}`} 
                alt={`Foto ${num}`} 
                className="uploaded-image"
              />
              <div className="image-overlay">
                <div className="overlay-buttons">
                  <button 
                    type="button"
                    className="image-action-btn change-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (fileInputRefs.current[key]) {
                        fileInputRefs.current[key].click();
                      }
                    }}
                  >
                    <div className="plus-icon">+</div>
                    <span>Cambiar</span>
                  </button>
                  <button 
                    type="button"
                    className="image-action-btn remove-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveImage(key);
                    }}
                  >
                    <div className="remove-icon">×</div>
                    <span>Quitar</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-upload-box">
              <button 
                type="button"
                className="upload-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (fileInputRefs.current[key]) {
                    fileInputRefs.current[key].click();
                  }
                }}
              >
                <div className="plus-icon">+</div>
                <span className="upload-text">Subir foto</span>
              </button>
            </div>
          )}
          <input 
            ref={(el) => fileInputRefs.current[key] = el}
            type="file" 
            name={key} 
            accept="image/*" 
            onChange={handleChange}
            className="file-input"
            style={{ display: 'none' }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="editar-container">
      <div className="editar-panel">
        <div className="editar-fotos">
          {Array.from({ length: fotosCount }, (_, index) => renderFoto(index + 1))}
        </div>

        <form className="editar-formulario" onSubmit={handleEditar}>
          <h2>EDITAR PRENDA</h2>

          <div>
            <label htmlFor="nombre">Nombre de la Prenda</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingresa el nombre de la prenda"
            />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Describe las características de la prenda"
            />
          </div>

          <div>
            <label htmlFor="talla">Talla</label>
            <input
              id="talla"
              type="text"
              name="talla"
              value={form.talla}
              onChange={handleChange}
              placeholder="XS, S, M, L, XL, etc."
            />
          </div>

          <div>
            <label htmlFor="valor">Valor (COP)</label>
            <input
              id="valor"
              type="number"
              name="valor"
              value={form.valor}
              onChange={handleChange}
              placeholder="Precio en pesos colombianos"
            />
          </div>

          {/* Campos ocultos */}
          <input type="hidden" name="foto_actual" value={form.foto_actual} />
          <input type="hidden" name="foto2_actual" value={form.foto2_actual} />
          <input type="hidden" name="foto3_actual" value={form.foto3_actual} />
          <input type="hidden" name="foto4_actual" value={form.foto4_actual} />

                    <div className="editar-botones">
            <button type="submit" className="btn-accion btn-primary">
              Guardar Cambios
            </button>
            <button type="button" className="btn-accion" onClick={handleEliminar}>
              Eliminar Prenda
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GestionPrendas;