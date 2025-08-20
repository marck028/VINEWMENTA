import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import altair as alt
import numpy as np
from datetime import datetime
import io

# Configuración de la página
st.set_page_config(
    page_title="Restaurante Menta - Dashboard de Ventas",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="expanded"
)

# CSS personalizado con tema veggie natural
st.markdown("""
<style>
    .main {
        background-color: #FFFFFF;
    }
    
    .stApp {
        background: linear-gradient(135deg, #F3F3F3 0%, #FFFFFF 100%);
    }
    
    .metric-card {
        background: linear-gradient(135deg, #6BBF59 0%, #A4D792 100%);
        padding: 20px;
        border-radius: 15px;
        color: white;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 10px 0;
    }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 10px 0;
    }
    
    .metric-label {
        font-size: 1.1rem;
        opacity: 0.9;
    }
    
    .stSelectbox > div > div > div {
        background-color: #F3F3F3;
    }
    
    .stMultiSelect > div > div > div {
        background-color: #F3F3F3;
    }
    
    .filter-section {
        background-color: #F3F3F3;
        padding: 20px;
        border-radius: 10px;
        margin: 10px 0;
    }
    
    .title-header {
        background: linear-gradient(135deg, #6BBF59 0%, #A4D792 100%);
        padding: 30px;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 30px;
        color: white;
    }
    
    .section-header {
        background: linear-gradient(135deg, #A4D792 0%, #6BBF59 100%);
        padding: 15px;
        border-radius: 10px;
        color: white;
        margin: 20px 0 10px 0;
    }
    
    .stButton > button {
        background: linear-gradient(135deg, #6BBF59 0%, #A4D792 100%);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 10px 20px;
        font-weight: bold;
    }
    
    .stButton > button:hover {
        background: linear-gradient(135deg, #5AA04A 0%, #93C683 100%);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
</style>
""", unsafe_allow_html=True)

# Mapas de conversión
MONTH_MAP = {
    1: "Enero", 2: "Febrero", 3: "Marzo", 4: "Abril", 5: "Mayo", 6: "Junio",
    7: "Julio", 8: "Agosto", 9: "Septiembre", 10: "Octubre", 11: "Noviembre", 12: "Diciembre"
}

WEEKDAY_MAP = {
    1: "Lunes", 2: "Martes", 3: "Miércoles", 4: "Jueves", 
    5: "Viernes", 6: "Sábado", 7: "Domingo"
}

REQUIRED_COLUMNS = [
    "COD PRD", "DESCRIPCION", "SUCURSAL", "FECHA", "CATEGORIA", 
    "YEAR", "MONTH", "L a D", "Nº TRANS.", "CLIENTE", 
    "CANTIDAD", "PRECIO", "VALOR", "BS"
]

def load_and_validate_data(uploaded_file):
    """Cargar y validar archivo Excel"""
    try:
        df = pd.read_excel(uploaded_file)
        
        # Verificar columnas requeridas
        missing_columns = [col for col in REQUIRED_COLUMNS if col not in df.columns]
        
        if missing_columns:
            st.error(f"⚠️ Faltan las siguientes columnas en el archivo Excel: {', '.join(missing_columns)}")
            st.info("Por favor, asegúrate de que tu archivo contenga todas las columnas requeridas.")
            return None
            
        # Convertir tipos de datos
        df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        df['VALOR'] = pd.to_numeric(df['VALOR'], errors='coerce')
        df['CANTIDAD'] = pd.to_numeric(df['CANTIDAD'], errors='coerce')
        df['PRECIO'] = pd.to_numeric(df['PRECIO'], errors='coerce')
        df['BS'] = pd.to_numeric(df['BS'], errors='coerce')
        
        # Mapear nombres de meses y días
        df['MONTH_NAME'] = df['MONTH'].map(MONTH_MAP)
        df['WEEKDAY_NAME'] = df['L a D'].map(WEEKDAY_MAP)
        
        return df
        
    except Exception as e:
        st.error(f"Error al cargar el archivo: {str(e)}")
        return None

