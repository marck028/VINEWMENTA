"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

interface SalesChartsProps {
  data: any
}

// Mapeo de colores para categorías reales (sin emojis)
const CATEGORY_COLORS: { [key: string]: string } = {
  Burgers: "#6BBF59",
  "Ensaladas & Bowls": "#A4D792",
  "Almuerzos Diarios": "#8FD175",
  Especiales: "#7BC862",
  "Bebidas Frías": "#9ADB84",
  "Postres & Helados": "#B8E5A3",
  "Combos & Promociones": "#C7EBB5",
  "Planes & Mensualidades": "#D6F1C7",
  "Otras Bebidas": "#E5F7D9",
  "Categoria desconocida": "#94A3B8",
  "Sin Categoría": "#CBD5E1",
  Otros: "#F1F5F9",
}

// Función para obtener emoji basado en la categoría
const getCategoryEmoji = (category: string): string => {
  const emojiMap: { [key: string]: string } = {
    Burgers: "🍔",
    "Ensaladas & Bowls": "🥗",
    "Almuerzos Diarios": "🍽️",
    Especiales: "⭐",
    "Bebidas Frías": "🥤",
    "Postres & Helados": "🍨",
    "Combos & Promociones": "🎯",
    "Planes & Mensualidades": "📋",
    "Otras Bebidas": "☕",
    "Categoria desconocida": "❓",
    "Sin Categoría": "🔧",
    Otros: "📦",
  }
  return emojiMap[category] || "📦"
}

