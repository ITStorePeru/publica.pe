# Módulo 7: Gestión de Pedidos, Cumplimiento y Logística (Order Management System - OMS)

## 1 Objetivo
Diseñar e implementar un sistema de gestión de pedidos (OMS) robusto para PUBLICA.PE. Este módulo centraliza el ciclo de vida completo de un pedido desde que el pago es confirmado hasta que el producto/servicio es entregado y confirmado por el comprador. Su objetivo es orquestar la logística, el cumplimiento (fulfillment) y la gestión de estados del pedido, garantizando una visibilidad clara para compradores y vendedores, y permitiendo una gestión eficiente de devoluciones o disputas.

---

## 2 Alcance
*   **Gestión de Estados del Pedido:** Control del flujo desde la creación (tras pago), preparación, envío, entrega y finalización.
*   **Integración Logística:** Conexión con proveedores de logística (Courier, envíos) para generación de guías, seguimiento (tracking) y gestión de entregas.
*   **Gestión de Disputas y Reclamos:** Flujo para gestionar desacuerdos entre comprador y vendedor antes de la liberación final de fondos (escrow).
*   **Documentación de Venta:** Generación de comprobantes, resúmenes de pedido y notificaciones de estado.

*Fuera del alcance:* Gestión de inventarios complejos para grandes B2C (esto sería un módulo de almacén avanzado si se requiere).

---

## 3 Casos de uso
1.  **Confirmación de Orden:** El sistema crea el pedido tras la confirmación de pago del Módulo 6.
2.  **Preparación y Envío:** Vendedor actualiza el estado a "Enviado", ingresando el número de seguimiento del courier.
3.  **Tracking del Pedido:** Comprador visualiza el estado del envío en tiempo real.
4.  **Confirmación de Recepción:** Comprador marca el pedido como recibido; dispara la liberación de fondos (Módulo 6).
5.  **Apertura de Disputa:** Comprador reclama un producto no recibido o defectuoso, pausando la liberación de fondos.

---

## 4 Historias de usuario
*   **HU-7.01 (Seguimiento claro):** Como comprador, quiero ver dónde está mi producto y cuándo llegará.
*   **HU-7.02 (Confirmación de envío):** Como vendedor, quiero marcar fácilmente un pedido como enviado e ingresar el tracking.
*   **HU-7.03 (Protección en disputa):** Como comprador, quiero poder abrir un reclamo si lo que recibí no es lo que compré.

---

## 5 Reglas de negocio
*   **RN-7.01 (Tiempo de respuesta):** Vendedores tienen un máximo de 48 horas para actualizar el estado a "Enviado" antes de que el pedido sea cancelado automáticamente.
*   **RN-7.02 (SLA de Entrega):** Los pedidos deben ser confirmados como entregados por el comprador en un máximo de 72 horas tras ser marcados como tal por el courier, o se liberarán automáticamente.
*   **RN-7.03 (Disputas):** Una disputa congela automáticamente la liberación de fondos hasta resolución por parte de moderación.

---

## 6 Arquitectura

### Componentes
*   **Order Service (NestJS):** Lógica del ciclo de vida del pedido.
*   **Logistics Adapter:** Abstracción para interactuar con APIs de couriers (ej. Olva, Scharff).
*   **Dispute Service:** Lógica de manejo de conflictos.

### Flujo
1.  Pago confirmado (evento de Módulo 6) -> `OrderService` crea `Order` (Pending).
2.  Vendedor actualiza tracking -> `OrderService` invoca `LogisticsAdapter` -> Notifica al comprador.
3.  Comprador marca recibido -> `OrderService` dispara evento -> Liberación fondos (Módulo 6).

---

## 7 Modelo de datos
1.  **`orders`**: `id`, `listing_id`, `buyer_id`, `seller_id`, `status`, `total_amount`, `shipping_address_id`, `created_at`.
2.  **`order_items`**: `order_id`, `product_id`, `quantity`, `price`.
3.  **`shipments`**: `order_id`, `tracking_number`, `courier_id`, `status`.
4.  **`disputes`**: `id`, `order_id`, `reason`, `status`, `created_at`.

---

## 8 APIs
*   **REST/GraphQL:** `get_order`, `update_shipping_status`, `open_dispute`, `confirm_delivery`.
*   **Webhooks:** Recepción de updates de estado de envío por parte del courier.

---

## 9 Seguridad
*   Validación estricta de que solo vendedor/comprador accedan a la orden.
*   Auditoría de todos los cambios de estado.
*   Protección contra manipulación de APIs de tracking.

---

## 10 Escalabilidad
*   Procesamiento asíncrono de updates logísticos mediante colas.
*   Particionado de pedidos por fecha.

---

## 11 Riesgos
*   **Riesgo:** Pérdida o daño de mercancía. **Mitigación:** Seguros de envío, políticas claras de disputa.
*   **Riesgo:** Vendedor marca como enviado sin haberlo hecho. **Mitigación:** Verificación de tracking con el courier.

---

## 12 Buenas prácticas
*   Uso de estados bien definidos (FSM - Finite State Machine).
*   Event-driven: desacoplar la confirmación de entrega del procesamiento financiero.

---

## 13 Roadmap de implementación
1.  Definición de la FSM de pedidos y esquema de DB.
2.  Implementación del API de gestión de pedidos.
3.  Integración con un primer courier (mock o real).
4.  Implementación del flujo de disputas.

---

## 14 Dependencias
*   **Depende de:** Módulo 3 (Catálogo - para el producto), Módulo 6 (Pagos - para la liberación).

---

## 15 Criterios de aceptación
*   Flujo completo desde pago hasta liberación de fondos.
*   Integración con tracking exitosa.
*   Gestión de disputas funcional.

---

## 16 Estrategia de pruebas
*   Pruebas de flujo completo de pedido.
*   Simulación de fallos de courier.

---

## 17 Mejoras futuras
*   Logística propia de PUBLICA.PE, integración con puntos de entrega (Lockers), estimación de tiempo de entrega mediante IA.
