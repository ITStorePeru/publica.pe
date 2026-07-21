# Módulo 5: Sistema de Mensajería, Chat en Tiempo Real y Notificaciones

## 1 Objetivo
Diseñar e implementar una plataforma de comunicación asíncrona y en tiempo real de alta disponibilidad y baja latencia, que permita a compradores y vendedores interactuar de forma segura dentro de PUBLICA.PE. Este módulo debe garantizar la entrega inmediata de mensajes, el almacenamiento persistente de historial, soporte para archivos adjuntos, indicadores de estado (leído, entregado, escribiendo), y un sistema centralizado de notificaciones push/email para mantener el *engagement* del usuario en el marketplace.

---

## 2 Alcance
*   **Servicio de Chat en Tiempo Real:** Implementación de WebSocket (vía Socket.io o similar sobre NestJS) para la comunicación bidireccional inmediata.
*   **Gestión de Historial y Hilos (Threads):** Persistencia de conversaciones entre usuarios, organizadas por anuncio (contextual).
*   **Sistema de Notificaciones:** Motor centralizado para disparar alertas vía Push (móvil), Web Push (web), Email (transaccional) y notificaciones in-app.
*   **Gestión de Estados de Mensaje:** Indicadores de entrega, lectura y presencia (typing).
*   **Multimedia en Chat:** Envío de imágenes y documentos dentro del chat, soportando validación de seguridad previa al envío.

*Fuera del alcance:* Integración de bots de IA para atención al cliente (esto será un módulo futuro), funciones de llamadas de voz/video.

---

## 3 Casos de uso
1.  **Inicio de Conversación Contextual:** Un comprador hace clic en "Contactar vendedor" desde un anuncio. Se crea un canal de chat contextualizado con el anuncio.
2.  **Envío de Mensaje en Tiempo Real:** Los usuarios envían mensajes que se reflejan instantáneamente en la otra parte sin recargar la página.
3.  **Notificación de Nuevo Mensaje:** El usuario receptor recibe una notificación push o in-app cuando llega un mensaje nuevo mientras no está activo en el chat.
4.  **Marcar como Leído:** Se actualiza el estado del mensaje a "leído" en tiempo real cuando el receptor abre el chat.
5.  **Gestión de Conversaciones:** Listado de chats activos del usuario, ordenados por fecha de último mensaje, permitiendo archivar o bloquear.

---

## 4 Historias de usuario
*   **HU-5.01 (Iniciar Chat Contextual):** Como comprador, quiero iniciar una conversación directamente desde el anuncio para tener el contexto claro de qué producto estoy consultando.
*   **HU-5.02 (Chat en Tiempo Real):** Como usuario, quiero enviar y recibir mensajes al instante para negociar condiciones rápidamente.
*   **HU-5.03 (Notificaciones de Mensajes):** Como usuario, quiero recibir alertas cuando tenga mensajes nuevos si no estoy usando la app, para no perder oportunidades de venta/compra.
*   **HU-5.04 (Estados de Mensaje):** Como usuario, quiero ver si mi mensaje fue entregado o leído para saber si el interlocutor ya está al tanto.

---

## 5 Reglas de negocio
*   **RN-5.01 (Contexto Obligatorio):** Todo chat debe estar vinculado a un anuncio activo o un contexto comercial válido.
*   **RN-5.02 (Privacidad de Datos):** Los mensajes no pueden incluir datos de contacto externo (teléfonos, correos, links externos) que violen las políticas de seguridad antes de concretar una venta segura.
*   **RN-5.03 (Notificación de Ausencia):** Si un usuario no responde en 24 horas, el sistema enviará un recordatorio automático por email.
*   **RN-5.04 (Bloqueo):** Si un usuario bloquea a otro, el chat se vuelve de solo lectura para el bloqueado, y no puede enviar nuevos mensajes.

---

## 6 Arquitectura

