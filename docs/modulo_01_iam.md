# Módulo 1: Servicio de Identidad, Autenticación y Perfiles de Usuario (IAM)

## 1 Objetivo
El objetivo de este módulo es diseñar e implementar la base fundamental de seguridad, autenticación, autorización y perfiles de usuario para la plataforma PUBLICA.PE. El sistema de Identity & Access Management (IAM) debe garantizar una experiencia de registro e inicio de sesión fluida (fricción mínima), segura contra vectores de ataque modernos, y altamente escalable para soportar más de 20 millones de usuarios activos con una disponibilidad del 99.99% (SLA).

Este servicio centraliza la emisión de tokens, verificación de identidad (teléfono, email, redes sociales), control de accesos basado en roles y permisos (RBAC/ABAC), y la gestión federada de identidades tanto para usuarios finales (C2C) como comerciales (B2C) e institucionales.

---

## 2 Alcance
El alcance del Módulo de IAM abarca las siguientes fronteras funcionales y técnicas:
*   **Autenticación de Usuarios:** Soporte para registro y login tradicional (Email/Password), autenticación sin contraseña (Magic Links), autenticación federada (OAuth2/OIDC con Google, Apple, Facebook), y autenticación multifactor (MFA por SMS, WhatsApp, Authenticator Apps TOTP, WebAuthn/Passkeys).
*   **Autorización y Gestión de Roles (RBAC/ABAC):** Definición de roles de sistema (SuperAdmin, Soporte, Moderador, Vendedor B2C, Comprador/Vendedor C2C, Empresa) y políticas dinámicas basadas en atributos (por ejemplo, reputación del usuario, geolocalización o tipo de verificación).
*   **Gestión de Perfiles y Cuentas:** Administración de datos de perfil, preferencias del usuario, configuraciones de privacidad, estados de cuenta (activa, suspendida provisionalmente, baneada permanentemente) y verificación de identidad avanzada (KYC por biometría/documento de identidad).
*   **Gestión de Sesiones Globales:** Control de sesiones activas concurrentes, revocación inmediata de tokens de acceso e inicio de sesión único (SSO) entre la aplicación web (Next.js) y la aplicación móvil (Flutter).
*   **Servicio de Auditoría de Accesos:** Registro inmutable de eventos de seguridad (intentos fallidos de login, cambios de contraseña, accesos desde nuevas IP/dispositivos).

*Fuera del alcance para este módulo:* Pasarelas de pago, procesamiento de publicaciones o compras, y sistemas de chat directo. Estos interactuarán con este módulo consumiendo sus tokens de identidad y consumiendo el API de perfiles.

---

## 3 Casos de uso
1.  **Registro de Cuenta Nueva (C2C / B2C):** Un visitante se registra utilizando su correo electrónico, número telefónico o un proveedor de identidad social (Google/Apple). El sistema valida la unicidad de los datos, envía un código de verificación de un solo uso (OTP) por SMS/WhatsApp, inicializa el perfil con reputación cero y emite la sesión inicial.
2.  **Inicio de Sesión y Emisión de Sesión Multi-dispositivo:** Un usuario autentica sus credenciales. El sistema analiza la huella digital del dispositivo e IP para evaluar riesgos. Si es de bajo riesgo, emite un Access Token de corta duración y un Refresh Token de larga duración almacenado de forma segura. Si el riesgo es alto, exige un segundo factor de autenticación (MFA).
3.  **Verificación KYC de Cuenta (B2C / Empresas):** Un vendedor profesional solicita la insignia de "Cuenta Verificada" para aumentar su conversión de venta. Sube una foto de su documento nacional de identidad (DNI o RUC) y una selfie biométrica. El sistema enruta las imágenes a un servicio de validación de identidad automatizado y actualiza el rol/nivel de confianza de la cuenta una vez aprobado.
4.  **Recuperación de Acceso Segura:** Un usuario solicita restablecer su contraseña debido a un olvido. El sistema genera un token de un solo uso criptográficamente seguro, con expiración de 10 minutos, y lo despacha por canal cifrado (email). El restablecimiento requiere opcionalmente confirmar un OTP enviado al móvil registrado.
5.  **Cierre de Sesión Global (Revocación):** Un usuario sospecha que su cuenta fue comprometida y solicita el cierre de sesión en todos los dispositivos activos. El sistema invalida todos los Refresh Tokens asociados en la base de datos de caché distribuida y propaga un evento de revocación para actualizar las listas negras de tokens en los API Gateways.

---

