"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { KPICards } from "@/components/kpi-cards"
import { SalesCharts } from "@/components/sales-charts"
import { FileUpload } from "@/components/file-upload"
import { DynamicCategoriesInfo } from "@/components/dynamic-categories-info"
import { SampleDataGenerator } from "@/components/sample-data-generator"
import { FilterStatusIndicator } from "@/components/filter-status-indicator"
import { DataSummary } from "@/components/data-summary"
import { DataProvider, useDataContext } from "@/components/data-context"

function DashboardContent() {
  const { processedData, applyFilters } = useDataContext()
  const [hasData, setHasData] = useState(false)
  const [filteredData, setFilteredData] = useState(null)
  const [filters, setFilters] = useState({
    categorias: [],
    productos: [],
    años: [],
    meses: [],
    diasSemana: [],
    sucursal: [],
  })

  console.log("🏠 APP - processedData:", processedData)
  console.log("🏠 APP - hasData:", hasData)

  const hasActiveFilters =
    filters.categorias.length > 0 ||
    filters.productos.length > 0 ||
    filters.años.length > 0 ||
    filters.meses.length > 0 ||
    filters.diasSemana.length > 0 ||
    filters.sucursal.length > 0

  const activeFiltersCount =
    filters.categorias.length +
    filters.productos.length +
    filters.años.length +
    filters.meses.length +
    filters.diasSemana.length +
    filters.sucursal.length

  useEffect(() => {
    if (processedData) {
      console.log("🔄 APP - Efecto processedData actualizado")
      console.log("🏷️ APP - Categorías en processedData:", processedData.availableCategories)

      // Verificar si hay algún filtro activo
      const hasActiveFilters =
        filters.categorias.length > 0 ||
        filters.productos.length > 0 ||
        filters.años.length > 0 ||
        filters.meses.length > 0 ||
        filters.diasSemana.length > 0 ||
        filters.sucursal.length > 0

      if (hasActiveFilters) {
        const filtered = applyFilters(filters)
        setFilteredData(filtered)
      } else {
        // Si no hay filtros activos, mostrar todos los datos
        setFilteredData(null)
      }
    }
  }, [filters, processedData, applyFilters])

  const handleFileUpload = (success: boolean) => {
    console.log("🚀 APP - handleFileUpload llamado con:", success)
    if (success) {
      setHasData(true)
    }
  }

  // Obtener categorías disponibles de los datos procesados
  const availableCategories = processedData?.availableCategories || []
  console.log("🏠 APP - availableCategories:", availableCategories)

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl space-y-6">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">Restaurante Menta</CardTitle>
              <p className="text-green-600">Dashboard de Ventas</p>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <DynamicCategoriesInfo availableCategories={availableCategories} />
            <SampleDataGenerator />
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-green-50">
        <DashboardSidebar filters={filters} setFilters={setFilters} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="font-semibold text-green-800">Restaurante Menta</h1>
                <p className="text-sm text-green-600">Dashboard de Ventas</p>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FilterStatusIndicator hasActiveFilters={hasActiveFilters} activeFiltersCount={activeFiltersCount} />
              <DataSummary data={processedData} />
            </div>
            <KPICards data={filteredData || processedData} isFiltered={hasActiveFilters} />
            <SalesCharts data={filteredData || processedData} />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

export default function Dashboard() {
  return (
    <DataProvider>
      <DashboardContent />
    </DataProvider>
  )
}
