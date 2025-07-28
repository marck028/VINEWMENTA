// Global variables
let salesData = [];
let filteredData = [];
let charts = {};

// Product categories mapping
const productCategories = {
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

// Color palette for charts
const chartColors = {
    primary: '#6BBF59',
    secondary: '#A4D792',
    accent: '#FFFFFF',
    background: '#F3F3F3',
    gradient: ['#6BBF59', '#A4D792', '#5da84a', '#92c47f', '#4a7c59', '#85b074', '#3d6b47', '#7ba068']
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    setupFileUpload();
    loadSampleData(); // For demo purposes
});

// File upload handling
function setupFileUpload() {
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    showLoading(true);
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const workbook = XLSX.read(e.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);
            
            if (validateDataStructure(jsonData)) {
                salesData = processRawData(jsonData);
                filteredData = [...salesData];
                updateProductFilter();
                updateDashboard();
                showMessage('Datos cargados exitosamente', 'success');
            } else {
                showMessage('Estructura de datos inválida. Verifique las columnas del archivo.', 'error');
            }
        } catch (error) {
            console.error('Error processing file:', error);
            showMessage('Error al procesar el archivo Excel', 'error');
        }
        
        showLoading(false);
    };
    
    reader.readAsBinaryString(file);
}

// Validate data structure
function validateDataStructure(data) {
    if (!data || data.length === 0) return false;
    
    const requiredColumns = ['COD PRD', 'DESCRIPCION', 'SUCURSAL', 'CAT', 'FECHA', 'YEAR', 'MONTH', 'L a D', 'Nº TRANS.', 'CLIENTE', 'CANTIDAD', 'PRECIO', 'VALOR', 'BS'];
    const firstRow = data[0];
    
    return requiredColumns.every(col => col in firstRow);
}

// Process raw data and add category mapping
function processRawData(rawData) {
    return rawData.map(row => {
        // Find category for product
        let category = '🔧 Otros'; // Default category
        const productName = row['DESCRIPCION']?.toUpperCase() || '';
        
        for (const [cat, products] of Object.entries(productCategories)) {
            if (products.some(product => productName.includes(product.toUpperCase()))) {
                category = cat;
                break;
            }
        }
        
        return {
            ...row,
            CATEGORIA: category,
            FECHA_PARSED: new Date(row.FECHA),
            VALOR_NUM: parseFloat(row.VALOR) || 0,
            BS_NUM: parseFloat(row.BS) || 0,
            CANTIDAD_NUM: parseInt(row.CANTIDAD) || 0,
            PRECIO_NUM: parseFloat(row.PRECIO) || 0
        };
    });
}

// Initialize filters
function initializeFilters() {
    // Set all filters to select all options by default
    const multiSelects = document.querySelectorAll('select[multiple]');
    multiSelects.forEach(select => {
        Array.from(select.options).forEach(option => option.selected = true);
    });
    
    // Add category filter change event
    document.getElementById('categoryFilter').addEventListener('change', updateProductFilter);
}

// Update product filter based on selected categories
function updateProductFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    const productFilter = document.getElementById('productFilter');
    const selectedCategories = Array.from(categoryFilter.selectedOptions).map(option => option.value);
    
    // Clear current options
    productFilter.innerHTML = '';
    
    // Add products from selected categories
    const availableProducts = new Set();
    selectedCategories.forEach(category => {
        if (productCategories[category]) {
            productCategories[category].forEach(product => {
                availableProducts.add(product);
            });
        }
    });
    
    // If we have data, only show products that exist in the data
    if (salesData.length > 0) {
        const dataProducts = new Set(salesData.map(row => row.DESCRIPCION));
        availableProducts.forEach(product => {
            if (dataProducts.has(product)) {
                const option = document.createElement('option');
                option.value = product;
                option.textContent = product;
                option.selected = true;
                productFilter.appendChild(option);
            }
        });
    } else {
        // If no data, show all products from categories
        availableProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product;
            option.textContent = product;
            option.selected = true;
            productFilter.appendChild(option);
        });
    }
}

