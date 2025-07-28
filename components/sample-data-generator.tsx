"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileSpreadsheet } from "lucide-react"
import * as XLSX from "xlsx"

const generateSampleData = () => {
  const sampleData = [
    {
      "COD PRD": "001",
      DESCRIPCION: "QUINOA BURGER",
      SUCURSAL: "16J",
      FECHA: "2024-01-15",
      CATEGORIA: "Burgers",
      YEAR: 2024,
      MONTH: 1, // Número en lugar de string
      "L a D": 1, // Número en lugar de string (1 = Lunes)
      "Nº TRANS.": "T001",
      CLIENTE: "Cliente A",
      CANTIDAD: 2,
      PRECIO: 45,
      VALOR: 90,
      BS: 90,
    },
    {
      "COD PRD": "002",
      DESCRIPCION: "BUDDHA BOWL",
      SUCURSAL: "FA",
      FECHA: "2024-01-15",
      CATEGORIA: "Ensaladas & Bowls",
      YEAR: 2024,
      MONTH: 1, // Enero
      "L a D": 1, // Lunes
      "Nº TRANS.": "T002",
      CLIENTE: "Cliente B",
      CANTIDAD: 1,
      PRECIO: 55,
      VALOR: 55,
      BS: 55,
    },
    {
      "COD PRD": "003",
      DESCRIPCION: "ALMUERZO COMPLETO",
      SUCURSAL: "16J",
      FECHA: "2024-01-16",
      CATEGORIA: "Almuerzos Diarios",
      YEAR: 2024,
      MONTH: 1, // Enero
      "L a D": 2, // Martes
      "Nº TRANS.": "T003",
      CLIENTE: "Cliente C",
      CANTIDAD: 3,
      PRECIO: 35,
      VALOR: 105,
      BS: 105,
    },
    {
      "COD PRD": "004",
      DESCRIPCION: "FULL GREEN 780",
      SUCURSAL: "FA",
      FECHA: "2024-02-16",
      CATEGORIA: "Bebidas Frías",
      YEAR: 2024,
      MONTH: 2, // Febrero
      "L a D": 3, // Miércoles
      "Nº TRANS.": "T004",
      CLIENTE: "Cliente D",
      CANTIDAD: 2,
      PRECIO: 25,
      VALOR: 50,
      BS: 50,
    },
    {
      "COD PRD": "005",
      DESCRIPCION: "HELADO ARTESANAL",
      SUCURSAL: "16J",
      FECHA: "2024-03-17",
      CATEGORIA: "Postres & Helados",
      YEAR: 2024,
      MONTH: 3, // Marzo
      "L a D": 4, // Jueves
      "Nº TRANS.": "T005",
      CLIENTE: "Cliente E",
      CANTIDAD: 1,
      PRECIO: 20,
      VALOR: 20,
      BS: 20,
    },
    {
      "COD PRD": "006",
      DESCRIPCION: "SILPANCHO VEGGIE",
      SUCURSAL: "16J",
      FECHA: "2024-04-18",
      CATEGORIA: "Especiales",
      YEAR: 2024,
      MONTH: 4, // Abril
      "L a D": 5, // Viernes
      "Nº TRANS.": "T006",
      CLIENTE: "Cliente F",
      CANTIDAD: 1,
      PRECIO: 50,
      VALOR: 50,
      BS: 50,
    },
    {
      "COD PRD": "007",
      DESCRIPCION: "PRODUCTO SIN CATEGORIA",
      SUCURSAL: "FA",
      FECHA: "2024-05-18",
      CATEGORIA: "Categoria desconocida",
      YEAR: 2024,
      MONTH: 5, // Mayo
      "L a D": 6, // Sábado
      "Nº TRANS.": "T007",
      CLIENTE: "Cliente G",
      CANTIDAD: 1,
      PRECIO: 30,
      VALOR: 30,
      BS: 30,
    },
    {
      "COD PRD": "008",
      DESCRIPCION: "CERVEZA CORONA",
      SUCURSAL: "16J",
      FECHA: "2024-06-19",
      CATEGORIA: "Otras Bebidas",
      YEAR: 2024,
      MONTH: 6, // Junio
      "L a D": 7, // Domingo
      "Nº TRANS.": "T008",
      CLIENTE: "Cliente H",
      CANTIDAD: 2,
      PRECIO: 15,
      VALOR: 30,
      BS: 30,
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(sampleData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas")

  XLSX.writeFile(workbook, "menta_ventas_estructura_real.xlsx")
}

export function SampleDataGenerator() {
  return (
    <Card className="border-green-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-green-600" />
          <CardTitle className="text-green-800">Datos de Ejemplo</CardTitle>
        </div>
        <CardDescription>Descarga un archivo que coincide exactamente con tu estructura de datos</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={generateSampleData} className="w-full bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Descargar Archivo de Ejemplo
        </Button>
        <div className="text-xs text-green-600 mt-2 space-y-2">
          <p className="text-center font-medium">✅ Estructura Real de tus Datos:</p>
          <div className="bg-green-100 p-2 rounded">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>
                <strong>MONTH:</strong> Números (1-12)
              </div>
              <div>
                <strong>L a D:</strong> Números (1-7)
              </div>
              <div>1 = Enero, 2 = Febrero...</div>
              <div>1 = Lunes, 2 = Martes...</div>
            </div>
          </div>
          <div className="text-xs">
            <p>
              <strong>Categorías incluidas:</strong>
            </p>
            <p>Burgers, Ensaladas & Bowls, Especiales, Bebidas Frías, Categoria desconocida</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
