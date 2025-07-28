# 🌱 Dashboard de Ventas - Restaurante Menta

Dashboard interactivo para el análisis de ventas del Restaurante Menta, con visualizaciones dinámicas y KPIs en tiempo real.

![Dashboard Preview](https://via.placeholder.com/800x400/6BBF59/FFFFFF?text=Menta+Dashboard)

## 🚀 Características

### 📊 Visualizaciones Interactivas
- **Distribución por categorías** - Gráfico circular con ventas por tipo de producto
- **Evolución temporal** - Tendencias mensuales y acumuladas
- **Heatmap de ventas** - Análisis por día de la semana y mes
- **Comparativa de sucursales** - Rendimiento entre ubicaciones
- **Top productos** - Mejores y peores productos por ventas

### 🔍 Filtrado Dinámico
- **Categorías**: Selección múltiple de tipos de productos
- **Productos**: Filtrado automático basado en categorías seleccionadas
- **Tiempo**: Filtros por año, mes y día de la semana
- **Sucursales**: Análisis por ubicación (16J, FA)

### 📈 KPIs en Tiempo Real
- Total de ventas
- Cantidad total vendida
- Días con ventas
- Promedio de ventas diarias
- Ventas por sucursal

### 💾 Funcionalidades Adicionales
- **Carga de archivos Excel** (.xlsx) con validación automática
- **Descarga de reportes** individuales y completos
- **Diseño responsivo** para móvil y desktop
- **Tema veggie** con paleta de colores naturales

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Gráficos**: Recharts
- **Procesamiento**: XLSX para archivos Excel
- **Deployment**: GitHub Pages / Vercel

## 📋 Formato de Datos

El dashboard acepta archivos Excel (.xlsx) con las siguientes columnas:

| Columna | Descripción | Tipo |
|---------|-------------|------|
| COD PRD | Código del producto | Texto |
| DESCRIPCION | Nombre del producto | Texto |
| SUCURSAL | Sucursal (16J, FA) | Texto |
| FECHA | Fecha de la venta | Fecha |
| YEAR | Año | Número |
| MONTH | Mes | Texto |
| L a D | Día de la semana | Texto |
| Nº TRANS. | Número de transacción | Texto |
| CLIENTE | Cliente | Texto |
| CANTIDAD | Cantidad vendida | Número |
| PRECIO | Precio unitario | Número |
| VALOR | Valor total | Número |
| BS | Bolivianos | Número |

> **Nota**: Las categorías se asignan automáticamente basándose en el nombre del producto. No es necesario incluir una columna de categoría en el archivo.

## 🚀 Instalación y Uso

### Opción 1: Uso Online (Recomendado)
Visita: [https://restaurante-menta.github.io/dashboard-ventas](https://restaurante-menta.github.io/dashboard-ventas)

### Opción 2: Instalación Local

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/restaurante-menta/dashboard-ventas.git

# Navegar al directorio
cd dashboard-ventas

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Abrir http://localhost:3000
\`\`\`

### Opción 3: Build para Producción

\`\`\`bash
# Construir la aplicación
npm run build

# Iniciar servidor de producción
npm start
\`\`\`

## 📖 Guía de Uso

1. **Cargar Datos**
   - Arrastra tu archivo .xlsx al área de carga
   - O haz clic en "Seleccionar archivo"
   - El sistema validará automáticamente las columnas

2. **Aplicar Filtros**
   - Usa el sidebar izquierdo para filtrar datos
   - Los productos se actualizan dinámicamente según las categorías
   - Todos los gráficos se actualizan en tiempo real

3. **Analizar Resultados**
   - Revisa los KPIs en la parte superior
   - Explora las diferentes visualizaciones
   - Descarga reportes específicos con los botones de descarga

4. **Descargar Reportes**
   - Cada gráfico tiene su botón de descarga individual
   - Usa "Descargar Dashboard" para el reporte completo

## 🎨 Categorías de Productos

- 🍔 **Burgers**: Hamburguesas veganas y vegetarianas
- 🥗 **Ensaladas & Bowls**: Bowls nutritivos y ensaladas
- 🍽️ **Almuerzos Diarios**: Menús del día y platos principales
- ⭐ **Especiales**: Platos especiales y de temporada
- 🥤 **Bebidas Frías**: Jugos, aguas y bebidas refrescantes
- ☕ **Otras Bebidas**: Tés, cervezas y bebidas especiales
- 🍨 **Postres & Helados**: Dulces y helados artesanales
- 🎯 **Combos & Promociones**: Ofertas y paquetes especiales
- 📋 **Planes & Mensualidades**: Suscripciones y planes
- 🔧 **Otros**: Desechables y productos adicionales

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Reportar Bugs

Si encuentras un bug, por favor:
1. Ve a [Issues](https://github.com/restaurante-menta/dashboard-ventas/issues)
2. Crea un nuevo issue
3. Describe el problema detalladamente
4. Incluye pasos para reproducir el error

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Restaurante Menta**
- Website: [restaurante-menta.com](https://restaurante-menta.com)
- Email: info@restaurante-menta.com
- GitHub: [@restaurante-menta](https://github.com/restaurante-menta)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por el styling
- [shadcn/ui](https://ui.shadcn.com/) por los componentes
- [Recharts](https://recharts.org/) por las visualizaciones
- [Lucide](https://lucide.dev/) por los iconos

---

**Hecho con 💚 para Restaurante Menta**
