# Módulo 3: Catálogo, Taxonomía de Categorías, Atributos Dinámicos y Publicación de Anuncios

## 1 Objetivo
El objetivo de este módulo es diseñar la arquitectura para la gestión del catálogo de productos, la taxonomía de categorías altamente flexible y extensible, el sistema de atributos dinámicos específicos por categoría (metadata estructurada), y el ciclo de vida completo de la publicación de anuncios (creación, edición, moderación, activación y expiración). Este sistema constituye el núcleo operativo de la plataforma PUBLICA.PE, diseñado para soportar la catalogación e indexación de decenas de millones de artículos con latencia imperceptible y permitiendo a los usuarios descubrir y publicar bienes de manera eficiente y estructurada.

---

## 2 Alcance
El alcance del Módulo de Catálogo y Publicaciones incluye las siguientes especificaciones arquitectónicas y de negocio:
*   **Taxonomía y Jerarquía de Categorías:** Diseño de un árbol jerárquico multicapa de categorías y subcategorías que pueda modificarse de forma dinámica (sin alterar código base) para acomodar desde vehículos e inmuebles hasta tecnología, moda y empleos.
*   **Sistema de Atributos Dinámicos (EAV / Schemaless conceptual):** Estructura que permite asociar un conjunto de especificaciones técnicas o atributos particulares a cada subcategoría (por ejemplo: "kilometraje", "transmisión", "combustible" para Vehículos; o "número de habitaciones", "baños", "área en m²" para Inmuebles).
*   **Ciclo de Vida del Anuncio (Listing Lifecycle):** Modelado de los estados de un anuncio (Borrador, En Moderación, Activo, Rechazado, Pausado, Vendido, Expirado) y las transiciones válidas gobernadas por el motor de reglas de negocio.
*   **Motor de Creación y Edición de Anuncios (Publishing Pipeline):** Arquitectura del flujo de publicación paso a paso, incluyendo carga asíncrona de archivos multimedia, asignación de precios mulidivisa (Soles / Dólares), georreferenciación y categorización asistida por metadatos.
*   **Integración con Servicios de Búsqueda y Moderación:** Interfaces y flujos asíncronos para propagar cambios del catálogo a motores de indexación de búsqueda avanzada y sistemas automáticos de análisis de contenido contra fraudes.

*Fuera del alcance:* La implementación concreta del motor de indexación OpenSearch, la pasarela de pagos para anuncios patrocinados (Bumpers/Highlights) y la interfaz de usuario específica en Flutter/Next.js. Estos sistemas se conectarán a través de las APIs y eventos especificados en este módulo.

---

## 3 Casos de uso
1.  **Creación de un Anuncio con Atributos Dinámicos:** Un vendedor selecciona la categoría "Inmuebles -> Departamentos -> Alquiler". El sistema recupera de forma dinámica el esquema de atributos asociados a esa subcategoría exacta y le exige completar campos específicos como "número de baños" y "área construida". El anuncio se guarda en estado provisional mientras se cargan las imágenes a la nube.
2.  **Carga de Imágenes y Optimización Multimedia:** Al publicar, el usuario carga hasta 10 fotos en alta resolución. El sistema emite URLs prefirmadas para subirlas directamente a almacenamiento de objetos, procesándolas en segundo plano para recortar, comprimir, marca-aguar y generar versiones optimizadas para miniaturas y visualización de retina.
3.  **Búsqueda Parametrizada por Facetas y Filtros:** Un comprador navega en la sección de "Tecnología -> Celulares". La interfaz carga los filtros de búsqueda dinámicos específicos (Capacidad de almacenamiento, RAM, Marca, Condición) basándose únicamente en los atributos activos de la subcategoría seleccionada, permitiendo filtrar millones de registros en milisegundos.
4.  **Moderación Automatizada de Anuncios:** Inmediatamente se completa una publicación, el anuncio entra en estado "En Moderación". El sistema ejecuta validaciones de seguridad de texto e imágenes en segundo plano. Si no detecta contenido prohibido (armas, drogas, spam, duplicidad obvia), el anuncio transiciona automáticamente al estado "Activo". Si hay sospecha, se deriva al panel de moderación humana.
5.  **Expiración y Renovación de Publicaciones:** Un anuncio gratuito alcanza su tiempo límite de visibilidad de 30 días. El sistema suspende su visibilidad, cambia su estado a "Expirado" y despacha de forma asíncrona notificaciones al vendedor ofreciendo la renovación inmediata o la conversión a un paquete de realce de pago.

