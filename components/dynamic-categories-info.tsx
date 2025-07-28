"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database } from "lucide-react"

interface DynamicCategoriesInfoProps {
  availableCategories: string[]
}

export function DynamicCategoriesInfo({ availableCategories }: DynamicCategoriesInfoProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-600" />
          <CardTitle className="text-green-800">Categorías Dinámicas</CardTitle>
        </div>
        <CardDescription>
          Las categorías se extraen directamente de la columna CATEGORIA de tu archivo Excel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {availableCategories.length > 0 ? (
          <div className="text-sm text-green-700">
            <p className="font-medium mb-2">Categorías encontradas en tus datos:</p>
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((category) => (
                <Badge key={category} variant="secondary" className="bg-green-100 text-green-700">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-green-600">
            <p>Las categorías aparecerán aquí después de cargar tu archivo Excel.</p>
          </div>
        )}
        <div className="text-xs text-green-600 bg-green-100 p-3 rounded-lg">
          <p className="font-medium">💡 Ventaja:</p>
          <p>
            Al usar la columna CATEGORIA de tu archivo, el dashboard se adapta automáticamente a cualquier estructura de
            categorías que manejes en tu restaurante.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
