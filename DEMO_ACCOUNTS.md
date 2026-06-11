# 🔐 Cuentas de Prueba - CardioHelp

## Descripción
Este documento contiene todas las cuentas de demostración disponibles para probar la aplicación CardioHelp con diferentes roles y permisos.

---

## 👨‍⚕️ Cuentas de Médicos

### Médico 1 - Especialista en Cardiología
```
Usuario:        medico1
Contraseña:     123456
Nombre:         Dr. Carlos Rodríguez
Email:          carlos.rodriguez@cardiohelp.com
Especialidad:   Cardiología
Licencia:       CMF-001234
Departamento:   Cardiología
```

**Permisos:**
- ✅ Ver lista de pacientes
- ✅ Visualizar signos vitales
- ✅ Editar registros médicos
- ✅ Generar alertas
- ✅ Ver resultados de laboratorio

---

### Médico 2 - Especialista en Medicina Interna
```
Usuario:        medico2
Contraseña:     password123
Nombre:         Dra. María García
Email:          maria.garcia@cardiohelp.com
Especialidad:   Medicina Interna
Licencia:       CMF-005678
Departamento:   Medicina Interna
```

**Permisos:**
- ✅ Ver lista de pacientes
- ✅ Visualizar signos vitales
- ✅ Ver registros médicos
- ✅ Ver resultados de laboratorio

---

## 👤 Cuentas de Pacientes

### Paciente 1 - Juan Pérez López
```
Usuario:        paciente1
Contraseña:     123456
Nombre:         Juan Pérez López
Email:          juan.perez@email.com
RUT:            12.345.678-9
Edad:           58 años
Teléfono:       +56912345678
Dirección:      Calle Principal 123, Santiago
```

**Antecedentes Médicos:**
- Hipertensión
- Diabetes tipo 2

**Medicamentos Actuales:**
- Lisinopril
- Metformina

**Permisos:**
- ✅ Ver sus propios signos vitales
- ✅ Registrar nuevos vitales
- ✅ Ver su expediente médico
- ✅ Exportar sus datos
- ✅ Crear recordatorios

---

### Paciente 2 - Rosa Martínez Díaz
```
Usuario:        paciente2
Contraseña:     secure456
Nombre:         Rosa Martínez Díaz
Email:          rosa.martinez@email.com
RUT:            11.234.567-8
Edad:           65 años
Teléfono:       +56987654321
Dirección:      Avenida Secundaria 456, Valparaíso
```

**Antecedentes Médicos:**
- Insuficiencia Cardíaca
- Hipertensión
- Colesterol elevado

**Medicamentos Actuales:**
- Furosemida
- Bisoprolol
- Atorvastatina

**Permisos:**
- ✅ Ver sus propios signos vitales
- ✅ Registrar nuevos vitales
- ✅ Ver su expediente médico
- ✅ Exportar sus datos
- ✅ Crear recordatorios

---

## 🔐 Cuenta de Administrador

```
Usuario:        admin
Contraseña:     admin123
Nombre:         Administrador Sistema
Email:          admin@cardiohelp.com
Departamento:   TI
```

**Permisos:**
- ✅ Gestionar usuarios
- ✅ Ver todos los datos
- ✅ Revisar logs de auditoría
- ✅ Configurar el sistema
- ✅ Gestionar pacientes
- ✅ Gestionar médicos

---

## 👨‍⚕️ Cuenta de Asistente Médico

```
Usuario:        asistente
Contraseña:     123456
Nombre:         Jorge Rodríguez López
Email:          jorge.rodriguez@cardiohelp.com
Departamento:   Enfermería
```

**Permisos:**
- ✅ Registrar vitales de pacientes
- ✅ Ver lista de pacientes
- ✅ Ingresar resultados de laboratorio
- ✅ Gestionar recordatorios

---

## 📊 Tabla Resumen de Cuentas

