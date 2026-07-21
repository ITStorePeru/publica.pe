# Módulo 2: Sistema de Diseño, Arquitectura de Información y Estructura de Navegación Web (Layout)

## 1 Objetivo
El objetivo de este módulo es definir con precisión milimétrica la identidad visual, la jerarquía de la información, el sistema de componentes del lado del cliente (Frontend) y la estructura de navegación principal de la plataforma PUBLICA.PE. Se busca plasmar el diseño de interfaz de usuario de alta fidelidad provisto para garantizar un rendimiento de carga ultra-rápido (Core Web Vitals excelentes, LCP < 1.2s), usabilidad óptima en dispositivos móviles y de escritorio (Responsive Design), SEO avanzado para indexación de millones de productos, y una experiencia de usuario cohesionada que fomente la conversión y retención.

---

## 2 Alcance
El alcance del módulo abarca el desarrollo de la arquitectura del frontend y la guía de estilos de interfaz:
*   **Identidad Visual y Tokens de Diseño:** Definición de la paleta de colores de la marca, escala tipográfica, espaciados, bordes y sombras basados en el logotipo y la maqueta web de alta fidelidad.
*   **Arquitectura de Navegación (Layout Global):** Diseño del Header (barra de búsqueda, selectores, acciones rápidas) y Footer de la plataforma, consistentes en todas las páginas.
*   **Estructura de la Página de Inicio (Home Page):** Estructuración de las secciones clave: Hero, Categorías, Carruseles de Productos (Destacados, Vehículos, Tecnología), Grilla Dividida (Productos Nuevos vs. Usados), Tiendas Oficiales, Banner de Publicación y Barra de Propuesta de Valor.
*   **Estructura de Componentes Reutilizables (Design System):** Especificación de botones, inputs, selectores de ubicación, tarjetas de producto (Product Cards), y logos de marcas socias.
*   **Optimización de Carga y SEO:** Estrategia de renderizado (SSR/ISR/CSR), precarga de imágenes críticas, optimización de fuentes y semántica HTML5 estructurada para motores de búsqueda.

*Fuera del alcance:* La implementación física de las llamadas al API del catálogo, el procesamiento de transacciones financieras reales y la mensajería en tiempo real. Estas capas interactuarán consumiendo este módulo de UI.

---

## 3 Casos de uso
1.  **Navegación e Interacción con el Buscador Global:** Un usuario ingresa a la home, selecciona el ámbito geográfico (Perú o departamento específico), escribe palabras clave de interés en la barra de búsqueda y selecciona una categoría base. El sistema procesa la interacción del lado del cliente sin recargar la página y actualiza los parámetros de búsqueda de la URL.
2.  **Exploración de Categorías Principales:** Un usuario interactúa con la sección "Explora por categorías". Al hacer clic o deslizar en móvil, accede instantáneamente a los listados segmentados de anuncios mediante rutas dinámicas optimizadas.
3.  **Visualización de Tarjetas de Producto con Estados Dinámicos:** El usuario navega por la sección de "Productos destacados". El sistema expone tarjetas de productos completas que reflejan el estado del anuncio (Insignia "Destacado"), datos del vendedor verificado, geolocalización aproximada, puntuación, y permite agregar a "Favoritos" en un solo clic con respuesta visual inmediata.
4.  **Descubrimiento Binario de Productos (Nuevos vs. Usados):** Un usuario busca ofertas específicas y utiliza la sección dividida en la home para comparar y explorar artículos clasificados rígidamente por su condición física ("Productos Nuevos" a la izquierda, "Productos Usados" a la izquierda de la pantalla).
5.  **Conversión de Publicación Rápida (CTA Primario):** Un visitante decide vender un artículo. Hace clic en el botón naranja "Publicar Gratis" del Header o en el botón del Banner de conversión, siendo redirigido de manera fluida y con animaciones de transición al embudo de creación de anuncios.

---

