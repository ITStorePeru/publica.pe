# Módulo 4: Motor de Búsqueda Avanzada, Filtrado Facetado y Geolocalización (Search & Discovery)

## 1 Objetivo
El objetivo de este módulo es diseñar la arquitectura para el subsistema de búsqueda, descubrimiento, filtrado predictivo y geolocalización de PUBLICA.PE. Este componente debe proporcionar un motor de búsqueda de texto completo (Full-Text Search) de ultra-alto rendimiento, capaz de procesar millones de anuncios con tolerancias de consulta sub-segundo (latencia < 50ms), soportando indexación en tiempo real, concordancias fonéticas, tolerancia a errores tipográficos, y filtros avanzados dinámicos correlacionados a la taxonomía y ubicación física del comprador.

---

## 2 Alcance
El alcance del Módulo de Búsqueda e Indexación abarca los siguientes límites arquitectónicos:
*   **Motor de Indexación en Tiempo Real:** Pipeline asíncrono para indexar anuncios desde la base de datos relacional (PostgreSQL) hacia el motor de búsqueda (OpenSearch) en menos de 1 segundo tras su activación.
*   **Búsqueda Semántica y de Texto Completo:** Procesamiento de lenguaje natural (NLP) para soportar búsquedas difusas (fuzzy searching), corrección de ortografía, sinónimos regionales de Latinoamérica (ej: "celular" / "teléfono", "carro" / "auto" / "vehículo") y relevancia ponderada (Boosting).
*   **Filtrado Facetado Dinámico (Faceted Search):** Capacidad de calcular y devolver agregaciones numéricas y de categorías en tiempo real basándose en los resultados activos de una búsqueda para construir los filtros laterales de la UI de forma dinámica.
*   **Búsqueda Geográfica y Radial (Geospatial Querying):** Filtros basados en coordenadas de latitud/longitud para permitir búsquedas del tipo "a menos de 10 km de mi ubicación actual", integrando polígonos de límites distritales y departamentales estandarizados.
*   **Sugerencias Predictivas (Autocompletado):** API para autocompletado rápido (Search-As-You-Type) que adivine categorías, marcas y palabras clave con un retraso menor a 15ms.

*Fuera del alcance:* El desarrollo de la interfaz de usuario móvil en Flutter, la optimización visual de mapas dinámicos interactivos y la indexación de logs del sistema. Estos se consumirán a través de los contratos definidos en este diseño.

---

## 3 Casos de uso
1.  **Búsqueda Predictiva de Texto con Sugerencias de Categoría:** Un usuario escribe "toyot" en la barra de búsqueda principal. El sistema responde instantáneamente con sugerencias autocompletadas como "Toyota Corolla en Vehículos", "Toyota Hilux en Camionetas" y la categoría "Repuestos Toyota", ordenadas por el volumen de demanda histórica de búsquedas.
2.  **Filtrado Facetado por Atributos de Subcategoría:** Un usuario ingresa a la categoría "Departamentos en Alquiler". La barra de filtros izquierda carga agregaciones numéricas mostrando cuántos anuncios corresponden a rangos específicos de precio, número de dormitorios, área en m² y departamentos verificados que coinciden exactamente con la consulta de ubicación activa.
3.  **Búsqueda por Radio de Cercanía Geográfica:** Un usuario busca "Bicicleta de montaña" y activa la opción "Cerca de mí" en su smartphone con un radio de 5 kilómetros. El sistema calcula su ubicación mediante GPS, ejecuta una consulta radial geoespacial en OpenSearch y ordena los resultados priorizando aquellos anuncios cuyos vendedores se encuentran más cercanos para facilitar la entrega física C2C.
4.  **Búsqueda Multitermino Tolerante a Errores Ortográficos (Fuzzy):** Un comprador escribe "Ipon 14 usado barato". El motor de búsqueda aplica analizadores de texto personalizados para corregir la palabra "Ipon" a "iPhone", omitir "barato" y "usado" como modificadores de filtrado implícitos, y presentar listados de "iPhone 14" con la condición "Usado" ordenada por el precio más bajo primero.
5.  **Re-indexación Instantánea de Anuncios Modificados:** Un vendedor modifica el precio de su publicación de S/ 5,000 a S/ 4,500. El microservicio de publicaciones guarda el cambio en PostgreSQL y propaga el evento asíncronamente. El motor de búsqueda procesa el mensaje de actualización del índice y actualiza el valor en OpenSearch, asegurando que los compradores visualicen el precio modificado en los listados en menos de un segundo.

