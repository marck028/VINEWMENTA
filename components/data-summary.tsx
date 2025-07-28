"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, MapPin, Package } from "lucide-react"

interface DataSummaryProps {
  data: any
}

export function DataSummary({ data }: DataSummaryProps) {
  if (!data) return null

  const totalProducts = Object.keys(data.productSales || {}).length
  const totalBranches = Object.keys(data.branchSales || {}).length
  const totalCategories = Object.keys(data.categorySales || {}).length
  const dateRange = data.salesDays || 0

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Resumen de Datos
        </CardTitle>
        <CardDescription>Información general de los datos cargados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-800">{totalProducts}</div>
            <p className="text-xs text-green-600">Productos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-800">{totalBranches}</div>
            <p className="text-xs text-green-600">Sucursales</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-800">{totalCategories}</div>
            <p className="text-xs text-green-600">Categorías</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-800">{dateRange}</div>
            <p className="text-xs text-green-600">Días con ventas</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
