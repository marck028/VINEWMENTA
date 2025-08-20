"""
Estructura de datos de ejemplo para el Dashboard de Restaurante Menta

Este archivo muestra la estructura esperada de los datos y proporciona
funciones para generar datos de prueba.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

# Configuración de datos de ejemplo
SAMPLE_CATEGORIES = [
    "Bebidas Naturales", "Ensaladas", "Bowls Saludables", "Jugos Detox",
    "Smoothies", "Wraps Veggie", "Sopas", "Postres Saludables"
]

SAMPLE_PRODUCTS = {
    "Bebidas Naturales": ["Agua Saborizada Menta", "Té Verde Orgánico", "Limonada Natural"],
    "Ensaladas": ["Ensalada César Veggie", "Bowl de Quinoa", "Ensalada Mediterránea"],
    "Bowls Saludables": ["Bowl de Açaí", "Bowl Proteico", "Bowl Tropical"],
    "Jugos Detox": ["Verde Detox", "Naranja Energía", "Remolacha Antioxidante"],
    "Smoothies": ["Smoothie Tropical", "Smoothie Proteico", "Smoothie Verde"],
    "Wraps Veggie": ["Wrap de Hummus", "Wrap Mediterráneo", "Wrap de Aguacate"],
    "Sopas": ["Sopa de Lentejas", "Crema de Calabaza", "Sopa Minestrone"],
    "Postres Saludables": ["Chia Pudding", "Brownie Vegano", "Helado de Coco"]
}

SUCURSALES = ["16J", "FA", "SCZ"]
CLIENTES = [f"CLI{str(i).zfill(4)}" for i in range(1, 101)]

def generate_sample_data(num_records=1000, start_date="2024-01-01", end_date="2024-12-31"):
    """
    Genera datos de ejemplo para el dashboard
    
    Args:
        num_records (int): Número de registros a generar
        start_date (str): Fecha de inicio (YYYY-MM-DD)
        end_date (str): Fecha de fin (YYYY-MM-DD)
    
    Returns:
        pandas.DataFrame: DataFrame con la estructura esperada
    """
    
    # Convertir fechas
    start = datetime.strptime(start_date, "%Y-%m-%d")
    end = datetime.strptime(end_date, "%Y-%m-%d")
    
    # Generar datos
    data = []
    
    for i in range(num_records):
        # Fecha aleatoria
        random_date = start + timedelta(
            days=random.randint(0, (end - start).days)
        )
        
        # Seleccionar categoría y producto
        categoria = random.choice(SAMPLE_CATEGORIES)
        producto = random.choice(SAMPLE_PRODUCTS[categoria])
        
        # Generar código de producto
        cod_prd = f"PRD{str(i % 500).zfill(3)}"
        
        # Otros campos
        sucursal = random.choice(SUCURSALES)
        cliente = random.choice(CLIENTES)
        cantidad = random.randint(1, 10)
        precio = round(random.uniform(15.0, 150.0), 2)
        valor = round(cantidad * precio, 2)
        bs = valor  # Asumiendo que VALOR y BS son iguales
        
        # Día de la semana (1=Lunes, 7=Domingo)
        weekday = random_date.weekday() + 1
        if weekday == 7:  # Python usa 0-6, nosotros 1-7
            weekday = 7
        
        record = {
            "COD PRD": cod_prd,
            "DESCRIPCION": producto,
            "SUCURSAL": sucursal,
            "FECHA": random_date.strftime("%Y-%m-%d"),
            "CATEGORIA": categoria,
            "YEAR": random_date.year,
            "MONTH": random_date.month,
            "L a D": weekday,
            "Nº TRANS.": f"T{str(i).zfill(6)}",
            "CLIENTE": cliente,
            "CANTIDAD": cantidad,
            "PRECIO": precio,
            "VALOR": valor,
            "BS": bs
        }
        
        data.append(record)
    
    return pd.DataFrame(data)

def save_sample_excel(filename="sample_ventas_menta.xlsx", num_records=1000):
    """
    Genera y guarda un archivo Excel de ejemplo
    
    Args:
        filename (str): Nombre del archivo a generar
        num_records (int): Número de registros a incluir
    """
    df = generate_sample_data(num_records)
    df.to_excel(filename, index=False)
    print(f"Archivo de ejemplo generado: {filename}")
    print(f"Registros incluidos: {len(df):,}")
    print(f"Rango de fechas: {df['FECHA'].min()} a {df['FECHA'].max()}")
    print(f"Categorías incluidas: {', '.join(df['CATEGORIA'].unique())}")
    print(f"Sucursales incluidas: {', '.join(df['SUCURSAL'].unique())}")

def validate_data_structure(df):
    """
    Valida que un DataFrame tenga la estructura correcta
    
    Args:
        df (pandas.DataFrame): DataFrame a validar
    
    Returns:
        dict: Resultado de la validación
    """
    required_columns = [
        "COD PRD", "DESCRIPCION", "SUCURSAL", "FECHA", "CATEGORIA",
        "YEAR", "MONTH", "L a D", "Nº TRANS.", "CLIENTE",
        "CANTIDAD", "PRECIO", "VALOR", "BS"
    ]
    
    result = {
        "valid": True,
        "missing_columns": [],
        "extra_columns": [],
        "data_types": {},
        "summary": {}
    }
    
    # Verificar columnas faltantes
    missing = [col for col in required_columns if col not in df.columns]
    result["missing_columns"] = missing
    
    # Verificar columnas extra
    extra = [col for col in df.columns if col not in required_columns]
    result["extra_columns"] = extra
    
    # Si hay columnas faltantes, marcar como inválido
    if missing:
        result["valid"] = False
    
    # Información sobre tipos de datos
    for col in df.columns:
        if col in required_columns:
            result["data_types"][col] = str(df[col].dtype)
    
    # Resumen de datos
    result["summary"] = {
        "total_records": len(df),
        "date_range": f"{df['FECHA'].min()} a {df['FECHA'].max()}" if 'FECHA' in df.columns else "N/A",
        "categories": df['CATEGORIA'].nunique() if 'CATEGORIA' in df.columns else 0,
        "products": df['DESCRIPCION'].nunique() if 'DESCRIPCION' in df.columns else 0,
        "branches": df['SUCURSAL'].nunique() if 'SUCURSAL' in df.columns else 0
    }
    
    return result

if __name__ == "__main__":
    # Generar archivo de ejemplo
    print("Generando archivo de ejemplo para Restaurante Menta Dashboard...")
    save_sample_excel("sample_ventas_menta.xlsx", 2000)
    
    # Cargar y validar el archivo generado
    print("\nValidando estructura del archivo generado...")
    df = pd.read_excel("sample_ventas_menta.xlsx")
    validation = validate_data_structure(df)
    
    print(f"\nValidación: {'✅ VÁLIDO' if validation['valid'] else '❌ INVÁLIDO'}")
    if validation['missing_columns']:
        print(f"Columnas faltantes: {validation['missing_columns']}")
    
    print(f"\nResumen del archivo:")
    for key, value in validation['summary'].items():
        print(f"  {key}: {value}")