# Módulo 8: Sistema de Reputación, Ratings y Reviews

## 1 Objetivo
El objetivo de este módulo es diseñar un sistema de reputación confiable, transparente y resistente a la manipulación para PUBLICA.PE. Este sistema es vital para establecer la confianza entre compradores y vendedores C2C/B2C, permitiendo que la reputación acumulada sea el activo principal de los participantes en la plataforma. Debe permitir la calificación de transacciones, la redacción de reseñas detalladas y el cálculo dinámico de puntuaciones globales basadas en diversos factores (historial, velocidad, veracidad, volumen).

---

## 2 Alcance
*   **Gestión de Ratings:** Sistema de calificación de 1 a 5 estrellas para transacciones completadas.
*   **Sistema de Reviews:** Redacción y publicación de reseñas textuales vinculadas a un pedido específico.
*   **Motor de Cálculo de Reputación:** Algoritmo ponderado para calcular la reputación pública del vendedor (y opcionalmente comprador) basado en ratings históricos, recencia de transacciones, disputas y cancelaciones.
*   **Moderación de Reviews:** Flujo para denunciar reseñas falsas, ofensivas o malintencionadas.
*   **Visualización de Reputación:** APIs y componentes para exponer la reputación en el perfil y en las tarjetas de anuncios.

*Fuera del alcance:* Integración de IA para generación automática de reseñas (esto sería un módulo de optimización futura).

---

## 3 Casos de uso
1.  **Calificar una transacción:** Tras confirmar la recepción (Módulo 7), el comprador califica al vendedor.
2.  **Visualización de reputación:** Compradores ven la reputación en el perfil del vendedor antes de comprar.
3.  **Denunciar reseña:** Un vendedor denuncia una reseña que considera injusta o falsa.
4.  **Cálculo dinámico:** El sistema actualiza la reputación del vendedor tras cada nueva calificación.

---

## 4 Historias de usuario
*   **HU-8.01 (Calificar venta):** Como comprador, quiero calificar mi experiencia para ayudar a otros usuarios a decidir.
*   **HU-8.02 (Ver reputación):** Como comprador, quiero ver la reputación de un vendedor para comprar con confianza.
*   **HU-8.03 (Responder reseñas):** Como vendedor, quiero responder a las reseñas para dar mi versión ante una crítica negativa.

---

## 5 Reglas de negocio
*   **RN-8.01 (Transacción obligatoria):** Solo se puede calificar si existe una transacción completada y confirmada en el OMS (Módulo 7).
*   **RN-8.02 (Tiempo límite):** El usuario tiene un máximo de 30 días tras la entrega para calificar.
*   **RN-8.03 (Peso de ratings):** Los ratings de vendedores con baja reputación o comportamiento sospechoso pueden tener un peso menor en el cálculo final para evitar manipulación.

---

## 6 Arquitectura

### Componentes
*   **Reputation Service (NestJS):** Lógica de cálculo de puntuaciones y gestión de reviews.
*   **Moderation Service:** Gestión de denuncias de contenido.
*   **Event-Driven Updates:** Actualizaciones de reputación disparadas por eventos del Módulo 7 (confirmación de entrega).

### Flujo
1.  Pedido confirmado recibido -> Módulo 7 emite evento `order.delivered`.
2.  `ReputationService` procesa evento y habilita la posibilidad de calificar al usuario.
3.  Usuario publica rating -> `ReputationService` persiste y recalcula puntuación promedio.
4.  `ReputationService` actualiza el perfil del usuario (Módulo 1/2) mediante evento.

---

## 7 Modelo de datos
1.  **`ratings`**: `id`, `order_id`, `buyer_id`, `seller_id`, `score` (1-5), `comment`, `created_at`.
2.  **`reputation_summary`**: `user_id`, `average_score`, `total_ratings`, `last_updated`.

---

## 8 APIs
*   **REST/GraphQL:** `submit_rating`, `get_ratings_by_user`, `report_review`.

---

## 9 Seguridad
*   Validación estricta de que el usuario solo puede calificar si participó en la orden.
*   Sanitización de comentarios (evitar XSS, spam).
*   Prevención de spam de calificaciones (limitación por usuario/orden).
*   Mecanismos anti-collusion (detectar vendedores/compradores que se califican entre sí reiteradamente).

---

## 10 Escalabilidad
*   Cálculo de reputación asíncrono (event-driven).
*   Cache de promedios de reputación en Redis para consulta rápida en tarjetas de producto.

---

## 11 Riesgos
*   **Riesgo:** Manipulación de reputación por parte del vendedor. **Mitigación:** Algoritmos de detección de anomalías, pesos dinámicos en puntuaciones.
*   **Riesgo:** Reseñas difamatorias. **Mitigación:** Sistema de denuncias eficiente y moderación humana/IA.

---

## 12 Buenas prácticas
*   Priorizar la recencia en el cálculo de la reputación (los ratings antiguos pesan menos que los nuevos).
*   Ser transparentes con la metodología de cálculo.

---

## 13 Roadmap de implementación
1.  Diseño de esquema de DB y lógica de cálculo.
2.  API de creación de ratings y reviews.
3.  Sistema de visualización y API de consulta.
4.  Moderación y sistema de denuncias.

---

## 14 Dependencias
*   **Depende de:** Módulo 1 (IAM), Módulo 7 (OMS - para validar la transacción).

---

## 15 Criterios de aceptación
*   Rating correctamente vinculado a una transacción única.
*   Cálculo de promedio actualizado en tiempo real o casi real.
*   Visualización correcta en perfil y anuncios.

---

## 16 Estrategia de pruebas
*   Pruebas de cálculo de promedios con grandes volúmenes de datos.
*   Pruebas de validación de transacciones (intentar calificar sin orden).

---

## 17 Mejoras futuras
*   Análisis de sentimiento de reseñas mediante IA, integración de respuestas de vendedores validadas, gamificación de reputación.