## 4 Historias de usuario
*   **HU-1.01 (Registro Unificado):** Como usuario comprador o vendedor, quiero registrarme usando mis credenciales de Google, Apple o mi correo electrónico para acceder instantáneamente a la plataforma sin procesos de registro complejos.
*   **HU-1.02 (Inicio de Sesión MFA Adaptativo):** Como usuario de PUBLICA.PE, quiero que el sistema me solicite un código de verificación temporal por SMS o WhatsApp solo cuando detecte un inicio de sesión desde un dispositivo o país inusual, para proteger mis publicaciones y datos de contacto sin perjudicar mi experiencia diaria.
*   **HU-1.03 (Perfil Profesional B2C):** Como comercio o concesionaria registrada (B2C), quiero configurar un perfil de tienda personalizada con logotipo, banner, geolocalización de sucursales físicas y enlaces a redes sociales para generar mayor confianza en mis clientes potenciales.
*   **HU-1.04 (Control de Sesiones Activas):** Como usuario preocupado por mi privacidad, quiero ver un listado de todos los dispositivos (navegador, móvil, ubicación aproximada y fecha de último acceso) que tienen una sesión activa de mi cuenta, con la opción de cerrar sesiones individuales o todas a la vez de forma remota.
*   **HU-1.05 (Validación de Identidad / Anti-fraude):** Como comprador, quiero visualizar una insignia de verificación en los perfiles de los vendedores para asegurarme de que sus identidades reales han sido validadas mediante su documento oficial y evitar fraudes o estafas en el marketplace.

---

## 5 Reglas de negocio
*   **RN-1.01 (Unicidad de Identificadores):** No pueden existir dos cuentas activas con el mismo correo electrónico o el mismo número de teléfono móvil validado en toda la plataforma.
*   **RN-1.02 (Fortaleza Criptográfica de Contraseñas):** Las contraseñas locales deben tener un mínimo de 10 caracteres, incluyendo al menos una letra mayúscula, una minúscula, un dígito y un carácter especial. Deben ser procesadas obligatoriamente usando algoritmos de hashing adaptativos (Argon2id con alta resistencia computacional).
*   **RN-1.03 (Políticas de Expiración de Tokens):** Los Access Tokens (JWT) emitidos deben tener un tiempo de vida máximo de 15 minutos. Los Refresh Tokens deben expirar en 30 días, estar sujetos a rotación automática en cada renovación (Token Rotation Pattern) e invalidarse inmediatamente al detectar un reuso sospechoso.
*   **RN-1.04 (Bloqueo de Cuenta por Fuerza Bruta):** Tras 5 intentos consecutivos fallidos de inicio de sesión en un intervalo de 10 minutos para un mismo correo o dirección IP, la cuenta del usuario debe bloquearse temporalmente por 15 minutos. El desbloqueo inmediato solo se habilitará validando un OTP enviado al móvil registrado.
*   **RN-1.05 (Verificación de Contacto Obligatoria):** Ningún usuario puede realizar publicaciones o interactuar con un vendedor (enviar mensajes, llamadas o compras) sin haber verificado con éxito al menos uno de sus canales de contacto principales (correo electrónico o número telefónico móvil).
*   **RN-1.06 (Restricción de Multicuenta en Dispositivos Sospechosos):** Si un mismo dispositivo móvil físico o dirección IP registra más de 3 cuentas distintas en un periodo menor a 24 horas, el sistema debe pausar automáticamente las cuentas nuevas y activar una alerta de moderación de fraude para análisis manual de comportamiento.

---

## 6 Arquitectura

### Componentes y Responsabilidades
El Módulo de IAM se implementa bajo un enfoque de microservicios, operando como el servicio base centralizado `Identity & User Service`.

*   **API Gateway (Nginx / Cloudflare):** Punto de entrada único. Maneja la terminación SSL/TLS, aplica reglas de Web Application Firewall (WAF) contra ataques como SQLi o XSS, y ejecuta un Rate Limiting estricto por dirección IP. Se integra con Redis en la capa perimetral para validar la firma e invalidación de tokens de manera ultra-rápida (token revocation list) antes de enrutar las peticiones al backend.
*   **NestJS IAM Microservice (Clean Architecture + Hexagonal):**
    *   **Capa de Infraestructura (Adaptadores de Entrada):** Controladores REST para endpoints de autenticación tradicionales, Resolvers GraphQL para consultas de perfiles públicos enriquecidos, y controladores gRPC para comunicación de alta velocidad interna entre microservicios (por ejemplo, cuando el servicio de publicaciones necesita validar los permisos de un usuario).
    *   **Capa de Aplicación (Casos de Uso):** Contiene la lógica orquestadora pura (ej. `RegisterUserUseCase`, `AuthenticateUserUseCase`, `VerifyIdentityUseCase`). Implementa el patrón CQRS dividiendo las consultas de visualización de perfiles (Query) de los comandos de cambio de contraseñas o datos críticos de identidad (Command).
    *   **Capa de Dominio (Núcleo):** Entidades puras de negocio (`User`, `Profile`, `Credential`, `Session`) libres de dependencias de bases de datos o frameworks. Contiene las reglas críticas y las validaciones invariantes del dominio.
    *   **Capa de Infraestructura (Adaptadores de Salida):** Implementaciones de repositorios mediante Prisma ORM para comunicarse con PostgreSQL, adaptadores de mensajería para publicar eventos de dominio vía RabbitMQ, y clientes HTTP para integrarse con proveedores de autenticación externa (OAuth) y servicios de validación de identidad KYC externos.