## 4 Historias de usuario
*   **HU-2.01 (Buscador Altamente Accesible):** Como usuario comprador, quiero tener un buscador predictivo y prominente en la cabecera de la web, que me permita filtrar por ubicación y categorías simultáneamente, para encontrar ofertas locales en segundos.
*   **HU-2.02 (Navegación Móvil Intuitiva - Mobile-First):** Como usuario de smartphone, quiero que la home de PUBLICA.PE se adapte perfectamente a mi pantalla táctil, permitiéndome deslizar horizontalmente las categorías y carruseles de productos de forma fluida y sin retrasos de renderizado.
*   **HU-2.03 (Estructura de Tarjeta de Producto Informativa):** Como comprador, quiero ver en cada tarjeta de producto de un vistazo: el precio en Soles (S/), el título, la ubicación, si el artículo es nuevo o usado, y el nombre y reputación del vendedor, para decidir rápidamente si me interesa sin necesidad de ingresar al detalle del anuncio.
*   **HU-2.04 (Acceso Directo a Tiendas Oficiales B2C):** Como comprador corporativo o de tecnología de marca, quiero visualizar una sección dedicada de marcas de renombre (Samsung, Xiaomi, Lenovo, etc.) para acceder directamente a sus catálogos autorizados y comprar con total garantía de fábrica.
*   **HU-2.05 (Propuesta de Valor Clara):** Como usuario nuevo, quiero visualizar en la parte inferior de la página las garantías, ventajas y características clave de seguridad (chat seguro, verificación biométrica, publicación gratuita) para tener total confianza en la plataforma.

---

## 5 Reglas de negocio
*   **RN-2.01 (Cohesión de Identidad de Marca):** El uso de los colores primarios y secundarios de PUBLICA.PE debe respetar estrictamente la maqueta aprobada: Violeta (`#6B38A6` o similar) como color institucional principal, Naranja (`#FF6B00` o similar) exclusivo para CTAs de conversión primaria (e.g. "+ Publicar Gratis" y botones de búsqueda), Verde-Teal (`#00A896`) para acentuar elementos positivos e insignias, y Amarillo (`#FFC800`) para estados decorativos e íconos de estrellas de reputación.
*   **RN-2.02 (Consistencia Mobile-First):** Ningún componente de la interfaz puede tener un ancho estático mayor que el viewport del dispositivo móvil. Todos los grids de la home deben colapsar elegantemente (e.g. de 5 columnas en escritorio de alta definición a 2 columnas o carrusel horizontal en teléfonos móviles).
*   **RN-2.03 (Rendimiento de Imágenes Obligatorio):** Todas las imágenes de tarjetas de productos, banners de marca y avatares de usuario deben pasar obligatoriamente por el componente de optimización de imágenes (Next.js `<Image>`), convirtiéndose dinámicamente a formatos WebP/AVIF y requiriendo dimensiones de relación de aspecto fija para evitar cambios acumulativos de diseño (CLS).
*   **RN-2.04 (Accesibilidad de Contraste WAI-ARIA):** Todo texto colocado sobre un fondo de color (por ejemplo, badges con fondo verde, azul o naranja) debe poseer una relación de contraste mínima de 4.5:1 (conforme a WCAG 2.1 AA) para asegurar la accesibilidad para usuarios con deficiencias visuales.
*   **RN-2.05 (Persistencia de Filtros Rápidos):** Al cambiar el filtro de ubicación en el Header, la selección del usuario debe guardarse inmediatamente en el almacenamiento local del navegador (`localStorage`) para que todas las búsquedas y recomendaciones en visitas futuras se contextualicen automáticamente por defecto a esa región geográfica.

---

## 6 Arquitectura

### Componentes y Jerarquía de la Interfaz (Frontend)
La interfaz de usuario de PUBLICA.PE se estructura utilizando Next.js 15 y Tailwind CSS bajo un diseño modular y altamente desacoplado:

*   **`RootLayout (app/layout.tsx)`:** Inicializa las fuentes institucionales globales ("Inter" y "Space Grotesk") y gestiona la estructura básica HTML. Envuelve el árbol de componentes con los proveedores de estado globales (`QueryClientProvider` para TanStack Query, `ZustandProvider` para estados dinámicos del cliente).
*   **`HeaderComponent (components/layout/Header.tsx)` [Client Component]:**
    *   *Sección Superior:* Contiene el logotipo de PUBLICA.PE optimizado, la barra de búsqueda unificada (con selector de departamento/región interactivo), accesos directos a favoritos, mensajería, centro de notificaciones con sistema de badges, botones de autenticación adaptativa ("Iniciar Sesión" / "Registrarse"), y el botón destacado de conversión de publicación rápida ("+ Publicar Gratis").
