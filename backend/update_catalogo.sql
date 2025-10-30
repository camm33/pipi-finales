-- Actualizar la vista catalogo para incluir más campos necesarios
CREATE OR REPLACE VIEW catalogo AS
SELECT 
    p.id_publicacion,
    p.descripcion,
    p.estado,
    p.tipo_publicacion,
    p.fecha_publicacion,
    p.id_usuario,
    pr.id_prenda,
    pr.nombre AS nombre_prenda,
    pr.descripcion_prenda,
    pr.talla,
    pr.foto,
    pr.foto2,
    pr.foto3,
    pr.foto4,
    pr.valor
FROM publicacion p
JOIN prenda pr ON p.id_publicacion = pr.id_publicacion;