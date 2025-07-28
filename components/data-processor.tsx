"use client"

import { useState } from "react"
import * as XLSX from "xlsx"

interface SalesData {
  "COD PRD": string
  DESCRIPCION: string
  SUCURSAL: string
  FECHA: string
  CATEGORIA: string
  YEAR: number
  MONTH: string
  "L a D": string
  "Nº TRANS.": string
  CLIENTE: string
  CANTIDAD: number
  PRECIO: number
  VALOR: number
  BS: number
}

interface ProcessedData {
  totalSales: number
  totalQuantity: number
  salesDays: number
  dailyAverage: number
  branchSales: { [key: string]: number }
  categorySales: { [key: string]: number }
  productSales: { [key: string]: { sales: number; quantity: number } }
  monthlySales: { [key: string]: number }
  weeklySales: { [key: string]: number }
  availableCategories: string[]
  availableProducts: { [category: string]: string[] }
}

// Función para normalizar nombres de columnas
const normalizeColumnName = (name: string): string => {
  return name.trim().toUpperCase().replace(/\s+/g, " ")
}

// Mapeo de columnas flexible
const COLUMN_MAPPINGS: { [key: string]: string[] } = {
  "COD PRD": ["COD PRD", "CODPRD", "COD_PRD", "CODIGO", "CODIGO PRODUCTO"],
  DESCRIPCION: ["DESCRIPCION", "DESCRIPCIÓN", "DESCRIPTION", "PRODUCTO", "NOMBRE"],
  SUCURSAL: ["SUCURSAL", "BRANCH", "TIENDA", "STORE"],
  FECHA: ["FECHA", "DATE", "FECHA_VENTA"],
  CATEGORIA: ["CATEGORIA", "CATEGORÍA", "CATEGORY", "CAT", "TIPO"],
  YEAR: ["YEAR", "AÑO", "ANNO", "ANIO"],
  MONTH: ["MONTH", "MES", "MESES"],
  "L a D": ["L a D", "L A D", "DIA", "DÍA", "DAY", "DIA_SEMANA"],
  "Nº TRANS.": ["Nº TRANS.", "N TRANS", "NUMERO TRANSACCION", "TRANSACCION", "TRANS"],
  CLIENTE: ["CLIENTE", "CLIENT", "CUSTOMER"],
  CANTIDAD: ["CANTIDAD", "QTY", "QUANTITY", "CANT"],
  PRECIO: ["PRECIO", "PRICE", "PRECIO_UNIT"],
  VALOR: ["VALOR", "VALUE", "TOTAL", "IMPORTE"],
  BS: ["BS", "BOLIVIANOS", "BOL"],
}

const findColumnMapping = (headers: string[], targetColumn: string): string | null => {
  const normalizedHeaders = headers.map((h) => normalizeColumnName(h))
  const possibleNames = COLUMN_MAPPINGS[targetColumn] || [targetColumn]

  for (const possibleName of possibleNames) {
    const normalizedPossible = normalizeColumnName(possibleName)
    const foundIndex = normalizedHeaders.findIndex((h) => h === normalizedPossible)
    if (foundIndex !== -1) {
      return headers[foundIndex] // Retornar el nombre original
    }
  }
  return null
}

