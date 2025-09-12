# flowchart-colaborativo

Aplicación colaborativa para creación de diagramas de flujo empresariales con gestión de usuarios, borradores y biblioteca de procesos aprobados.

## 🚀 Nuevas Funcionalidades Implementadas

### Características Principales
- **Colaboración Limitada**: Máximo 10 usuarios simultáneos
- **Sistema de Roles**: Usuarios y Administradores con permisos diferenciados
- **Gestión de Borradores**: Un borrador por usuario con tracking de modificaciones
- **Biblioteca de Procesos**: Sistema de aprobación para procesos oficiales
- **Exportación PDF**: Generación de documentos print-friendly
- **Integración Google Sheets**: Almacenamiento de procesos aprobados (configurado)

### Funcionalidades por Rol

#### 👤 Usuario Regular
- Crear y editar borradores personales
- Exportar procesos a PDF
- Acceder a biblioteca de procesos aprobados
- Controles de zoom y herramientas de diagramación

#### 👑 Administrador
- Vista completa de todos los borradores
- Aprobación de procesos para biblioteca
- Gestión de borradores de otros usuarios
- Guardado automático en Google Sheets

## 🎯 Cómo Usar

1. **Identificación**: Al cargar, ingresa tu nombre y selecciona tu rol
2. **Crear Proceso**: Usa "➕ Nuevo Proceso" o carga uno existente
3. **Diseñar**: Arrastra elementos de la paleta al canvas
4. **Guardar**: "💾 Guardar Borrador" para tu trabajo personal
5. **Exportar**: "📄 Exportar PDF" para documentación
6. **Biblioteca**: "📚 Biblioteca" para gestionar procesos

## 📋 Flujo de Trabajo

### Para Usuarios
1. Identificación → Crear/Editar → Guardar Borrador → Exportar PDF

### Para Administradores  
1. Identificación → Revisar Todos los Borradores → Aprobar → Biblioteca Actualizada

## 🔧 Configuración

### Producción
Para uso en producción, configurar en `index.html`:

```javascript
// Google Sheets API (líneas 1234-1250)
const SPREADSHEET_ID = 'tu-google-sheet-id';
// Descomentar código de API en saveToGoogleSheets()
```

### Límites
- Usuarios simultáneos: 10 (configurable en `window.maxUsers`)
- Borradores por usuario: 1 por proceso
- Firebase para colaboración en tiempo real

## 📚 Documentación Completa

Ver `FEATURES.md` para documentación técnica detallada de todas las funcionalidades implementadas.

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Firebase (Firestore + Auth)
- **Almacenamiento**: Google Sheets API (biblioteca)
- **Colaboración**: Firebase Realtime
- **Exportación**: HTML2Canvas + jsPDF (fallback a print)
