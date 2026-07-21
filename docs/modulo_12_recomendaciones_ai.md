# Módulo 12: Recomendaciones Inteligentes y Motor de IA

## 1 Objetivo
Desarrollar un ecosistema de inteligencia artificial que personalice la experiencia de usuario en PUBLICA.PE, aumentando la relevancia del contenido, mejorando la conversión y fomentando el descubrimiento de productos. El objetivo es transitar de un marketplace pasivo a uno proactivo mediante el uso de modelos de aprendizaje automático para recomendaciones, búsqueda semántica avanzada, optimización de precios y detección de comportamientos anómalos.

---

## 2 Alcance
*   **Motor de Recomendaciones (Personalización):** Sistema de recomendación de productos ("Productos similares", "Comprados juntos", "Para ti").
*   **Búsqueda Semántica (AI Search):** Mejora de la búsqueda actual mediante embeddings y modelos vectoriales (KNN).
*   **Optimización de Precios (Dynamic Pricing):** Sugerencias para vendedores basadas en competidores y demanda.
*   **Detección de Fraude Avanzada:** Análisis de comportamiento en tiempo real para bloquear estafadores.

*Fuera del alcance:* Generación de contenido generativo complejo (descripciones automáticas) — reservado para roadmap posterior.

---

## 3 Casos de uso
1.  **Recomendación personalizada:** Usuario ve "Recomendado para ti" en la Home, basado en su historial de navegación.
2.  **Búsqueda semántica:** Comprador busca "ropa para frío extremo", sistema devuelve productos relevantes sin necesidad de coincidencias exactas de palabras clave.
3.  **Optimización de precio:** Vendedor recibe sugerencia "Sugerimos bajar el precio un 5% para aumentar la probabilidad de venta".

---

## 4 Historias de usuario
*   **HU-12.01 (Descubrimiento):** Como usuario, quiero ver productos que realmente me interesan sin buscarlos, para ahorrar tiempo.
*   **HU-12.02 (Búsqueda semántica):** Como comprador, quiero encontrar productos usando lenguaje natural para no pelear con palabras clave.

---

## 5 Reglas de negocio
*   **RN-12.01 (Privacidad):** Los modelos de personalización no deben exponer datos privados de navegación entre usuarios diferentes.
*   **RN-12.02 (Sesgo):** Los modelos deben ser monitoreados constantemente para evitar sesgos discriminatorios en recomendaciones o precios.

---

## 6 Arquitectura

### Componentes
*   **AI Engine (Python/FastAPI):** Servicio dedicado para inferencia y entrenamiento.
*   **Vector Database (OpenSearch KNN o Pinecone/Milvus):** Almacenamiento de embeddings.
*   **Data Pipeline:** Proceso para transformar eventos de usuario en features de entrenamiento.

### Flujo
1.  Eventos de usuario se guardan en Data Lake.
2.  `Training Pipeline` re-entrena modelos periódicamente.
3.  `Inference Service` entrega recomendaciones vía API.

---

## 7 Modelo de datos
1.  **`user_embeddings`**: `user_id`, `vector` (float array).
2.  **`item_embeddings`**: `item_id`, `vector` (float array).

---

## 8 APIs
*   `GET /api/v1/recommendations/for-user/{userId}`
*   `GET /api/v1/search/semantic?q={query}`

---

## 9 Seguridad
*   Modelos aislados en infraestructura dedicada.
*   Anonimización de datos de usuario antes del entrenamiento.

---

## 10 Escalabilidad
*   Inferencia en tiempo real mediante caché de embeddings en Redis.
*   Entrenamiento distribuido (Spark/Kubeflow).

---

## 11 Riesgos
*   **Riesgo:** "Caja negra" - dificultad para explicar por qué se recomendó algo. **Mitigación:** Herramientas de explicabilidad (XAI).

---

## 12 Buenas prácticas
*   Medir métricas de negocio (CTR, conversión) no solo métricas técnicas de ML (precisión/recall).

---

## 13 Roadmap de implementación
1.  Setup de infraestructura de datos (Data Lake/Event tracking).
2.  Implementación del modelo básico de recomendación (Colaborativo).
3.  Búsqueda vectorial.
4.  Optimización de precios y fraude.

---

## 14 Dependencias
*   **Depende de:** Módulo 3 (Catálogo), Módulo 4 (Búsqueda).

---

## 15 Criterios de aceptación
*   Mejora del CTR en recomendaciones > 10% vs control.
*   Búsqueda semántica supera en relevancia a búsqueda tradicional en queries de lenguaje natural.

---

## 16 Estrategia de pruebas
*   A/B testing (Control vs Modelo IA).

---

## 17 Mejoras futuras
*   Recomendaciones multimodales (imágenes + texto), generación de texto de anuncios mediante LLMs.