---

## 4 Historias de usuario
*   **HU-3.01 (Categorización Asistida):** Como vendedor, quiero que el sistema me sugiera automáticamente la subcategoría más adecuada para mi producto basándose en el título que escribo, para agilizar mi proceso de publicación y evitar errores taxonómicos.
*   **HU-3.02 (Formularios Dinámicos por Categoría):** Como vendedor de un vehículo, quiero completar especificaciones específicas como el año de fabricación, tipo de motorización y kilometraje, de modo que mi anuncio cuente con información técnica completa y estructurada para los compradores potenciales.
*   **HU-3.03 (Control de Estado de Mis Publicaciones):** Como vendedor en la plataforma, quiero tener un panel centralizado donde pueda pausar temporalmente un anuncio si ya estoy en negociaciones con un comprador, reactivarlo si la venta no se concreta, o marcarlo como "Vendido" para dejar de recibir consultas.
*   **HU-3.04 (Filtros Avanzados y Facetados):** Como comprador de inmuebles, quiero aplicar filtros de búsqueda específicos como rango de precios, cantidad de dormitorios y si acepta mascotas, para no perder tiempo analizando ofertas que no coinciden con mis necesidades exactas.
*   **HU-3.05 (Optimización de Carga Visual de Galería):** Como comprador, quiero visualizar la galería de imágenes de un anuncio con transiciones suaves, pre-carga de imágenes vecinas y escalabilidad automática según mi tipo de conexión a internet para optimizar el consumo de mis datos móviles.

---

## 5 Reglas de negocio
*   **RN-3.01 (Jerarquía Estricta):** Cada anuncio debe estar asociado exactamente a una sola subcategoría final (nodo hoja) del árbol jerárquico de categorías del catálogo. No se permiten publicaciones en categorías padre o contenedores intermedios.
*   **RN-3.02 (Validación de Atributos Mandatorios):** Los atributos marcados como requeridos en el esquema dinámico de una categoría específica deben ser validados de forma estricta tanto en el frontend como en el backend antes de autorizar la transición del anuncio al estado "Activo".
*   **RN-3.03 (Límite de Contenido Gráfico):** Un anuncio estándar C2C puede contener un mínimo de 1 y un máximo de 10 imágenes. Los anuncios patrocinados de tiendas B2C o cuentas de concesionarias/inmobiliarias de alta gama pueden subir hasta un máximo de 30 imágenes y un enlace de video en formato compatible.
*   **RN-3.04 (Control de Precios y Moneda):** El precio ingresado en una publicación debe ser estrictamente mayor a cero. El sistema debe admitir precios en Soles peruanos (S/) y Dólares estadounidenses (USD), calculando la conversión de manera informativa al tipo de cambio diario de la plataforma para fines de comparación y ordenamiento en el catálogo.
*   **RN-3.05 (Prevención de Spam y Contenido Duplicado):** No se permite publicar el mismo anuncio (mismo título, descripción y fotos del mismo vendedor) en un periodo menor a 7 días. Si el sistema detecta una duplicidad de más del 85% en el texto o similitud exacta en los hashes perceptuales de las imágenes, rechazará automáticamente la publicación.
*   **RN-3.06 (Tiempo de Vida de Anuncios por Tipo):** Los anuncios gratuitos para usuarios estándar (C2C) tendrán un periodo de expiración forzoso de 30 días calendario. Pasado este lapso, el anuncio se oculta y el usuario tiene hasta 15 días adicionales para renovarlo antes de que sea archivado de forma definitiva en almacenamiento histórico.

---

## 6 Arquitectura

### Componentes y Responsabilidades
El catálogo y el motor de publicaciones se implementan bajo un enfoque de microservicios, interactuando con los módulos de IAM, Búsqueda y Notificaciones:

*   **`Catalog & Listing Microservice` (NestJS con DDD):**
    *   **Módulo de Taxonomía:** Responsable de gestionar el árbol de categorías, subcategorías y los esquemas dinámicos de atributos asociados (metadatos).
    *   **Módulo de Anuncios (Listings):** Controla el ciclo de vida, la consistencia transicional, el almacenamiento persistente y la edición de las publicaciones.
    *   **Procesador Multimedia Asíncrono:** Consume eventos de carga de archivos de imagen temporales, realiza validaciones de formato, ejecuta redimensionamientos optimizados y almacena los activos permanentes de forma estructurada en Cloudflare R2, liberando al servidor de API de tareas pesadas de CPU.