### Flujo de Autenticación OIDC (OAuth2)
1.  El cliente (Next.js/Flutter) inicia la autenticación social solicitando el consentimiento del usuario en Google/Apple.
2.  El proveedor de identidad emite un token de identidad (IdToken) firmado.
3.  El cliente transmite este IdToken al `NestJS IAM Service` vía API Gateway.
4.  El microservicio valida la firma del token con las llaves públicas rotativas del proveedor (JWKS).
5.  Si el usuario no existe en la base de datos de PUBLICA.PE, se ejecuta el caso de uso de registro silencioso, guardando la entidad de usuario e inicializando su perfil predeterminado.
6.  Se registra la sesión activa en el almacén de datos transaccionales, se guarda la huella en Redis para control de revocación rápida y se emiten los JWT correspondientes (Access Token firmado con HS256/RS256 y un Refresh Token de alta seguridad).

### Integraciones y Patrones Utilizados
*   **Outbox Pattern (Garantía de Entrega de Eventos):** Cuando se crea o modifica una cuenta, el servicio de IAM debe persistir de manera atómica el estado del usuario junto con un registro de evento en una tabla especial (`OutboxTable`) en la base de datos PostgreSQL, todo dentro de una misma transacción transaccional de Prisma. Un proceso de fondo independiente (Outbox Worker) lee continuamente esta tabla e inyecta los eventos (`UserCreatedEvent`, `UserStatusChangedEvent`) en los exchanges dedicados de RabbitMQ, garantizando consistencia eventual del 100% en otros microservicios (por ejemplo, para actualizar la base de datos de búsqueda de perfiles en OpenSearch o registrar datos analíticos).
*   **Circuit Breaker Pattern (Resiliencia en Servicios de Terceros):** Las integraciones con APIs externas de envío de SMS (Twilio), WhatsApp Business API, y herramientas de biometría KYC están protegidas por Circuit Breakers implementados en NestJS. Si el proveedor de SMS comienza a fallar o excede los tiempos de respuesta (latencia > 2000ms), el circuito se abre y desvía las peticiones a un proveedor secundario de respaldo o degrada el flujo ofreciendo envío por correo electrónico temporalmente.

---

## 7 Modelo de datos

### Entidades y Esquema Físico (PostgreSQL)

El esquema de base de datos se normaliza para garantizar atomicidad y rendimiento óptimo de lectura en perfiles altamente consultados. Se definen las siguientes tablas principales:

1.  **`users` (Tabla Principal de Identidad):**
    *   `id` (UUIDv4, PK): Identificador único global de la cuenta.
    *   `email` (VARCHAR(255), Unique, Nullable): Correo electrónico principal del usuario.
    *   `phone` (VARCHAR(30), Unique, Nullable): Teléfono móvil internacional verificado.
    *   `password_hash` (VARCHAR(255), Nullable): Hash Argon2id de la contraseña local (nulo si es cuenta OAuth pura).
    *   `status` (ENUM: ACTIVE, SUSPENDED, BANNED, PENDING_VERIFICATION): Estado operativo de la cuenta en la plataforma.
    *   `created_at` (TIMESTAMP WITH TIME ZONE, Default NOW).
    *   `updated_at` (TIMESTAMP WITH TIME ZONE, Default NOW).

2.  **`profiles` (Datos de Perfil e Información Comercial):**
    *   `user_id` (UUIDv4, FK -> users.id, PK, Unique): Relación uno-a-uno rígida con la identidad.
    *   `display_name` (VARCHAR(100)): Nombre público visible en el marketplace.
    *   `avatar_url` (VARCHAR(512), Nullable): Enlace a Cloudflare R2 para la imagen de perfil pública.
    *   `bio` (TEXT, Nullable): Descripción o biografía pública de la cuenta (crítica para vendedores B2C).
    *   `reputation_score` (DECIMAL(3,2), Default 5.00): Puntuación de reputación acumulada del vendedor.
    *   `verified_merchant` (BOOLEAN, Default FALSE): Bandera de verificación formal (KYC).
    *   `metadata` (JSONB): Atributos dinámicos (horarios de atención, dirección física de sucursales, enlaces a redes sociales).

3.  **`user_roles` (Mapeo de Control de Accesos):**
    *   `user_id` (UUIDv4, FK -> users.id, PK).
    *   `role` (ENUM: SUPERADMIN, MODERATOR, MERCHANT_B2C, USER_C2C, SUPPORT, COMPANY): Rol de seguridad asignado.
    *   `assigned_at` (TIMESTAMP).

