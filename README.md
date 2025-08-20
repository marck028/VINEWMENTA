# 🌿 Restaurante Menta - Dashboard de Ventas

Dashboard interactivo desarrollado en Streamlit para el análisis y visualización de ventas del Restaurante Menta. Incluye KPIs, filtros dinámicos y múltiples visualizaciones con un diseño moderno y natural.

## 🚀 Características Principales

### 📊 Visualizaciones Incluidas
- **Distribución de ventas por categoría** - Gráfico de barras horizontal
- **Top 10 productos por ventas** - Ranking de productos más vendidos
- **Evolución de ventas mensuales** - Línea de tendencia temporal
- **Ventas por día de la semana** - Análisis de patrones semanales
- **Heatmap de ventas** - Visualización por mes y día (en miles con 1 decimal)
- **Top 10 productos menos vendidos** - Identificación de productos con menor rotación
- **Comparativa por sucursal** - Gráfico circular de distribución
- **Relación cantidad vs valor** - Análisis de correlación por categoría
- **Tendencia acumulada** - Evolución del crecimiento de ventas
- **Productos por categoría** - Gráfico circular dinámico según filtros

### 🎯 KPIs Implementados
- Total de ventas (Bs.)
- Cantidad total vendida
- Días con ventas
- Promedio de ventas diarias
- Ventas por sucursal

### 🔍 Filtros Interactivos
- **Categorías** - Selección múltiple con opciones dinámicas
- **Productos** - Filtrado automático según categorías seleccionadas
- **Años** - 2024, 2025 y años disponibles en los datos
- **Meses** - Todos los meses del año
- **Días de la semana** - Lunes a domingo
- **Sucursales** - 16J, FA, SCZ y otras disponibles

### ✨ Funcionalidades Especiales
- **Botones de acción rápida**: "Seleccionar todo" y "Limpiar selección" para cada filtro
- **Validación de columnas**: Verificación automática de estructura del archivo Excel
- **Descarga de datos**: Export de datos filtrados en formato CSV
- **Botón de recarga**: Reinicio completo de la aplicación
- **Actualización automática**: Los gráficos se actualizan dinámicamente con los filtros

## 🎨 Diseño y Tema

### Paleta de Colores
- **Verde principal**: #6BBF59
- **Verde claro**: #A4D792  
- **Blanco**: #FFFFFF
- **Gris claro**: #F3F3F3

### Estilo
- **Tema**: Veggie natural
- **Tipografía**: Moderna y legible
- **Iconos**: Relacionados con salud, naturaleza y comida
- **Gradientes**: Efectos visuales suaves y naturales

## 📋 Estructura de Datos Requerida

El archivo Excel debe contener las siguientes columnas:

| Columna | Descripción | Tipo |
|---------|-------------|------|
| COD PRD | Código del producto | Texto |
| DESCRIPCION | Descripción del producto | Texto |
| SUCURSAL | Código de sucursal (16J, FA, SCZ) | Texto |
| FECHA | Fecha de la transacción | Fecha |
| CATEGORIA | Categoría del producto | Texto |
| YEAR | Año de la transacción | Número |
| MONTH | Mes de la transacción (1-12) | Número |
| L a D | Día de la semana (1-7) | Número |
| Nº TRANS. | Número de transacción | Texto/Número |
| CLIENTE | Identificación del cliente | Texto |
| CANTIDAD | Cantidad vendida | Número |
| PRECIO | Precio unitario | Número |
| VALOR | Valor total de la venta | Número |
| BS | Valor en bolivianos | Número |

### Mapeo de Valores

**Meses (MONTH → Nombre)**:
- 1: Enero, 2: Febrero, 3: Marzo, 4: Abril, 5: Mayo, 6: Junio
- 7: Julio, 8: Agosto, 9: Septiembre, 10: Octubre, 11: Noviembre, 12: Diciembre

**Días de la Semana (L a D → Nombre)**:
- 1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes, 6: Sábado, 7: Domingo

## 🛠️ Instalación y Ejecución

### Requisitos Previos
- Python 3.8 o superior
- pip (gestor de paquetes de Python)

### Pasos de Instalación

1. **Clonar el repositorio**:
```bash
git clone <url-del-repositorio>
cd restaurante-menta-dashboard
```