*   **`FooterComponent (components/layout/Footer.tsx)` [Server Component]:**
    *   Estructura estática de navegación que incluye enlaces corporativos, información de ayuda, términos legales, datos de contacto del corporativo y las insignias de las redes sociales oficiales.
*   **`HomePage (app/page.tsx)` [Server Component con hojas de cliente]:**
    *   Ensambla los módulos visuales de forma secuencial:
        1.  `HeroSection` [Server Component]: Banner promocional dinámico con optimización LCP que contiene el copy principal y el montaje visual optimizado de los productos.
        2.  `CategoryExplore` [Client Component]: Fila scrollable horizontalmente con iconos circulares estilizados por categoría de negocio.
        3.  `ProductCarouselSection` [Client Component]: Carruseles táctiles reutilizables para "Productos Destacados" y "Vehículos para ti".
        4.  `SplitConditionSection` [Client Component]: Bloque binario yuxtapuesto que divide simétricamente en columnas "Productos Nuevos" y "Productos Usados".
        5.  `OfficialStoresSection` [Server Component]: Grilla de marcas oficiales reconocidas por el marketplace.
        6.  `PublisherBanner` [Server Component]: Banner de conversión masiva naranja con mockup de la app móvil.
        7.  `ValuePropositionStrip` [Server Component]: Línea de beneficios del marketplace con iconos limpios de `lucide-react`.

### Arquitectura de Navegación e Información (SSR vs CSR)
Para garantizar un SEO impecable, la plataforma utiliza renderizado en el servidor (SSR) para generar el HTML estático de las tarjetas de producto iniciales, los textos del Hero, y las secciones del Footer. Al mismo tiempo, se implementan hidrataciones progresivas del lado del cliente (CSR) para:
*   Filtros interactivos y predictivos en el input de búsqueda.
*   Animaciones de hover y click táctiles usando Framer Motion.
*   Persistencia transitoria de favoritos y lecturas en tiempo real de notificaciones (vía WebSocket).

---

## 7 Modelo de datos (Frontend)

### Tipos y Estructuras de Datos de Interfaz (TypeScript Interfaces)

Aunque el backend almacena los datos de forma robusta en PostgreSQL, el frontend de PUBLICA.PE requiere modelos estrictamente definidos en TypeScript para representar las entidades de interfaz de usuario de manera segura.

```typescript
// Interface para representar la estructura geográfica de filtrado rápido
export interface GeographicLocation {
  id: string;
  name: string;      // Ej: "Lima", "Arequipa", "Cusco"
  country: string;   // "Perú"
}

// Interface que define una categoría en el carrusel principal
export interface CategoryItem {
  id: string;
  slug: string;
  name: string;      // Ej: "Tecnología", "Vehículos", "Inmuebles"
  iconName: string;  // Nombre de icono mapeado a Lucide-React
}

// Interface que representa el modelo unificado de Tarjeta de Producto (Product Card)
export interface ProductCardData {
  id: string;
  title: string;
  price: number;
  currency: 'S/' | 'USD';
  imageUrl: string;
  location: string;
  condition: 'NEW' | 'USED';
  isFeatured: boolean;
  merchant: {
    name: string;
    verified: boolean;
    rating: number; // Ej: 4.9
  };
  createdAt: string;
}

// Interface para el control del estado global de la interfaz de usuario (Zustand State)
export interface UIState {
  selectedLocation: GeographicLocation;
  searchQuery: string;
  activeCategory: string | null;
  favoriteProductIds: string[];
  unreadNotificationsCount: number;
  isSidebarOpen: boolean;
}
```

### Estrategia de Almacenamiento en Cliente (Persistence)
*   `favoriteProductIds`: Se persiste en `localStorage` sincronizándose automáticamente con el almacenamiento de usuario en base de datos en caso de que esté autenticado.
*   `selectedLocation`: Se guarda en `localStorage` con fallback al servicio de geolocalización por IP en el primer ingreso.

---

## 8 APIs

El frontend consume endpoints optimizados para velocidad mediante el API Gateway.

### API de Catálogo e Inicio (Consumo Frontend)
*   `GET /api/v1/catalog/featured`: Retorna el listado de productos destacados. Incluye paginación e imágenes optimizadas.
*   `GET /api/v1/catalog/by-condition?condition={NEW|USED}&limit=8`: Retorna productos segmentados para la sección dividida.
*   `GET /api/v1/locations/list`: Retorna el listado de los departamentos del Perú con soporte de autocompletado y lat/long base.
*   `GET /api/v1/categories`: Retorna el listado plano de categorías activas y sus rutas asociadas.

