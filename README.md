# Pan de Casa - Tienda de Pan Artesanal

Sistema de gestión y catálogo en línea para la panadería artesanal "Pan de Casa". Permite a los clientes visualizar productos, agregarlos a un carrito y realizar pedidos. Además, cuenta con un panel de administración para gestionar el catálogo y las órdenes.

## Estructura del Proyecto

El proyecto está construido utilizando HTML, CSS (Vanilla) y JavaScript (Vanilla) sin frameworks adicionales, priorizando la simplicidad y el rendimiento.

```text
/
├── admin/                  # Vistas del panel de administración
│   ├── dashboard.html      # Resumen general (Métricas)
│   ├── orders.html         # Gestión de pedidos activos
│   └── product-form.html   # CRUD del catálogo de productos
├── css/
│   └── index.css           # Hoja de estilos principal (Design System)
├── js/
│   ├── store.js            # Lógica central (Estado, LocalStorage, Modelos)
│   ├── catalog.js          # Controlador de la vista principal del catálogo
│   └── admin-catalog.js    # Controlador de la vista de gestión de productos
├── index.html              # Catálogo principal (Página de inicio)
├── cart.html               # Vista del carrito de compras
├── checkout.html           # Proceso de pago/confirmación
└── order-status.html       # Seguimiento de pedidos para clientes
```

## Características Técnicas

- **Persistencia de Datos:** Utiliza `localStorage` del navegador para simular una base de datos de Productos, Carrito y Órdenes.
- **Gestión de Estado:** La clase `Store` (en `store.js`) actúa como un gestor de estado centralizado, emitiendo eventos personalizados (CustomEvents) para mantener la UI sincronizada.
- **Seguridad:** Implementación de funciones de sanitización (Escape HTML) para mitigar vulnerabilidades XSS en la renderización dinámica.
- **Manejo de Errores:** Bloques `try/catch` implementados en el acceso y parseo de datos estructurados.

## Instalación y Uso Local

Al ser un proyecto estático, no requiere un servidor backend complejo para su visualización básica. 

1. Clona o descarga el repositorio.
2. Abre el archivo `index.html` en cualquier navegador web moderno.
3. (Recomendado) Utiliza una extensión como "Live Server" en VSCode o un servidor estático simple (`npx serve`, `python -m http.server`) para evitar problemas con CORS al cargar recursos si se añaden funcionalidades futuras.

## Notas de Calidad (ISO Compliance)

Este proyecto ha sido revisado y ajustado tomando en cuenta lineamientos inspirados en normativas ISO:
- **ISO 5055 & ISO 27001:** Adopción de prácticas de codificación para prevenir inyecciones (XSS).
- **ISO 25000:** Mejora en la mantenibilidad al separar responsabilidades (HTML vs. JS) y asegurar operaciones riesgosas (`localStorage`) con manejo de errores persistentes.
- **ISO 9001:** Implementación de este documento para mantener la trazabilidad e información del producto controlada.