2. **Instalar dependencias**:
```bash
pip install -r requirements.txt
```

3. **Ejecutar la aplicación**:
```bash
streamlit run app.py
```

4. **Abrir en el navegador**:
La aplicación se abrirá automáticamente en `http://localhost:8501`

### Dependencias Principales
- `streamlit==1.29.0` - Framework de aplicación web
- `pandas==2.1.4` - Manipulación y análisis de datos
- `openpyxl==3.1.2` - Lectura de archivos Excel
- `plotly==5.17.0` - Visualizaciones interactivas
- `altair==5.2.0` - Gráficos estadísticos
- `numpy==1.24.3` - Operaciones numéricas

## 📱 Uso de la Aplicación

### 1. Carga de Datos
1. Utiliza el botón "Selecciona el archivo Excel de ventas" en la barra lateral
2. El sistema validará automáticamente las columnas requeridas
3. Si faltan columnas, se mostrará un mensaje específico con las columnas faltantes

### 2. Aplicación de Filtros
1. **Categorías**: Selecciona una o múltiples categorías de productos
2. **Productos**: Se filtran automáticamente según las categorías seleccionadas
3. **Fechas**: Filtra por años, meses y días de la semana
4. **Sucursales**: Selecciona las sucursales de interés
5. Usa los botones "Seleccionar todo" o "Limpiar selección" para gestión rápida

### 3. Interpretación de Resultados
- **KPIs**: Métricas principales en la parte superior con formato de moneda boliviana
- **Gráficos**: Visualizaciones interactivas que se actualizan automáticamente
- **Heatmap**: Valores en miles de bolivianos con 1 decimal para mejor legibilidad
- **Descarga**: Exporta los datos filtrados para análisis adicional

### 4. Funciones Especiales
- **Recarga**: Usa el botón "🔄 Recargar Aplicación" para reiniciar completamente
- **Gráfico circular dinámico**: Aparece automáticamente cuando seleccionas categorías
- **Filtros dependientes**: Los productos se filtran según las categorías seleccionadas

## 🔧 Personalización

### Modificar Colores
Edita las variables CSS en la sección de estilos del archivo `app.py`:
```python
# Colores principales
primary_green = "#6BBF59"
light_green = "#A4D792"
white = "#FFFFFF"
light_gray = "#F3F3F3"
```

### Agregar Nuevas Visualizaciones
1. Crea una nueva función en la sección de visualizaciones
2. Añádela a la función `create_visualizations()`
3. Mantén la consistencia con el tema de colores

### Modificar KPIs
Edita la función `calculate_kpis()` para agregar nuevas métricas:
```python
def calculate_kpis(df):
    # Agregar nuevos KPIs aquí
    kpis['nuevo_kpi'] = df['COLUMNA'].operacion()
    return kpis
```

## 🚀 Despliegue

### Streamlit Cloud
1. Sube el código a GitHub
2. Conecta tu repositorio a [Streamlit Cloud](https://streamlit.io/cloud)
3. La aplicación se desplegará automáticamente

### Configuración para Producción
- Asegúrate de que `requirements.txt` esté actualizado
- Configura variables de entorno si es necesario
- Considera implementar autenticación para datos sensibles

## 🐛 Solución de Problemas

### Error de Columnas Faltantes
**Problema**: "Faltan las siguientes columnas en el archivo Excel"
**Solución**: Verifica que tu archivo Excel contenga todas las columnas listadas en la sección "Estructura de Datos Requerida"

### Error de Formato de Fecha
**Problema**: Fechas no se procesan correctamente
**Solución**: Asegúrate de que la columna FECHA tenga formato de fecha válido en Excel

### Visualizaciones No Aparecen
**Problema**: Los gráficos no se muestran después de aplicar filtros
**Solución**: Verifica que los filtros no estén excluyendo todos los datos. Usa "Limpiar selección" y vuelve a filtrar gradualmente

### Rendimiento Lento
**Problema**: La aplicación responde lentamente con archivos grandes
**Solución**: 
- Filtra los datos por período antes de cargar
- Considera dividir archivos muy grandes por mes o trimestre

## 🤝 Contribución

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crea un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre el dashboard:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo

---

**Desarrollado con ❤️ para Restaurante Menta** 🌿