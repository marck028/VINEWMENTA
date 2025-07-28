"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Calendar, MapPin, DollarSign } from "lucide-react"

interface KPICardsProps {
  data: any
  isFiltered?: boolean
}

export function KPICards({ data, isFiltered = false }: KPICardsProps) {
  if (!data) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-green-200">
            <CardContent className="p-6 text-center">
              <p className="text-green-600">Cargando...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Calcular sucursal líder
  const branchEntries = Object.entries(data.branchSales || {})
  const leadingBranch =
    branchEntries.length > 0
      ? branchEntries.reduce((a, b) => ((a[1] as number) > (b[1] as number) ? a : b))
      : ["N/A", 0]

  const totalBranchSales = branchEntries.reduce((sum, [, sales]) => sum + (sales as number), 0)
  const leadingBranchPercentage =
    totalBranchSales > 0 ? Math.round(((leadingBranch[1] as number) / totalBranchSales) * 100) : 0

  const kpis = [
    {
      title: "Total de Ventas",
      value: `Bs. ${data.totalSales?.toLocaleString() || "0"}`,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Cantidad Total Vendida",
      value: data.totalQuantity?.toLocaleString() || "0",
      change: "+8.2%",
      icon: ShoppingCart,
      color: "text-green-600",
    },
    {
      title: "Días con Ventas",
      value: data.salesDays?.toString() || "0",
      change: "100%",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Promedio Ventas Diarias",
      value: `Bs. ${Math.round(data.dailyAverage || 0).toLocaleString()}`,
      change: "+5.1%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Sucursal Líder",
      value: leadingBranch[0],
      change: `${leadingBranchPercentage}% del total`,
      icon: MapPin,
      color: "text-green-600",
    },
  ]

  return (
    <div className="space-y-4">
      {isFiltered && (
        <div className="text-center">
          <p className="text-sm text-green-600">📊 KPIs calculados con datos filtrados</p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, index) => (
          <Card key={index} className="border-green-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800">{kpi.value}</div>
              <p className="text-xs text-green-600 mt-1">
                <span className="text-green-700 font-medium">{kpi.change}</span> vs mes anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