4.  **`user_sessions` (Almacén Transaccional de Sesiones):**
    *   `id` (UUIDv4, PK).
    *   `user_id` (UUIDv4, FK -> users.id): Usuario propietario de la sesión.
    *   `refresh_token_hash` (VARCHAR(255), Unique): Hash del token de actualización activo para rotación rápida.
    *   `device_fingerprint` (VARCHAR(255)): Identificador único del navegador/teléfono móvil.
    *   `ip_address` (VARCHAR(45)): Dirección IPv4 o IPv6 del dispositivo que inició la conexión.
    *   `user_agent` (VARCHAR(512)): Cadena identificadora del sistema operativo y navegador.
    *   `is_valid` (BOOLEAN, Default TRUE): Estado de la sesión.
    *   `expires_at` (TIMESTAMP WITH TIME ZONE).
    *   `last_active_at` (TIMESTAMP WITH TIME ZONE).

5.  **`outbox_events` (Consistencia Eventual de Mensajería):**
    *   `id` (UUIDv4, PK).
    *   `aggregate_type` (VARCHAR(100)): Nombre de la entidad afectada (e.g., "User").
    *   `aggregate_id` (VARCHAR(100)): Identificador del recurso.
    *   `event_type` (VARCHAR(100)): Nombre del evento (e.g., "UserCreatedEvent").
    *   `payload` (JSONB): Datos completos serializados para transmisión.
    *   `status` (ENUM: PENDING, PROCESSED, FAILED): Control del despachador de eventos.
    *   `created_at` (TIMESTAMP WITH TIME ZONE).
    *   `processed_at` (TIMESTAMP WITH TIME ZONE, Nullable).

### Relaciones y Cardinalidad
*   `users` 1:1 `profiles` (Relación rígida para segregar credenciales/identidad del perfil público, reduciendo tamaño de fila en lecturas concurrentes).
*   `users` 1:N `user_roles` (Un usuario puede acumular múltiples roles, por ejemplo, ser un Comprador C2C estándar pero poseer credenciales de Moderador o Vendedor Corporativo).
*   `users` 1:N `user_sessions` (Permite al usuario mantener sesiones concurrentes en computadoras personales, tabletas y teléfonos inteligentes de forma simultánea).

### Índices y Particionado
*   **Índices B-Tree:**
    *   `users(email)` y `users(phone)`: Críticos para la velocidad de login y validación de unicidad en milisegundos.
    *   `user_sessions(refresh_token_hash)`: Acceso directo y optimizado para la rotación de tokens en cada petición de refresco de sesión.
    *   `profiles(reputation_score DESC)` y `profiles(verified_merchant)`: Índices compuestos para listados ordenados de vendedores destacados en el buscador del marketplace.
*   **Particionado de Tablas:**
    *   La tabla `user_sessions` experimenta un volumen masivo de escrituras e invalidaciones. Se aplicará **particionado por rango de tiempo mensual** en PostgreSQL. Esto permite purgar registros antiguos de sesiones cerradas o expiradas simplemente eliminando particiones históricas obsoletas (`DROP PARTITION`), evitando por completo la fragmentación de índices y el consumo masivo de recursos de vaciado de tablas (`VACUUM`).

### Estrategia de Almacenamiento
*   Los datos altamente estructurados y relacionales se consolidan en PostgreSQL bajo ACID estricto.
*   Los avatares y archivos de verificación de identidad de alta definición se almacenan de manera directa en **Cloudflare R2** utilizando URLs prefirmadas emitidas con expiración corta de 5 minutos, protegiendo documentos confidenciales.
*   **Redis** se configura con políticas de persistencia en disco de bajo impacto para actuar como el sistema de almacenamiento en caché clave-valor distribuido, reteniendo las sesiones activas, tokens de revocación global (blacklist) y límites de Rate Limiting.

---

## 8 APIs

### REST API
Utilizado principalmente para los flujos tradicionales de autenticación y flujos móviles donde se requiere consistencia clásica de peticiones HTTP en formato JSON.

*   `POST /api/v1/auth/register`: Registro inicial de usuarios. Recibe correo/teléfono y credenciales locales, devuelve estado preliminar del registro y requiere validación OTP.
*   `POST /api/v1/auth/login`: Autenticación tradicional. Recibe credenciales, retorna Access Token (JWT en cuerpo de respuesta) y guarda el Refresh Token cifrado en una cookie HTTP-Only segura con banderas `Secure`, `SameSite=Strict`, `Partitioned` y `HostOnly`.
*   `POST /api/v1/auth/refresh`: Renovación del Access Token. Lee la cookie segura, ejecuta la validación del Refresh Token, invalida el token actual, guarda el nuevo token rotado en la base de datos y cookies, y devuelve el nuevo Access Token de 15 minutos.
*   `POST /api/v1/auth/mfa/enable`: Inicia la activación de MFA (retorna código QR de TOTP o inicia validación SMS).
*   `POST /api/v1/auth/logout`: Revoca la sesión actual eliminando el token de Redis y PostgreSQL, y limpiando las cookies HTTP del cliente.

