"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { X, CheckSquare, Square } from "lucide-react"
import { useMemo } from "react"
import { useDataContext } from "./data-context"

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]
const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const SUCURSALES = ["16J", "FA"]
const AÑOS = [2024, 2025]

interface DashboardSidebarProps {
  filters: any
  setFilters: (filters: any) => void
}

export function DashboardSidebar({ filters, setFilters }: DashboardSidebarProps) {
  const { processedData } = useDataContext()

  const clearAllFilters = () => {
    setFilters({
      categorias: [],
      productos: [],
      años: [],
      meses: [],
      diasSemana: [],
      sucursal: [],
    })
  }

  const getActiveFiltersCount = () => {
    return (
      filters.categorias.length +
      filters.productos.length +
      filters.años.length +
      filters.meses.length +
      filters.diasSemana.length +
      filters.sucursal.length
    )
  }

  // Obtener categorías disponibles de los datos procesados
  const availableCategories = processedData?.availableCategories || []

  // Obtener productos disponibles basados en las categorías seleccionadas
  const availableProducts = useMemo(() => {
    if (!processedData?.availableProducts || filters.categorias.length === 0) {
      return []
    }

    const products: string[] = []
    filters.categorias.forEach((categoria: string) => {
      if (processedData.availableProducts[categoria]) {
        products.push(...processedData.availableProducts[categoria])
      }
    })

    return [...new Set(products)].sort() // Eliminar duplicados y ordenar
  }, [processedData, filters.categorias])

  // Funciones para seleccionar/limpiar todo
  const selectAllCategories = () => {
    setFilters({
      ...filters,
      categorias: [...availableCategories],
      productos: [], // Limpiar productos cuando cambian categorías
    })
  }

  const clearCategories = () => {
    setFilters({
      ...filters,
      categorias: [],
      productos: [], // Limpiar productos cuando cambian categorías
    })
  }

  const selectAllProducts = () => {
    setFilters({
      ...filters,
      productos: [...availableProducts],
    })
  }

  const clearProducts = () => {
    setFilters({
      ...filters,
      productos: [],
    })
  }

  const selectAllSucursales = () => {
    setFilters({
      ...filters,
      sucursal: [...SUCURSALES],
    })
  }

  const clearSucursales = () => {
    setFilters({
      ...filters,
      sucursal: [],
    })
  }

  const selectAllAños = () => {
    setFilters({
      ...filters,
      años: [...AÑOS],
    })
  }

  const clearAños = () => {
    setFilters({
      ...filters,
      años: [],
    })
  }

  const selectAllMeses = () => {
    setFilters({
      ...filters,
      meses: [...MESES],
    })
  }

  const clearMeses = () => {
    setFilters({
      ...filters,
      meses: [],
    })
  }

  const selectAllDias = () => {
    setFilters({
      ...filters,
      diasSemana: [...DIAS_SEMANA],
    })
  }

  const clearDias = () => {
    setFilters({
      ...filters,
      diasSemana: [],
    })
  }

  return (
    <Sidebar className="border-r border-green-200">
      <SidebarHeader className="border-b border-green-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-green-800">Filtros</h2>
          {getActiveFiltersCount() > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-green-600 hover:text-green-700">
              <X className="w-4 h-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
        {getActiveFiltersCount() > 0 && (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {getActiveFiltersCount()} filtros activos
          </Badge>
        )}
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="h-full">
          {/* Categorías */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">
              🏷️ Categorías ({availableCategories.length} disponibles)
            </SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {availableCategories.length > 0 ? (
                <>
                  {availableCategories.map((categoria) => (
                    <div key={categoria} className="flex items-center space-x-2">
                      <Checkbox
                        id={categoria}
                        checked={filters.categorias.includes(categoria)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFilters({
                              ...filters,
                              categorias: [...filters.categorias, categoria],
                              productos: [], // Limpiar productos cuando cambian categorías
                            })
                          } else {
                            setFilters({
                              ...filters,
                              categorias: filters.categorias.filter((c: string) => c !== categoria),
                              productos: [], // Limpiar productos cuando cambian categorías
                            })
                          }
                        }}
                      />
                      <Label htmlFor={categoria} className="text-sm cursor-pointer">
                        {categoria}
                      </Label>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2 border-t border-green-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllCategories}
                      className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <CheckSquare className="w-3 h-3 mr-1" />
                      Todo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCategories}
                      className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                    >
                      <Square className="w-3 h-3 mr-1" />
                      Limpiar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  <p>📊 Carga tu archivo Excel para ver las categorías disponibles</p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Productos Dinámicos */}
          {filters.categorias.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel className="text-green-700">
                Productos ({availableProducts.length} disponibles)
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-2 max-h-48 overflow-y-auto">
                {availableProducts.map((producto) => (
                  <div key={producto} className="flex items-center space-x-2">
                    <Checkbox
                      id={producto}
                      checked={filters.productos.includes(producto)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFilters({
                            ...filters,
                            productos: [...filters.productos, producto],
                          })
                        } else {
                          setFilters({
                            ...filters,
                            productos: filters.productos.filter((p: string) => p !== producto),
                          })
                        }
                      }}
                    />
                    <Label htmlFor={producto} className="text-xs cursor-pointer">
                      {producto}
                    </Label>
                  </div>
                ))}
                <div className="flex gap-2 pt-2 border-t border-green-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectAllProducts}
                    className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <CheckSquare className="w-3 h-3 mr-1" />
                    Todo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearProducts}
                    className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                  >
                    <Square className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* Sucursales */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">Sucursales</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {SUCURSALES.map((sucursal) => (
                <div key={sucursal} className="flex items-center space-x-2">
                  <Checkbox
                    id={sucursal}
                    checked={filters.sucursal.includes(sucursal)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          sucursal: [...filters.sucursal, sucursal],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          sucursal: filters.sucursal.filter((s: string) => s !== sucursal),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={sucursal} className="text-sm cursor-pointer">
                    {sucursal}
                  </Label>
                </div>
              ))}
              <div className="flex gap-2 pt-2 border-t border-green-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllSucursales}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Todo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSucursales}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Años */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">Años</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {AÑOS.map((año) => (
                <div key={año} className="flex items-center space-x-2">
                  <Checkbox
                    id={año.toString()}
                    checked={filters.años.includes(año)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          años: [...filters.años, año],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          años: filters.años.filter((a: number) => a !== año),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={año.toString()} className="text-sm cursor-pointer">
                    {año}
                  </Label>
                </div>
              ))}
              <div className="flex gap-2 pt-2 border-t border-green-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllAños}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Todo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAños}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Meses */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">Meses</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {MESES.map((mes) => (
                <div key={mes} className="flex items-center space-x-2">
                  <Checkbox
                    id={mes}
                    checked={filters.meses.includes(mes)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          meses: [...filters.meses, mes],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          meses: filters.meses.filter((m: string) => m !== mes),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={mes} className="text-sm cursor-pointer">
                    {mes}
                  </Label>
                </div>
              ))}
              <div className="flex gap-2 pt-2 border-t border-green-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllMeses}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Todo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearMeses}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Días de la Semana */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-green-700">Días de la Semana</SidebarGroupLabel>
            <SidebarGroupContent className="space-y-2">
              {DIAS_SEMANA.map((dia) => (
                <div key={dia} className="flex items-center space-x-2">
                  <Checkbox
                    id={dia}
                    checked={filters.diasSemana.includes(dia)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFilters({
                          ...filters,
                          diasSemana: [...filters.diasSemana, dia],
                        })
                      } else {
                        setFilters({
                          ...filters,
                          diasSemana: filters.diasSemana.filter((d: string) => d !== dia),
                        })
                      }
                    }}
                  />
                  <Label htmlFor={dia} className="text-sm cursor-pointer">
                    {dia}
                  </Label>
                </div>
              ))}
              <div className="flex gap-2 pt-2 border-t border-green-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllDias}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <CheckSquare className="w-3 h-3 mr-1" />
                  Todo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearDias}
                  className="flex-1 text-xs border-green-300 text-green-700 hover:bg-green-50 bg-transparent"
                >
                  <Square className="w-3 h-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  )
}