### Canales WebSocket para la Interfaz de Usuario
*   **Canal `/ws/v1/ui/notifications`**: Mantiene al cliente Next.js sincronizado para actualizar el badge rojo de notificaciones no leídas en el Header inmediatamente ocurra una interacción con un anuncio del usuario.

---

## 9 Seguridad

El frontend de PUBLICA.PE implementa barreras de seguridad críticas para proteger a los usuarios de ataques en el navegador y garantizar la integridad de la interfaz:
*   **Content Security Policy (CSP) Estricta:** Cabeceras HTTP que limitan el origen de ejecución de scripts, estilos, fuentes e imágenes, bloqueando de raíz intentos de inyección de código malicioso (XSS). Solo se permiten orígenes de confianza (como el dominio propio, Cloudflare y dominios oficiales de Google/Apple para auth).
*   **Prevención de Clickjacking:** Configuración de cabeceras de respuesta `X-Frame-Options: SAMEORIGIN` y `Content-Security-Policy: frame-ancestors 'self'` para evitar que el marketplace sea incrustado de manera maliciosa dentro de iframes externos invisibles para robar clics o datos.
*   **Saneamiento HTML de Entradas (XSS Prevention):** Toda entrada del usuario en el buscador o cajas de comentarios es saneada del lado del cliente utilizando librerías de purificación de HTML antes de ser inyectada o renderizada dinámicamente en el DOM de la aplicación.
*   **Protección de Rutas de Autenticación (Route Guards):** Implementación de Next.js Middleware para interceptar y proteger rutas restringidas (como el panel de control del vendedor, creación de publicaciones, mensajería), redirigiendo al login si no se encuentra un token de sesión legítimo en cookies HTTP-Only.

---

## 10 Escalabilidad

### Estrategia de Entrega y Carga en Escala de Millones de Usuarios
*   **Incremental Static Regeneration (ISR) para Páginas de Catálogo:** Las páginas que muestran las categorías y listados principales se generan de forma estática en el servidor y se actualizan de forma asíncrona en segundo plano cada 60 segundos (ISR). Esto permite que las peticiones de millones de usuarios simultáneos sean servidas directamente desde la memoria caché global del CDN (Cloudflare) con tiempo de respuesta de 15ms, sin tocar la base de datos principal de PostgreSQL.
*   **Optimización LCP mediante Preconexión de Recursos:** La página de inicio implementa directivas de optimización del navegador (`dns-prefetch` y `preconnect`) para conectarse de forma anticipada a los servidores de imágenes de Cloudflare R2 y servidores de autenticación, permitiendo descargar los recursos visuales críticos del Hero instantáneamente.
*   **Código Dividido por Componentes (Route-based Code Splitting):** Next.js realiza de forma nativa la división de paquetes por rutas. Además, se implementa carga dinámica (`next/dynamic`) para componentes pesados que no se muestran inmediatamente en pantalla (como modales de confirmación o carruseles interactivos del final de la página), descargándolos del lado del cliente únicamente cuando entran en el viewport (Lazy Loading).
*   **Uso de Tailwind CSS para Estilos Planos de Alta Compresión:** Tailwind CSS compila únicamente las clases de utilidad que se usan activamente en el proyecto. El archivo CSS global compilado resultante tiene un peso menor a 15KB (gzipped), eliminando la sobrecarga común de archivos de estilos pesados que retrasan el renderizado del navegador (FCP).

---

## 11 Riesgos

### Identificación de Amenazas en Frontend y Planes de Mitigación
1.  **Riesgo Técnico: Cambios Acumulativos de Diseño (CLS) que degraden el SEO en Google.**
    *   *Detalle:* Si los carruseles de productos destacados o las secciones de marcas tardan en cargar sus imágenes y no poseen dimensiones predefinidas, el contenido de la página dará un salto visual brusco al hidratarse el cliente, lo que penalizará fuertemente el ranking SEO de la plataforma.
    *   *Mitigación:* Se obliga a que todas las tarjetas de producto y contenedores de imágenes posean dimensiones con relaciones de aspecto fijas (`aspect-video`, `aspect-square`) y esqueletos de carga animados (Skeletons) idénticos en tamaño para retener el espacio exacto del elemento mientras se descarga el recurso real.