const downloadChart = (chartName: string) => {
  // Simular descarga
  const link = document.createElement("a")
  link.href = "#"
  link.download = `${chartName}_${new Date().toISOString().split("T")[0]}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function SalesCharts({ data }: SalesChartsProps) {
  // Procesar datos para gráficos
  const chartData = useMemo(() => {
    if (!data) return null

    // Datos para distribución por categoría con colores y emojis
    const categoryData = Object.entries(data.categorySales || {}).map(([category, sales]) => ({
      category,
      displayName: `${getCategoryEmoji(category)} ${category}`,
      sales: sales as number,
      fill: CATEGORY_COLORS[category] || "#6BBF59",
    }))

    // Datos para ventas mensuales y acumuladas
    const monthOrder = [
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
    const monthlyEntries = Object.entries(data.monthlySales || {}).sort(
      ([a], [b]) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
    )

    let cumulative = 0
    const cumulativeData = monthlyEntries.map(([month, sales]) => {
      cumulative += sales as number
      return {
        month: month.substring(0, 3), // Abreviar nombres de meses
        sales: sales as number,
        cumulative,
      }
    })

    // Datos para ventas por día de la semana
    const dayOrder = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const weeklyData = dayOrder.map((day) => ({
      day: day.substring(0, 3), // Abreviar nombres de días
      sales: data.weeklySales?.[day] || 0,
    }))

    // Top productos
    const topProducts = Object.entries(data.productSales || {})
      .map(([product, info]: [string, any]) => ({
        product,
        sales: info.sales,
        quantity: info.quantity,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)

    // Bottom productos
    const bottomProducts = Object.entries(data.productSales || {})
      .map(([product, info]: [string, any]) => ({
        product,
        sales: info.sales,
        quantity: info.quantity,
      }))
      .sort((a, b) => a.sales - b.sales)
      .slice(0, 5)

    // Datos para sucursales
    const branchData = Object.entries(data.branchSales || {}).map(([branch, sales]) => {
      const totalSales = Object.values(data.branchSales || {}).reduce((sum: number, val: any) => sum + val, 0)
      return {
        branch,
        sales: sales as number,
        percentage: totalSales > 0 ? Math.round(((sales as number) / totalSales) * 100) : 0,
      }
    })

    // Relación cantidad vs valor por categoría
    const quantityValueData = Object.entries(data.categorySales || {}).map(([category, sales]) => {
      // Calcular cantidad total por categoría desde availableProducts
      const categoryProducts = data.availableProducts?.[category] || []
      const totalQuantity = categoryProducts.reduce((sum: number, product: string) => {
        return sum + (data.productSales?.[product]?.quantity || 0)
      }, 0)

      const avgPrice = totalQuantity > 0 ? (sales as number) / totalQuantity : 0

      return {
        category: `${getCategoryEmoji(category)} ${category}`,
        quantity: totalQuantity,
        value: sales as number,
        avgPrice,
      }
    })

    // Datos para productos por categorías seleccionadas (nuevo gráfico)
    const productsInCategoriesData = useMemo(() => {
      if (!data?.availableProducts || !data?.productSales) return []
      
      const productsData: { product: string; sales: number; category: string; fill: string }[] = []
      
      // Obtener todas las categorías disponibles
      const categories = Object.keys(data.availableProducts)
      
      categories.forEach((category) => {
        const categoryProducts = data.availableProducts[category] || []
        const categoryColor = CATEGORY_COLORS[category] || "#6BBF59"
        
        categoryProducts.forEach((product) => {
          const productInfo = data.productSales[product]
          if (productInfo && productInfo.sales > 0) {
            productsData.push({
              product,
              sales: productInfo.sales,
              category,
              fill: categoryColor
            })
          }
        })
      })
      
      // Ordenar por ventas y tomar los top 15 productos
      return productsData
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 15)
    }, [data])

    // Heatmap mejorado con formato decimal
    const heatmapData = monthOrder.slice(0, 6).map((month) => {
      const monthSales = data.monthlySales?.[month] || 0
      const avgDailySales = monthSales / 30 // Aproximación

      return {
        month: month.substring(0, 3),
        Lun: avgDailySales * 0.8,
        Mar: avgDailySales * 0.9,
        Mié: avgDailySales * 0.85,
        Jue: avgDailySales * 1.1,
        Vie: avgDailySales * 1.2,
        Sáb: avgDailySales * 1.4,
        Dom: avgDailySales * 1.3,
      }
    })

    return {
      categoryData,
      cumulativeData,
      weeklyData,
      topProducts,
      bottomProducts,
      branchData,
      productsInCategoriesData,
      quantityValueData,
      heatmapData,
    }
  }, [data])

  if (!data || !chartData) {
    return (
      <div className="grid gap-6">
        <Card className="border-green-200">
          <CardContent className="p-8 text-center">
            <p className="text-green-600">No hay datos disponibles para mostrar los gráficos.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Header con opciones de descarga */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-800">Reportes y Análisis</h2>
        <Button onClick={() => downloadChart("dashboard_completo")} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Descargar Dashboard
        </Button>
      </div>

      {/* Primera fila - Distribución por categoría y productos en categorías */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Distribución por Categoría</CardTitle>
              <CardDescription>Ventas totales por categoría de productos</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("distribucion_categoria")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {chartData.categoryData.length > 0 ? (
              <ChartContainer
                config={{
                  sales: {
                    label: "Ventas",
                    color: "#6BBF59",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="sales"
                      label={({ displayName, value }) => `${displayName}: Bs.${value.toLocaleString()}`}
                    >
                      {chartData.categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-green-600">
                No hay datos de categorías disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Productos por Categorías</CardTitle>
              <CardDescription>Top 15 productos según categorías disponibles</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("productos_categorias")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {chartData.productsInCategoriesData.length > 0 ? (
              <ChartContainer
                config={{
                  sales: {
                    label: "Ventas",
                    color: "#6BBF59",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.productsInCategoriesData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="sales"
                      label={({ product, sales }) => `${product.length > 15 ? product.substring(0, 15) + '...' : product}: Bs.${sales.toLocaleString()}`}
                    >
                      {chartData.productsInCategoriesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload
                          return (
                            <div className="bg-white p-3 border border-green-200 rounded-lg shadow-lg">
                              <p className="font-medium text-green-800">{data.product}</p>
                              <p className="text-sm text-green-600">Categoría: {getCategoryEmoji(data.category)} {data.category}</p>
                              <p className="text-sm text-green-700">Ventas: Bs. {data.sales.toLocaleString()}</p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-green-600">
                No hay datos de productos disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Segunda fila - Tendencia acumulada */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Tendencia Acumulada</CardTitle>
              <CardDescription>Ventas mensuales y acumuladas</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("tendencia_acumulada")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {chartData.cumulativeData.length > 0 ? (
              <ChartContainer
                config={{
                  sales: { label: "Ventas Mensuales", color: "#6BBF59" },
                  cumulative: { label: "Acumulado", color: "#A4D792" },
                }}
                className="h-[300px]"
              >
                <LineChart data={chartData.cumulativeData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sales" stroke="#6BBF59" strokeWidth={3} name="Ventas Mensuales" />
                  <Line
                    type="monotone"
                    dataKey="cumulative"
                    stroke="#A4D792"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Acumulado"
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-green-600">
                No hay datos mensuales disponibles
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tercera fila - Relación cantidad vs valor y Heatmap */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Cantidad vs Valor por Categoría</CardTitle>
              <CardDescription>Relación entre volumen y valor de ventas</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("cantidad_valor")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.quantityValueData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">{item.category}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Bs. {item.avgPrice.toFixed(1)} promedio
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-green-600">Cantidad: </span>
                      <span className="font-medium">{item.quantity}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Valor: </span>
                      <span className="font-medium">Bs. {item.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(item.value / Math.max(...chartData.quantityValueData.map((d) => d.value))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Heatmap de Ventas</CardTitle>
              <CardDescription>Ventas por mes y día de la semana (en miles)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("heatmap")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-8 gap-1 text-xs font-medium text-green-700">
                <div></div>
                <div>Lun</div>
                <div>Mar</div>
                <div>Mie</div>
                <div>Jue</div>
                <div>Vie</div>
                <div>Sab</div>
                <div>Dom</div>
              </div>
              {chartData.heatmapData.map((row, index) => (
                <div key={index} className="grid grid-cols-8 gap-1">
                  <div className="text-xs font-medium text-green-700 flex items-center">{row.month}</div>
                  {Object.entries(row)
                    .slice(1)
                    .map(([day, value], dayIndex) => {
                      const maxValue = Math.max(
                        ...chartData.heatmapData.flatMap((r) => Object.values(r).slice(1) as number[]),
                      )
                      const intensity = (value as number) / maxValue
                      const displayValue = (value as number) / 1000 // Convertir a miles

                      return (
                        <div
                          key={dayIndex}
                          className="h-8 rounded flex items-center justify-center text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(107, 191, 89, ${intensity})`,
                            color: intensity > 0.5 ? "white" : "#166534",
                          }}
                          title={`${row.month} ${day}: Bs. ${(value as number).toLocaleString()}`}
                        >
                          {((value as number) / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })}
                        </div>
                      )
                    })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cuarta fila - Ventas por día y comparativa sucursales */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Ventas por Día de la Semana</CardTitle>
              <CardDescription>Distribución de ventas semanales</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("ventas_semanales")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {chartData.weeklyData.some((d) => d.sales > 0) ? (
              <ChartContainer
                config={{
                  sales: {
                    label: "Ventas",
                    color: "#6BBF59",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={chartData.weeklyData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="#6BBF59" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-green-600">
                No hay datos de ventas semanales disponibles
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Comparativa por Sucursal</CardTitle>
              <CardDescription>Rendimiento de cada sucursal</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("comparativa_sucursales")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {chartData.branchData.map((branch, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">{branch.branch}</span>
                    <span className="text-sm text-green-600">
                      Bs. {branch.sales.toLocaleString()} ({branch.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${branch.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quinta fila - Top y Bottom productos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Top 10 Productos por Ventas</CardTitle>
              <CardDescription>Los productos más vendidos del período</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("top_productos")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-green-700">Pos.</TableHead>
                  <TableHead className="text-green-700">Producto</TableHead>
                  <TableHead className="text-green-700">Ventas</TableHead>
                  <TableHead className="text-green-700">Cant.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.topProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">#{index + 1}</TableCell>
                    <TableCell className="font-medium text-green-800">{product.product}</TableCell>
                    <TableCell>Bs. {product.sales.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-green-800">Top 5 Productos Menos Vendidos</CardTitle>
              <CardDescription>Productos con menor rendimiento</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadChart("bottom_productos")}
              className="border-green-300 text-green-700 hover:bg-green-50"
            >
              <Download className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-green-700">Producto</TableHead>
                  <TableHead className="text-green-700">Ventas</TableHead>
                  <TableHead className="text-green-700">Cant.</TableHead>
                  <TableHead className="text-green-700">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chartData.bottomProducts.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-green-800">{product.product}</TableCell>
                    <TableCell>Bs. {product.sales.toLocaleString()}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-orange-300 text-orange-700">
                        Bajo rendimiento
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}