# Módulo 9: Moderación de Contenido, Confianza y Seguridad (Trust & Safety)

## 1 Objetivo
Diseñar e implementar un motor centralizado de moderación de contenido y seguridad para PUBLICA.PE. El objetivo es proteger la plataforma contra el fraude, contenido ilegal, spam, abuso y comportamientos malintencionados, garantizando un entorno seguro y confiable para todos los usuarios. Este módulo actúa como el guardián de la integridad de la plataforma, utilizando tanto mecanismos automáticos (IA/Reglas) como flujos de moderación humana.

---

## 2 Alcance
*   **Moderación Automática de Contenido (Textos/Imágenes):** Análisis de títulos, descripciones y fotografías de anuncios para detectar contenido prohibido, armas, drogas, material ilegal, o duplicados.
*   **Gestión de Reportes de Usuarios:** Sistema para que los usuarios denuncien anuncios, perfiles o mensajes inapropiados.
*   **Motor de Reglas de Seguridad:** Implementación de reglas automáticas para bloquear cuentas o anuncios que violen los términos de servicio.
*   **Panel de Moderación (Dashboard Interno):** Interfaz para moderadores humanos para revisar casos flagelados por el sistema automático y tomar decisiones.
*   **Prevención de Fraude:** Detección de patrones de comportamiento sospechosos (ej. intentos de estafa, publicaciones masivas sospechosas).

*Fuera del alcance:* Implementación de servicios de IA de terceros para análisis de visión (se consumen mediante integraciones).

---

## 3 Casos de uso
1.  **Moderación automática de anuncio:** Un anuncio es analizado inmediatamente tras su creación; si detecta contenido prohibido (ej. imágenes explícitas), se pausa automáticamente.
2.  **Reporte de usuario:** Usuario reporta un anuncio por ser estafa; el anuncio es flagelado y entra en la cola de revisión humana.
3.  **Acción del moderador:** Moderador humano revisa el reporte, decide bloquear el anuncio y aplicar sanción al vendedor.
4.  **Detección de patrones de fraude:** El sistema identifica un vendedor que intenta publicar 50 anuncios en 10 minutos y bloquea la cuenta preventivamente.

---

## 4 Historias de usuario
*   **HU-9.01 (Reportar anuncio):** Como usuario, quiero reportar contenido inapropiado para mantener la calidad del marketplace.
*   **HU-9.02 (Panel de moderación):** Como moderador, quiero visualizar los reportes pendientes para tomar acciones rápidas sobre contenido malicioso.
*   **HU-9.03 (Notificación de moderación):** Como vendedor, quiero ser notificado si mi anuncio fue rechazado y cuál es la razón.

---

## 5 Reglas de negocio
*   **RN-9.01 (Contenido Prohibido):** Contenido que infrinja leyes locales o términos del servicio debe ser eliminado de forma inmediata.
*   **RN-9.02 (Sanciones escalonadas):** Aplicar sanciones basadas en reincidencia (advertencia -> suspensión temporal -> ban permanente).
*   **RN-9.03 (Reportes):** Todo reporte de usuario debe ser contabilizado y analizado para detectar falsos positivos.

---

## 6 Arquitectura

### Componentes
*   **Moderation Engine (NestJS):** Orquestador de reglas, colas de moderación y comunicación con integraciones.
*   **Moderation Dashboard API:** Endpoints para el panel de moderadores humanos.
*   **Worker de Análisis (asíncrono):** Procesa anuncios en cola mediante servicios de IA/visión.

### Flujo
1.  Evento de nuevo anuncio (Módulo 3) -> `ModerationEngine` coloca anuncio en cola de revisión.
2.  `Worker de Análisis` procesa (AI vision/text check).
3.  Si es sospechoso -> Flagged, notificar moderador. Si es seguro -> Activar anuncio.
4.  Reporte de usuario -> `ModerationEngine` bandera anuncio y notifica al equipo de moderación.

---

## 7 Modelo de datos
1.  **`moderation_reports`**: `id`, `target_id`, `target_type` (listing/user/message), `reporter_id`, `reason`, `status`, `created_at`.
2.  **`moderation_actions`**: `id`, `report_id`, `moderator_id`, `action_taken`, `reason`, `created_at`.

---

## 8 APIs
*   **REST/GraphQL:** `submit_report`, `get_pending_reports`, `take_action_on_report`.
*   **Eventos:** `listing.flagged`, `user.banned`, `content.approved`.

---

## 9 Seguridad
*   Restricción de acceso al panel de moderación mediante RBAC (solo usuarios con rol MODERATOR).
*   Logs inmutables de todas las acciones tomadas por moderadores.
*   Protección de los endpoints de moderación contra ataques de fuerza bruta.

---

## 10 Escalabilidad
*   Procesamiento asíncrono de moderación automática mediante colas.
*   Escalabilidad horizontal de los servicios de análisis.

---

## 11 Riesgos
*   **Riesgo:** Falsos positivos bloqueando anuncios legítimos. **Mitigación:** Sistema de revisión humana ágil, mejora continua de los modelos de IA/reglas.
*   **Riesgo:** Sobrecarga de reportes manuales. **Mitigación:** Automatización avanzada para filtrar reportes triviales.

---

## 12 Buenas prácticas
*   Priorizar la moderación preventiva siempre que sea posible.
*   Ser transparente con los usuarios sobre las políticas de contenido.

---

## 13 Roadmap de implementación
1.  Definición de políticas de contenido y reglas automáticas.
2.  Implementación del flujo de reportes y colas de moderación.
3.  Desarrollo del panel de moderación para equipos internos.
4.  Integración de servicios externos de moderación (IA).

---

## 14 Dependencias
*   **Depende de:** Módulo 1 (IAM - para autenticación), Módulo 3 (Catálogo - para el contenido).

---

## 15 Criterios de aceptación
*   Detección y bloqueo automático de contenido prohibido básico.
*   Dashboard funcional para que moderadores tomen acciones.
*   Flujo de reporte de usuario operativo.

---

## 16 Estrategia de pruebas
*   Pruebas automatizadas con datasets de contenido prohibido conocido.
*   Simulación de cargas masivas de reportes.

---

## 17 Mejoras futuras
*   Modelos propios de aprendizaje profundo para moderación especializada, integración con bases de datos de fraude globales.
