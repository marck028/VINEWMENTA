"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import * as XLSX from "xlsx"

interface SalesData {
  "COD PRD": string
  DESCRIPCION: string
  SUCURSAL: string
  FECHA: string
  CATEGORIA: string
  YEAR: number
  MONTH: number // Cambiar a number
  "L a D": number // Cambiar a number
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

interface DataContextType {
  data: any[]
  processedData: ProcessedData | null
  loading: boolean
  error: string | null
  processFile: (file: File) => Promise<boolean>
  applyFilters: (filters: any) => ProcessedData | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Mapeos para convertir números a nombres
const MONTH_MAPPING: { [key: number]: string } = {
  1: "Enero",
  2: "Febrero",
  3: "Marzo",
  4: "Abril",
  5: "Mayo",
  6: "Junio",
  7: "Julio",
  8: "Agosto",
  9: "Septiembre",
  10: "Octubre",
  11: "Noviembre",
  12: "Diciembre",
}

const DAY_MAPPING: { [key: number]: string } = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<any[]>([])
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateAndMapColumns = (
    headers: string[],
  ): { isValid: boolean; missingColumns: string[]; mappings: { [key: string]: string } } => {
    console.log("🔍 CONTEXT - Headers originales encontrados:", headers)

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
        console.log(`✅ CONTEXT - ${requiredCol} -> ${foundColumn}`)
      } else {
        missingColumns.push(requiredCol)
        console.log(`❌ CONTEXT - No se encontró: ${requiredCol}`)
      }
    }

    return {
      isValid: missingColumns.length === 0,
      missingColumns,
      mappings,
    }
  }

  const processData = (rawData: any[]): ProcessedData => {
    console.log("🔄 CONTEXT - Iniciando procesamiento de", rawData.length, "filas")
    console.log("📊 CONTEXT - Muestra de datos (primera fila):", rawData[0])

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

    // Ventas por categoría
    const categorySales: { [key: string]: number } = {}
    const categoriesSet = new Set<string>()

    console.log("🏷️ CONTEXT - Procesando categorías...")
    rawData.forEach((row, index) => {
      const category = row.CATEGORIA || "Sin Categoría"
      if (index < 10) {
        // Log de las primeras 10 filas para debug
        console.log(`CONTEXT - Fila ${index + 1}: CATEGORIA = "${category}" (tipo: ${typeof category})`)
      }
      categoriesSet.add(category)
      categorySales[category] = (categorySales[category] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })

    // Obtener categorías disponibles
    const availableCategories = Array.from(categoriesSet).sort()
    console.log("✅ CONTEXT - Categorías únicas encontradas:", availableCategories)
    console.log("✅ CONTEXT - Total de categorías:", availableCategories.length)

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

    // Ventas mensuales (convertir números a nombres)
    const monthlySales: { [key: string]: number } = {}
    console.log("📅 CONTEXT - Procesando meses...")
    rawData.forEach((row, index) => {
      const monthNumber = Number.parseInt(row.MONTH)
      const monthName = MONTH_MAPPING[monthNumber] || `Mes ${monthNumber}`

      if (index < 5) {
        console.log(`CONTEXT - Fila ${index + 1}: MONTH = ${monthNumber} -> ${monthName}`)
      }

      monthlySales[monthName] = (monthlySales[monthName] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })
    console.log("📅 CONTEXT - Ventas mensuales:", monthlySales)

    // Ventas semanales (convertir números a nombres)
    const weeklySales: { [key: string]: number } = {}
    console.log("📅 CONTEXT - Procesando días de la semana...")
    rawData.forEach((row, index) => {
      const dayNumber = Number.parseInt(row["L a D"])
      const dayName = DAY_MAPPING[dayNumber] || `Día ${dayNumber}`

      if (index < 5) {
        console.log(`CONTEXT - Fila ${index + 1}: L a D = ${dayNumber} -> ${dayName}`)
      }

      weeklySales[dayName] = (weeklySales[dayName] || 0) + (Number.parseFloat(row.VALOR) || 0)
    })
    console.log("📅 CONTEXT - Ventas semanales:", weeklySales)

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

    console.log("📊 CONTEXT - Resultado final del procesamiento:", result)
    return result
  }

  const processFile = async (file: File): Promise<boolean> => {
    setLoading(true)
    setError(null)

    try {
      console.log("📁 CONTEXT - Procesando archivo:", file.name)

      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: "array" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      console.log("📈 CONTEXT - Datos cargados:", jsonData.length, "filas")

      if (jsonData.length === 0) {
        setError("El archivo está vacío o no contiene datos válidos.")
        setLoading(false)
        return false
      }

      // Obtener headers de la primera fila
      const headers = Object.keys(jsonData[0])
      console.log("🏷️ CONTEXT - Headers detectados:", headers)

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

      // Normalizar datos usando los mapeos
      const normalizedData = jsonData.map((row: any) => {
        const normalizedRow: any = {}
        for (const [standardName, originalName] of Object.entries(validation.mappings)) {
          normalizedRow[standardName] = row[originalName]
        }
        return normalizedRow
      })

      console.log("🔄 CONTEXT - Datos normalizados (primera fila):", normalizedData[0])
      console.log("🏷️ CONTEXT - Categorías en primera fila:", normalizedData[0]?.CATEGORIA)
      console.log(
        "📅 CONTEXT - Mes en primera fila:",
        normalizedData[0]?.MONTH,
        "->",
        MONTH_MAPPING[normalizedData[0]?.MONTH],
      )
      console.log(
        "📅 CONTEXT - Día en primera fila:",
        normalizedData[0]?.["L a D"],
        "->",
        DAY_MAPPING[normalizedData[0]?.["L a D"]],
      )

      setData(normalizedData)

      // Procesar datos
      const processed = processData(normalizedData)
      setProcessedData(processed)

      console.log("✅ CONTEXT - Procesamiento completado exitosamente")
      console.log("🏷️ CONTEXT - Categorías finales:", processed.availableCategories)

      setLoading(false)
      return true
    } catch (err) {
      console.error("💥 CONTEXT - Error procesando archivo:", err)
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
      filteredData = filteredData.filter((row) => {
        const monthNumber = Number.parseInt(row.MONTH)
        const monthName = MONTH_MAPPING[monthNumber]
        return filters.meses.includes(monthName)
      })
    }

    if (filters.diasSemana.length > 0) {
      filteredData = filteredData.filter((row) => {
        const dayNumber = Number.parseInt(row["L a D"])
        const dayName = DAY_MAPPING[dayNumber]
        return filters.diasSemana.includes(dayName)
      })
    }

    return processData(filteredData)
  }

  return (
    <DataContext.Provider
      value={{
        data,
        processedData,
        loading,
        error,
        processFile,
        applyFilters,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useDataContext() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}