*   **`OpenSearch Engine` (Suscrito al catálogo):** Actúa como base de datos de lectura rápida optimizada para búsquedas avanzadas de texto completo, filtrado por facetas geográficas y atributos específicos en milisegundos. Se actualiza de forma asíncrona mediante el consumo de eventos del catálogo.

### Flujo Detallado de Publicación y Procesamiento
1.  **Solicitud de Esquema:** El cliente Next.js o Flutter solicita al microservicio de Catálogo el esquema de atributos de la subcategoría seleccionada por el usuario. El servicio retorna una estructura estructurada de metadatos con tipos de campo, validaciones, opciones de valores y banderas de obligatoriedad.
2.  **Creación en Borrador (Draft):** El usuario completa el formulario y se crea el anuncio en base de datos con estado "Draft". Se genera un UUID único y permanente para la publicación.
3.  **Subida de Multimedia Cifrada:** El servidor de publicaciones emite URLs firmadas de Cloudflare R2 con expiración corta. El cliente sube las imágenes directamente al bucket de almacenamiento S3-compatible, reduciendo a cero el consumo de ancho de banda del backend de NestJS.
4.  **Persistencia Transaccional (Outbox Pattern):** Al hacer clic en "Finalizar", el microservicio guarda el anuncio, asocia las imágenes subidas y almacena un evento `ListingCreatedEvent` en la base de datos PostgreSQL dentro de una sola transacción ACID controlada por Prisma.
5.  **Propagación de Eventos y Moderación:** El Outbox Worker detecta el nuevo evento y lo publica en RabbitMQ:
    *   El servicio de Moderación Inteligente consume el evento y ejecuta análisis de visión artificial y NLP sobre los textos para verificar que no infrinja las políticas de uso de la plataforma.
    *   El servicio de Búsqueda indexa la información estructurada del anuncio en OpenSearch para que esté disponible en los filtros de forma instantánea una vez activado.
    *   Si la moderación aprueba, el estado cambia a "Active" y se envía un evento de activación que actualiza el índice público.

### Patrones Utilizados
*   **State Pattern (Patrón Estado):** Para gobernar de manera estricta el ciclo de vida del anuncio, garantizando que un anuncio archivado o vendido no pueda pasar directamente a activo sin pasar por un proceso de renovación o verificación de integridad del contenido.
*   **Entity-Attribute-Value (EAV) Híbrido en JSONB:** PostgreSQL permite guardar atributos variables mediante JSONB. Para equilibrar el rendimiento de consultas relacionales estables con la flexibilidad extrema de categorías dispares, se mantiene un modelo híbrido donde los campos comunes (título, precio, moneda, usuario, categoría, ubicación) se guardan en columnas tradicionales de la tabla, mientras que las especificaciones dinámicas se persisten en una columna de tipo JSONB fuertemente indexada con GIN (Generalized Inverted Index) para permitir búsquedas eficientes.

---

## 7 Modelo de datos

### Estructura de Tablas Relacionales (PostgreSQL)

Para evitar la redundancia y asegurar un rendimiento de base de datos óptimo para millones de publicaciones, se definen las siguientes entidades estructuradas:

1.  **`categories` (Árbol Jerárquico de Categorías):**
    *   `id` (SERIAL, PK): Identificador secuencial de la categoría.
    *   `parent_id` (INTEGER, Nullable, FK -> categories.id): Referencia para modelar jerarquías recursivas (Estructura de Árbol).
    *   `name` (VARCHAR(150)): Nombre público (e.g. "Tecnología" o "Celulares").
    *   `slug` (VARCHAR(150), Unique): Cadena de texto optimizada para rutas SEO (URL-friendly).
    *   `icon_name` (VARCHAR(100), Nullable): Nombre de referencia para la biblioteca de iconos del frontend.
    *   `is_active` (BOOLEAN, Default TRUE): Estado que permite activar/desactivar ramas enteras de la taxonomía.

2.  **`category_attributes` (Definición de Atributos Dinámicos por Categoría):**
    *   `id` (UUIDv4, PK): Identificador único de la regla de atributo.
    *   `category_id` (INTEGER, FK -> categories.id): Subcategoría a la que pertenece este campo.
    *   `name` (VARCHAR(100)): Identificador interno del atributo (e.g., "mileage", "num_rooms").
    *   `label` (VARCHAR(150)): Etiqueta amigable que ve el usuario (e.g., "Kilometraje", "Nro. de Habitaciones").
    *   `type` (ENUM: NUMBER, STRING, BOOLEAN, SELECT, MULTISELECT): Tipo de dato del campo.
    *   `is_required` (BOOLEAN, Default FALSE): Obligatoriedad de completado al publicar.
    *   `validation_rules` (JSONB, Nullable): Expresiones regulares, rangos permitidos, límites numéricos.
    *   `options` (JSONB, Nullable): Lista de valores preestablecidos para tipos SELECT o MULTISELECT.

