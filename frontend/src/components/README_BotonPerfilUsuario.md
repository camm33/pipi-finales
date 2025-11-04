# Componente BotonPerfilUsuario

Componente reutilizable para mostrar información de usuario con botón de navegación al perfil. Diseño minimalista con colores Double P.

## Instalación

```javascript
import BotonPerfilUsuario from './components/BotonPerfilUsuario';
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `userId` | number | - | **Requerido** - ID del usuario |
| `username` | string | - | **Requerido** - Nombre del usuario |
| `showLabel` | boolean | true | Mostrar texto "Publicado por:" |
| `customLabel` | string | "Publicado por:" | Texto personalizado del label |
| `className` | string | "" | Clase CSS adicional |
| `onClick` | function | - | Función personalizada de click |

## Ejemplos de uso

### Uso básico (como en DetallePrenda)
```javascript
<BotonPerfilUsuario 
  userId={prenda.id_usuario} 
  username={prenda.username} 
/>
```

### Sin label
```javascript
<BotonPerfilUsuario 
  userId={usuario.id} 
  username={usuario.nombre}
  showLabel={false}
  className="solo-boton"
/>
```

### Con label personalizado
```javascript
<BotonPerfilUsuario 
  userId={vendedor.id} 
  username={vendedor.nombre}
  customLabel="Vendedor:"
/>
```

### Versión compacta
```javascript
<BotonPerfilUsuario 
  userId={autor.id} 
  username={autor.nombre}
  customLabel="Autor:"
  className="compact small"
/>
```

### Con función personalizada
```javascript
<BotonPerfilUsuario 
  userId={usuario.id} 
  username={usuario.nombre}
  onClick={(userId, username) => {
    console.log('Ver perfil de:', username);
    // Lógica personalizada
  }}
/>
```

## Clases CSS disponibles

- `compact` - Versión sin contenedor de fondo
- `solo-boton` - Solo el botón, sin contenedor
- `small` - Versión más pequeña
- Puedes combinar: `className="compact small"`

## Estructura HTML generada

```html
<div class="boton-perfil-container">
  <span class="boton-perfil-label">Publicado por:</span>
  <button class="boton-perfil-btn" title="Ver perfil de usuario">
    <span class="boton-perfil-icon">👤</span>
    <span class="boton-perfil-username">NombreUsuario</span>
  </button>
</div>
```

## Migración desde DetallePrenda

### Antes:
```javascript
<div className="detalle-prenda-publicador">
  <span className="publicado-por-texto">Publicado por:</span>
  <button
    onClick={() => navigate(`/perfil/${prenda.id_usuario}`)}
    className="detalle-prenda-publicador-btn"
    title="Ver perfil de usuario"
  >
    <span style={{ fontSize: '18px' }}>👤</span> {prenda.username}
  </button>
</div>
```

### Después:
```javascript
<BotonPerfilUsuario 
  userId={prenda.id_usuario} 
  username={prenda.username} 
/>
```

## Colores Double P incluidos

- Dorado principal: `#b8904a`
- Dorado oscuro: `#9A7738`
- Gris elegante: `#6c757d`
- Fondo claro: `#fafafa`
- Bordes: `#e9ecef`