| Usuario | Contraseña | Rol | Nombre | Email |
|---------|-----------|-----|--------|-------|
| medico1 | 123456 | 👨‍⚕️ Médico | Dr. Carlos Rodríguez | carlos.rodriguez@cardiohelp.com |
| medico2 | password123 | 👨‍⚕️ Médico | Dra. María García | maria.garcia@cardiohelp.com |
| paciente1 | 123456 | 👤 Paciente | Juan Pérez López | juan.perez@email.com |
| paciente2 | secure456 | 👤 Paciente | Rosa Martínez Díaz | rosa.martinez@email.com |
| admin | admin123 | 🔐 Admin | Administrador | admin@cardiohelp.com |
| asistente | 123456 | 👨‍⚕️ Asistente | Jorge Rodríguez López | jorge.rodriguez@cardiohelp.com |

---

## 🚀 Cómo Probar

1. Abre `index.html` en tu navegador
2. Selecciona cualquiera de las cuentas anteriores
3. Ingresa el usuario y contraseña
4. Explora las funcionalidades disponibles según el rol

---

## 📋 Datos de Prueba Disponibles

### Pacientes en el Sistema
- Juan Pérez López (Riesgo: ALTO)
- Rosa Martínez Díaz (Riesgo: ALTO)
- Carlos López García (Riesgo: MEDIO)
- Ana Rodríguez Silva (Riesgo: BAJO)

### Signos Vitales Simulados
```
Última Presión Arterial:     138/88 mmHg
Última Frecuencia Cardíaca:  75 bpm
Peso:                        82 kg
IMC:                         29.2
```

### Resultados de Laboratorio
- Colesterol Total: 245 mg/dL (ELEVADO)
- Glucosa en Ayunas: 115 mg/dL (LÍMITE)
- Triglicéridos: 180 mg/dL (ELEVADO)

### Recordatorios Configurados
- Tomar Lisinopril (Diariamente a las 08:00)
- Cita con Dr. Rodríguez (15/06/2024 a las 10:00)
- Medir presión arterial (Diariamente a las 18:00)
- Tomar Furosemida (Diariamente a las 09:00)
- Examen de sangre (20/06/2024 a las 08:30)

---

## 🔄 Flujos de Prueba Recomendados

### Como Médico
1. Inicia sesión con `medico1`/`123456`
2. Ve a "Mis Pacientes" para ver la lista
3. Visualiza en "Monitoreo" los signos vitales promedio
4. Revisa "Alertas" para ver valores críticos
5. Consulta "Resultados Lab" para exámenes

### Como Paciente
1. Inicia sesión con `paciente1`/`123456`
2. Ve a "Mis Signos Vitales" para ver historial
3. Registra nuevos vitales en "Registrar Vitales"
4. Revisa tu "Expediente Médico"
5. Configura recordatorios en "Recordatorios"
6. Exporta tus datos en "Exportar Datos"

### Como Administrador
1. Inicia sesión con `admin`/`admin123`
2. Accede a "Gestión Usuarios" para ver todos
3. Revisa "Auditoría" para ver actividades
4. Configura parámetros en "Sistema"

### Como Asistente
1. Inicia sesión con `asistente`/`123456`
2. Ve "Pacientes" para ver la lista
3. Registra vitales en "Registrar Vitales"
4. Gestiona recordatorios en "Recordatorios"

---

## 🔒 Notas de Seguridad

- ⚠️ **IMPORTANTE**: Estas son cuentas de demostración. No usar en producción.
- 🔐 Las contraseñas son simples para facilitar la demostración
- 💾 Los datos se guardan en localStorage del navegador
- 🔑 El sistema implementa control de acceso basado en roles (RBAC)
- 📋 Todos los accesos se registran en el sistema de auditoría

---

## 📝 Modificar Cuentas

Para agregar o modificar cuentas, edita el archivo `auth.js` en la sección `demoUsers`:

```javascript
'username': {
    password: 'contraseña',
    role: 'doctor|patient|admin|assistant',
    name: 'Nombre Completo',
    email: 'email@example.com',
    permissions: ['permission1', 'permission2'],
    // ... más propiedades según el rol
}
```

---

## 📞 Soporte

Para problemas o dudas sobre las cuentas de demostración, contactar al equipo de desarrollo:
- Francisco Javier Angel
- Maximiliano Duarte
- Constanza Venegas

---

**Versión**: 2.8  
**Fecha**: 09/06/2026  
**Proyecto**: CardioHelp - Sistema de Monitoreo Cardiovascular