3.  **`listings` (Tabla Central de Anuncios):**
    *   `id` (UUIDv4, PK): Identificador global del anuncio.
    *   `user_id` (UUIDv4): Identificador del vendedor propietario (Relación conceptual con IAM).
    *   `category_id` (INTEGER, FK -> categories.id): Subcategoría hoja en la que está clasificado.
    *   `title` (VARCHAR(200)): Título descriptivo principal del anuncio.
    *   `description` (TEXT): Descripción textual detallada escrita por el vendedor.
    *   `price` (NUMERIC(15, 2)): Precio del artículo en formato de alta precisión decimal.
    *   `currency` (ENUM: PEN, USD): Unidad monetaria de la publicación.
    *   `condition` (ENUM: NEW, USED, NOT_APPLICABLE): Estado físico o condición del producto.
    *   `status` (ENUM: DRAFT, UNDER_REVIEW, ACTIVE, REJECTED, PAUSED, SOLD, EXPIRED, ARCHIVED): Control de estados.
    *   `location_id` (VARCHAR(100)): Identificador geográfico y administrativo del anuncio.
    *   `latitude` (DECIMAL(9,6), Nullable): Coordenada de latitud aproximada para búsquedas de mapa.
    *   `longitude` (DECIMAL(9,6), Nullable): Coordenada de longitud aproximada para búsquedas de mapa.
    *   `dynamic_specifications` (JSONB): Valores de los atributos dinámicos llenados según el esquema de la subcategoría.
    *   `view_count` (INTEGER, Default 0): Contador acumulado de impresiones directas del anuncio.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW).
    *   `updated_at` (TIMESTAMP WITH TIME ZONE, Default NOW).
    *   `expires_at` (TIMESTAMP WITH TIME ZONE): Fecha calculada de fin de publicación.

4.  **`listing_images` (Galería Multimedia Asociada):**
    *   `id` (UUIDv4, PK).
    *   `listing_id` (UUIDv4, FK -> listings.id ON DELETE CASCADE): Anuncio al que pertenece la imagen.
    *   `image_url` (VARCHAR(512)): Ruta absoluta optimizada en Cloudflare R2.
    *   `sort_order` (SMALLINT, Default 0): Orden de visualización en la galería (el orden 0 indica la foto de portada principal).
    *   `created_at` (TIMESTAMP WITH TIME ZONE).

### Cardinalidad y Relaciones Clave
*   `categories` 1:N `categories` (Relación jerárquica reflexiva padre-hijo).
*   `categories` 1:N `category_attributes` (Una subcategoría define múltiples atributos técnicos específicos).
*   `categories` 1:N `listings` (Una subcategoría agrupa múltiples publicaciones activas).
*   `listings` 1:N `listing_images` (Una publicación posee una galería indexada de archivos multimedia).

### Índices y Particionado
*   **Índices GIN sobre JSONB:** El campo `dynamic_specifications` de la tabla `listings` se indexa con un GIN de clase `jsonb_path_ops` para permitir búsquedas instantáneas sobre múltiples llaves y valores dinámicos anidados en las especificaciones.
*   **Índices Compuestos de Consulta:**
    *   `listings(category_id, status, created_at DESC)`: Esencial para la carga rápida de los listados de catálogo ordenados cronológicamente por categoría.
    *   `listings(user_id, status)`: Utilizado para la sección de anuncios personales del usuario en su panel de control.
*   **Particionado de Base de Datos:**
    *   La tabla `listings` se particiona de manera lógica **por categorías principales** (por ejemplo: Partición 1 para Vehículos, Partición 2 para Inmuebles, Partición 3 para Productos Generales). Esto permite que las consultas de búsqueda y los escaneos de índices se limiten únicamente a la partición de la categoría de interés, reduciendo drásticamente la carga de entrada/salida de disco en PostgreSQL para consultas masivas concurrentes.

---

## 8 APIs

### REST API
Utilizado para la creación de anuncios estructurados, carga de metadatos de configuración e interacciones con el flujo multimedia.

