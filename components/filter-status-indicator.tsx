"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Filter, Database } from "lucide-react"

interface FilterStatusIndicatorProps {
  hasActiveFilters: boolean
  activeFiltersCount: number
}

export function FilterStatusIndicator({ hasActiveFilters, activeFiltersCount }: FilterStatusIndicatorProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <>
                <Filter className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Datos Filtrados</span>
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Todos los Datos</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {activeFiltersCount} filtros activos
              </Badge>
            ) : (
              <Badge variant="outline" className="border-green-300 text-green-600">
                Sin filtros
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-green-600 mt-2">
          {hasActiveFilters
            ? "Los reportes y KPIs muestran solo los datos que coinciden con los filtros seleccionados."
            : "Los reportes y KPIs muestran todos los datos disponibles en la base de datos."}
        </p>
      </CardContent>
    </Card>
  )
}