export function useDataProcessor() {
  const [data, setData] = useState<any[]>([]) // Cambiar a any[] para ser más flexible
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [columnMappings, setColumnMappings] = useState<{ [key: string]: string }>({})

  const validateAndMapColumns = (
    headers: string[],
  ): { isValid: boolean; missingColumns: string[]; mappings: { [key: string]: string } } => {
    console.log("🔍 Headers originales encontrados:", headers)
    console.log(
      "🔍 Headers normalizados:",
      headers.map((h) => normalizeColumnName(h)),
    )

    const requiredColumns = [
      "COD PRD",
      "DESCRIPCION",
      "SUCURSAL",
      "FECHA",
      "CATEGORIA",
      "YEAR",
      "MONTH",
      "L a D",
      "Nº TRANS.",
      "CLIENTE",
      "CANTIDAD",
      "PRECIO",
      "VALOR",
      "BS",
    ]

    const mappings: { [key: string]: string } = {}
    const missingColumns: string[] = []

    for (const requiredCol of requiredColumns) {
      const foundColumn = findColumnMapping(headers, requiredCol)
      if (foundColumn) {
        mappings[requiredCol] = foundColumn
        console.log(`✅ ${requiredCol} -> ${foundColumn}`)
      } else {
        missingColumns.push(requiredCol)
        console.log(`❌ No se encontró: ${requiredCol}`)
      }
    }

    console.log("📋 Mapeo final de columnas:", mappings)
    console.log("❌ Columnas faltantes:", missingColumns)

    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      mappings,
    }
  }

  const processFile = async (file: File): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      console.log("📁 Procesando archivo:", file.name)

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      console.log("📊 Hoja de cálculo:", sheetName)

      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log("📈 Datos cargados:", jsonData.length, "filas")

      if (jsonData.length === 0) {
        setError("El archivo está vacío o no contiene datos válidos.")
        setLoading(false)
        return false
      }

      // Obtener headers de la primera fila
      const headers = Object.keys(jsonData[0])
      console.log("🏷️ Headers detectados:", headers)

      // Validar y mapear columnas
      const validation = validateAndMapColumns(headers)

      if (!validation.isValid) {
        const missingList = validation.missingColumns.join(", ")
        const availableList = headers.join(", ")
        setError(
          `❌ Faltan las siguientes columnas: ${missingList}\n\n` +
            `📋 Columnas encontradas en tu archivo: ${availableList}\n\n` +
            `💡 Verifica que tu archivo Excel tenga exactamente estas columnas:\n` +
            `COD PRD, DESCRIPCION, SUCURSAL, FECHA, CATEGORIA, YEAR, MONTH, L a D, Nº TRANS., CLIENTE, CANTIDAD, PRECIO, VALOR, BS`,
        )
        setLoading(false)
        return false
      }

      // Guardar mapeos para uso posterior
      setColumnMappings(validation.mappings)

      // Normalizar datos usando los mapeos
      const normalizedData = jsonData.map((row: any) => {
        const normalizedRow: any = {}
        for (const [standardName, originalName] of Object.entries(validation.mappings)) {
          normalizedRow[standardName] = row[originalName]
        }
        return normalizedRow
      })

      console.log("🔄 Datos normalizados (primera fila):", normalizedData[0])
      console.log("🏷️ Categorías en primera fila:", normalizedData[0]?.CATEGORIA)

      setData(normalizedData)

      // Procesar datos
      const processed = processData(normalizedData)
      console.log("✅ Datos procesados:", processed)
      console.log("🏷️ Categorías encontradas:", processed.availableCategories)

      setProcessedData(processed)
      setLoading(false)
      return true
    } catch (err) {
      console.error("💥 Error procesando archivo:", err)
      setError(
        "Error al procesar el archivo: " +
          (err as Error).message +
          "\n\nVerifica que:\n" +
          "• El archivo sea formato .xlsx (Excel)\n" +
          "• La primera fila contenga los nombres de las columnas\n" +
          "• No haya filas vacías al inicio\n" +
          "• El archivo no esté corrupto",
      )
      setLoading(false)
      return false
    }
  }

  const processData = (rawData: any[]): ProcessedData => {
    console.log("🔄 Iniciando procesamiento de", rawData.length, "filas")

    const totalSales = rawData.reduce((sum, row) => sum + (Number.parseFloat(row.VALOR) || 0), 0)
    const totalQuantity = rawData.reduce((sum, row) => sum + (Number.parseFloat(row.CANTIDAD) || 0), 0)

    // Días únicos con ventas
    const uniqueDates = new Set(rawData.map((row) => row.FECHA))
    const salesDays = uniqueDates.size
    const dailyAverage = salesDays > 0 ? totalSales / salesDays : 0

    // Ventas por sucursal
    const branchSales: { [key: string]: number } = {}
    rawData.forEach((row) => {
      const branch = row.SUCURSAL || "Sin Sucursal"
      branchSales[branch] = (branchSales[branch] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })

    // Ventas por categoría (usando la columna CATEGORIA real)
    const categorySales: { [key: string]: number } = {}
    const categoriesSet = new Set<string>()

    console.log("🏷️ Procesando categorías...")
    rawData.forEach((row, index) => {
      const category = row.CATEGORIA || "Sin Categoría"
      if (index < 5) {
        // Log de las primeras 5 filas para debug
        console.log(`Fila ${index + 1}: CATEGORIA = "${category}"`)
      }
      categoriesSet.add(category)
      categorySales[category] = (categorySales[category] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })

    // Obtener categorías disponibles
    const availableCategories = Array.from(categoriesSet).sort()
    console.log("✅ Categorías únicas encontradas:", availableCategories)

    // Productos por categoría
    const availableProducts: { [category: string]: string[] } = {}
    rawData.forEach((row) => {
      const category = row.CATEGORIA || "Sin Categoría"
      const product = row.DESCRIPCION || "Sin Descripción"

      if (!availableProducts[category]) {
        availableProducts[category] = []
      }
      if (!availableProducts[category].includes(product)) {
        availableProducts[category].push(product)
      }
    })

    // Ventas por producto
    const productSales: { [key: string]: { sales: number; quantity: number } } = {}
    rawData.forEach((row) => {
      const product = row.DESCRIPCION || "Sin Descripción"
      if (!productSales[product]) {
        productSales[product] = { sales: 0, quantity: 0 }
      }
      productSales[product].sales += Number.parseFloat(row.VALOR) || 0
      productSales[product].quantity += Number.parseFloat(row.CANTIDAD) || 0
    })

    // Ventas mensuales
    const monthlySales: { [key: string]: number } = {}
    rawData.forEach((row) => {
      const month = row.MONTH || "Sin Mes"
      monthlySales[month] = (monthlySales[month] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })

    // Ventas semanales
    const weeklySales: { [key: string]: number } = {}
    rawData.forEach((row) => {
      const day = row["L a D"] || "Sin Día"
      weeklySales[day] = (weeklySales[day] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })

    const result = {
      totalSales,
      totalQuantity,
      salesDays,
      dailyAverage,
      branchSales,
      categorySales,
      productSales,
      monthlySales,
      weeklySales,
      availableCategories,
      availableProducts,
    }

    console.log("📊 Resultado del procesamiento:", result)
    return result
  }

  const applyFilters = (filters: any): ProcessedData | null => {
    if (!data.length) return null

    let filteredData = [...data]

    // Aplicar filtros
    if (filters.categorias.length > 0) {
      filteredData = filteredData.filter((row) => {
        const category = row.CATEGORIA || "Sin Categoría"
        return filters.categorias.includes(category)
      })
    }

    if (filters.productos.length > 0) {
      filteredData = filteredData.filter((row) => filters.productos.includes(row.DESCRIPCION))
    }

    if (filters.sucursal.length > 0) {
      filteredData = filteredData.filter((row) => filters.sucursal.includes(row.SUCURSAL))
    }

    if (filters.años.length > 0) {
      filteredData = filteredData.filter((row) => filters.años.includes(Number.parseInt(row.YEAR)))
    }

    if (filters.meses.length > 0) {
      filteredData = filteredData.filter((row) => filters.meses.includes(row.MONTH))
    }

    if (filters.diasSemana.length > 0) {
      filteredData = filteredData.filter((row) => filters.diasSemana.includes(row["L a D"]))
    }

    return processData(filteredData)
  }

  return {
    data,
    processedData,
    loading,
    error,
    processFile,
    applyFilters,
    columnMappings, // Exportar mapeos para debugging
  }
}
