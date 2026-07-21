# Módulo 6: Pasarela de Pagos, Transacciones Seguras y Billetera Digital

## 1 Objetivo
Diseñar e implementar un motor financiero robusto, seguro y escalable para PUBLICA.PE, encargado de gestionar el procesamiento de pagos (pagos seguros, escrow), cobro de comisiones por servicio, transferencias a vendedores (payouts) y el sistema de billetera digital (Wallet) del usuario. Este módulo es crítico para la confianza del marketplace y debe garantizar integridad absoluta en cada transacción (cumplimiento ACID, auditoría inmutable), manejo de múltiples monedas y métodos de pago, además de una conciliación automática impecable con proveedores financieros externos.

---

## 2 Alcance
*   **Gestión de Métodos de Pago:** Integración con pasarelas de pago (Stripe, Mercado Pago, pasarelas locales) para procesar tarjetas, transferencias bancarias, efectivo, y billeteras digitales.
*   **Sistema de Escrow (Pago Seguro):** Retención de fondos del comprador hasta la confirmación de la recepción/satisfacción del producto/servicio.
*   **Billetera Digital (Internal Ledger):** Registro de saldos internos de usuario, movimientos y conciliación.
*   **Motor de Comisiones:** Cálculo y cobro automatizado de comisiones por venta exitosa basada en reglas por categoría.
*   **Gestión de Payouts:** Transferencias programadas o bajo demanda a las cuentas bancarias de los vendedores (desembolsos).
*   **Conciliación Financiera:** Proceso automático para cuadrar movimientos bancarios contra registros del sistema.

*Fuera del alcance:* Implementación de contabilidad fiscal corporativa profunda (esto será parte de otro módulo financiero avanzado).

---

## 3 Casos de uso
1.  **Compra Protegida:** Comprador realiza el pago, fondos se retienen en estado "Escrow" (pendiente de liberación).
2.  **Confirmación de Entrega y Liberación:** Comprador confirma recepción, fondos se liberan al vendedor descontando comisión.
3.  **Recarga de Billetera:** Usuario añade saldo a su cuenta interna mediante transferencia/tarjeta.
4.  **Solicitud de Retiro (Payout):** Vendedor solicita transferir fondos de su billetera a su cuenta bancaria.
5.  **Devolución/Reembolso:** Procesamiento de reverso de transacciones por disputas.

---

## 4 Historias de usuario
*   **HU-6.01 (Compra Segura):** Como comprador, quiero pagar con mi tarjeta sabiendo que mi dinero está protegido hasta recibir el producto.
*   **HU-6.02 (Vendedor con Confianza):** Como vendedor, quiero ver mis fondos disponibles en mi billetera y poder retirarlos a mi banco sin fricciones.
*   **HU-6.03 (Transparencia):** Como vendedor, quiero ver el desglose exacto de la comisión cobrada por PUBLICA.PE por cada venta realizada.

---

## 5 Reglas de negocio
*   **RN-6.01 (Escrow Mandatorio):** Todas las transacciones de alto riesgo C2C pasan obligatoriamente por el sistema de Escrow.
*   **RN-6.02 (Comisiones Dinámicas):** Las comisiones varían según la categoría (ej: Vehículos < Electrónica).
*   **RN-6.03 (Liquidación de Fondos):** Los fondos del vendedor se liberan tras 48 horas de la confirmación de entrega (período de gracia).

---

## 6 Arquitectura

### Componentes
*   **Payment Service (NestJS):** Lógica de orquestación de pagos y transacciones.
*   **Ledger Service (Database - PostgreSQL):** Registro inmutable de transacciones financieras (Double-Entry Bookkeeping).
*   **Payment Gateway Adapter:** Abstracción para interactuar con Stripe, Mercado Pago, etc.
*   **Payout Worker:** Proceso asíncrono que gestiona las transferencias hacia vendedores.

