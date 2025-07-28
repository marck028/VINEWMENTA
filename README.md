# 🌿 Visualizador de Ventas - Restaurante Menta

Dashboard interactivo para el análisis de ventas del Restaurante Menta, con tema veggie natural en tonos verdes.

## ✨ Características Principales

### 📊 KPIs Principales
- **Total de ventas** - Suma total de ventas en bolivianos
- **Cantidad total vendida** - Número total de productos vendidos
- **Días con ventas** - Cantidad de días únicos con transacciones
- **Promedio diario** - Ventas promedio por día
- **Ticket promedio** - Valor promedio por transacción
- **Clientes únicos** - Número de clientes diferentes

### 🎯 Filtros Dinámicos
- **Sucursal**: 16J, FA
- **Año**: 2024, 2025
- **Mes**: Enero a Diciembre
- **Categoría**: 10 categorías de productos con emojis
- **Producto**: Filtrado dinámicamente según categoría seleccionada
- **Día de la semana**: Lunes a Domingo

### 📈 Visualizaciones Incluidas

1. **Distribución de ventas por categoría** (Gráfico de dona)
2. **Top 10 productos por ventas** (Gráfico de barras)
3. **Evolución de ventas mensuales** (Gráfico de líneas)
4. **Ventas por día de la semana** (Gráfico de barras)
5. **Comparativa por sucursal** (Gráfico de barras)
6. **Tendencia acumulada** (Gráfico de líneas)
7. **Heatmap de ventas por mes y día** (Mapa de calor interactivo)

### 🍔 Categorías de Productos

- **🍔 Burgers**: Burguer Corso, Cañahua Burger, Chickpea Burger, etc.
- **🥗 Ensaladas & Bowls**: Buddha Bowl, Falafel Bowl, Mediterránea Bowl, etc.
- **🍽️ Almuerzos Diarios**: Almuerzo Completo, Segundo, Sopa, Entrada
- **⭐ Especiales**: Silpancho Veggie, Pique Macho, Picana Navideña, etc.
- **🥤 Bebidas Frías**: Agua, Citrus, Full Green, Jugos de temporada
- **☕ Otras Bebidas**: Cerveza, Infusiones, Té, Vino
- **🍨 Postres & Helados**: Brownies, Helado Artesanal, Tiramisú
- **🎯 Combos & Promociones**: Combos 2x1, Promociones especiales
- **📋 Planes & Mensualidades**: Planes mensuales y semanales
- **🔧 Otros**: Desechables, porciones extra, cortesías

## 🚀 Cómo Usar

### 1. Cargar Datos
- Haga clic en "Cargar Datos Excel" en el header
- Seleccione un archivo Excel (.xlsx) con la estructura requerida
- El sistema validará automáticamente las columnas

### 2. Estructura de Datos Requerida
El archivo Excel debe contener las siguientes columnas:
```
COD PRD, DESCRIPCION, SUCURSAL, CAT, FECHA, YEAR, MONTH, 
L a D, Nº TRANS., CLIENTE, CANTIDAD, PRECIO, VALOR, BS
```

### 3. Aplicar Filtros
- Seleccione los valores deseados en cada filtro
- Los productos se filtran automáticamente según las categorías seleccionadas
- Haga clic en "Aplicar Filtros" para actualizar los gráficos
- Use "Resetear" para volver a mostrar todos los datos

### 4. Exportar Datos
- **Excel**: Exporta los datos filtrados en formato .xlsx
- **CSV**: Exporta los datos filtrados en formato .csv
- **PDF**: Funcionalidad en desarrollo

## 🎨 Diseño

### Paleta de Colores
- **Verde Principal**: #6BBF59
- **Verde Claro**: #A4D792
- **Blanco**: #FFFFFF
- **Gris Claro**: #F3F3F3

### Características Visuales
- Tema veggie natural
- Tipografía moderna y legible
- Iconos relacionados con salud/naturaleza/comida
- Animaciones suaves y transiciones
- Diseño responsivo para móviles y tablets

## 📱 Responsive Design

El dashboard es completamente responsivo y se adapta a:
- **Desktop**: Vista completa con gráficos en grid 2x2
- **Tablet**: Vista adaptada con gráficos apilados
- **Móvil**: Vista de una columna con filtros colapsados

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos con variables CSS y Flexbox/Grid
- **JavaScript ES6+**: Lógica de aplicación
- **Chart.js**: Generación de gráficos interactivos
- **XLSX.js**: Procesamiento de archivos Excel
- **Font Awesome**: Iconografía

## 📊 Datos de Demostración

El dashboard incluye datos de muestra para demostración que incluyen:
- 200 transacciones de ejemplo
- Productos de todas las categorías
- Ventas en ambas sucursales (16J, FA)
- Datos distribuidos en 2024 y 2025
- Clientes diversos y días de la semana variados

## 🚀 Instalación y Despliegue

### Opción 1: Uso Local
1. Clone o descargue los archivos
2. Abra `index.html` en un navegador web moderno
3. El dashboard funcionará inmediatamente con datos de muestra

### Opción 2: Servidor Web
1. Suba los archivos a un servidor web
2. Acceda a través de la URL del servidor
3. Funciona en cualquier servidor que sirva archivos estáticos

### Opción 3: GitHub Pages
1. Suba los archivos a un repositorio de GitHub
2. Active GitHub Pages en la configuración del repositorio
3. Acceda a través de la URL generada

## 🔄 Actualizaciones Futuras

- [ ] Exportación a PDF con gráficos
- [ ] Filtros de fecha con selector de rango
- [ ] Gráficos adicionales (scatter plot, bubble chart)
- [ ] Comparativas año a año
- [ ] Análisis de tendencias predictivas
- [ ] Integración con APIs de datos en tiempo real
- [ ] Dashboard de administración para configuración

## 📞 Soporte

Para soporte técnico o consultas sobre personalización, contacte al equipo de desarrollo.

---

**Desarrollado con 💚 para Restaurante Menta**