2.  **Riesgo Funcional: Experiencia de scroll e interacción lenta en dispositivos móviles de gama baja.**
    *   *Detalle:* Con más de 100 productos renderizados simultáneamente en carruseles y listados dinámicos en la home, los celulares antiguos pueden sufrir caídas de frames críticas durante el scroll, causando frustración.
    *   *Mitigación:* Se implementa virtualización de listas (con librerías de alto rendimiento) para asegurar que solo se rendericen en el árbol del DOM aquellos componentes de tarjeta de producto que se encuentran visibles dentro del viewport del dispositivo móvil.
3.  **Riesgo de Negocio: Pérdida de interés o rebote de usuarios debido a tiempos de carga iniciales mayores a 3 segundos.**
    *   *Detalle:* La experiencia de compra en el marketplace depende de la inmediatez. Un retraso en la carga inicial de la home debido a consultas complejas de base de datos provoca el abandono inmediato del usuario.
    *   *Mitigación:* El 100% de la home de inicio se compila de forma estática pura, desacoplada de consultas síncronas de base de datos. Los carruseles de productos destacados cargan de forma diferida mediante peticiones REST asíncronas no bloqueantes una vez que la estructura básica de la página ha sido completamente renderizada y es interactiva para el usuario.

---

## 12 Buenas prácticas
*   **Semantic HTML5 markup:** Uso estricto de elementos semánticos de HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) para asegurar una estructura web impecable comprensible para lectores de pantalla y bots de indexación de buscadores.
*   **Estrategia de iconos optimizada:** Uso exclusivo de la librería `lucide-react` importando componentes de forma individual para habilitar el sacudido de árbol (Tree Shaking) automático de empaquetado, evitando cargar iconos que no se utilizan.
*   **Estilo Declarativo Responsivo en Tailwind:** Queda terminantemente prohibido calcular anchos y tamaños dinámicos de componentes de UI mediante scripts de JavaScript (`window.innerWidth`). Todos los cambios responsivos se declaran puramente con modificadores de Tailwind CSS (`sm:grid-cols-2 lg:grid-cols-5`).

---

## 13 Roadmap de implementación

```
[MÓDULO DE IDENTIDAD Y ESTRUCTURA: SECUENCIA DE PRIORIDAD DE TAREAS FRONtend]

Fase 1: Configuración de Configuración Global y Tokens de Diseño (Alta Prioridad)
  ├── Tarea 1.1: Configurar fuentes e incorporar tokens de diseño cromático (Tailwind CSS Config)
  └── Tarea 1.2: Implementar el RootLayout global y los proveedores de estado (Zustand y TanStack Query)

Fase 2: Creación de Componentes de Layout Globales (Prioridad Media-Alta)
  ├── Tarea 2.1: Desarrollar el Header interactivo responsivo con barra de búsqueda y selector de ubicación
  └── Tarea 2.2: Desarrollar el Footer institucional estático adaptado a dispositivos móviles

Fase 3: Desarrollo de Componentes Reutilizables de Interfaz (Prioridad Media)
  ├── Tarea 3.1: Desarrollar la Tarjeta de Producto (Product Card) reactiva con estados dinámicos
  └── Tarea 3.2: Desarrollar el carrusel táctil interactivo reutilizable para listado de productos

Fase 4: Estructuración y Ensamblaje de Secciones de la Home (Prioridad Media-Baja)
  ├── Tarea 4.1: Construir la Hero Section optimizada para LCP y la sección de exploración de categorías
  └── Tarea 4.2: Construir la sección de marcas oficiales, banner de publicación y strip de beneficios

Fase 5: Optimización de Rendimiento, Accesibilidad y Suite de Pruebas (Baja Prioridad / Iterativo)
  ├── Tarea 5.1: Aplicar optimizaciones Web Vitals (CLS zero targets, SEO estruturado, Lazy Loading)
  └── Tarea 5.2: Diseñar y ejecutar suite completa de pruebas unitarias de UI y pruebas de carga frontend
```

---

## 14 Dependencias
*   **Depende directamente de:**
    *   *Módulo 1: Servicio de Identidad, Autenticación y Perfiles de Usuario (IAM):* El Header requiere interactuar con el estado de autenticación y leer datos del perfil del usuario para adaptar las opciones visibles ("Iniciar sesión" o Avatar de control).