// Apply filters
function applyFilters() {
    if (salesData.length === 0) {
        showMessage('No hay datos para filtrar. Cargue un archivo Excel primero.', 'error');
        return;
    }
    
    const filters = {
        sucursal: getSelectedValues('sucursalFilter'),
        year: getSelectedValues('yearFilter'),
        month: getSelectedValues('monthFilter'),
        category: getSelectedValues('categoryFilter'),
        product: getSelectedValues('productFilter'),
        dayOfWeek: getSelectedValues('dayFilter')
    };
    
    filteredData = salesData.filter(row => {
        return (
            (filters.sucursal.length === 0 || filters.sucursal.includes(row.SUCURSAL)) &&
            (filters.year.length === 0 || filters.year.includes(row.YEAR?.toString())) &&
            (filters.month.length === 0 || filters.month.includes(row.MONTH?.toString())) &&
            (filters.category.length === 0 || filters.category.includes(row.CATEGORIA)) &&
            (filters.product.length === 0 || filters.product.includes(row.DESCRIPCION)) &&
            (filters.dayOfWeek.length === 0 || filters.dayOfWeek.includes(row['L a D']))
        );
    });
    
    updateDashboard();
    showMessage('Filtros aplicados correctamente', 'success');
}

// Reset filters
function resetFilters() {
    const multiSelects = document.querySelectorAll('select[multiple]');
    multiSelects.forEach(select => {
        Array.from(select.options).forEach(option => option.selected = true);
    });
    
    updateProductFilter();
    
    if (salesData.length > 0) {
        filteredData = [...salesData];
        updateDashboard();
        showMessage('Filtros restablecidos', 'success');
    }
}

// Get selected values from multi-select
function getSelectedValues(selectId) {
    const select = document.getElementById(selectId);
    return Array.from(select.selectedOptions).map(option => option.value);
}

// Update entire dashboard
function updateDashboard() {
    updateKPIs();
    updateCharts();
}

// Update KPIs
function updateKPIs() {
    const kpis = calculateKPIs(filteredData);
    
    document.getElementById('totalSales').textContent = `Bs. ${kpis.totalSales.toLocaleString()}`;
    document.getElementById('totalQuantity').textContent = kpis.totalQuantity.toLocaleString();
    document.getElementById('salesDays').textContent = kpis.salesDays;
    document.getElementById('dailyAverage').textContent = `Bs. ${kpis.dailyAverage.toLocaleString()}`;
    document.getElementById('averageTicket').textContent = `Bs. ${kpis.averageTicket.toLocaleString()}`;
    document.getElementById('uniqueCustomers').textContent = kpis.uniqueCustomers;
}

// Calculate KPIs
function calculateKPIs(data) {
    if (data.length === 0) {
        return {
            totalSales: 0,
            totalQuantity: 0,
            salesDays: 0,
            dailyAverage: 0,
            averageTicket: 0,
            uniqueCustomers: 0
        };
    }
    
    const totalSales = data.reduce((sum, row) => sum + row.BS_NUM, 0);
    const totalQuantity = data.reduce((sum, row) => sum + row.CANTIDAD_NUM, 0);
    const uniqueDates = new Set(data.map(row => row.FECHA)).size;
    const uniqueCustomers = new Set(data.map(row => row.CLIENTE)).size;
    const uniqueTransactions = new Set(data.map(row => row['Nº TRANS.'])).size;
    
    return {
        totalSales: totalSales,
        totalQuantity: totalQuantity,
        salesDays: uniqueDates,
        dailyAverage: uniqueDates > 0 ? totalSales / uniqueDates : 0,
        averageTicket: uniqueTransactions > 0 ? totalSales / uniqueTransactions : 0,
        uniqueCustomers: uniqueCustomers
    };
}

// Update all charts
function updateCharts() {
    updateCategoryChart();
    updateTopProductsChart();
    updateMonthlyChart();
    updateWeekdayChart();
    updateBranchChart();
    updateTrendChart();
    updateHeatmapChart();
}

// Category distribution chart
function updateCategoryChart() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    if (charts.category) {
        charts.category.destroy();
    }
    
    const categoryData = {};
    filteredData.forEach(row => {
        categoryData[row.CATEGORIA] = (categoryData[row.CATEGORIA] || 0) + row.BS_NUM;
    });
    
    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);
    
    charts.category = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: chartColors.gradient,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${context.label}: Bs. ${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Top products chart
function updateTopProductsChart() {
    const ctx = document.getElementById('topProductsChart').getContext('2d');
    
    if (charts.topProducts) {
        charts.topProducts.destroy();
    }
    
    const productData = {};
    filteredData.forEach(row => {
        productData[row.DESCRIPCION] = (productData[row.DESCRIPCION] || 0) + row.BS_NUM;
    });
    
    const sortedProducts = Object.entries(productData)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
    
    const labels = sortedProducts.map(([product]) => product.length > 20 ? product.substring(0, 20) + '...' : product);
    const data = sortedProducts.map(([,sales]) => sales);
    
    charts.topProducts = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas (Bs.)',
                data: data,
                backgroundColor: chartColors.primary,
                borderColor: chartColors.primary,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        maxRotation: 45
                    }
                }
            }
        }
    });
}