---

## 4 Historias de usuario
*   **HU-4.01 (Búsqueda Eficiente de Texto):** Como usuario comprador, quiero buscar productos utilizando lenguaje coloquial o sinónimos de mi región para encontrar lo que busco rápidamente sin preocuparme por la ortografía exacta.
*   **HU-4.02 (Búsqueda Geo-localizada):** Como usuario de la aplicación, quiero restringir mis búsquedas de productos a mi distrito o provincia actual para evitar ver listados de regiones lejanas que requieran costos de envío elevados.
*   **HU-4.03 (Filtros Adaptativos de Categoría):** Como comprador de tecnología, quiero que la barra de filtros cambie dinámicamente mostrándome opciones de Memoria RAM y Almacenamiento cuando busco celulares, pero de Kilometraje y Año cuando busco vehículos, para encontrar ofertas compatibles de manera intuitiva.
*   **HU-4.04 (Historial de Búsquedas Recientes):** Como usuario recurrente del marketplace, quiero ver mis búsquedas de texto anteriores y los últimos anuncios visualizados para retomar mis búsquedas rápidamente sin volver a escribir los términos.
*   **HU-4.05 (Alertas de Búsquedas Guardadas):** Como comprador interesado en ofertas específicas, quiero guardar una búsqueda parametrizada (ej. "Toyota Hilux 2021 menor a S/ 80,000") y recibir una notificación instantánea por correo o push en el momento exacto en que un vendedor publique un anuncio compatible.

---

## 5 Reglas de negocio
*   **RN-4.01 (Priorización de Anuncios Patrocinados - Boosting):** En los resultados de cualquier búsqueda, los anuncios que posean un nivel de realce de pago activo (Premium, Bumper) deben posicionarse en los primeros bloques de resultados (Top Slots), aplicando un factor de multiplicación de relevancia ponderado controlado dinámicamente.
*   **RN-4.02 (Ocultamiento Inmediato de Anuncios Inactivos):** Ningún anuncio que se encuentre en estado diferente a "Activo" (ej. Borrador, En Moderación, Pausado, Vendido, Expirado) puede aparecer en los resultados de búsqueda pública bajo ninguna circunstancia.
*   **RN-4.03 (Límite Máximo de Radio de Búsqueda):** Para búsquedas geoespaciales por cercanía, el radio mínimo permitido será de 1 kilómetro y el máximo de 100 kilómetros para evitar consultas geográficas masivas ineficientes que degraden el procesador de base de datos.
*   **RN-4.04 (Actualización de Inventario Geográfico Estandarizado):** La búsqueda por jerarquía geográfica debe ceñirse de forma estricta a la base de datos oficial de límites político-administrativos de la plataforma, impidiendo que campos de texto libre introducidos por el usuario alteren el orden de los filtros de ubicación.
*   **RN-4.05 (Penalización de Reputación en Ordenamiento):** Al aplicar el ordenamiento por defecto de la plataforma ("Relevancia"), los anuncios publicados por vendedores que posean una puntuación de reputación inferior a 3.0 estrellas deben ser penalizados con un factor multiplicador negativo, desplazándolos hacia las últimas páginas de resultados para proteger al comprador.

---

## 6 Arquitectura

### Componentes y Responsabilidades
El subsistema de búsqueda opera de forma desacoplada de la base de datos transaccional relacional mediante un modelo CQRS (Command Query Responsibility Segregation), donde las escrituras van a PostgreSQL y las lecturas masivas de catálogo se realizan sobre OpenSearch:

*   **`Search & Discovery Service` (NestJS):**
    *   Maneja las peticiones de búsqueda, autocompletado y cálculo de agregaciones (filtros) procedentes del API Gateway.
    *   Traduce los parámetros de filtrado HTTP/GraphQL sencillos a consultas estructuradas complejas de tipo Query DSL (Domain Specific Language) de OpenSearch.
*   **`OpenSearch Cluster` (Motor de Indexación y Consulta):**
    *   Almacena los documentos desnormalizados de los anuncios listos para lectura directa.
    *   Gestiona los analizadores de texto específicos para idioma español (Invert-Index), diccionarios de sinónimos y la indexación geoespacial nativa mediante estructuras BKD-Tree.
*   **`Index Sync Worker` (Consumidor de Mensajería):**
    *   Servicio ligero escrito en Node.js que escucha continuamente la cola `search.indexing.queue` de RabbitMQ.
    *   Recibe eventos de creación, modificación o desactivación de anuncios e interactúa mediante APIs masivas (Bulk API) con OpenSearch para mantener el índice unificado en tiempo real con latencia menor a 1 segundo.

### Flujo de Sincronización y Consulta Desacoplada
1.  **Transacción de Publicación:** El usuario edita un anuncio. El microservicio de publicaciones actualiza PostgreSQL y escribe un `ListingCreatedEvent` en la tabla de Outbox de forma atómica.
2.  **Propagación por Mensajería:** El Outbox Worker despacha el evento a RabbitMQ.
3.  **Procesamiento del Índice:** El `Index Sync Worker` toma el evento, consulta de forma rápida los datos adicionales requeridos (como reputación del usuario y detalles de taxonomía) y realiza un PUT indexador asíncrono en OpenSearch.
4.  **Consulta del Comprador:** El comprador realiza una búsqueda filtrada desde Next.js. La petición llega al `Search & Discovery Service` vía API Gateway.
5.  **Ejecución DSL en OpenSearch:** El servicio NestJS ejecuta una consulta DSL estructurada en OpenSearch solicitando tanto el listado paginado de coincidencias como los cubos de agregación (buckets) para los filtros laterales de la pantalla.
6.  **Retorno Consolidado:** OpenSearch responde en un promedio menor a 15ms. El servicio de búsqueda de PUBLICA.PE formatea la respuesta en JSON y la transmite al cliente, logrando que el listado de resultados y sus filtros se rendericen simultáneamente de forma impecable.

### Patrones Utilizados
*   **CQRS (Command Query Responsibility Segregation):** Segregación total de la carga de base de datos. La base de datos transaccional PostgreSQL maneja comandos (inserción, edición de perfiles y anuncios), mientras que el clúster de OpenSearch asume el 100% de las consultas de catálogo, búsquedas y filtros, garantizando que el sistema escale de manera independiente.
*   **Pipe and Filter Pattern:** Estructura aplicada en el pipeline de indexación para transformar, limpiar y enriquecer de forma lineal los datos del anuncio (ej. remover caracteres HTML, normalizar ubicaciones, calcular hash perceptual de imágenes) antes de persistir el documento final en OpenSearch.

---

## 7 Modelo de datos

### Estructura de Documento Indexado (OpenSearch Mapping)