### GraphQL API
Ideal para el consumo del Frontend en Next.js y la aplicación móvil en Flutter, reduciendo sustancialmente el over-fetching de datos públicos e información enriquecida del vendedor.

*   `Query { getPublicProfile(userId: ID!) { id display_name avatar_url bio reputation_score verified_merchant rating_distribution { stars percentage } created_at } }`
*   `Mutation { updateProfile(input: UpdateProfileInput!) { id display_name bio avatar_url metadata } }`

### API de Eventos (Eventos Asíncronos vía RabbitMQ)
El microservicio IAM publica eventos de alta relevancia de negocio utilizando el patrón de publicación/suscripción.

*   `user.event.created` (Routing Key): Publicado inmediatamente tras registrar una cuenta. Contiene la estructura básica de identidad (id, email, phone, created_at). Consumido por el microservicio de Notificaciones para despachar el correo de bienvenida, y por el microservicio de Búsqueda para crear el índice del usuario.
*   `user.event.suspended` (Routing Key): Notifica a toda la plataforma que un usuario ha sido suspendido por comportamiento sospechoso o fraude. El microservicio de publicaciones procesa este evento y oculta todas sus publicaciones de manera inmediata.
*   `user.event.kyc_verified` (Routing Key): Disparado tras aprobar el proceso de validación biométrica. Desbloquea límites más altos de publicación en la plataforma.

### WebSocket (Comunicación de Sesiones en Tiempo Real)
*   **Canal `/ws/v1/iam/session`**: Permite a la aplicación de usuario mantener un túnel WebSocket abierto con el servidor para reaccionar inmediatamente a eventos remotos de su cuenta (por ejemplo, alertas de nuevos inicios de sesión sospechosos, invalidación forzada de la sesión o notificaciones críticas del sistema IAM).

### gRPC API (Comunicación Interna Síncrona de Alto Rendimiento)
Expuesto exclusivamente dentro de la red privada de Kubernetes, de baja latencia (serialización en binario con Protocol Buffers).

*   `rpc ValidateToken (TokenRequest) returns (TokenResponse)`: Consumido por los microservicios aguas abajo (Publicaciones, Pagos, Chat) para verificar la validez e identidad de un Access Token decodificado, retornando el identificador del usuario, rol y permisos específicos.
*   `rpc CheckUserPermissions (PermissionRequest) returns (PermissionResponse)`: Valida políticas complejas basadas en RBAC/ABAC para autorizar acciones específicas del sistema en milisegundos.

---

## 9 Seguridad

### Control de Accesos, Firma y Mitigación de Vulnerabilidades
*   **JWT Cifrados y Firmados (RS256):** El microservicio IAM utiliza criptografía asimétrica. Firma los tokens utilizando una clave privada resguardada bajo estrictas políticas de rotación de secretos en el Cloud Secret Manager. Los microservicios de consumo solo requieren descargar periódicamente la clave pública (JWKS) expuesta en la red interna para validar la autenticidad del token de forma descentralizada y síncrona sin sobrecargar el servicio IAM.
*   **Cookie HTTP-Only, Secure y SameSite=Strict:** El Refresh Token se almacena exclusivamente en cookies del lado del cliente que no pueden ser accedidas por scripts JS del navegador (mitigación total de ataques de robo de tokens por XSS).
*   **Control de Accesos Basado en Roles y Atributos (RBAC + ABAC):** La seguridad de la aplicación implementa decoradores a nivel de controladores que evalúan no solo el rol (ej. `Merchant`) sino atributos en tiempo real (ej. `reputation_score > 3.0` o `account_age_days > 15`) para autorizar operaciones críticas como publicaciones de alto valor.
*   **Rate Limiting con Algoritmo Token Bucket:** Protegido a nivel perimetral en Cloudflare y controlado de forma redundante en el API Gateway mediante Redis. Los endpoints de autenticación (`/auth/login`, `/auth/register`) tienen una tasa estricta de un máximo de 5 peticiones por minuto por dirección IP / Fingerprint.
*   **Integración de Cloudflare WAF:** Reglas personalizadas para inspeccionar tráficos inusuales, bloqueando intentos de inyección de payloads, mitigando ataques de denegación de servicio (DDoS) a gran escala, y desafiando con captchas inteligentes tráficos automatizados sospechosos procedentes de redes residenciales comprometidas o VPS de bajo costo.
*   **CORS e Implementación de Tokens CSRF:** Políticas de Cross-Origin Resource Sharing ultra-estrictas que solo permiten peticiones HTTP procedentes del dominio principal y de los subdominios legítimos configurados. Los endpoints con métodos mutacionales (`POST`, `PUT`, `DELETE`) en los navegadores web requieren un token CSRF dinámico inyectado de forma segura en las cabeceras HTTP de la transacción.
*   **Políticas de Saneamiento y Validaciones estrictas:** Toda entrada es saneada eliminando caracteres sospechosos de inyección SQL u HTML. Se implementan validaciones de esquemas en tiempo de compilación y ejecución utilizando **Zod** y **Class-Validator** en NestJS, asegurando que ningún payload malformado llegue a tocar las bases de datos de almacenamiento persistente.
*   **Auditoría inmutable de Logs de Seguridad:** Cada modificación de seguridad (cambios de contraseña, autenticaciones multifactor fallidas o cambios de estado de cuenta) es registrada en un almacén de auditoría inmutable. Los logs estructurados en JSON se despachan a un agente recolector OpenTelemetry para ser analizados en Grafana Loki de forma centralizada.