*   **Dependientes de este módulo:** Todos los módulos funcionales y de interfaz que se desarrollen posteriormente utilizarán de manera mandatoria el layout, el sistema de diseño y la estructura de componentes web definidos en este módulo:
    *   *Módulo de Publicación de Anuncios:* Empleará los estilos de formulario, botones y estructura visual.
    *   *Módulo de Búsqueda y Resultados:* Reutilizará la barra de búsqueda y las tarjetas de productos para la grilla de catálogo.

---

## 15 Criterios de aceptación
*   **CA-2.01 (Puntuación de Lighthouse / Core Web Vitals):** La página de inicio (Home Page) debe obtener obligatoriamente una puntuación de rendimiento de Lighthouse superior a 90/100, con un valor de Cumulative Layout Shift (CLS) estricto de 0.
*   **CA-2.02 (Adaptabilidad Responsiva Completa):** La interfaz completa no debe presentar ningún desbordamiento horizontal (horizontal scrollbar involuntaria) en ninguna resolución estándar de pantalla entre 320px (iPhone SE) y 2560px (Ultra-wide desktop).
*   **CA-2.03 (Interactividad del Carrusel Móvil):** En dispositivos móviles, los carruseles de productos deben responder de forma nativa e interactiva a gestos de deslizamiento táctil (swipe) sin retrasos de renderizado ni caídas por debajo de los 60 cuadros por segundo (FPS).
*   **CA-2.04 (Sincronización de Favoritos en Un Solo Clic):** Al marcar un producto como favorito en la tarjeta, el icono de corazón debe activarse inmediatamente con una micro-animación responsiva de Framer Motion, y el ID de producto debe almacenarse en el estado reactivo del cliente en menos de 50 milisegundos.

---

## 16 Estrategia de pruebas
*   **Pruebas Unitarias de Componentes de Interfaz:** Cobertura con Jest y React Testing Library sobre los componentes base reutilizables (`Button`, `ProductCard`, `Badge`), verificando que los renders de propiedades y estilos condicionales ocurran sin errores de sintaxis.
*   **Pruebas de Accesibilidad de la Interfaz (Accessibility Testing):** Validación automatizada utilizando la suite de análisis de accesibilidad `axe-core` para garantizar que la estructura de la página cumpla con las normas de contraste cromático y accesibilidad de etiquetas de lectores de pantalla.
*   **Pruebas de Compatibilidad de Navegadores (Cross-Browser Testing):** Pruebas de compatibilidad sobre plataformas reales en múltiples combinaciones de navegadores y sistemas operativos (Chrome en Windows/macOS, Safari en iOS, Firefox en Linux y Edge) mediante automatizaciones en la nube, garantizando que el motor CSS compile de forma idéntica en todos ellos.
*   **Pruebas de Carga de Frontend (Lighthouse CI):** Integración de verificaciones automáticas de métricas Web Vitals en los flujos de integración continua (Lighthouse CI) para bloquear despliegues en producción si un cambio de código degrada el tiempo de LCP, el CLS o la interactividad general de la home page.

---

## 17 Mejoras futuras
*   **Estrategia de Temas Dinámicos (Dark Mode Adaptativo):** Planificar la incorporación de un tema de modo noche (Dark Mode) selectivo que disminuya la fatiga visual de los usuarios que navegan por el catálogo de productos durante horas de la noche, implementando clases `@media (prefers-color-scheme: dark)` optimizadas nativamente por Tailwind CSS.
*   **Soporte de Búsqueda Visual Avanzada por Imagen (AI Image Search):** Diseñar e implementar capacidades de búsqueda disruptiva que permitan al comprador subir una fotografía de un producto físico (por ejemplo, una zapatilla o una marca de coche) desde su móvil, procesarla mediante un modelo de visión artificial y buscar anuncios visualmente similares en el catálogo de PUBLICA.PE.
*   **Personalización Extrema del Feed basada en Intereses (Personalized AI Feed):** Desarrollar un sistema de recomendación inteligente que aprenda de las interacciones silenciosas del usuario (anuncios vistos, tiempo de permanencia, búsquedas recurrentes) para reordenar dinámicamente las secciones de la home page, mostrando primero las categorías y productos que tienen la mayor probabilidad de conversión.