El motor de búsqueda no utiliza tablas relacionales; en su lugar, almacena la información estructurada en formato de documentos JSON optimizados. A continuación se detalla el esquema de mapeo (Mapping) del índice `listings_index`:

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "category_hierarchy": {
        "type": "keyword"
      },
      "title": {
        "type": "text",
        "analyzer": "spanish_custom_analyzer",
        "fields": {
          "suggest": {
            "type": "completion",
            "analyzer": "spanish_suggest_analyzer"
          },
          "raw": { "type": "keyword" }
        }
      },
      "description": {
        "type": "text",
        "analyzer": "spanish_custom_analyzer"
      },
      "price": { "type": "double" },
      "currency": { "type": "keyword" },
      "condition": { "type": "keyword" },
      "status": { "type": "keyword" },
      "geo_coordinates": {
        "type": "geo_point"
      },
      "location": {
        "properties": {
          "department_id": { "type": "keyword" },
          "province_id": { "type": "keyword" },
          "district_id": { "type": "keyword" },
          "formatted_address": { "type": "text" }
        }
      },
      "merchant_reputation": { "type": "float" },
      "verified_merchant": { "type": "boolean" },
      "is_featured": { "type": "boolean" },
      "dynamic_attributes": {
        "type": "nested",
        "properties": {
          "name": { "type": "keyword" },
          "value_string": { "type": "keyword" },
          "value_numeric": { "type": "double" }
        }
      },
      "created_at": { "type": "date" }
    }
  }
}
```

### Relaciones y Cardinalidad del Índice
*   El documento de OpenSearch está completamente desnormalizado. Cada documento representa un anuncio con toda su información contextual (vendedor, taxonomía, geolocalización e imágenes principales), eliminando la necesidad de realizar operaciones de cruce de datos (Joins) durante las búsquedas, lo que permite lograr velocidades de consulta masivas en milisegundos.

### Índices, Sharding y Particionado
*   **Estrategia de Sharding en OpenSearch:** El clúster se despliega con **3 Shards Primarios** y **1 Shard de Réplica** por cada uno para asegurar alta disponibilidad. Esto distribuye el volumen total de documentos de forma equilibrada en el clúster de Kubernetes, permitiendo que las búsquedas se ejecuten en paralelo sobre múltiples nodos de forma simultánea.
*   **Particionado por Rango Temporal (Rollover Policy):** Los anuncios de un marketplace son altamente temporales. Se define una política de ciclo de vida del índice (ISM - Index State Management) que realiza un Rollover automático cada 90 días, creando un índice fresco para los anuncios recientes y archivando los índices antiguos de anuncios inactivos en almacenamiento en frío para optimizar el uso de memoria RAM del clúster.

### Estrategia de Almacenamiento
*   Los datos calientes y los índices de búsqueda inversa se mantienen de forma exclusiva en la memoria RAM de los nodos del clúster OpenSearch respaldados por discos SSD NVMe ultra-rápidos de baja latencia para lecturas inmediatas.
*   Los datos geográficos municipales de límites vectoriales se precargan en estructuras espaciales del clúster para calcular polígonos de límites de entrega rápida sin requerir consultas de servicios de mapas externos de pago.

---

## 8 APIs

### REST API
Utilizado para las integraciones de la barra de búsqueda en tiempo real, histórico de búsquedas y autocompletados rápidos.

*   `GET /api/v1/search/suggest?q={query}`: Retorna una lista estructurada de palabras clave, marcas y sugerencias de categorías recomendadas para autocompletar mientras el usuario escribe en la caja de búsqueda.
*   `GET /api/v1/search/listings`: Endpoint principal de búsqueda. Soporta query params extensos (`q`, `category_id`, `location_id`, `min_price`, `max_price`, `attributes.mileage`, `sort`, `page`, `limit`).
*   `POST /api/v1/search/saved-searches`: Permite a un comprador guardar la combinación de filtros y término de búsqueda activo para activar alertas de notificaciones periódicas.
*   `GET /api/v1/search/recent`: Retorna los términos de búsqueda guardados localmente o en el perfil del usuario autenticado.

### GraphQL API
Ideal para la carga agregada de listados de catálogo y sus facetas de categorías asociadas en Next.js.

*   `Query { searchCatalog(input: SearchCatalogInput!) { total items { id title price currency imageUrl location_formatted rating merchant { name verified } } aggregations { name label buckets { key doc_count } } } }`

### API de Eventos (Consumo Asíncrono de Mensajería vía RabbitMQ)
El microservicio de búsqueda actúa principalmente como consumidor de eventos de la plataforma para mantener el clúster de búsqueda sincronizado:

*   `listing.event.activated` (Suscrito): Al recibir este evento, el worker asocia la información, la estructura según el mapping de OpenSearch y ejecuta la indexación de forma inmediata para que sea visible públicamente en las búsquedas.
*   `listing.event.deactivated` (Suscrito): Remueve el documento del índice de OpenSearch de forma inmediata mediante su identificador único para retirar el anuncio del catálogo expuesto a los compradores.
*   `user.event.reputation_updated` (Suscrito): Actualiza de forma asíncrona la reputación del vendedor en todos sus anuncios indexados en OpenSearch para re-calcular los factores de boosting y ordenamiento de relevancia sin reconstruir la información completa del anuncio.

---

## 9 Seguridad

*   **Bloqueo de Consultas Directas al Clúster (Direct Access Prevention):** El clúster de OpenSearch se encuentra aislado de forma estricta dentro de la red privada virtual (VPC) del clúster de Kubernetes. Bajo ningún motivo se permite el acceso directo a los puertos del motor de búsqueda desde internet. Toda petición debe pasar de forma obligatoria por el microservicio NestJS `Search & Discovery Service`, el cual sanitiza y valida los parámetros de búsqueda del cliente.
*   **Preferencia de Cabeceras JWT y Autorización RBAC en Guardado de Búsquedas:** Los endpoints que permiten guardar búsquedas de interés o configurar alertas de correo electrónico exigen validación de Access Token JWT. El servicio de búsqueda valida mediante gRPC contra IAM la vigencia e identidad de la sesión del usuario antes de asociar la regla de notificación en base de datos.
*   **Rate Limiting Dinámico por Búsquedas Rápidas (Anti-Scraping):** El endpoint de búsqueda es el principal objetivo de los bots de extracción de datos (Scrapers). Se implementa un Rate Limiting estricto por IP y dispositivo controlado por Redis, limitando a un máximo de 60 consultas de búsqueda por minuto para cuentas estándar, desafiando con captchas interactivos de Cloudflare Turnstile a las IPs que excedan este umbral.
*   **Sanitización y Validación de Consultas DSL (SQLi & DSL Injection Prevention):** Se prohíbe de forma estricta la construcción manual de cadenas Query DSL utilizando concatenación directa de variables procedentes del cliente HTTP. El microservicio utiliza la librería cliente oficial de OpenSearch para estructurar las consultas mediante constructores tipados, bloqueando intentos de inyección de payloads maliciosos que busquen extraer datos privados de las configuraciones de los índices.

---

## 10 Escalabilidad

### Diseño para Alta Disponibilidad y Descubrimiento a Escala de Millones de Usuarios
*   **Escalabilidad Horizontal de Nodos de Consulta (OpenSearch Cluster Scaling):** El clúster de OpenSearch se compone de nodos con roles separados: Nodos Maestros (Master Nodes) de bajo consumo dedicados a la coordinación del estado del clúster, y Nodos de Datos (Data/Query Nodes) encargados de procesar las consultas de búsqueda y las indexaciones. Ante incrementos masivos de tráfico de búsqueda (como campañas navideñas o Cyber Days), Kubernetes incrementa de forma automática la cantidad de Nodos de Datos basándose en métricas de consumo de CPU e Input/Output de red, garantizando alta disponibilidad sin degradación de velocidad.
*   **Caché de Consultas a Nivel de Nodo (Node Query Cache & Request Cache):** OpenSearch implementa de forma nativa caché interna para los filtros de tipo estructurado (`filter` contexts) y agregaciones estables de categorías. El servicio de búsqueda de PUBLICA.PE diseña las consultas DSL priorizando contextos de filtros estructurados, logrando que búsquedas con los mismos filtros de departamentos o categorías se sirvan de forma directa en memoria con tiempos de respuesta menores a 2 milisegundos.
*   **Estrategia de Indexación Agrupada mediante Lotes (Bulk Indexing):** Para evitar sobrecargar la memoria de OpenSearch con inserciones individuales continuas en horas de alto tráfico, el worker de indexación implementa un búfer interno de acumulación de lotes. En lugar de procesar cada anuncio de forma individual, acumula las actualizaciones de índice en memoria y ejecuta inserciones agrupadas (Bulk Actions) cada 500 milisegundos o al acumular 100 documentos, reduciendo drásticamente la latencia y la contención de hilos de disco en el clúster de búsqueda.
*   **Réplicas Geográficas para Baja Latencia:** El clúster de OpenSearch se distribuye a lo largo de múltiples zonas de disponibilidad en la nube. Las consultas de búsqueda se desvían de forma equilibrada a los Shards de Réplica distribuidos físicamente en las diferentes zonas, asegurando que un fallo catastrófico en un centro de datos no afecte la disponibilidad del catálogo y que el tráfico de lectura se distribuya equitativamente para optimizar el rendimiento.

---

## 11 Riesgos

### Identificación de Amenazas en Búsqueda y Planes de Mitigación
1.  **Riesgo Técnico: Consumo excesivo de memoria RAM (OutOfMemory) en el clúster de búsqueda.**
    *   *Detalle:* Las agregaciones facetadas dinámicas sobre campos de texto de alta variabilidad consumen enormes cantidades de memoria de Heap en Java (OpenSearch), lo que puede colapsar los nodos de datos bajo tráfico masivo concurrente.
    *   *Mitigación:* Se restringe el uso de agregaciones únicamente a campos de tipo `keyword` estrictamente predefinidos y controlados (ej. marcas, departamentos, condiciones). Se bloquea por completo la agregación sobre campos de descripción o texto libre, y se implementa una política de Circuit Breaker integrada en OpenSearch que interrumpe consultas que excedan el 85% de la memoria de Heap asignada antes de que el nodo se detenga físicamente.
2.  **Riesgo Funcional: Resultados irrelevantes o vacíos ante búsquedas complejas.**
    *   *Detalle:* Si un comprador escribe términos muy específicos con errores tipográficos cruzados, el sistema puede devolver "Cero Resultados", provocando la salida inmediata del usuario de la plataforma debido a la sensación de catálogo vacío.
    *   *Mitigación:* Se configura un pipeline de búsqueda degradado: si una consulta con filtros estrictos y términos específicos devuelve cero resultados, el motor relaja automáticamente de forma secuencial las condiciones de coincidencia: primero reduce el nivel de tolerancia a errores (Fuzziness), luego ignora los filtros de atributos secundarios no mandatorios y finalmente ofrece recomendaciones de anuncios similares de la misma categoría principal para retener la interacción del comprador.
3.  **Riesgo de Negocio: Manipulación artificial del posicionamiento de anuncios (Black Hat SEO interno).**
    *   *Detalle:* Vendedores fraudulentos rellenan los títulos y descripciones de sus anuncios con decenas de palabras clave irrelevantes de alta demanda (Keyword Stuffing) para aparecer artificialmente en búsquedas ajenas y desviar tráfico legítimo.
    *   *Mitigación:* El motor de análisis de texto en el proceso de indexación implementa un filtro de densidad de palabras clave. Si detecta la repetición inusual de marcas o palabras no correlacionadas con la subcategoría asignada al anuncio, disminuye de forma drástica el factor de relevancia (Boosting) del documento y envía una alerta de spam al panel de moderación para revisión de comportamiento.

---

## 12 Buenas prácticas
*   **Normalización Estricta de Cadenas de Texto en Español:** Utilizar analizadores y filtros específicos de idioma español que implementen elminación de palabras vacías (Stopwords como "de", "con", "para"), conversión de caracteres a minúsculas, y procesos de Stemming avanzado para reducir las palabras a su raíz morfológica (ej. "computadoras", "computadora", "computación" se normalizan bajo la misma raíz, garantizando que el usuario encuentre coincidencias exactas independientemente del plural o género utilizado).
*   **Estrategia de Consulta por Paginación Segura (Search After Pattern):** Queda terminantemente prohibido utilizar paginación profunda basada en `from` y `size` tradicionales para navegar más allá de las 10,000 coincidencias, debido a que esto obliga a OpenSearch a ordenar y cargar millones de registros en memoria en cada página posterior. Para la navegación por el catálogo infinito o consumos masivos, se utiliza el patrón de punteros secuenciales `search_after` mediante claves de ordenamiento únicas, asegurando un consumo de recursos plano y de alta velocidad en cualquier profundidad del catálogo.
*   **Indexación Asíncrona Garantizada por Colas Durables:** Toda actualización de índice debe pasar de forma obligatoria por colas persistentes con confirmación de entrega (Acknowledge) activa en RabbitMQ, asegurando que ante una eventual caída temporal del clúster de búsqueda, ningún anuncio se pierda, reanudando la indexación de forma totalmente automatizada una vez reestablecido el servicio.

---

## 13 Roadmap de implementación

```
[MÓDULO DE BÚSQUEDA Y GEOLOCALIZACIÓN: SECUENCIA DE PRIORIDAD DE TAREAS]