def create_filter_buttons(key_prefix):
    """Crear botones de Seleccionar todo y Limpiar selección"""
    col1, col2 = st.columns(2)
    
    select_all = col1.button("🔄 Seleccionar todo", key=f"select_all_{key_prefix}")
    clear_all = col2.button("🗑️ Limpiar selección", key=f"clear_all_{key_prefix}")
    
    return select_all, clear_all

def apply_filters(df, filters):
    """Aplicar todos los filtros al dataframe"""
    filtered_df = df.copy()
    
    if filters['categorias']:
        filtered_df = filtered_df[filtered_df['CATEGORIA'].isin(filters['categorias'])]
    
    if filters['productos']:
        filtered_df = filtered_df[filtered_df['DESCRIPCION'].isin(filters['productos'])]
    
    if filters['años']:
        filtered_df = filtered_df[filtered_df['YEAR'].isin(filters['años'])]
    
    if filters['meses']:
        filtered_df = filtered_df[filtered_df['MONTH_NAME'].isin(filters['meses'])]
    
    if filters['dias_semana']:
        filtered_df = filtered_df[filtered_df['WEEKDAY_NAME'].isin(filters['dias_semana'])]
    
    if filters['sucursales']:
        filtered_df = filtered_df[filtered_df['SUCURSAL'].isin(filters['sucursales'])]
    
    return filtered_df

def calculate_kpis(df):
    """Calcular KPIs principales"""
    if df.empty:
        return {
            'total_ventas': 0,
            'cantidad_total': 0,
            'dias_con_ventas': 0,
            'promedio_diario': 0,
            'ventas_por_sucursal': {}
        }
    
    kpis = {
        'total_ventas': df['VALOR'].sum(),
        'cantidad_total': df['CANTIDAD'].sum(),
        'dias_con_ventas': df['FECHA'].dt.date.nunique(),
        'promedio_diario': df.groupby(df['FECHA'].dt.date)['VALOR'].sum().mean(),
        'ventas_por_sucursal': df.groupby('SUCURSAL')['VALOR'].sum().to_dict()
    }
    
    return kpis

def create_metric_card(title, value, format_type="number"):
    """Crear tarjeta de métrica personalizada"""
    if format_type == "currency":
        formatted_value = f"Bs. {value:,.0f}"
    elif format_type == "decimal":
        formatted_value = f"{value:,.1f}"
    else:
        formatted_value = f"{value:,.0f}"
    
    st.markdown(f"""
    <div class="metric-card">
        <div class="metric-label">{title}</div>
        <div class="metric-value">{formatted_value}</div>
    </div>
    """, unsafe_allow_html=True)

