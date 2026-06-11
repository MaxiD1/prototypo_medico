# 💓 CardioHelp - Sistema de Monitoreo Cardiovascular

## Descripción

CardioHelp es una aplicación web para el monitoreo de salud cardiovascular que permite a médicos, pacientes y administrativos gestionar información médica de forma segura y eficiente.

## Características Principales

### Para Médicos 👨‍⚕️
- Visualizar lista de pacientes asignados
- Monitorear signos vitales en tiempo real
- Generar alertas ante valores críticos
- Revisar resultados de laboratorio
- Acceder al expediente médico completo del paciente

### Para Pacientes 👤
- Registrar propios signos vitales
- Visualizar histórico de mediciones
- Ver su expediente médico
- Crear y gestionar recordatorios
- Exportar datos en PDF, CSV o JSON

### Para Administrador 🔐
- Gestionar usuarios del sistema
- Revisar logs de auditoría
- Configurar parámetros del sistema
- Monitorear uso de recursos

### Para Asistentes Médicos 👨‍⚕️
- Registrar vitales de pacientes
- Gestionar recordatorios
- Ver lista de pacientes

## Cuentas de Prueba Disponibles

### Médico
- **Usuario**: medico1
- **Contraseña**: 123456
- **Nombre**: Dr. Carlos Rodríguez
- **Especialidad**: Cardiología

### Médico 2
- **Usuario**: medico2
- **Contraseña**: password123
- **Nombre**: Dra. María García
- **Especialidad**: Medicina Interna

### Paciente 1
- **Usuario**: paciente1
- **Contraseña**: 123456
- **Nombre**: Juan Pérez López
- **RUT**: 12.345.678-9

### Paciente 2
- **Usuario**: paciente2
- **Contraseña**: secure456
- **Nombre**: Rosa Martínez Díaz
- **RUT**: 11.234.567-8

### Administrador
- **Usuario**: admin
- **Contraseña**: admin123

### Asistente Médico
- **Usuario**: asistente
- **Contraseña**: 123456
- **Nombre**: Jorge Rodríguez López

## Funcionalidades Implementadas (Basadas en Scrum)

### Sprint 3 ✅
- HU-01: Registrar/Visualizar presión arterial
- HU-02: Registrar/Visualizar frecuencia cardíaca
- HU-03: Visualizar último registro
- HU-08: Crear recordatorios

### Sprint 4 ✅
- HU-04: Historial clínico
- HU-09: Visualizar recordatorios
- HU-10: Agregar información a ficha médica
- HU-11: Visualizar ficha médica

### Sprint 5 ✅
- HU-05: Generar gráficos de presión
- HU-06: Mostrar estado de riesgo
- HU-12: Mostrar datos de laboratorio
- HU-15: Simulación de costos médicos

### Sprint 6 ✅
- HU-07: Generar alertas por valores altos
- HU-13: Exportación de datos
- HU-14: Seguridad y trazabilidad de datos

## Requisitos de Seguridad (Definition of Done)

- ✅ DH-01: El código debe aprobar todas las pruebas de función
- ✅ DH-02: No debe presentar errores que comprometan la UX
- ✅ DH-03: No debe presentar vulnerabilidades de seguridad
- ✅ DH-04: La aplicación debe ser fácil de entender y usar
- ✅ DH-05: La aplicación no debe tardar más de 2 segundos al cargar

## Permisos por Rol

### Médico
- `view_patients`: Ver lista de pacientes
- `view_vitals`: Ver signos vitales
- `edit_records`: Editar registros médicos
- `generate_alerts`: Generar alertas
- `view_lab_results`: Ver resultados de laboratorio

### Paciente
- `view_own_vitals`: Ver sus propios vitales
- `register_vitals`: Registrar nuevos vitales
- `view_own_records`: Ver su expediente
- `export_data`: Exportar sus datos
- `set_reminders`: Crear recordatorios

### Administrador
- `manage_users`: Gestionar usuarios
- `view_all_data`: Ver todos los datos
- `audit_logs`: Revisar logs de auditoría
- `system_config`: Configurar el sistema

### Asistente
- `register_vitals`: Registrar vitales
- `view_patients`: Ver pacientes
- `input_lab_results`: Ingresar resultados de lab
- `manage_reminders`: Gestionar recordatorios

## Estructura de Archivos

```
cardiohelp/
├── index.html          # HTML principal
├── styles.css          # Estilos CSS
├── auth.js             # Sistema de autenticación
├── app.js              # Lógica principal de la app
└── README.md           # Este archivo
```

## Cómo Usar

1. Abre `index.html` en tu navegador
2. Selecciona una cuenta de prueba o ingresa credenciales
3. Explora las diferentes funcionalidades según tu rol
4. Los datos se guardan localmente en localStorage

## Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript (Vanilla)
- localStorage para persistencia de datos

## Notas de Implementación

- La aplicación utiliza datos simulados para demostración
- Los datos se persisten en localStorage del navegador
- Las gráficas están representadas como placeholders (se pueden integrar librerías como Chart.js)
- La exportación de PDF/CSV necesitaría librerías adicionales en producción

## Próximas Mejoras

- Integración con base de datos backend
- Notificaciones en tiempo real con WebSockets
- Integración de gráficas dinámicas con Chart.js
- API REST para integración con sistemas externos
- Autenticación con JWT
- Encriptación de datos sensibles

## Información Legal

Esta es una aplicación de demostración basada en el documento Scrum del proyecto CardioHelp para la materia de Ingeniería de Software.

---

**Versión**: 2.8  
**Fecha**: 09/06/2026  
**Integrantes**: Francisco Javier Angel, Maximiliano Duarte, Constanza Venegas
