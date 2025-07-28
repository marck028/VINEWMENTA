# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al Dashboard de Ventas de Restaurante Menta! Esta guía te ayudará a empezar.

## 🚀 Cómo Contribuir

### Reportar Bugs
1. Verifica que el bug no haya sido reportado antes en [Issues](https://github.com/restaurante-menta/dashboard-ventas/issues)
2. Crea un nuevo issue con:
   - Descripción clara del problema
   - Pasos para reproducir
   - Comportamiento esperado vs actual
   - Screenshots si es relevante
   - Información del navegador/sistema

### Sugerir Mejoras
1. Abre un issue con la etiqueta "enhancement"
2. Describe la funcionalidad propuesta
3. Explica por qué sería útil
4. Proporciona ejemplos de uso si es posible

### Contribuir Código

#### Setup del Entorno
\`\`\`bash
# Fork y clona el repositorio
git clone https://github.com/tu-usuario/dashboard-ventas.git
cd dashboard-ventas

# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev
\`\`\`

#### Proceso de Desarrollo
1. **Crea una rama** para tu feature:
   \`\`\`bash
   git checkout -b feature/nombre-descriptivo
   \`\`\`

2. **Desarrolla tu feature**:
   - Sigue las convenciones de código existentes
   - Agrega comentarios donde sea necesario
   - Mantén los commits pequeños y descriptivos

3. **Prueba tu código**:
   \`\`\`bash
   npm run build
   npm run lint
   \`\`\`

4. **Commit tus cambios**:
   \`\`\`bash
   git add .
   git commit -m "feat: descripción clara del cambio"
   \`\`\`

5. **Push y crea Pull Request**:
   \`\`\`bash
   git push origin feature/nombre-descriptivo
   \`\`\`

#### Convenciones de Commit
Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` nueva funcionalidad
- `fix:` corrección de bug
- `docs:` cambios en documentación
- `style:` cambios de formato (no afectan funcionalidad)
- `refactor:` refactorización de código
- `test:` agregar o modificar tests
- `chore:` tareas de mantenimiento

### Estándares de Código

#### TypeScript
- Usa TypeScript para todos los archivos
- Define interfaces para props y datos
- Evita `any`, usa tipos específicos

#### React
- Usa componentes funcionales con hooks
- Implementa `use client` cuando sea necesario
- Mantén componentes pequeños y reutilizables

#### Styling
- Usa Tailwind CSS para estilos
- Mantén consistencia con la paleta de colores verde
- Asegura responsividad en móvil

#### Estructura de Archivos
\`\`\`
components/
  ├── ui/           # Componentes base (shadcn/ui)
  ├── charts/       # Componentes de gráficos
  ├── filters/      # Componentes de filtros
  └── layout/       # Componentes de layout

app/
  ├── page.tsx      # Página principal
  └── layout.tsx    # Layout base

lib/
  └── utils.ts      # Utilidades compartidas
\`\`\`

## 🎯 Áreas de Contribución

### Prioridad Alta
- [ ] Mejoras en performance de gráficos
- [ ] Nuevos tipos de visualizaciones
- [ ] Optimización para móviles
- [ ] Tests automatizados

### Prioridad Media
- [ ] Nuevas opciones de exportación
- [ ] Temas adicionales
- [ ] Internacionalización
- [ ] Documentación de API

### Prioridad Baja
- [ ] Animaciones mejoradas
- [ ] Shortcuts de teclado
- [ ] Modo offline
- [ ] PWA features

## 📋 Checklist para Pull Requests

Antes de enviar tu PR, verifica:

- [ ] El código compila sin errores (`npm run build`)
- [ ] No hay errores de linting (`npm run lint`)
- [ ] Los cambios son responsivos
- [ ] Se mantiene la paleta de colores
- [ ] La funcionalidad funciona con datos reales
- [ ] Se actualizó la documentación si es necesario
- [ ] Los commits siguen las convenciones
- [ ] El PR tiene una descripción clara

## 🔍 Proceso de Review

1. **Revisión Automática**: GitHub Actions ejecuta tests
2. **Revisión de Código**: Maintainers revisan el código
3. **Testing**: Se prueba la funcionalidad
4. **Merge**: Se integra a la rama principal

## 📞 Contacto

¿Tienes preguntas? Contáctanos:
- Abre un [Discussion](https://github.com/restaurante-menta/dashboard-ventas/discussions)
- Email: dev@restaurante-menta.com

¡Gracias por contribuir! 🌱