*   `GET /api/v1/categories/tree`: Retorna la taxonomía de categorías estructurada en formato de árbol completo para la navegación.
*   `GET /api/v1/categories/:id/attributes`: Retorna el esquema JSON de atributos obligatorios y opcionales asociados a una subcategoría.
*   `POST /api/v1/listings`: Crea un nuevo borrador de anuncio asignando ID único y devolviendo los parámetros de subida firmados.
*   `PUT /api/v1/listings/:id`: Guarda la información del formulario de publicación y asocia los atributos dinámicos contenidos en JSON.
*   `POST /api/v1/listings/:id/images/presign`: Solicita URLs de subida directa prefirmadas para Cloudflare R2 por cada imagen que el usuario desea adjuntar.
*   `PATCH /api/v1/listings/:id/status`: Ejecuta transiciones del ciclo de vida del anuncio (Pausar, Reactivar, Marcar como Vendido).

### GraphQL API
Optimizado para búsquedas dinámicas complejas del catálogo y visualización de detalles enriquecidos de anuncios individuales.

*   `Query { getListingDetail(id: ID!) { id title description price currency condition status location { name } category { name parent { name } } images { url order } dynamic_specifications user_id created_at view_count } }`
*   `Query { searchListings(filter: SearchFilterInput!, limit: Int, offset: Int) { total results { id title price currency imageUrl location status condition created_at } } }`

### API de Eventos (Event-Driven Integration)
El servicio de publicaciones publica estados a través de RabbitMQ para orquestar la consistencia eventual:

*   `listing.event.created`: Publicado inmediatamente tras guardar los datos del anuncio. Despierta al servicio de moderación automática de texto y análisis de fraude.
*   `listing.event.activated`: Publicado cuando el anuncio pasa con éxito la moderación y es visible. El motor de búsqueda OpenSearch consume este evento para agregarlo al índice de búsqueda en tiempo real.
*   `listing.event.deactivated`: Disparado cuando el anuncio es pausado, vendido, expirado o eliminado físicamente. OpenSearch consume este evento para remover inmediatamente la publicación del catálogo de búsquedas públicas.

---

## 9 Seguridad

*   **Firmas Criptográficas de Acceso a R2 (URL Prefirmadas):** Ningún cliente o tercero puede escribir directamente en el bucket de almacenamiento de Cloudflare R2. El microservicio de catálogo emite firmas de acceso con políticas ultra-restrictivas: tiempo de expiración limitado a 5 minutos, restricción estricta de tamaño máximo de archivo (máximo 10MB por imagen) y tipo MIME exclusivo para formatos de imagen comprimidos (JPEG, PNG, WEBP), evitando la carga de archivos ejecutables maliciosos o scripts maliciosos al almacenamiento del marketplace.
*   **Control de Propiedad de Recursos (Resource Ownership Validation):** Cada operación mutacional de un anuncio (`PUT`, `PATCH`, `DELETE`) pasa por un middleware de autorización estricto que valida gRPC contra el servicio de IAM. El sistema verifica que el `user_id` decodificado del Access Token JWT coincida exactamente con el propietario registrado en el anuncio a modificar, bloqueando accesos cruzados no autorizados.
*   **Sanitización Completa contra Ataques XSS e Inyecciones de Código:** Los campos de texto libre provistos por el usuario (título, descripción, valores de atributos dinámicos de texto) se procesan con algoritmos de depuración profunda (Deep Sanitization) para codificar caracteres de escape y eliminar etiquetas `<script>`, iframes o atributos de eventos inline en el HTML que puedan ser inyectados para secuestrar sesiones de usuarios compradores que visualicen la página de anuncios.
*   **Límites de Publicación y Protección contra Spam (Abuse Prevention):** Se aplican reglas de cuotas estrictas de Rate Limiting por cuenta de usuario mediante Redis para evitar que scripts automatizados publiquen cientos de anuncios en masa. Un usuario básico C2C no puede realizar más de 3 publicaciones en un lapso de 24 horas, limitando la proliferación de anuncios basura en el marketplace.

---

## 10 Escalabilidad