// Monthly evolution chart
function updateMonthlyChart() {
    const ctx = document.getElementById('monthlyChart').getContext('2d');
    
    if (charts.monthly) {
        charts.monthly.destroy();
    }
    
    const monthlyData = {};
    filteredData.forEach(row => {
        const key = `${row.YEAR}-${row.MONTH?.toString().padStart(2, '0')}`;
        monthlyData[key] = (monthlyData[key] || 0) + row.BS_NUM;
    });
    
    const sortedMonths = Object.keys(monthlyData).sort();
    const labels = sortedMonths.map(key => {
        const [year, month] = key.split('-');
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    });
    const data = sortedMonths.map(key => monthlyData[key]);
    
    charts.monthly = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas Mensuales (Bs.)',
                data: data,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.secondary,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Weekday chart
function updateWeekdayChart() {
    const ctx = document.getElementById('weekdayChart').getContext('2d');
    
    if (charts.weekday) {
        charts.weekday.destroy();
    }
    
    const weekdayData = {};
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    weekdays.forEach(day => weekdayData[day] = 0);
    
    filteredData.forEach(row => {
        if (row['L a D'] && weekdayData.hasOwnProperty(row['L a D'])) {
            weekdayData[row['L a D']] += row.BS_NUM;
        }
    });
    
    charts.weekday = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: weekdays,
            datasets: [{
                label: 'Ventas por Día (Bs.)',
                data: weekdays.map(day => weekdayData[day]),
                backgroundColor: chartColors.secondary,
                borderColor: chartColors.primary,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Branch comparison chart
function updateBranchChart() {
    const ctx = document.getElementById('branchChart').getContext('2d');
    
    if (charts.branch) {
        charts.branch.destroy();
    }
    
    const branchData = {};
    filteredData.forEach(row => {
        branchData[row.SUCURSAL] = (branchData[row.SUCURSAL] || 0) + row.BS_NUM;
    });
    
    const labels = Object.keys(branchData);
    const data = Object.values(branchData);
    
    charts.branch = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Ventas por Sucursal (Bs.)',
                data: data,
                backgroundColor: [chartColors.primary, chartColors.secondary],
                borderColor: [chartColors.primary, chartColors.secondary],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Cumulative trend chart
function updateTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    if (charts.trend) {
        charts.trend.destroy();
    }
    
    const dailyData = {};
    filteredData.forEach(row => {
        const date = row.FECHA;
        dailyData[date] = (dailyData[date] || 0) + row.BS_NUM;
    });
    
    const sortedDates = Object.keys(dailyData).sort();
    let cumulative = 0;
    const cumulativeData = sortedDates.map(date => {
        cumulative += dailyData[date];
        return cumulative;
    });
    
    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedDates.map(date => new Date(date).toLocaleDateString()),
            datasets: [{
                label: 'Ventas Acumuladas (Bs.)',
                data: cumulativeData,
                borderColor: chartColors.primary,
                backgroundColor: chartColors.secondary,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'Bs. ' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    ticks: {
                        maxTicksLimit: 10
                    }
                }
            }
        }
    });
}

// Heatmap chart
function updateHeatmapChart() {
    const container = document.getElementById('heatmapChart');
    container.innerHTML = '';
    
    const heatmapData = {};
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    // Initialize data structure
    months.forEach(month => {
        heatmapData[month] = {};
        weekdays.forEach(day => {
            heatmapData[month][day] = 0;
        });
    });
    
    // Fill with actual data
    filteredData.forEach(row => {
        const month = months[parseInt(row.MONTH) - 1];
        const day = row['L a D'];
        if (month && day && heatmapData[month] && heatmapData[month][day] !== undefined) {
            heatmapData[month][day] += row.BS_NUM;
        }
    });
    
    // Find min and max values for color scaling
    let minValue = Infinity;
    let maxValue = -Infinity;
    for (const month of months) {
        for (const day of weekdays) {
            const value = heatmapData[month][day];
            if (value > 0) {
                minValue = Math.min(minValue, value);
                maxValue = Math.max(maxValue, value);
            }
        }
    }
    
    // Create heatmap HTML
    let html = '<div style="margin-bottom: 1rem;"><strong>Ventas por Mes y Día de la Semana</strong></div>';
    html += '<div style="display: grid; grid-template-columns: 60px repeat(7, 1fr); gap: 2px; align-items: center;">';
    
    // Header row
    html += '<div></div>';
    weekdays.forEach(day => {
        html += `<div style="text-align: center; font-weight: 600; font-size: 0.8rem;">${day.substring(0, 3)}</div>`;
    });
    
    // Data rows
    months.forEach(month => {
        html += `<div style="text-align: right; font-weight: 600; font-size: 0.8rem; padding-right: 0.5rem;">${month}</div>`;
        weekdays.forEach(day => {
            const value = heatmapData[month][day];
            const intensity = value > 0 ? (value - minValue) / (maxValue - minValue) : 0;
            const bgColor = value > 0 ? `rgba(107, 191, 89, ${0.2 + intensity * 0.8})` : '#f0f0f0';
            const textColor = intensity > 0.5 ? '#ffffff' : '#333333';
            
            html += `<div style="
                aspect-ratio: 1;
                background-color: ${bgColor};
                border-radius: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.7rem;
                font-weight: 600;
                color: ${textColor};
                cursor: pointer;
                transition: transform 0.2s ease;
                border: 1px solid #e0e0e0;
            " title="${month} ${day}: Bs. ${value.toLocaleString()}" 
               onmouseover="this.style.transform='scale(1.1)'" 
               onmouseout="this.style.transform='scale(1)'">
                ${value > 0 ? (value >= 1000 ? (value/1000).toFixed(0) + 'K' : value.toFixed(0)) : ''}
            </div>`;
        });
    });
    
    html += '</div>';
    
    // Add legend
    if (maxValue > 0) {
        html += '<div style="margin-top: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.8rem;">';
        html += '<span>Menos</span>';
        for (let i = 0; i <= 4; i++) {
            const intensity = i / 4;
            const bgColor = `rgba(107, 191, 89, ${0.2 + intensity * 0.8})`;
            html += `<div style="width: 15px; height: 15px; background-color: ${bgColor}; border-radius: 2px; border: 1px solid #e0e0e0;"></div>`;
        }
        html += '<span>Más</span>';
        html += '</div>';
    }
    
    container.innerHTML = html;
}

// Load sample data for demo
function loadSampleData() {
    // Create sample data for demonstration
    const sampleData = [];
    const products = Object.values(productCategories).flat();
    const branches = ['16J', 'FA'];
    const clients = ['Cliente1', 'Cliente2', 'Cliente3', 'Cliente4', 'Cliente5'];
    const weekdays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    
    for (let i = 0; i < 200; i++) {
        const product = products[Math.floor(Math.random() * products.length)];
        const branch = branches[Math.floor(Math.random() * branches.length)];
        const client = clients[Math.floor(Math.random() * clients.length)];
        const weekday = weekdays[Math.floor(Math.random() * weekdays.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        const price = Math.floor(Math.random() * 50) + 10;
        const value = quantity * price;
        const month = Math.floor(Math.random() * 12) + 1;
        const day = Math.floor(Math.random() * 28) + 1;
        const year = Math.random() > 0.5 ? 2024 : 2025;
        const date = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        sampleData.push({
            'COD PRD': `PRD${i.toString().padStart(3, '0')}`,
            'DESCRIPCION': product,
            'SUCURSAL': branch,
            'CAT': 'CAT1',
            'FECHA': date,
            'YEAR': year,
            'MONTH': month,
            'L a D': weekday,
            'Nº TRANS.': `T${i.toString().padStart(4, '0')}`,
            'CLIENTE': client,
            'CANTIDAD': quantity,
            'PRECIO': price,
            'VALOR': value,
            'BS': value
        });
    }
    
    salesData = processRawData(sampleData);
    filteredData = [...salesData];
    updateProductFilter();
    updateDashboard();
}

// Export functionality
function exportData(format) {
    if (filteredData.length === 0) {
        showMessage('No hay datos para exportar', 'error');
        return;
    }
    
    switch (format) {
        case 'excel':
            exportToExcel();
            break;
        case 'csv':
            exportToCSV();
            break;
        case 'pdf':
            exportToPDF();
            break;
    }
}

function exportToExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredData);
    XLSX.utils.book_append_sheet(wb, ws, 'Datos de Ventas');
    XLSX.writeFile(wb, 'ventas_restaurante_menta.xlsx');
    showMessage('Datos exportados a Excel', 'success');
}

function exportToCSV() {
    const csv = convertToCSV(filteredData);
    downloadCSV(csv, 'ventas_restaurante_menta.csv');
    showMessage('Datos exportados a CSV', 'success');
}

function exportToPDF() {
    showMessage('Funcionalidad de PDF en desarrollo', 'error');
}

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
        }).join(',')
    );
    return [csvHeaders, ...csvRows].join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Utility functions
function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => messageDiv.classList.add('show'), 100);
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => document.body.removeChild(messageDiv), 300);
    }, 3000);
}