Fase 1: Configuración del Clúster e Infraestructura de OpenSearch (Alta Prioridad)
  ├── Tarea 1.1: Diseñar y aprovisionar el clúster de OpenSearch con redundancia multi-zona en Kubernetes
  └── Tarea 1.2: Definir y configurar los mappings de los índices de anuncios y analizadores de texto en español

Fase 2: Pipeline de Sincronización e Indexación Asíncrona (Prioridad Media-Alta)
  ├── Tarea 2.1: Desarrollar el microservicio de sincronización (Index Sync Worker) y conexión a RabbitMQ
  └── Tarea 2.2: Implementar el pipeline de enriquecimiento y normalización de documentos JSON de anuncios

Fase 3: Desarrollo del Servicio de Búsqueda y Filtros Facetados (Prioridad Media)
  ├── Tarea 3.1: Desarrollar la lógica de traducción de parámetros HTTP a consultas DSL en el Search Service
  └── Tarea 3.2: Implementar las agregaciones facetadas dinámicas y filtros numéricos para la UI lateral

Fase 4: Consultas Geoespaciales y Autocompletado Rápido (Prioridad Media-Baja)
  ├── Tarea 4.1: Desarrollar la lógica de búsqueda radial geoespacial "Cerca de mí" basada en geo-points
  └── Tarea 4.2: Implementar la API de autocompletado rápido predictivo basado en completion suggesters