### Diseño para Alta Disponibilidad y Catálogo de Millones de Anuncios
*   **Estrategia Read-Through Cache con Redis para Categorías y Atributos:** El árbol de taxonomía de categorías de la plataforma y la configuración de esquemas de atributos dinámicos son datos que se leen constantemente pero que cambian de forma infrecuente. Se configuran políticas de almacenamiento en caché en Redis de lectura directa (Read-Through Cache) para estos endpoints, permitiendo que la navegación por la estructura jerárquica del catálogo sea servida en memoria en un promedio de 1ms, tolerando picos extremos de tráfico masivo sin sobrecargar la base de datos relacional.
*   **Búsquedas Avanzadas Desacopladas mediante OpenSearch:** Todas las búsquedas de texto completo, búsquedas con filtros condicionales avanzados y generación de facetas de categorías se desvían de forma exclusiva a un clúster dedicado de OpenSearch. Esto mantiene a PostgreSQL libre de consultas intensivas de agregación y análisis de texto, garantizando que el motor relacional solo sea consultado para inserciones directas de nuevos anuncios y lecturas puntuales por identificador único de publicación.
*   **Procesamiento Asíncrono de Imágenes con Fila Intermedia (Event-Driven Image Pipeline):** La carga de imágenes se escala de forma asíncrona mediante un servicio de procesamiento en segundo plano (Serverless Workers o microservicio especializado). Cuando un cliente sube una imagen a una ruta temporal en R2 y finaliza la creación del anuncio, se publica un mensaje en RabbitMQ. Los trabajadores de imágenes toman el mensaje, descargan la imagen original, ejecutan tareas pesadas de manipulación de medios (compresión avanzada, conversión a WebP/AVIF y marca de agua) y actualizan la base de datos de forma paralela y distribuida, evitando cuellos de botella de rendimiento de CPU en los servidores principales de APIs REST/GraphQL.
*   **Uso Intensivo de CDN para Activos de Catálogo y Miniaturas:** Las imágenes procesadas y almacenadas en Cloudflare R2 se sirven directamente mediante subdominios mapeados que aprovechan las redes perimetrales de la CDN de Cloudflare con caché de bordes activa. El navegador de los compradores descarga los elementos estáticos y visuales de forma paralela desde el servidor perimetral geográficamente más cercano a su ubicación física, optimizando significativamente la velocidad de carga visual (Largest Contentful Paint) para millones de visitas diarias.

---

## 11 Riesgos

### Identificación de Amenazas en Publicaciones y Planes de Mitigación
1.  **Riesgo Técnico: Cuellos de botella en PostgreSQL por inserción masiva y actualización de JSONB.**
    *   *Detalle:* Con millones de publicaciones activas y miles de cambios simultáneos sobre metadatos dinámicos JSONB, PostgreSQL puede experimentar altas latencias en escrituras o consumo intensivo de memoria RAM para actualizar índices de tipo GIN de manera concurrente.
    *   *Mitigación:* Se implementa un mecanismo de escritura diferida controlado (Write-Behind Pattern) donde los cambios menores de anuncios no críticos (por ejemplo, el incremento secuencial de visitas de un anuncio `view_count`) se acumulan en un búfer en memoria en Redis y se sincronizan a la base de datos PostgreSQL principal de manera agregada cada 5 minutos, reduciendo los accesos transaccionales a disco por un factor de 100.
2.  **Riesgo Funcional: Inconsistencia temporal entre la base de datos relacional y el motor de búsqueda.**
    *   *Detalle:* Si un anuncio es eliminado físicamente o marcado como prohibido en PostgreSQL pero la actualización en OpenSearch falla debido a una caída de la red intermedia, el anuncio seguirá apareciendo en las búsquedas públicas, generando clics rotos y mala experiencia de usuario.
    *   *Mitigación:* Se implementa el patrón Outbox en conjunto con reintentos automáticos controlados (Exponential Backoff with Jitter) en el consumidor de RabbitMQ responsable de sincronizar OpenSearch. Además, se corre un proceso de conciliación diario automático en horas de baja demanda que compara los hashes de los estados activos de publicaciones entre PostgreSQL y OpenSearch para reparar inconsistencias de manera automatizada.
3.  **Riesgo de Negocio: Fraudes financieros, publicaciones falsas y ofertas inexistentes (Scams).**
    *   *Detalle:* Usuarios maliciosos publican productos de alta demanda a precios irrealmente bajos con fotos descargadas de internet para estafar a compradores confiados y atraerlos fuera de los canales seguros de la plataforma.
    *   *Mitigación:* El servicio de publicaciones exige de forma obligatoria verificación telefónica robusta (MFA) antes de autorizar la activación del anuncio. Adicionalmente, se implementa una cola de moderación automatizada que analiza la reputación histórica del vendedor, la coincidencia inversa de las imágenes cargadas en motores de búsqueda de internet para detectar fraude visual y aplica Machine Learning para pausar preventivamente publicaciones sospechosas que presenten desviaciones atípicas de precios de mercado.

