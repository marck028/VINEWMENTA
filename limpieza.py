import pandas as pd

# Cargar el archivo original
df = pd.read_excel("C:/Users/Marco/Documents/UNIVERSIDAD/MENTA 2025/Menta Ventas sep 2024 a jun 2025 .xlsx")

# Diccionario de categorías
categorias = {
    "Burgers": [
        "BURGUER CORSO", "CAÑAHUA BURGER", "CHICKPEA BURGER", "LENTEJA BURGER",
        "MORENA BURGER", "QUINOA BURGER", "TAURUS BURGUER", "MINI BURGER"
    ],
    "Ensaladas & Bowls": [
        "BUDDHA BOWL", "BUDDHA BOWL PEQUEÑO", "BUFFET DE ENSALADAS",
        "FALAFEL BOWL", "FALAFEL BOWL PEQUEÑO", "JALISCO BOWL", 
        "JALISCO BOWL PEQUEÑO", "MEDITERRANEA BOWL", "MEDITERRANEA BOWL PEQUEÑO"
    ],
    "Almuerzos Diarios": [
        "ALMUERZO COMPLETO", "ALMUERZO + BUFFET DE ENSALADAS", "SEGUNDO",
        "SEGUNDO + BUFFET DE ENSALADAS", "SOPA", "ENTRADA"
    ],
    "Especiales": [
        "SAB. ALMUERZO ESPECIAL COMPLETO", "SAB. ESPECIAL SOPA", 
        "SEGUNDO SABADO ESPECIAL", "SILPANCHO VEGGIE", "PIQUE MACHO",
        "FRICASE AÑO NUEVO", "PICANA NAVIDEÑA", "VEGANCUCHO"
    ],
    "Bebidas Frías": [
        "AGUA CON GAS", "AGUA CON LIMON", "AGUA SIN GAS", "CITRUS FRESA",
        "FULL CITRUS", "FULL GREEN 780", "JUGO DE TEMPORADA", "COCO", "SKINNY"
    ],
    "Otras Bebidas": [
        "CERVEZA", "CERVEZA CORONA PERSONAL", "CERVEZA S/A PROST LATA",
        "CHUFLAY O MOJITO VASO", "INFUSION DE HIERBAS", "TE", "MENTA",
        "VINO BLANCO TERRUÑO BOTELLA"
    ],
    "Postres & Helados": [
        "BROWNIES", "HELADO ARTESANAL", "HELADO ARTESANAL CHOCOLATE",
        "PASTEL DE ZANAHORIA", "TIRAMISU", "POSTRE ESPECIAL"
    ],
    "Combos & Promociones": [
        "COMBO 2x1 TRANCAPECHO HORA VEGGIE FELIZ", "COMBO BURGER 2X1 (SIN PAPAS)",
        "COMBO HAMBURGUESA 3X2", "COMBO TRANCAPECHO", "PROMO 21 SEPTIEMBRE",
        "VEGGIE WING 2X30"
    ],
    "Planes & Mensualidades": [
        "ALMUERZO MENSUAL", "ALMUERZO SEMANAL", "FIT MENSUAL", "SEGUNDO MENSUAL",
        "SEGUNDO SEMANAL", "PLAN MENSUAL 400", "PROMO ALMUERZO SEMANAL"
    ],
    "Otros": [
        "DESECHABLES 1bs", "DESECHABLES 3bs", "DESECHABLES 5bs", "CONSUMO CORTESIA",
        "PAPAS FRITAS", "PAPITAS C/SALSA BLANCA", "PORCION EXTRA-FALAFEL",
        "PORCION HUEVO", "PORCION CARNE HAMBURGUESA"
    ]
}

# Función para asignar categoría
def asignar_categoria(descripcion):
    if pd.isna(descripcion):
        return "Categoria desconocida"
    for categoria, items in categorias.items():
        if descripcion.strip().upper() in (item.upper() for item in items):
            return categoria
    return "Categoria desconocida"

# Aplicar la función
df["CATEGORIA"] = df["DESCRIPCION"].apply(asignar_categoria)

# Guardar archivo final
df.to_excel("datos_finales.xlsx", index=False)

print("Archivo 'datos_finales.xlsx' creado exitosamente con las categorías.")

