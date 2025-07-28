# Dashboard de Ventas - Restaurante Menta

## 🌿 Descripción

Dashboard interactivo para analizar las ventas del Restaurante Menta con estilo veggie natural. Permite cargar archivos Excel, aplicar filtros dinámicos y visualizar KPIs y reportes detallados.

## 🚀 Características Principales

### 📊 KPIs Incluidos
- **Total de ventas** en bolivianos
- **Cantidad total vendida** de productos
- **Días con ventas** registradas
- **Promedio de ventas diarias**
- **Cantidad promedio por transacción**
- **Ticket promedio por cliente**
- **Clientes únicos**
- **Ventas por sucursal**

### 📈 Visualizaciones
1. **Distribución de ventas por categoría** (Gráfico de dona)
2. **Top 10 productos por ventas** (Gráfico de barras)
3. **Evolución de ventas mensuales** (Gráfico de líneas)
4. **Ventas por día de la semana** (Gráfico radar)
5. **Relación cantidad vs valor por categoría** (Gráfico scatter)
6. **Heatmap de ventas por mes y día**
7. **Top 10 productos menos vendidos**
8. **Comparativa de ventas por sucursal**
9. **Tendencia acumulada de ventas**

### 🎯 Filtros Dinámicos
- **Categorías**: Selección múltiple de categorías de productos
- **Productos**: Filtrado automático según categorías seleccionadas
- **Año**: 2024, 2025
- **Mes**: Enero a Diciembre
- **Día de la semana**: Lunes a Domingo
- **Sucursal**: 16J, FA

### 🍔 Categorías de Productos
- 🍔 **Burgers**: Hamburguesas veganas y vegetarianas
- 🥗 **Ensaladas & Bowls**: Bowls nutritivos y ensaladas
- 🍽️ **Almuerzos Diarios**: Menús del día
- ⭐ **Especiales**: Platos especiales y temporales
- 🥤 **Bebidas Frías**: Jugos, aguas y bebidas refrescantes
- ☕ **Otras Bebidas**: Cervezas, vinos, infusiones
- 🍨 **Postres & Helados**: Dulces y helados artesanales
- 🎯 **Combos & Promociones**: Ofertas y combos especiales
- 📋 **Planes & Mensualidades**: Planes de alimentación
- 🔧 **Otros**: Desechables y extras

## 📋 Formato de Datos Requerido

El archivo Excel debe contener las siguientes columnas:

| Columna | Descripción |
|---------|-------------|
| COD PRD | Código del producto |
| DESCRIPCION | Nombre del producto |
| SUCURSAL | Sucursal (16J o FA) |
| CAT | Categoría del producto |
| FECHA | Fecha de la venta |
| YEAR | Año |
| MONTH | Mes (número) |
| L a D | Día de la semana |
| Nº TRANS. | Número de transacción |
| CLIENTE | Identificador del cliente |
| CANTIDAD | Cantidad vendida |
| PRECIO | Precio unitario |
| VALOR | Valor total |
| BS | Monto en bolivianos |

## 🎨 Paleta de Colores (Tema Veggie)
- **Verde principal**: #6BBF59
- **Verde claro**: #A4D792
- **Verde oscuro**: #5AAF4A
- **Blanco**: #FFFFFF
- **Gris claro**: #F3F3F3

## 🛠️ Uso del Dashboard

### 1. Cargar Datos
- **Opción 1**: Hacer clic en "Seleccionar Archivo" y cargar un archivo Excel (.xlsx)
- **Opción 2**: Hacer clic en "Usar Datos de Prueba" para cargar datos de demostración

### 2. Aplicar Filtros
- Seleccionar categorías, productos, fechas y sucursales
- Los filtros se aplican automáticamente
- Los productos se filtran dinámicamente según las categorías seleccionadas

### 3. Analizar Resultados
- Observar los KPIs actualizados en tiempo real
- Explorar los diferentes gráficos y visualizaciones
- Utilizar las herramientas interactivas de los gráficos

### 4. Descargar Reportes
- **CSV**: Datos filtrados en formato CSV
- **Excel**: Datos filtrados en formato Excel
- **PDF**: (Funcionalidad a implementar)

## 🔧 Funcionalidades Técnicas

### Validación de Datos
- Verificación automática de columnas requeridas
- Validación de formato de archivo
- Manejo de errores con mensajes informativos

### Interactividad
- Actualización automática de gráficos al cambiar filtros
- Filtrado dinámico de productos por categoría
- Tooltips informativos en todos los gráficos
- Animaciones suaves en las transiciones

### Responsividad
- Diseño adaptable para diferentes tamaños de pantalla
- Optimizado para dispositivos móviles y tablets
- Interfaz intuitiva y fácil de usar

## 📱 Compatibilidad
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Dispositivos móviles y tablets
- Resoluciones desde 320px en adelante

## 🚀 Instalación y Ejecución

1. Clona o descarga los archivos del proyecto
2. Abre `index.html` en un navegador web
3. No requiere instalación de dependencias adicionales

### Archivos del Proyecto
- `index.html`: Dashboard principal
- `sample_data.js`: Generador de datos de prueba
- `README.md`: Documentación

## 🎯 Ejemplos de Uso

### Análisis de Rendimiento por Categoría
1. No seleccionar filtros específicos para ver el panorama general
2. Observar el gráfico de distribución por categorías
3. Identificar las categorías más y menos rentables

### Análisis de Productos Estrella
1. Revisar el Top 10 de productos por ventas
2. Aplicar filtros de tiempo para ver tendencias
3. Comparar productos menos vendidos para identificar oportunidades

### Análisis Temporal
1. Usar el filtro de mes para comparar períodos
2. Observar la evolución mensual de ventas
3. Analizar patrones por día de la semana

### Análisis por Sucursal
1. Filtrar por sucursal específica
2. Comparar KPIs entre sucursales
3. Identificar diferencias en preferencias de productos

## 🔮 Próximas Funcionalidades
- Exportación de gráficos como imágenes
- Comparación de períodos
- Alertas automáticas de tendencias
- Integración con APIs externas
- Funcionalidad de PDF mejorada

## 🤝 Soporte
Para soporte técnico o sugerencias de mejora, contacta al equipo de desarrollo.

---

🌱 **Restaurante Menta** - Dashboard de Ventas v1.0