---

## 12 Buenas prácticas
*   **Uso del Patrón Hexagonal para Lógica de Catálogo:** Asegura que las reglas del ciclo de vida del anuncio y las validaciones de negocio estén totalmente aisladas en módulos de dominio puros en NestJS, permitiendo sustituir el motor de almacenamiento de base de datos (por ejemplo, migrar de PostgreSQL a bases de datos documentales o Bigtable de alta escalabilidad) en el futuro sin reescribir la lógica operativa de la aplicación.
*   **Estrategia de Versionado de Esquemas de Atributos:** Los esquemas de atributos de categorías cambian con el tiempo (por ejemplo, añadir campos para tecnologías emergentes). Se implementa un modelo de versionado de atributos dinámicos en base de datos para garantizar la compatibilidad hacia atrás: los anuncios existentes conservan su formato histórico JSONB estructurado mientras que las nuevas publicaciones de la misma subcategoría son obligadas a completar los campos de la versión de esquema más reciente.
*   **Normalización Controlada de Datos Geográficos:** Los identificadores geográficos de ubicación (`location_id`) en los anuncios se asocian a una taxonomía estandarizada (Ubigeo oficial en el caso de Perú) para evitar inconsistencias de escritura manual y asegurar que la indexación de búsquedas geográficas y mapas funcione con un alto nivel de precisión en toda la plataforma.

---

## 13 Roadmap de implementación

```
[MÓDULO DE CATÁLOGO Y PUBLICACIÓN: SECUENCIA DE PRIORIDAD DE TAREAS]

Fase 1: Diseño del Árbol de Categorías y Base de Datos (Alta Prioridad)
  ├── Tarea 1.1: Diseñar esquema físico PostgreSQL (Categorías, Atributos Dinámicos y Anuncios) en Prisma
  └── Tarea 1.2: Cargar y validar la estructura taxonómica completa de categorías del marketplace

Fase 2: Motor de Publicación y Ciclo de Vida del Anuncio (Prioridad Media-Alta)
  ├── Tarea 2.1: Desarrollar la lógica transaccional del ciclo de vida del anuncio con State Pattern en NestJS
  └── Tarea 2.2: Implementar la API REST/GraphQL de creación y edición de publicaciones con atributos JSONB

Fase 3: Carga e Integración de Medios Multimedia (Prioridad Media)
  ├── Tarea 3.1: Configurar el adaptador de firmas criptográficas para URLs de subida directa a Cloudflare R2
  └── Tarea 3.2: Desarrollar el servicio asíncrono de procesamiento, redimensionamiento y compresión de imágenes

Fase 4: Desacoplamiento de Búsquedas e Indexación (Prioridad Media-Baja)
  ├── Tarea 4.1: Desarrollar el flujo de consistencia eventual mediante Outbox Pattern y RabbitMQ
  └── Tarea 4.2: Implementar el consumidor del buscador para indexar y remover publicaciones en OpenSearch

Fase 5: Moderación de Contenido, Reglas Antifraude y Suite de Pruebas (Baja Prioridad / Iterativo)
  ├── Tarea 5.1: Desarrollar las colas de moderación automatizada basadas en validaciones de texto y reputación
  └── Tarea 5.2: Diseñar y ejecutar suite completa de pruebas unitarias, de integración, de carga y de caos
```

---

## 14 Dependencias
*   **Depende directamente de:**
    *   *Módulo 1: Servicio de Identidad, Autenticación y Perfiles de Usuario (IAM):* Obligatorio para verificar la validez del Access Token del vendedor, comprobar su rol (e.g., verificar si tiene permiso de tienda B2C) e inicializar la propiedad de la publicación con su identificador único de cuenta.
    *   *Módulo 2: Sistema de Diseño y Estructura de Navegación Web (Layout):* Reutiliza los estilos, grids responsivos y la estructura modular de la cabecera (Header) para los filtros predictivos de búsqueda y listados.
*   **Dependientes de este módulo:** Los módulos funcionales subsiguientes consumen la estructura e información de las publicaciones activas generadas en este catálogo:
    *   *Módulo de Búsqueda Avanzada y Listados:* Consume directamente el esquema y los datos indexados para el motor de filtros de la tienda.
    *   *Módulo de Mensajería y Chat entre Usuarios:* Requiere consultar el identificador del anuncio asociado para contextualizar los canales de conversación abiertos entre compradores e interesados en un artículo en venta.