---

## 10 Escalabilidad

### Diseño para Alta Disponibilidad y Tráfico de Millones de Usuarios
*   **Escalabilidad Horizontal de NestJS (Stateless Design):** El microservicio de IAM es completamente sin estado (Stateless). Toda la información de sesión se distribuye entre PostgreSQL (particionado) y Redis (Clusterizado). Los contenedores Docker de NestJS corren en Kubernetes (EKS/GKE) y se autoescalan mediante el Horizontal Pod Autoscaler (HPA) basándose en métricas de CPU y memoria, permitiendo escalar de 5 pods en baja demanda a 50 pods durante picos extremos de tráfico.
*   **Caché Distribuido con Arquitectura Redis Cluster:** Redis opera como la base de datos en memoria para el acceso rápido a estados de sesión activos y la lista negra de revocación de tokens. Se despliega un cluster de Redis multi-zona con nodos de lectura replicados geográficamente para garantizar que la verificación de tokens en el API Gateway ocurra en un promedio menor a 2 milisegundos.
*   **Replicación de Lectura y Sharding en PostgreSQL:** PostgreSQL se implementa con una topología de un Nodo de Escritura Primario y múltiples Réplicas de Lectura distribuidas por zonas de disponibilidad. Las lecturas de perfiles públicos de vendedores se enrutan de forma exclusiva a las réplicas de lectura, mientras que la escritura de registros y sesiones va al primario, evitando cuellos de botella de bloqueo de tablas de base de datos.
*   **Distribución Global a través de Cloudflare CDN:** El contenido estático del módulo de IAM (como avatares, logotipos y banners de tiendas cargados en Cloudflare R2) es servido y distribuido en los bordes de la red (Edge Servers) de Cloudflare a nivel global, reduciendo el consumo de ancho de banda del backend y optimizando la velocidad de renderizado de imágenes para el usuario final.
*   **Cola de Mensajería Elástica con RabbitMQ:** Los flujos asíncronos y pesados de procesamiento de identidades (por ejemplo, procesar imágenes KYC de alta definición o despachar notificaciones masivas de seguridad) se manejan mediante colas de RabbitMQ elásticas. Esto actúa como un búfer que previene picos de tráfico que puedan saturar el procesador de base de datos principal, permitiendo encolar tareas y procesarlas en paralelo según la disponibilidad de trabajadores (Workers).

---

## 11 Riesgos

### Identificación de Amenazas y Planes de Mitigación Creados
1.  **Riesgo Técnico: Latencia crítica en la validación síncrona de tokens por microservicios.**
    *   *Detalle:* Si cada acción en el marketplace (publicar, enviar mensaje) requiere que los otros microservicios pregunten síncronamente al servicio de IAM si el usuario es válido, se crearía una alta latencia añadida y un único punto de fallo (SPOF) catastrófico.
    *   *Mitigación:* Se implementan JSON Web Tokens (JWT) firmados asimétricamente (RS256) con llaves rotativas expuestas en JWKS. Los microservicios descargan localmente las llaves públicas públicas una sola vez al día (guardándolas en memoria) y validan la firma del token localmente sin realizar llamadas de red, eliminando por completo este punto de fallo de rendimiento.
2.  **Riesgo Funcional: Registro masivo de cuentas falsas y bots de spam.**
    *   *Detalle:* Los atacantes automatizados crean miles de cuentas fantasma diariamente para minar datos de contacto de vendedores legítimos o inundar la base de datos de publicaciones fraudulentas.
    *   *Mitigación:* Se implementa un modelo de reputación inicial pasivo y un sistema de verificación multifactor obligatorio (teléfono móvil/WhatsApp) antes de autorizar cualquier publicación de anuncios en la plataforma. Además, se asocia el registro de nuevos usuarios con el servicio antibot invisible de Cloudflare Turnstile para detener agentes automatizados antes de que toquen el backend.