def create_visualizations(df):
    """Crear todas las visualizaciones"""
    if df.empty:
        st.warning("No hay datos para mostrar con los filtros seleccionados.")
        return
    
    # Distribución de ventas por categoría
    st.markdown('<div class="section-header"><h3>📊 Distribución de Ventas por Categoría</h3></div>', unsafe_allow_html=True)
    
    category_sales = df.groupby('CATEGORIA')['VALOR'].sum().sort_values(ascending=True)
    
    fig_category = px.bar(
        x=category_sales.values,
        y=category_sales.index,
        orientation='h',
        title="Ventas por Categoría",
        color=category_sales.values,
        color_continuous_scale=['#A4D792', '#6BBF59'],
        labels={'x': 'Ventas (Bs.)', 'y': 'Categoría'}
    )
    fig_category.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333'
    )
    st.plotly_chart(fig_category, use_container_width=True)
    
    # Top 10 productos por ventas
    st.markdown('<div class="section-header"><h3>🏆 Top 10 Productos por Ventas</h3></div>', unsafe_allow_html=True)
    
    top_products = df.groupby('DESCRIPCION')['VALOR'].sum().nlargest(10)
    
    fig_top_products = px.bar(
        x=top_products.index,
        y=top_products.values,
        title="Top 10 Productos Más Vendidos",
        color=top_products.values,
        color_continuous_scale=['#A4D792', '#6BBF59'],
        labels={'x': 'Producto', 'y': 'Ventas (Bs.)'}
    )
    fig_top_products.update_xaxes(tickangle=45)
    fig_top_products.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333'
    )
    st.plotly_chart(fig_top_products, use_container_width=True)
    
    # Dos columnas para más visualizaciones
    col1, col2 = st.columns(2)
    
    with col1:
        # Evolución de ventas mensuales
        st.markdown('<div class="section-header"><h3>📈 Evolución Mensual</h3></div>', unsafe_allow_html=True)
        
        monthly_sales = df.groupby(['YEAR', 'MONTH_NAME'])['VALOR'].sum().reset_index()
        monthly_sales['PERIODO'] = monthly_sales['YEAR'].astype(str) + '-' + monthly_sales['MONTH_NAME']
        
        fig_monthly = px.line(
            monthly_sales,
            x='PERIODO',
            y='VALOR',
            title="Evolución de Ventas Mensuales",
            markers=True,
            color_discrete_sequence=['#6BBF59']
        )
        fig_monthly.update_xaxes(tickangle=45)
        fig_monthly.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#333333'
        )
        st.plotly_chart(fig_monthly, use_container_width=True)
    
    with col2:
        # Ventas por día de la semana
        st.markdown('<div class="section-header"><h3>📅 Ventas por Día</h3></div>', unsafe_allow_html=True)
        
        weekday_sales = df.groupby('WEEKDAY_NAME')['VALOR'].sum()
        weekday_order = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
        weekday_sales = weekday_sales.reindex(weekday_order, fill_value=0)
        
        fig_weekday = px.bar(
            x=weekday_sales.index,
            y=weekday_sales.values,
            title="Ventas por Día de la Semana",
            color=weekday_sales.values,
            color_continuous_scale=['#A4D792', '#6BBF59']
        )
        fig_weekday.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#333333'
        )
        st.plotly_chart(fig_weekday, use_container_width=True)
    
    # Heatmap de ventas por mes y día de la semana (en miles con 1 decimal)
    st.markdown('<div class="section-header"><h3>🔥 Heatmap de Ventas (Miles de Bs.)</h3></div>', unsafe_allow_html=True)
    
    heatmap_data = df.groupby(['MONTH_NAME', 'WEEKDAY_NAME'])['VALOR'].sum().reset_index()
    heatmap_pivot = heatmap_data.pivot(index='MONTH_NAME', columns='WEEKDAY_NAME', values='VALOR').fillna(0)
    
    # Reordenar columnas y filas
    month_order = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                   "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    weekday_order = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    
    heatmap_pivot = heatmap_pivot.reindex(index=month_order, columns=weekday_order, fill_value=0)
    
    # Convertir a miles con 1 decimal
    heatmap_pivot_thousands = heatmap_pivot / 1000
    
    fig_heatmap = px.imshow(
        heatmap_pivot_thousands.values,
        x=heatmap_pivot_thousands.columns,
        y=heatmap_pivot_thousands.index,
        color_continuous_scale=['#F3F3F3', '#A4D792', '#6BBF59'],
        title="Heatmap de Ventas por Mes y Día (Miles de Bs.)",
        text_auto='.1f'
    )
    fig_heatmap.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333'
    )
    st.plotly_chart(fig_heatmap, use_container_width=True)
    
    # Más visualizaciones en dos columnas
    col3, col4 = st.columns(2)
    
    with col3:
        # Top 10 productos menos vendidos
        st.markdown('<div class="section-header"><h3>📉 Top 10 Menos Vendidos</h3></div>', unsafe_allow_html=True)
        
        bottom_products = df.groupby('DESCRIPCION')['VALOR'].sum().nsmallest(10)
        
        fig_bottom = px.bar(
            x=bottom_products.values,
            y=bottom_products.index,
            orientation='h',
            title="Top 10 Productos Menos Vendidos",
            color=bottom_products.values,
            color_continuous_scale=['#F3F3F3', '#A4D792']
        )
        fig_bottom.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#333333'
        )
        st.plotly_chart(fig_bottom, use_container_width=True)
    
    with col4:
        # Comparativa de ventas por sucursal
        st.markdown('<div class="section-header"><h3>🏪 Ventas por Sucursal</h3></div>', unsafe_allow_html=True)
        
        branch_sales = df.groupby('SUCURSAL')['VALOR'].sum()
        
        fig_branch = px.pie(
            values=branch_sales.values,
            names=branch_sales.index,
            title="Distribución de Ventas por Sucursal",
            color_discrete_sequence=['#6BBF59', '#A4D792', '#8FCC7E']
        )
        fig_branch.update_layout(
            plot_bgcolor='rgba(0,0,0,0)',
            paper_bgcolor='rgba(0,0,0,0)',
            font_color='#333333'
        )
        st.plotly_chart(fig_branch, use_container_width=True)
    
    # Relación cantidad vs valor por categoría
    st.markdown('<div class="section-header"><h3>💰 Relación Cantidad vs Valor por Categoría</h3></div>', unsafe_allow_html=True)
    
    category_stats = df.groupby('CATEGORIA').agg({
        'CANTIDAD': 'sum',
        'VALOR': 'sum'
    }).reset_index()
    
    fig_scatter = px.scatter(
        category_stats,
        x='CANTIDAD',
        y='VALOR',
        text='CATEGORIA',
        title="Relación entre Cantidad Vendida y Valor por Categoría",
        color='VALOR',
        size='CANTIDAD',
        color_continuous_scale=['#A4D792', '#6BBF59']
    )
    fig_scatter.update_traces(textposition="top center")
    fig_scatter.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333'
    )
    st.plotly_chart(fig_scatter, use_container_width=True)
    
    # Tendencia acumulada de ventas
    st.markdown('<div class="section-header"><h3>📊 Tendencia Acumulada de Ventas</h3></div>', unsafe_allow_html=True)
    
    df_sorted = df.sort_values('FECHA')
    df_sorted['VENTAS_ACUMULADAS'] = df_sorted['VALOR'].cumsum()
    daily_cumulative = df_sorted.groupby(df_sorted['FECHA'].dt.date)['VENTAS_ACUMULADAS'].last().reset_index()
    
    fig_cumulative = px.area(
        daily_cumulative,
        x='FECHA',
        y='VENTAS_ACUMULADAS',
        title="Tendencia Acumulada de Ventas",
        color_discrete_sequence=['#6BBF59']
    )
    fig_cumulative.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333'
    )
    st.plotly_chart(fig_cumulative, use_container_width=True)