Fase 5: Afinación de Relevancia, Pruebas y Seguridad (Baja Prioridad / Iterativo)
  ├── Tarea 5.1: Configurar las reglas de boosting para anuncios patrocinados y penalización de reputación
  └── Tarea 5.2: Diseñar y ejecutar suite completa de pruebas unitarias, de integración, de carga y de caos
```

---

## 14 Dependencias
*   **Depende directamente de:**
    *   *Módulo 1: Servicio de Identidad, Autenticación y Perfiles de Usuario (IAM):* Utilizado para validar sesiones de usuarios al guardar búsquedas y verificar la reputación en tiempo real del vendedor al indexar los anuncios.
    *   *Módulo 3: Catálogo, Taxonomía de Categorías, Atributos Dinámicos y Publicación de Anuncios:* Indispensable, ya que el motor de búsqueda se alimenta y suscribe directamente a los eventos de este módulo para indexar la información estructural y técnica de las publicaciones.
*   **Dependientes de este módulo:** Todos los flujos y módulos que presenten catálogos de anuncios activos para los compradores dependerán de la consistencia y velocidad de este motor:
    *   *Módulo de Recomendaciones Inteligentes:* Utilizará los historiales de búsqueda guardados de este módulo para sugerir ofertas personalizadas al usuario.
    *   *Módulo de Tiendas Oficiales B2C:* Dependerá del filtrado facetado por marca para estructurar los micrositios exclusivos de las tiendas asociadas dentro de la plataforma.

---

## 15 Criterios de aceptación
*   **CA-4.01 (Latencia de Consulta de Catálogo):** La ejecución de búsquedas con filtros facetados complejos en OpenSearch debe retornar respuestas JSON estructuradas en menos de 50 milisegundos para el 95% de las consultas concurrentes bajo carga de tráfico nominal.
*   **CA-4.02 (Consistencia Temporal de Indexación):** Tras dispararse el evento de activación de un anuncio en RabbitMQ, el documento debe estar indexado y ser completamente recuperable en las búsquedas públicas en menos de 1000 milisegundos.
*   **CA-4.03 (Tolerancia a Errores Tipográficos):** El sistema debe identificar y corregir de forma automatizada palabras con una distancia de edición de hasta 2 caracteres (Fuzziness: 2) para términos de búsqueda de más de 6 letras, devolviendo resultados relevantes sin arrojar listas vacías.
*   **CA-4.04 (Precisión Geoespacial):** La búsqueda por radio de cercanía basada en coordenadas geoespaciales debe excluir de forma estricta todo anuncio ubicado fuera del polígono radial exacto configurado por el usuario con una precisión métrica del 100%.

---

## 16 Estrategia de pruebas
*   **Pruebas Unitarias (Analyzer & Stemming Unit Testing):** Cobertura completa sobre los analizadores personalizados de texto en español, validando de forma automatizada que diferentes variantes morfológicas y errores tipográficos comunes de palabras clave se reduzcan de forma exacta a las raíces de búsqueda correspondientes en memoria.
*   **Pruebas de Integración (Sync Pipeline Testing):** Escenarios integrados automatizados (mediante Testcontainers) que inyecten publicaciones simuladas en PostgreSQL, verifiquen el correcto flujo de mensajes a través de RabbitMQ, procesen las transformaciones en el Worker, y constaten la existencia e integridad del documento resultante en una instancia local activa de OpenSearch.
*   **Pruebas de Carga y Concurrencia (Load Testing con K6):** Pruebas intensivas de estrés sobre la API `/api/v1/search/listings` simulando 250,000 consultas de búsqueda aleatorias concurrentes por minuto, validando que el clúster de OpenSearch no presente fugas de memoria, que el consumo de Heap de Java se mantenga estable por debajo del 70% y que las latencias promedio no superen los 80ms.
*   **Chaos Testing de Clúster de Búsqueda:** Introducción de fallos provocados en el clúster Kubernetes de búsqueda (por ejemplo, desconectar de forma imprevista el Nodo de Datos maestro o saturar la red de sincronización), verificando que los Shards de Réplica asuman inmediatamente el 100% del tráfico de consultas de búsqueda de la home page sin generar interrupciones en la experiencia de navegación de los usuarios activos.

---

## 17 Mejoras futuras
*   **Búsqueda Vectorial Basada en Modelos de Embedding (Semantic Vector Search):** Incorporar capacidades de búsqueda semántica pura de nueva generación (K-Nearest Neighbors - KNN) utilizando modelos de embeddings de texto alojados en el clúster de OpenSearch. Esto permitirá a los compradores buscar por intenciones de uso complejas (ej. "ropa cómoda de invierno para hacer montañismo") y encontrar productos sumamente relevantes aunque el título del anuncio no contenga las palabras exactas escritas por el usuario.
*   **Indexación Predictiva de Demanda Geográfica:** Implementar análisis en tiempo real de los términos de búsqueda guardados e intereses geográficos locales de los compradores para generar mapas térmicos dinámicos (Demand Heatmaps) visibles para vendedores B2C, permitiendo a comercios y concesionarias anticipar qué productos de alta demanda específica deben abastecer en almacenes locales para optimizar sus tiempos de distribución y ventas.
*   **Personalización Dinámica de Resultados en el Borde mediante Edge AI:** Integrar modelos de recomendación ultraligeros que corran directamente en las redes de borde de Cloudflare, permitiendo re-ordenar los resultados de búsqueda devueltos por OpenSearch basándose en la latencia, el dispositivo de origen y el historial transitorio del usuario de forma inmediata y personalizada sin sobrecargar el microservicio de búsqueda principal.