3.  **Riesgo de Negocio: Incremento exorbitante de costos operacionales de SMS / WhatsApp para OTP.**
    *   *Detalle:* Un ataque coordinado de abuso de envío de SMS de registro puede consumir decenas de miles de dólares en minutos enviando mensajes telefónicos a números internacionales inexistentes o premium.
    *   *Mitigación:* Se diseña un control estricto de Rate Limiting IP/Teléfono para peticiones de SMS. El sistema implementa un retraso exponencial obligatorio (Exponential Backoff) entre solicitudes de un mismo usuario e implementa verificación inicial de reputación del número móvil. Adicionalmente, se prioriza el uso de WhatsApp Business API (el cual posee tarifas más económicas que los SMS tradicionales en mercados clave de Latinoamérica) y el uso prioritario de autenticación mediante correo de un solo uso o Magic Links en etapas tempranas del embudo de registro de la plataforma.

---

## 12 Buenas prácticas
*   **Cumplimiento de Estándares de Seguridad de la Industria (OWASP / GDPR / PCI):**
    *   Cumplimiento riguroso del OWASP Top 10 para mitigar fallos comunes de inyección y autenticación incorrecta.
    *   El diseño de base de datos implementa el principio de "Privacidad por Diseño" (GDPR Compliant), permitiendo que un usuario ejerza su derecho al olvido. La eliminación de cuenta destruye de forma física las credenciales e información identificable del usuario en la tabla `users` y anonimiza todos los campos personales del perfil, manteniendo los registros históricos de transacciones con un UUID no vinculable por motivos de control tributario e histórico de ventas del negocio.
*   **Separación Estricta de Responsabilidades (CQRS):** Separar completamente el almacenamiento y la lectura de perfiles mediante réplicas dedicadas para asegurar que las consultas masivas no tengan ningún impacto en el flujo transaccional de inicio de sesión o edición de cuentas críticas.
*   **Prácticas de Desarrollo de la Base de Datos con Prisma:** Jamás correr consultas raw no sanitizadas en la base de datos. Se utiliza Prisma Client estructurado, y todas las migraciones del esquema físico se declaran de forma determinista y secuencial en control de versiones, prohibiendo de forma estricta alteraciones directas "en vivo" en producción.

---

## 13 Roadmap de implementación

```
[MÓDULO DE IAM: SECUENCIA DE PRIORIDAD DE TAREAS ARQUITECTÓNICAS]

Fase 1: Core de Base de Datos y Modelado de Datos de Identidad (Alta Prioridad)
  ├── Tarea 1.1: Diseñar esquema físico PostgreSQL (Tablas, Índices, Relaciones) en Prisma
  └── Tarea 1.2: Configurar e inicializar el clúster de base de datos relacional y las réplicas de lectura

Fase 2: Arquitectura del Servicio NestJS IAM e Integración del SDK (Prioridad Media-Alta)
  ├── Tarea 2.1: Implementar la arquitectura hexagonal base del microservicio de autenticación
  └── Tarea 2.2: Configurar la estrategia de autenticación asimétrica de tokens (RS256 / JWKS)

Fase 3: Implementación de Endpoints Críticos y Control de Sesión (Prioridad Media)
  ├── Tarea 3.1: Desarrollar lógica transaccional de Login, Registro, Cookies y Token Rotation en Redis
  └── Tarea 3.2: Desarrollar lógica de seguridad periférica (MFA Adaptativo, Rate Limiting y WAF)

Fase 4: Consistencia de Datos con Colas y Notificaciones (Prioridad Media-Baja)
  ├── Tarea 4.1: Desarrollar componente de persistencia Outbox Pattern para propagación de eventos
  └── Tarea 4.2: Configurar colas de mensajería asíncronas en RabbitMQ para eventos de usuario

Fase 5: Verificaciones Avanzadas de Identidad y Pruebas (Baja Prioridad / Iterativo)
  ├── Tarea 5.1: Desarrollar módulo de integración externa biométrica y KYC para cuentas comerciales B2C
  └── Tarea 5.2: Diseñar y ejecutar suite completa de pruebas unitarias, de integración, de carga y de caos
```

---

## 14 Dependencias
*   **Depende directamente de:** Ninguno. IAM es el microservicio fundacional absoluto y el ancla de seguridad del ecosistema de PUBLICA.PE. No requiere ningún otro módulo de negocio activo para operar su lógica.
*   **Dependientes de este módulo:** Todos los módulos e infraestructuras subsecuentes del ecosistema de PUBLICA.PE dependen directamente de IAM para validar la autenticidad, identidad, roles y autorizaciones de las peticiones que procesan:
    *   *Módulo de Publicación de Anuncios:* Requiere validación de sesión de usuario y evaluación de nivel de perfil/reputación.
    *   *Módulo de Mensajería y Chat:* Consume tokens de identidad de IAM para abrir canales WebSocket seguros entre usuarios reales de la plataforma.
    *   *Módulo de Pasarela de Pagos y Transacciones:* Requiere confirmación KYC firme y estado operativo activo del usuario en el sistema IAM para mitigar lavado de dinero y fraudes en transacciones de compra/venta.