---

## 15 Criterios de aceptación
*   **CA-3.01 (Latencia del API de Carga de Atributos):** La consulta que retorna el esquema completo de atributos dinámicos para cualquier subcategoría específica del catálogo mediante su ID debe responder en menos de 10 milisegundos para el 99.9% de las peticiones concurrentes aprovechando la caché de memoria de Redis.
*   **CA-3.02 (Rotación e Invalidación de Multimedia Temporal):** Al solicitar URLs prefirmadas para carga de imágenes, las llaves de seguridad devueltas por el microservicio deben expirar de forma estricta a los 5 minutos de su emisión, impidiendo cualquier subida posterior al bucket de almacenamiento.
*   **CA-3.03 (Consistencia de Eventos de Publicación):** Tras guardar un anuncio exitosamente en estado activo, el evento de sincronización de catálogo debe estar encolado en RabbitMQ en menos de 50 milisegundos bajo transacción transaccional atómica garantizada por el Outbox Worker.
*   **CA-3.04 (Resistencia de Modificación de Terceros):** Si un usuario intenta modificar o pausar un anuncio del cual no es el propietario, la API del catálogo debe denegar la petición de forma inmediata con un código de respuesta HTTP `403 Forbidden` y registrar la alerta de seguridad en los logs estructurados del sistema.

---

## 16 Estrategia de pruebas
*   **Pruebas Unitarias (Domain Unit Testing):** Cobertura exhaustiva de pruebas sobre la lógica pura del State Pattern de las publicaciones, garantizando que transiciones inválidas (por ejemplo, mover un anuncio de estado "Pausado" a "Draft" de forma directa) arrojen las excepciones de dominio correctas.
*   **Pruebas de Integración (Database Integration Testing):** Validación del guardado y consulta de atributos dinámicos mapeados en la columna JSONB utilizando Prisma ORM sobre bases de datos de prueba reales, asegurando que las búsquedas mediante operadores de coincidencia estructurados (GIN Indexes) operen con total precisión lógica.
*   **Pruebas de Carga de API de Publicación (Load Testing):** Simulación de un escenario masivo de tráfico concurrente con K6 para estresar la API de catálogo. La prueba medirá la respuesta de navegación y filtrado de categorías con una concurrencia sostenida de 150,000 peticiones de lectura simultáneas por minuto, validando que el clúster Redis y el diseño de caché mantengan latencias promedio inferiores a los 10ms.
*   **Pruebas de Seguridad y Sanitización (Input Validation Security Testing):** Suite de pruebas dedicada a inyectar payloads de ataque complejos (como scripts de inyección SQL, fragmentos maliciosos de HTML5 y ataques de Session Hijacking) en los inputs del formulario de creación de anuncios, comprobando que las librerías de sanitización del microservicio NestJS filtren o neutralicen todo contenido malicioso antes de ser persistido en la base de datos de PostgreSQL.

---

## 17 Mejoras futuras
*   **Sugerencia de Precios basada en Machine Learning (Smart Price Advisor):** Desarrollar un agente de inteligencia artificial integrado en el formulario de creación que compare el título, condición, año y atributos dinámicos del producto con el histórico de ventas reales concretadas en el marketplace de PUBLICA.PE, sugiriendo de forma predictiva un rango de precio óptimo al vendedor para maximizar su probabilidad de venta en el menor tiempo posible.
*   **Taxonomía Autónoma Autogestionada por IA (Autonomous Classification Service):** Implementar un modelo de procesamiento de lenguaje natural y visión computacional que analice las fotografías y el texto de la descripción cargada por el usuario en tiempo real para predecir, clasificar y autocompletar de manera completamente autónoma la categoría hoja del catálogo y los atributos dinámicos técnicos del artículo, disminuyendo el esfuerzo del formulario de publicación de anuncios a menos de 15 segundos de interacción.
*   **Soporte Multilingüe y Traduccional en Red de Borde (Localization & Multi-Language Support):** Diseñar e incorporar un pipeline transaccional de internacionalización que permita traducir dinámicamente tanto las etiquetas de la taxonomía del catálogo de categorías como los títulos y descripciones libres de los anuncios utilizando APIs de traducción optimizadas en las redes de borde de Cloudflare, habilitando la expansión del marketplace a nuevos territorios de forma fluida y sin rediseñar la arquitectura base de datos.
