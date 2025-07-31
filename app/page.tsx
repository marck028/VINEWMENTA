"use client"

import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { FileUpload } from "@/components/file-upload"
import { KPICards } from "@/components/kpi-cards"
import { SalesCharts } from "@/components/sales-charts"
import { FilterStatusIndicator } from "@/components/filter-status-indicator"
import { DataSummary } from "@/components/data-summary"
import { SampleDataGenerator } from "@/components/sample-data-generator"
import { DataProvider, useDataContext } from "@/components/data-context"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

function DashboardContent() {
  const { processedData, applyFilters } = useDataContext()
  const [fileUploaded, setFileUploaded] = useState(false)
  const [showNewFileUpload, setShowNewFileUpload] = useState(false)
  const [filters, setFilters] = useState({
    categorias: [],
    productos: [],
    años: [],
    meses: [],
    diasSemana: [],
    sucursal: [],
  })

  // Aplicar filtros a los datos
  const filteredData =
    processedData && Object.values(filters).some((f) => f.length > 0) ? applyFilters(filters) : processedData

  const handleFileUpload = (success: boolean) => {
    if (success) {
      setFileUploaded(true)
      setShowNewFileUpload(false)
      // Limpiar filtros cuando se carga un nuevo archivo
      setFilters({
        categorias: [],
        productos: [],
        años: [],
        meses: [],
        diasSemana: [],
        sucursal: [],
      })
    }
  }

  const handleLoadNewFile = () => {
    setShowNewFileUpload(true)
    setFileUploaded(false)
  }

  if (!fileUploaded && !showNewFileUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Dashboard Restaurante Menta</h1>
            <p className="text-green-600 text-lg">Visualizador de Ventas y Analytics</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />

            <div className="mt-8">
              <SampleDataGenerator />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (showNewFileUpload) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 Cargar Nuevo Archivo</h1>
            <p className="text-green-600 text-lg">Selecciona un nuevo archivo de datos</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} />

            <div className="mt-4 text-center">
              <Button
                variant="outline"
                onClick={() => setShowNewFileUpload(false)}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <DashboardSidebar filters={filters} setFilters={setFilters} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-green-700" />
                <div>
                  <h1 className="text-2xl font-bold text-green-800">🌱 Dashboard Restaurante Menta</h1>
                  <p className="text-green-600 text-sm">Visualizador de Ventas y Analytics</p>
                </div>
              </div>

              <Button onClick={handleLoadNewFile} className="bg-green-600 hover:bg-green-700">
                <Upload className="w-4 h-4 mr-2" />
                Cargar Nuevo Archivo
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 space-y-6 overflow-auto">
            {/* Status and Summary */}
            <div className="grid gap-6 md:grid-cols-2">
              <FilterStatusIndicator filters={filters} />
              <DataSummary data={filteredData} />
            </div>

            {/* KPIs */}
            <KPICards data={filteredData} />

            {/* Charts */}
            <SalesCharts data={filteredData} />
          </main>
        </div>
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
