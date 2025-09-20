# Panel de Administrador - Documentación

## Características Implementadas

### 🎯 Funciones del Panel de Administrador

El panel de administrador proporciona control completo sobre la sesión colaborativa:

#### 1. **Gestión de Usuarios Conectados**
- **Ver usuarios online**: Lista todos los usuarios conectados con sus roles
- **Expulsar usuarios**: Botón 🚪 para desconectar usuarios específicos
- **Gestión de permisos de edición**: 
  - ✏️ = Otorgar permisos de edición
  - 🚫 = Revocar permisos de edición
- **Indicadores visuales**:
  - 👑 = Administrador
  - 👤 = Usuario regular  
  - ✏️ badge = Tiene permisos de edición

#### 2. **Controles de Sesión**
- **Bloquear Chat**: Impide que los usuarios envíen mensajes
- **Bloquear Post-its**: Deshabilita la creación/edición de notas adhesivas
- **Bloquear Edición General**: Impide editar el diagrama de flujo

#### 3. **Estado de la Sesión**
Indicadores visuales en tiempo real:
- 🔒 = Función bloqueada
- 💬 📝 ✏️ = Funciones activas

#### 4. **Zona Peligrosa**
- **Cerrar Sesión para Todos**: Expulsa a todos los usuarios no-administradores

### 🔐 Control de Acceso

- Solo usuarios con rol `admin` pueden ver y usar el panel
- El botón "👑 Admin" solo aparece para administradores
- Todas las acciones administrativas incluyen confirmación

### 💻 Uso

1. **Abrir el Panel**: Clic en "👑 Admin" (esquina superior izquierda)
2. **Gestionar Usuarios**: Use los botones ✏️/🚫 y 🚪 junto a cada usuario
3. **Controlar Sesión**: Active/desactive las casillas de verificación
4. **Cerrar Sesión**: Use el botón en "Zona Peligrosa" (requiere confirmación)

### 🎨 Diseño

- **Responsive**: Se adapta a dispositivos móviles
- **Visual**: Iconos intuitivos y códigos de color
- **Accesible**: Tooltips y confirmaciones claras
- **Integrado**: Usa el framework CSS existente de la aplicación

### 🔧 Implementación Técnica

- **Context API**: Gestión de estado centralizada
- **Firebase Integration**: Sincronización en tiempo real
- **Demo Mode**: Versión de demostración sin conexión Firebase
- **Error Handling**: Manejo robusto de errores de conectividad