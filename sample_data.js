// Sample data generator for Restaurante Menta Sales Dashboard
// This script creates mock sales data that matches the expected Excel format

function generateSampleData() {
    const products = {
        "🍔 Burgers": ["BURGUER CORSO", "CAÑAHUA BURGER", "CHICKPEA BURGER", "LENTEJA BURGER", "MORENA BURGER", "QUINOA BURGER", "TAURUS BURGUER", "MINI BURGER"],
        "🥗 Ensaladas & Bowls": ["BUDDHA BOWL", "BUDDHA BOWL PEQUEÑO", "BUFFET DE ENSALADAS", "FALAFEL BOWL", "FALAFEL BOWL PEQUEÑO", "JALISCO BOWL", "JALISCO BOWL PEQUEÑO", "MEDITERRANEA BOWL", "MEDITERRANEA BOWL PEQUEÑO"],
        "🍽️ Almuerzos Diarios": ["ALMUERZO COMPLETO", "ALMUERZO + BUFFET DE ENSALADAS", "SEGUNDO", "SEGUNDO + BUFFET DE ENSALADAS", "SOPA", "ENTRADA"],
        "⭐ Especiales": ["SAB. ALMUERZO ESPECIAL COMPLETO", "SAB. ESPECIAL SOPA", "SEGUNDO SABADO ESPECIAL", "SILPANCHO VEGGIE", "PIQUE MACHO", "FRICASE AÑO NUEVO", "PICANA NAVIDEÑA", "VEGANCUCHO"],
        "🥤 Bebidas Frías": ["AGUA CON GAS", "AGUA CON LIMON", "AGUA SIN GAS", "CITRUS FRESA", "FULL CITRUS", "FULL GREEN 780", "JUGO DE TEMPORADA", "COCO", "SKINNY"],
        "☕ Otras Bebidas": ["CERVEZA", "CERVEZA CORONA PERSONAL", "CERVEZA S/A PROST LATA", "CHUFLAY O MOJITO VASO", "INFUSION DE HIERBAS", "TE", "MENTA", "VINO BLANCO TERRUÑO BOTELLA"],
        "🍨 Postres & Helados": ["BROWNIES", "HELADO ARTESANAL", "HELADO ARTESANAL CHOCOLATE", "PASTEL DE ZANAHORIA", "TIRAMISU", "POSTRE ESPECIAL"],
        "🎯 Combos & Promociones": ["COMBO 2x1 TRANCAPECHO HORA VEGGIE FELIZ", "COMBO BURGER 2X1 (SIN PAPAS)", "COMBO HAMBURGUESA 3X2", "COMBO TRANCAPECHO", "PROMO 21 SEPTIEMBRE", "VEGGIE WING 2X30"],
        "📋 Planes & Mensualidades": ["ALMUERZO MENSUAL", "ALMUERZO SEMANAL", "FIT MENSUAL", "SEGUNDO MENSUAL", "SEGUNDO SEMANAL", "PLAN MENSUAL 400", "PROMO ALMUERZO SEMANAL"],
        "🔧 Otros": ["DESECHABLES 1bs", "DESECHABLES 3bs", "DESECHABLES 5bs", "CONSUMO CORTESIA", "PAPAS FRITAS", "PAPITAS C/SALSA BLANCA", "PORCION EXTRA-FALAFEL", "PORCION HUEVO", "PORCION CARNE HAMBURGUESA"]
    };

    const sucursales = ["16J", "FA"];
    const weekdays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    const clients = ["Cliente1", "Cliente2", "Cliente3", "Cliente4", "Cliente5", "Cliente6", "Cliente7", "Cliente8", "Cliente9", "Cliente10"];
    
    const sampleData = [];
    let transactionCounter = 1000;

    // Generate data for the last 6 months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 6);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayOfWeek = weekdays[d.getDay() === 0 ? 6 : d.getDay() - 1]; // Adjust for Monday = 0
        
        // Generate 3-15 transactions per day
        const dailyTransactions = Math.floor(Math.random() * 13) + 3;
        
        for (let t = 0; t < dailyTransactions; t++) {
            const category = Object.keys(products)[Math.floor(Math.random() * Object.keys(products).length)];
            const productList = products[category];
            const product = productList[Math.floor(Math.random() * productList.length)];
            
            const cantidad = Math.floor(Math.random() * 5) + 1;
            let precio = 0;
            
            // Set realistic prices based on category
            switch (category) {
                case "🍔 Burgers":
                    precio = Math.floor(Math.random() * 20) + 25; // 25-45 Bs
                    break;
                case "🥗 Ensaladas & Bowls":
                    precio = Math.floor(Math.random() * 15) + 30; // 30-45 Bs
                    break;
                case "🍽️ Almuerzos Diarios":
                    precio = Math.floor(Math.random() * 10) + 20; // 20-30 Bs
                    break;
                case "⭐ Especiales":
                    precio = Math.floor(Math.random() * 25) + 35; // 35-60 Bs
                    break;
                case "🥤 Bebidas Frías":
                    precio = Math.floor(Math.random() * 8) + 8; // 8-16 Bs
                    break;
                case "☕ Otras Bebidas":
                    precio = Math.floor(Math.random() * 15) + 10; // 10-25 Bs
                    break;
                case "🍨 Postres & Helados":
                    precio = Math.floor(Math.random() * 10) + 15; // 15-25 Bs
                    break;
                case "🎯 Combos & Promociones":
                    precio = Math.floor(Math.random() * 30) + 40; // 40-70 Bs
                    break;
                case "📋 Planes & Mensualidades":
                    precio = Math.floor(Math.random() * 200) + 300; // 300-500 Bs
                    break;
                case "🔧 Otros":
                    precio = Math.floor(Math.random() * 10) + 1; // 1-11 Bs
                    break;
            }
            
            const valor = cantidad * precio;
            
            const row = {
                "COD PRD": `PRD${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                "DESCRIPCION": product,
                "SUCURSAL": sucursales[Math.floor(Math.random() * sucursales.length)],
                "CAT": category,
                "FECHA": d.toISOString().split('T')[0],
                "YEAR": d.getFullYear(),
                "MONTH": d.getMonth() + 1,
                "L a D": dayOfWeek,
                "Nº TRANS.": `TR${transactionCounter++}`,
                "CLIENTE": clients[Math.floor(Math.random() * clients.length)],
                "CANTIDAD": cantidad,
                "PRECIO": precio,
                "VALOR": valor,
                "BS": valor
            };
            
            sampleData.push(row);
        }
    }

    return sampleData;
}

function downloadSampleExcel() {
    const data = generateSampleData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, 'sample_sales_data.xlsx');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSampleData, downloadSampleExcel };
}