### Componentes
*   **Chat Gateway (NestJS + WebSocket):** Maneja las conexiones persistentes de los usuarios.
*   **Chat Service:** Orquestador de la lógica de negocio (guardar mensajes, gestionar hilos, estados).
*   **Notification Service:** Servicio dedicado a la agregación y despacho de notificaciones (Push, Email).
*   **Redis Pub/Sub:** Permite escalar los WebSockets horizontalmente permitiendo que mensajes enviados a un nodo lleguen a usuarios conectados en otros nodos.

### Flujo
1.  Cliente envía mensaje vía WebSocket.
2.  Servicio de Chat persiste en PostgreSQL.
3.  Servicio de Chat publica en Redis Pub/Sub.
4.  El nodo donde está conectado el receptor consume el mensaje y lo emite vía WebSocket.
5.  Notificación asíncrona se encola para procesamiento de Push/Email.

---

## 7 Modelo de datos

1.  **`conversations`**: `id`, `listing_id`, `buyer_id`, `seller_id`, `created_at`, `updated_at`.
2.  **`messages`**: `id`, `conversation_id`, `sender_id`, `text`, `status` (sent/delivered/read), `created_at`.
3.  **`notifications`**: `id`, `user_id`, `type`, `content`, `is_read`, `created_at`.

---

## 8 APIs
*   **REST/GraphQL:** Listado de chats, historial de mensajes, marcar como leído.
*   **WebSocket:** `send_message`, `receive_message`, `typing_indicator`, `read_status`.

---

## 9 Seguridad
*   Cifrado TLS en tránsito para WebSockets.
*   Validación de pertenencia a la conversación antes de leer/escribir mensajes.
*   Sanitización profunda de mensajes (evitar XSS, inyección de links maliciosos).
*   Rate limiting agresivo en el envío de mensajes.

---

## 10 Escalabilidad
*   **Redis Pub/Sub:** Vital para escalar los servidores de WebSockets horizontalmente.
*   **Notificaciones Asíncronas:** Procesamiento mediante colas (RabbitMQ) para evitar bloquear el hilo de ejecución del chat.
*   **Particionado de Mensajes:** Si el volumen de mensajes es extremo, particionar la tabla `messages` por fecha o por `conversation_id`.

---

## 11 Riesgos
*   **Riesgo:** Sobrecarga de memoria en nodos WebSocket con alta concurrencia. **Mitigación:** Desconexión de clientes inactivos (timeouts), optimización de carga útil.
*   **Riesgo:** Uso del chat para spam/fraude. **Mitigación:** Implementación de análisis heurístico de contenido en tiempo real (prohibir links externos, detección de patrones de spam).

---

## 12 Buenas prácticas
*   Uso estricto de WebSockets con fallback a long-polling si es necesario (aunque en esta arquitectura moderna se asume WebSocket).
*   Desacoplamiento total del servicio de notificaciones del servicio de chat mediante eventos.

---

## 13 Roadmap de implementación
1.  Diseño de esquema de DB y configuración de WebSocket en NestJS.
2.  Implementación de persistencia de mensajes y lógica de canales.
3.  Sistema de indicadores de estado (typing, read).
4.  Motor de notificaciones y colas de despacho.
5.  Pruebas de carga de WebSocket.

---

## 14 Dependencias
*   **Depende de:** Módulo 1 (IAM - para autenticación) y Módulo 3 (Catálogo - para el contexto de anuncios).

---

## 15 Criterios de aceptación
*   Entrega de mensaje < 200ms.
*   Soporte para 100k usuarios concurrentes por nodo WebSocket.
*   Notificaciones push entregadas < 5s.

---

## 16 Estrategia de pruebas
*   Pruebas de carga con herramientas especializadas en WebSocket (ej. Artillery, K6).
*   Pruebas funcionales de desconexión/reconexión del cliente.

---

## 17 Mejoras futuras
*   Chat por voz/video, traducción automática en tiempo real, análisis de sentimiento de ventas mediante IA.
