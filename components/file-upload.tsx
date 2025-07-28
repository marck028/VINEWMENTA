"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react"
import { useDataContext } from "./data-context"

interface FileUploadProps {
  onFileUpload: (success: boolean) => void
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  const { processFile, loading, error } = useDataContext()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith(".xlsx")) {
      handleFileProcess(file)
    } else if (file) {
      alert("Por favor selecciona un archivo .xlsx (Excel)")
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    const file = event.dataTransfer.files[0]
    if (file && file.name.endsWith(".xlsx")) {
      handleFileProcess(file)
    } else if (file) {
      alert("Por favor arrastra un archivo .xlsx (Excel)")
    }
  }

  const handleFileProcess = async (file: File) => {
    setUploading(true)
    console.log("🚀 UPLOAD - Iniciando procesamiento del archivo:", file.name)
    const success = await processFile(file)
    console.log("📋 UPLOAD - Resultado del procesamiento:", success)
    setUploading(false)
    onFileUpload(success)
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? "border-green-500 bg-green-50" : "border-green-300 hover:border-green-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="space-y-2">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto animate-spin" />
            <p className="text-green-700 font-medium">Procesando archivo...</p>
            <p className="text-xs text-green-600">Analizando columnas y datos...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <FileSpreadsheet className="w-12 h-12 text-green-600 mx-auto" />
            <div>
              <p className="text-lg font-medium text-green-800">Sube tu archivo de ventas</p>
              <p className="text-sm text-green-600 mt-1">Formato .xlsx con las columnas requeridas</p>
            </div>
            <Input type="file" accept=".xlsx" onChange={handleFileChange} className="hidden" id="file-upload" />
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Seleccionar archivo
              </label>
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 font-medium text-sm">Error al procesar archivo</p>
                <pre className="text-red-700 text-xs mt-2 whitespace-pre-wrap font-mono bg-red-100 p-2 rounded">
                  {error}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-xs text-green-600 space-y-2">
        <div className="bg-green-100 p-3 rounded text-green-700">
          <p className="font-medium">📊 Estructura de Datos Esperada:</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div>
              <strong>MONTH:</strong> 1, 2, 3... (números)
            </div>
            <div>
              <strong>L a D:</strong> 1, 2, 3... (números)
            </div>
            <div>1=Enero, 2=Febrero, etc.</div>
            <div>1=Lunes, 2=Martes, etc.</div>
          </div>
          <p className="text-xs mt-2">💡 El sistema convierte automáticamente los números a nombres</p>
        </div>
        <div className="bg-blue-100 p-2 rounded text-blue-700">
          <p className="font-medium">🔍 Debug: Abre la consola (F12)</p>
          <p className="text-xs">Verás logs detallados del procesamiento de meses y días</p>
        </div>
      </div>
    </div>
  )
}