def create_category_products_chart(df, selected_categories):
    """Crear gráfico circular de productos dentro de categorías seleccionadas"""
    if not selected_categories or df.empty:
        return
    
    st.markdown('<div class="section-header"><h3>🥗 Productos en Categorías Seleccionadas</h3></div>', unsafe_allow_html=True)
    
    category_products = df[df['CATEGORIA'].isin(selected_categories)]
    product_sales = category_products.groupby('DESCRIPCION')['VALOR'].sum().sort_values(ascending=False)
    
    # Tomar top 15 para mejor visualización
    top_products = product_sales.head(15)
    
    fig_products = px.pie(
        values=top_products.values,
        names=top_products.index,
        title=f"Top 15 Productos en Categorías: {', '.join(selected_categories)}",
        color_discrete_sequence=px.colors.qualitative.Set3
    )
    fig_products.update_traces(textposition='inside', textinfo='percent+label')
    fig_products.update_layout(
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font_color='#333333',
        showlegend=False
    )
    st.plotly_chart(fig_products, use_container_width=True)

def main():
    # Header principal
    st.markdown("""
    <div class="title-header">
        <h1>🌿 Restaurante Menta</h1>
        <h2>Dashboard Interactivo de Ventas</h2>
        <p>Visualizaciones y KPIs para el análisis de ventas</p>
    </div>
    """, unsafe_allow_html=True)
    
    # Sidebar para carga de archivo y filtros
    with st.sidebar:
        st.markdown("## 📁 Cargar Datos")
        
        # Botón de recarga
        if st.button("🔄 Recargar Aplicación", type="primary"):
            st.rerun()
        
        uploaded_file = st.file_uploader(
            "Selecciona el archivo Excel de ventas",
            type=['xlsx'],
            help="El archivo debe contener todas las columnas requeridas"
        )
        
        if uploaded_file is not None:
            # Cargar y validar datos
            df = load_and_validate_data(uploaded_file)
            
            if df is not None:
                st.success(f"✅ Archivo cargado: {len(df):,} registros")
                
                # Inicializar filtros en session state
                if 'filters' not in st.session_state:
                    st.session_state.filters = {
                        'categorias': [],
                        'productos': [],
                        'años': [],
                        'meses': [],
                        'dias_semana': [],
                        'sucursales': []
                    }
                
                st.markdown("---")
                st.markdown("## 🔍 Filtros")
                
                # Filtro de Categorías
                st.markdown("### Categorías")
                categorias_disponibles = sorted(df['CATEGORIA'].unique().tolist())
                
                select_all_cat, clear_all_cat = create_filter_buttons("categorias")
                
                if select_all_cat:
                    st.session_state.filters['categorias'] = categorias_disponibles
                
                if clear_all_cat:
                    st.session_state.filters['categorias'] = []
                
                selected_categorias = st.multiselect(
                    "Seleccionar categorías:",
                    options=categorias_disponibles,
                    default=st.session_state.filters['categorias'],
                    key="categorias_filter"
                )
                st.session_state.filters['categorias'] = selected_categorias
                
                # Filtro de Productos (dinámico según categorías)
                if selected_categorias:
                    st.markdown("### Productos")
                    productos_filtrados = sorted(df[df['CATEGORIA'].isin(selected_categorias)]['DESCRIPCION'].unique().tolist())
                    
                    select_all_prod, clear_all_prod = create_filter_buttons("productos")
                    
                    if select_all_prod:
                        st.session_state.filters['productos'] = productos_filtrados
                    
                    if clear_all_prod:
                        st.session_state.filters['productos'] = []
                    
                    selected_productos = st.multiselect(
                        "Seleccionar productos:",
                        options=productos_filtrados,
                        default=[p for p in st.session_state.filters['productos'] if p in productos_filtrados],
                        key="productos_filter"
                    )
                    st.session_state.filters['productos'] = selected_productos
                else:
                    st.session_state.filters['productos'] = []
                
                # Filtro de Años
                st.markdown("### Años")
                años_disponibles = sorted(df['YEAR'].unique().tolist())
                
                select_all_year, clear_all_year = create_filter_buttons("años")
                
                if select_all_year:
                    st.session_state.filters['años'] = años_disponibles
                
                if clear_all_year:
                    st.session_state.filters['años'] = []
                
                selected_años = st.multiselect(
                    "Seleccionar años:",
                    options=años_disponibles,
                    default=st.session_state.filters['años'],
                    key="años_filter"
                )
                st.session_state.filters['años'] = selected_años
                
                # Filtro de Meses
                st.markdown("### Meses")
                meses_disponibles = [month for month in MONTH_MAP.values() if month in df['MONTH_NAME'].unique()]
                
                select_all_month, clear_all_month = create_filter_buttons("meses")
                
                if select_all_month:
                    st.session_state.filters['meses'] = meses_disponibles
                
                if clear_all_month:
                    st.session_state.filters['meses'] = []
                
                selected_meses = st.multiselect(
                    "Seleccionar meses:",
                    options=meses_disponibles,
                    default=st.session_state.filters['meses'],
                    key="meses_filter"
                )
                st.session_state.filters['meses'] = selected_meses
                
                # Filtro de Días de la Semana
                st.markdown("### Días de la Semana")
                dias_disponibles = [day for day in WEEKDAY_MAP.values() if day in df['WEEKDAY_NAME'].unique()]
                
                select_all_day, clear_all_day = create_filter_buttons("dias_semana")
                
                if select_all_day:
                    st.session_state.filters['dias_semana'] = dias_disponibles
                
                if clear_all_day:
                    st.session_state.filters['dias_semana'] = []
                
                selected_dias = st.multiselect(
                    "Seleccionar días:",
                    options=dias_disponibles,
                    default=st.session_state.filters['dias_semana'],
                    key="dias_filter"
                )
                st.session_state.filters['dias_semana'] = selected_dias
                
                # Filtro de Sucursales
                st.markdown("### Sucursales")
                sucursales_disponibles = sorted(df['SUCURSAL'].unique().tolist())
                
                select_all_branch, clear_all_branch = create_filter_buttons("sucursales")
                
                if select_all_branch:
                    st.session_state.filters['sucursales'] = sucursales_disponibles
                
                if clear_all_branch:
                    st.session_state.filters['sucursales'] = []
                
                selected_sucursales = st.multiselect(
                    "Seleccionar sucursales:",
                    options=sucursales_disponibles,
                    default=st.session_state.filters['sucursales'],
                    key="sucursales_filter"
                )
                st.session_state.filters['sucursales'] = selected_sucursales
                
                # Aplicar filtros
                filtered_df = apply_filters(df, st.session_state.filters)
                
                st.markdown("---")
                st.markdown(f"**Registros filtrados:** {len(filtered_df):,}")
                
                # Opción de descarga
                if not filtered_df.empty:
                    csv_buffer = io.StringIO()
                    filtered_df.to_csv(csv_buffer, index=False)
                    csv_data = csv_buffer.getvalue()
                    
                    st.download_button(
                        label="📥 Descargar datos filtrados (CSV)",
                        data=csv_data,
                        file_name=f"ventas_menta_filtrado_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
                        mime="text/csv"
                    )
                
                # Área principal con KPIs y visualizaciones
                if not filtered_df.empty:
                    # KPIs
                    st.markdown('<div class="section-header"><h2>📊 Indicadores Clave de Rendimiento (KPIs)</h2></div>', unsafe_allow_html=True)
                    
                    kpis = calculate_kpis(filtered_df)
                    
                    kpi_col1, kpi_col2, kpi_col3, kpi_col4 = st.columns(4)
                    
                    with kpi_col1:
                        create_metric_card("💰 Total de Ventas", kpis['total_ventas'], "currency")
                    
                    with kpi_col2:
                        create_metric_card("📦 Cantidad Total", kpis['cantidad_total'])
                    
                    with kpi_col3:
                        create_metric_card("📅 Días con Ventas", kpis['dias_con_ventas'])
                    
                    with kpi_col4:
                        create_metric_card("📈 Promedio Diario", kpis['promedio_diario'], "currency")
                    
                    # KPI de ventas por sucursal
                    if kpis['ventas_por_sucursal']:
                        st.markdown("#### 🏪 Ventas por Sucursal")
                        sucursal_cols = st.columns(len(kpis['ventas_por_sucursal']))
                        
                        for i, (sucursal, ventas) in enumerate(kpis['ventas_por_sucursal'].items()):
                            with sucursal_cols[i]:
                                create_metric_card(f"Sucursal {sucursal}", ventas, "currency")
                    
                    # Visualizaciones
                    create_visualizations(filtered_df)
                    
                    # Gráfico circular de productos en categorías seleccionadas
                    if selected_categorias:
                        create_category_products_chart(filtered_df, selected_categorias)
                
                else:
                    st.warning("⚠️ No hay datos que coincidan con los filtros seleccionados.")
            
        else:
            st.info("👆 Por favor, carga un archivo Excel para comenzar el análisis.")
            
            # Mostrar información sobre las columnas requeridas
            st.markdown("### 📋 Columnas Requeridas")
            st.markdown("El archivo Excel debe contener las siguientes columnas:")
            
            cols_per_row = 2
            for i in range(0, len(REQUIRED_COLUMNS), cols_per_row):
                cols = st.columns(cols_per_row)
                for j, col in enumerate(REQUIRED_COLUMNS[i:i+cols_per_row]):
                    cols[j].markdown(f"• `{col}`")

if __name__ == "__main__":
    main()