### Flujo
1.  Compra iniciada: `PaymentService` crea `Transaction` en estado PENDING, bloquea fondos.
2.  Pasarela confirma: `PaymentService` actualiza `Transaction` a ESCROW.
3.  Confirmación recepción: Evento disparado -> `PaymentService` libera fondos a `Wallet` del vendedor.
4.  Retiro: `Wallet` verifica saldo -> `PayoutWorker` interactúa con pasarela de payouts.

---

## 7 Modelo de datos

1.  **`wallets`**: `id`, `user_id`, `balance`, `currency`.
2.  **`transactions`**: `id`, `source_wallet_id`, `target_wallet_id`, `amount`, `currency`, `type` (payment, refund, commission, payout), `status`, `reference_id` (pasarela), `created_at`.
3.  **`ledgers`**: Tabla contable de doble entrada para auditoría inmutable (`entry_id`, `account_id`, `amount`, `type`, `transaction_id`).

---

## 8 APIs
*   **REST/GraphQL:** `initiate_payment`, `get_wallet_balance`, `request_payout`, `list_transactions`.
*   **Webhooks:** Endpoints dedicados para recibir notificaciones asíncronas de pasarelas de pago (Stripe/Mercado Pago).

---

## 9 Seguridad
*   **Cumplimiento PCI-DSS:** Jamás almacenar datos sensibles de tarjetas (PAN) en la base de datos de PUBLICA.PE (utilizar tokenización de pasarela).
*   **Idempotencia:** Implementación estricta de claves de idempotencia en todos los endpoints de pago para evitar cobros duplicados ante reintentos de red.
*   **Auditoría de Doble Entrada:** Uso obligatorio del modelo contable de doble entrada en el Ledger para garantizar que los saldos siempre cuadren.
*   **Firma de Webhooks:** Verificación obligatoria de las firmas digitales de las pasarelas para asegurar que las notificaciones son auténticas.

---

## 10 Escalabilidad
*   **Base de datos:** Particionado por tiempo de la tabla de transacciones.
*   **Consistencia:** Patrón SAGA para coordinar transacciones distribuidas entre el servicio de pagos y el servicio de pedidos/anuncios.
*   **Resiliencia:** Uso de colas (RabbitMQ) para procesar pagos y payouts fuera del flujo crítico de la petición HTTP.

---

## 11 Riesgos
*   **Riesgo:** Inconsistencias contables por fallos en red durante transacciones distribuidas. **Mitigación:** Implementación del patrón SAGA con compensaciones, uso intensivo de transacciones locales y auditoría de doble entrada.
*   **Riesgo:** Fraude en pagos (chargebacks). **Mitigación:** Implementación de motores de riesgo de terceros (ej: Stripe Radar) y bloqueo automático de vendedores/compradores con alta tasa de disputas.

---

## 12 Buenas prácticas
*   Jamás permitir que el frontend calcule precios o comisiones (siempre el backend es la fuente de la verdad).
*   Uso de tipos `Decimal` o enteros para manejo de dinero (nunca `float`/`double`).
*   Logging exhaustivo de cada cambio de estado de una transacción.

---

## 13 Roadmap de implementación
1.  Diseño del modelo de datos de contabilidad (Ledger) y Wallet.
2.  Integración básica con una pasarela de pago (Stripe/Mercado Pago).
3.  Implementación del flujo de Escrow y confirmación de recepción.
4.  Desarrollo del motor de comisiones y payouts.
5.  Conciliación automática y auditoría.

---

## 14 Dependencias
*   **Depende de:** Módulo 1 (IAM - para autenticación), Módulo 3 (Catálogo - para el precio del anuncio).

---

## 15 Criterios de aceptación
*   Integridad total de saldos (Balance sum = 0 en el Ledger).
*   Procesamiento correcto de webhooks incluso bajo alta carga.
*   Trazabilidad completa de cada centavo en el sistema.

---

## 16 Estrategia de pruebas
*   Pruebas de estrés en la conciliación.
*   Simulación de fallos de red en pasarelas durante el proceso de pago.
*   Pruebas de caja negra con tarjetas de prueba de pasarelas.

---

## 17 Mejoras futuras
*   Soporte para pagos mediante criptomonedas, factoring de facturas para vendedores B2C, sistemas de crédito interno para compradores.