---

## 15 Criterios de aceptación
*   **CA-1.01 (Verificación de Token en Milisegundos):** La comprobación de firma y validez de un Access Token de usuario a través del API Gateway utilizando la validación asimétrica local en memoria debe ocurrir en menos de 3 milisegundos para el 99.9% de las peticiones HTTP concurrentes.
*   **CA-1.02 (Rotación e Invalidación de Tokens):** Si un atacante roba un Refresh Token de usuario e intenta utilizarlo después de que ya haya sido rotado (uso duplicado sospechoso), el sistema de seguridad IAM debe marcar inmediatamente toda la cadena de Refresh Tokens relacionados como inválida, revocar todas las sesiones del usuario de forma inmediata en Redis/PostgreSQL, y forzar un cambio de contraseña al propietario real.
*   **CA-1.03 (Tolerancia a Caídas de Proveedores Externos de SMS/OTP):** El circuito de seguridad del microservicio debe redirigir de forma totalmente automatizada las solicitudes de OTP al proveedor de respaldo en menos de 500 milisegundos tras registrar 3 fallos consecutivos en el proveedor principal, sin mostrar mensajes de error al usuario final.
*   **CA-1.04 (Inmutabilidad de la Tabla de Eventos Outbox):** Ningún evento puede omitirse ni borrarse físicamente antes de haber sido procesado exitosamente por la cola RabbitMQ. La base de datos debe almacenar de manera atómica cada evento asociado en la transacción de usuario.

---

## 16 Estrategia de pruebas
*   **Pruebas Unitarias (Unit Testing):** Cobertura de pruebas superior al 95% en la capa de Dominio (Entidades de negocio y reglas puras) y en la capa de Aplicación (Casos de uso críticos como hashing de contraseñas, validación de expiración de tokens, etc.).
*   **Pruebas de Integración (Integration Testing):** Pruebas de integración automatizadas simulando peticiones HTTP REST y mutaciones GraphQL de principio a fin, validando la interacción entre NestJS Prisma, la base de datos PostgreSQL real levantada en entornos de integración continua (Testcontainers) y la base de datos en caché Redis para el refresco e invalidación de tokens.
*   **Pruebas de Carga (Load Testing):** Simulación de un volumen extremo de tráfico recurrente utilizando herramientas de alta concurrencia como K6. El objetivo de la prueba es estresar el endpoint `/api/v1/auth/login` con 200,000 peticiones concurrentes de inicio de sesión por minuto, validando que el cluster de Redis mantenga latencias menores a 5ms y que el procesador NestJS no degrade su rendimiento.
*   **Pruebas de Seguridad (Penetration & Security Testing):** Escaneo estático del código (SAST) integrado en los flujos de GitHub Actions para identificar vulnerabilidades de librerías desactualizadas o fallos de diseño de código. Ejecución periódica de herramientas dinámicas (DAST) simulando vectores de ataque clásicos (Session Fixation, Token Spoofing, Brute Force Bypass, SQL Injection) para asegurar la solidez del API Gateway y Cloudflare WAF.
*   **Pruebas de Caos (Chaos Testing):** Implementación de agentes de caos en el clúster Kubernetes de prueba para apagar de forma imprevista pods del microservicio IAM, forzar la caída de un nodo del clúster Redis, o inyectar latencia artificial del 80% en el primario de base de datos PostgreSQL, comprobando que el sistema se auto-recupere y mantenga activas las lecturas sin degradar la disponibilidad del core del marketplace.

---

## 17 Mejoras futuras
*   **Integración Nativa de WebAuthn / Passkeys:** Permitir a los usuarios iniciar sesión sin contraseñas ni OTPs utilizando sistemas biométricos nativos de sus dispositivos (FaceID, TouchID, huella dactilar de Android) integrados con las API Web del navegador y del SDK nativo del dispositivo, eliminando por completo la necesidad de contraseñas tradicionales y reduciendo costos operativos de autenticación OTP a cero.
*   **Detección de Fraudes basada en Modelos de Machine Learning (ML Behavior Analysis):** Desarrollar un agente de puntuación de riesgos dinámico que analice patrones complejos de velocidad de clic de usuario, navegación física, coincidencia de perfiles sospechosos y cambios de red para detectar cuentas operadas por bots coordinados y bloquearlas de forma preventiva antes de que inicien campañas de spam o estafas en el marketplace.
*   **Soporte de B2C Premium Multi-Tenant:** Diseñar e implementar capacidades de Federación avanzada que permitan a los comercios B2C corporativos más grandes (como concesionarias de vehículos de gran envergadura o corporaciones inmobiliarias multinacionales) integrar sus propios sistemas corporativos IAM de identidad (como Active Directory, Okta o Auth0) directamente con la plataforma de PUBLICA.PE para gestionar los permisos de sus asesores de venta de forma centralizada y segura.
