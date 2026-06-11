// Aplicación Principal - CardioHelp

class CardioHelpApp {
    constructor() {
        this.currentView = 'login';
        this.patients = this.loadPatientData();
        this.vitals = this.loadVitalData();
        this.reminders = this.loadReminderData();
        this.labResults = this.loadLabResultData();
        this.init();
    }

    init() {
        if (auth.getCurrentUser()) {
            this.showDashboard();
        } else {
            this.showLogin();
        }
    }

    // ========== LOGIN VIEW ==========
    showLogin() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-container">
                <div class="auth-box">
                    <h1>🏥 CardioHelp</h1>
                    <p style="text-align: center; color: #666; margin-bottom: 1.5rem;">Sistema de Monitoreo Cardiovascular</p>
                    
                    <form id="loginForm">
                        <div class="form-group">
                            <label for="username">Usuario:</label>
                            <input type="text" id="username" placeholder="Ingrese su usuario" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña:</label>
                            <input type="password" id="password" placeholder="Ingrese su contraseña" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                    </form>

                    <div class="demo-accounts">
                        <p><strong>Cuentas Demo Disponibles:</strong></p>
                        <button type="button" onclick="cardioApp.quickLogin('medico1', '123456')">👨‍⚕️ Dr. Rodríguez (Médico)</button>
                        <button type="button" onclick="cardioApp.quickLogin('paciente1', '123456')">👤 Juan Pérez (Paciente)</button>
                        <button type="button" onclick="cardioApp.quickLogin('admin', 'admin123')">🔐 Administrador</button>
                        <button type="button" onclick="cardioApp.quickLogin('asistente', '123456')">👨‍⚕️ Asistente Médico</button>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
    }

    handleLogin(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const result = auth.login(username, password);
        
        if (result.success) {
            this.showDashboard();
        } else {
            alert(result.message);
        }
    }

    quickLogin(username, password) {
        const result = auth.login(username, password);
        if (result.success) {
            this.showDashboard();
        }
    }

    // ========== DASHBOARD ==========
    showDashboard() {
        const user = auth.getCurrentUser();
        const app = document.getElementById('app');
        
        let content = this.getNavbar();
        content += `
            <div class="dashboard-container">
                <div class="sidebar">
                    <ul class="sidebar-menu" id="menu">
        `;

        // Menú según rol
        if (auth.isDoctor()) {
            content += `
                <li><button onclick="cardioApp.showSection('patients')" class="menu-btn active">👥 Mis Pacientes</button></li>
                <li><button onclick="cardioApp.showSection('vitals')" class="menu-btn">📊 Monitoreo</button></li>
                <li><button onclick="cardioApp.showSection('alerts')" class="menu-btn">⚠️ Alertas</button></li>
                <li><button onclick="cardioApp.showSection('lab')" class="menu-btn">🔬 Resultados Lab</button></li>
            `;
        } else if (auth.isPatient()) {
            content += `
                <li><button onclick="cardioApp.showSection('myVitals')" class="menu-btn active">📈 Mis Signos Vitales</button></li>
                <li><button onclick="cardioApp.showSection('registerVitals')" class="menu-btn">➕ Registrar Vitales</button></li>
                <li><button onclick="cardioApp.showSection('records')" class="menu-btn">📋 Mi Expediente</button></li>
                <li><button onclick="cardioApp.showSection('reminders')" class="menu-btn">🔔 Recordatorios</button></li>
                <li><button onclick="cardioApp.showSection('exportData')" class="menu-btn">📄 Exportar Datos</button></li>
            `;
        } else if (auth.isAdmin()) {
            content += `
                <li><button onclick="cardioApp.showSection('users')" class="menu-btn active">👥 Gestión Usuarios</button></li>
                <li><button onclick="cardioApp.showSection('audit')" class="menu-btn">🔍 Auditoría</button></li>
                <li><button onclick="cardioApp.showSection('system')" class="menu-btn">⚙️ Sistema</button></li>
            `;
        } else if (auth.currentUser.role === 'assistant') {
            content += `
                <li><button onclick="cardioApp.showSection('patients')" class="menu-btn active">👥 Pacientes</button></li>
                <li><button onclick="cardioApp.showSection('registerVitals')" class="menu-btn">➕ Registrar Vitales</button></li>
                <li><button onclick="cardioApp.showSection('reminders')" class="menu-btn">🔔 Recordatorios</button></li>
            `;
        }

        content += `
                    </ul>
                </div>
                <div class="main-content">
        `;

        // Contenido según rol
        if (auth.isDoctor()) {
            content += this.getDoctorView();
        } else if (auth.isPatient()) {
            content += this.getPatientView();
        } else if (auth.isAdmin()) {
            content += this.getAdminView();
        } else if (auth.currentUser.role === 'assistant') {
            content += this.getAssistantView();
        }

        content += `
                </div>
            </div>
        `;

        app.innerHTML = content;
    }

    getNavbar() {
        const user = auth.getCurrentUser();
        const roleEmoji = {
            'doctor': '👨‍⚕️',
            'patient': '👤',
            'admin': '🔐',
            'assistant': '👨‍⚕️'
        };

        return `
            <div class="navbar">
                <div class="logo">💓 CardioHelp</div>
                <div class="user-info">
                    <span>${roleEmoji[user.role]} ${user.name}</span>
                    <button onclick="cardioApp.logout()">Cerrar Sesión</button>
                </div>
            </div>
        `;
    }

    // ========== VISTAS POR ROL ==========
    getDoctorView() {
        return `
            <div id="patients" class="section active">
                <h2>👥 Mis Pacientes</h2>
                ${this.getPatientsTable()}
            </div>
            <div id="vitals" class="section">
                <h2>📊 Monitoreo de Vitales</h2>
                ${this.getMonitoringView()}
            </div>
            <div id="alerts" class="section">
                <h2>⚠️ Alertas Críticas</h2>
                ${this.getAlertsView()}
            </div>
            <div id="lab" class="section">
                <h2>🔬 Resultados de Laboratorio</h2>
                ${this.getLabResultsView()}
            </div>
        `;
    }

    getPatientView() {
        const user = auth.getCurrentUser();
        return `
            <div id="myVitals" class="section active">
                <h2>📈 Mis Signos Vitales</h2>
                ${this.getPatientVitalsView()}
            </div>
            <div id="registerVitals" class="section">
                <h2>➕ Registrar Nuevos Vitales</h2>
                ${this.getRegisterVitalsForm()}
            </div>
            <div id="records" class="section">
                <h2>📋 Mi Expediente Médico</h2>
                ${this.getPatientRecords()}
            </div>
            <div id="reminders" class="section">
                <h2>🔔 Mis Recordatorios</h2>
                ${this.getRemindersView()}
            </div>
            <div id="exportData" class="section">
                <h2>📄 Exportar Mis Datos</h2>
                ${this.getExportDataView()}
            </div>
        `;
    }

    getAdminView() {
        return `
            <div id="users" class="section active">
                <h2>👥 Gestión de Usuarios</h2>
                ${this.getUsersManagementView()}
            </div>
            <div id="audit" class="section">
                <h2>🔍 Registro de Auditoría</h2>
                ${this.getAuditView()}
            </div>
            <div id="system" class="section">
                <h2>⚙️ Configuración del Sistema</h2>
                ${this.getSystemView()}
            </div>
        `;
    }

    getAssistantView() {
        return `
            <div id="patients" class="section active">
                <h2>👥 Pacientes</h2>
                ${this.getPatientsTable()}
            </div>
            <div id="registerVitals" class="section">
                <h2>➕ Registrar Vitales</h2>
                ${this.getRegisterVitalsForm()}
            </div>
            <div id="reminders" class="section">
                <h2>🔔 Gestionar Recordatorios</h2>
                ${this.getRemindersView()}
            </div>
        `;
    }

    // ========== TABLAS Y VISTAS ==========
    getPatientsTable() {
        const patients = this.patients.filter(p => p.active);
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Edad</th>
                            <th>Teléfono</th>
                            <th>Estado Riesgo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        patients.forEach(patient => {
            const riskColor = patient.riskLevel === 'Alto' ? 'status-high' : patient.riskLevel === 'Medio' ? 'status-medium' : 'status-low';
            html += `
                <tr>
                    <td>${patient.name}</td>
                    <td>${patient.rut}</td>
                    <td>${patient.age}</td>
                    <td>${patient.phone}</td>
                    <td><span class="card-status ${riskColor}">${patient.riskLevel}</span></td>
                    <td>
                        <button onclick="cardioApp.viewPatientDetails('${patient.id}')" class="btn btn-small btn-primary">Ver</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        return html;
    }

    getMonitoringView() {
        return `
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">Presión Arterial Promedio</div>
                    <div class="card-value">132/85</div>
                    <div class="card-status status-high">Elevada</div>
                </div>
                <div class="card">
                    <div class="card-title">Frecuencia Cardíaca Promedio</div>
                    <div class="card-value">72 bpm</div>
                    <div class="card-status status-low">Normal</div>
                </div>
                <div class="card">
                    <div class="card-title">Pacientes Monitoreados</div>
                    <div class="card-value">8</div>
                    <div class="card-status status-low">Activos</div>
                </div>
                <div class="card">
                    <div class="card-title">Alertas Pendientes</div>
                    <div class="card-value">3</div>
                    <div class="card-status status-high">Urgentes</div>
                </div>
            </div>
            <h3>Gráfico de Presión Arterial (Últimos 7 días)</h3>
            <p style="color: #999; padding: 2rem; text-align: center; background: #f9f9f9; border-radius: 4px;">
                [Gráfico de línea con datos simulados]
            </p>
        `;
    }

    getAlertsView() {
        const alerts = [
            { patient: 'Juan Pérez', date: '2024-06-11 14:30', type: 'Presión Arterial', value: '180/110', severity: 'Alta' },
            { patient: 'Rosa Martínez', date: '2024-06-11 10:15', type: 'Frecuencia Cardíaca', value: '98 bpm', severity: 'Media' },
            { patient: 'Carlos López', date: '2024-06-10 18:45', type: 'Presión Arterial', value: '175/105', severity: 'Alta' }
        ];

        let html = `<div class="table-responsive"><table>
            <thead><tr>
                <th>Paciente</th>
                <th>Fecha</th>
                <th>Tipo de Alerta</th>
                <th>Valor</th>
                <th>Severidad</th>
                <th>Acciones</th>
            </tr></thead>
            <tbody>`;

        alerts.forEach(alert => {
            const statusClass = alert.severity === 'Alta' ? 'status-high' : 'status-medium';
            html += `<tr>
                <td>${alert.patient}</td>
                <td>${alert.date}</td>
                <td>${alert.type}</td>
                <td>${alert.value}</td>
                <td><span class="card-status ${statusClass}">${alert.severity}</span></td>
                <td><button class="btn btn-small btn-primary">Revisar</button></td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        return html;
    }

    getLabResultsView() {
        return `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Tipo de Examen</th>
                            <th>Fecha</th>
                            <th>Resultado</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Juan Pérez López</td>
                            <td>Colesterol Total</td>
                            <td>2024-06-05</td>
                            <td>245 mg/dL</td>
                            <td><span class="card-status status-high">Elevado</span></td>
                        </tr>
                        <tr>
                            <td>Rosa Martínez Díaz</td>
                            <td>Glucosa en Ayunas</td>
                            <td>2024-06-08</td>
                            <td>115 mg/dL</td>
                            <td><span class="card-status status-medium">Límite</span></td>
                        </tr>
                        <tr>
                            <td>Juan Pérez López</td>
                            <td>Triglicéridos</td>
                            <td>2024-06-05</td>
                            <td>180 mg/dL</td>
                            <td><span class="card-status status-medium">Elevado</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    getPatientVitalsView() {
        const user = auth.getCurrentUser();
        const userVitals = this.vitals.filter(v => v.patientId === user.username);
        
        return `
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">Última Presión Arterial</div>
                    <div class="card-value">138/88</div>
                    <div class="card-status status-medium">Elevada</div>
                </div>
                <div class="card">
                    <div class="card-title">Última Frecuencia Cardíaca</div>
                    <div class="card-value">75 bpm</div>
                    <div class="card-status status-low">Normal</div>
                </div>
                <div class="card">
                    <div class="card-title">Peso</div>
                    <div class="card-value">82 kg</div>
                    <div class="card-status status-low">Estable</div>
                </div>
                <div class="card">
                    <div class="card-title">IMC</div>
                    <div class="card-value">29.2</div>
                    <div class="card-status status-medium">Sobrepeso</div>
                </div>
            </div>
            <h3>Histórico de Registros (Últimos 7 días)</h3>
            ${this.getVitalsHistoryTable(userVitals)}
        `;
    }

    getVitalsHistoryTable(vitals) {
        let html = `<div class="table-responsive"><table>
            <thead><tr>
                <th>Fecha</th>
                <th>Presión Sistólica</th>
                <th>Presión Diastólica</th>
                <th>Frecuencia Cardíaca</th>
                <th>Peso</th>
            </tr></thead>
            <tbody>`;

        vitals.forEach(v => {
            html += `<tr>
                <td>${v.date}</td>
                <td>${v.systolic}</td>
                <td>${v.diastolic}</td>
                <td>${v.heartRate} bpm</td>
                <td>${v.weight} kg</td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        return html;
    }

    getRegisterVitalsForm() {
        return `
            <div class="form-section">
                <h3>Registro de Nuevos Vitales</h3>
                <form id="vitalsForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="systolic">Presión Sistólica (mmHg)</label>
                            <input type="number" id="systolic" min="60" max="200" required>
                        </div>
                        <div class="form-group">
                            <label for="diastolic">Presión Diastólica (mmHg)</label>
                            <input type="number" id="diastolic" min="40" max="130" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="heartRate">Frecuencia Cardíaca (bpm)</label>
                            <input type="number" id="heartRate" min="40" max="150" required>
                        </div>
                        <div class="form-group">
                            <label for="weight">Peso (kg)</label>
                            <input type="number" id="weight" min="30" max="200" step="0.1" required>
                        </div>
                    </div>
                    <div class="form-row full">
                        <div class="form-group">
                            <label for="observations">Observaciones</label>
                            <textarea id="observations" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;" rows="3"></textarea>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar Registro</button>
                </form>
            </div>
        `;
    }

    getPatientRecords() {
        const user = auth.getCurrentUser();
        return `
            <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px;">
                <h3>Información Personal</h3>
                <table style="width: 100%; margin-bottom: 1.5rem;">
                    <tr><td style="padding: 0.5rem; font-weight: bold;">Nombre:</td><td style="padding: 0.5rem;">${user.name}</td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: bold;">RUT:</td><td style="padding: 0.5rem;">${user.rut}</td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: bold;">Edad:</td><td style="padding: 0.5rem;">${user.age} años</td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: bold;">Teléfono:</td><td style="padding: 0.5rem;">${user.phone}</td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: bold;">Email:</td><td style="padding: 0.5rem;">${user.email}</td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: bold;">Dirección:</td><td style="padding: 0.5rem;">${user.address}</td></tr>
                </table>

                <h3>Antecedentes Médicos</h3>
                <ul style="margin-left: 1.5rem;">
                    ${user.medicalHistory.map(h => `<li>${h}</li>`).join('')}
                </ul>

                <h3>Medicamentos Actuales</h3>
                <ul style="margin-left: 1.5rem;">
                    ${user.currentMedications.map(m => `<li>${m}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    getRemindersView() {
        const user = auth.getCurrentUser();
        const userReminders = this.reminders.filter(r => r.userId === user.username);
        
        let html = `
            <div class="form-section">
                <h3>Crear Nuevo Recordatorio</h3>
                <form id="reminderForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="reminderType">Tipo de Recordatorio</label>
                            <select id="reminderType" required>
                                <option value="">Seleccionar...</option>
                                <option value="medication">Tomar Medicamento</option>
                                <option value="checkup">Revisión Médica</option>
                                <option value="measurement">Medir Vitales</option>
                                <option value="lab">Examen de Laboratorio</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="reminderDate">Fecha</label>
                            <input type="date" id="reminderDate" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="reminderTime">Hora</label>
                            <input type="time" id="reminderTime" required>
                        </div>
                        <div class="form-group">
                            <label for="reminderFrequency">Frecuencia</label>
                            <select id="reminderFrequency" required>
                                <option value="once">Una sola vez</option>
                                <option value="daily">Diariamente</option>
                                <option value="weekly">Semanalmente</option>
                                <option value="monthly">Mensualmente</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-row full">
                        <div class="form-group">
                            <label for="reminderDescription">Descripción</label>
                            <textarea id="reminderDescription" style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px;" rows="2"></textarea>
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary">Crear Recordatorio</button>
                </form>
            </div>

            <h3 style="margin-top: 2rem;">Mis Recordatorios</h3>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Fecha y Hora</th>
                            <th>Frecuencia</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        userReminders.forEach(reminder => {
            const statusClass = reminder.completed ? 'status-low' : 'status-medium';
            const status = reminder.completed ? 'Completado' : 'Pendiente';
            html += `
                <tr>
                    <td>${reminder.type}</td>
                    <td>${reminder.description}</td>
                    <td>${reminder.date} ${reminder.time}</td>
                    <td>${reminder.frequency}</td>
                    <td><span class="card-status ${statusClass}">${status}</span></td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        return html;
    }

    getExportDataView() {
        const user = auth.getCurrentUser();
        return `
            <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px;">
                <h3>Exportar mis Datos Médicos</h3>
                <p>Selecciona el formato y rango de fechas para exportar tus datos:</p>
                
                <div class="form-section" style="background: white; margin-top: 1rem;">
                    <form id="exportForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="exportFormat">Formato de Exportación</label>
                                <select id="exportFormat" required>
                                    <option value="pdf">PDF (Documento)</option>
                                    <option value="csv">CSV (Excel)</option>
                                    <option value="json">JSON (Datos)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="exportType">Tipo de Datos</label>
                                <select id="exportType" required>
                                    <option value="all">Todos los datos</option>
                                    <option value="vitals">Solo Vitales</option>
                                    <option value="lab">Solo Resultados Lab</option>
                                    <option value="records">Solo Expediente</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="dateFrom">Desde</label>
                                <input type="date" id="dateFrom" required>
                            </div>
                            <div class="form-group">
                                <label for="dateTo">Hasta</label>
                                <input type="date" id="dateTo" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Generar Exportación</button>
                    </form>
                </div>

                <div style="margin-top: 2rem; padding: 1rem; background: #d1ecf1; border-radius: 4px; border: 1px solid #bee5eb;">
                    <strong>ℹ️ Información:</strong>
                    <p>Tus datos se exportarán de forma segura y encriptada. Puedes compartir este archivo con otros profesionales médicos.</p>
                </div>
            </div>
        `;
    }

    getUsersManagementView() {
        const users = auth.getAllUsers();
        let html = `
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Nombre</th>
                            <th>Rol</th>
                            <th>Email</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        users.forEach(user => {
            const roleEmoji = {
                'doctor': '👨‍⚕️',
                'patient': '👤',
                'admin': '🔐',
                'assistant': '👨‍⚕️'
            };
            html += `
                <tr>
                    <td>${user.username}</td>
                    <td>${user.name}</td>
                    <td>${roleEmoji[user.role]} ${user.role}</td>
                    <td>${user.email}</td>
                    <td><span class="card-status status-low">Activo</span></td>
                    <td>
                        <button class="btn btn-small btn-primary">Editar</button>
                        <button class="btn btn-small btn-danger">Desactivar</button>
                    </td>
                </tr>
            `;
        });

        html += `
                    </tbody>
                </table>
            </div>
        `;
        return html;
    }

    getAuditView() {
        const auditLogs = [
            { user: 'medico1', action: 'Ver expediente', patient: 'Juan Pérez', date: '2024-06-11 14:30', status: 'Éxito' },
            { user: 'paciente1', action: 'Registrar vitales', patient: 'N/A', date: '2024-06-11 10:15', status: 'Éxito' },
            { user: 'admin', action: 'Crear usuario', patient: 'N/A', date: '2024-06-10 18:45', status: 'Éxito' },
            { user: 'paciente2', action: 'Exportar datos', patient: 'N/A', date: '2024-06-10 16:20', status: 'Éxito' },
            { user: 'medico2', action: 'Generar alerta', patient: 'Rosa Martínez', date: '2024-06-10 14:00', status: 'Éxito' }
        ];

        let html = `<div class="table-responsive"><table>
            <thead><tr>
                <th>Usuario</th>
                <th>Acción</th>
                <th>Paciente Afectado</th>
                <th>Fecha y Hora</th>
                <th>Estado</th>
            </tr></thead>
            <tbody>`;

        auditLogs.forEach(log => {
            html += `<tr>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.patient}</td>
                <td>${log.date}</td>
                <td><span class="card-status status-low">${log.status}</span></td>
            </tr>`;
        });

        html += `</tbody></table></div>`;
        return html;
    }

    getSystemView() {
        return `
            <div class="cards-grid">
                <div class="card">
                    <div class="card-title">Usuarios Activos</div>
                    <div class="card-value">12</div>
                </div>
                <div class="card">
                    <div class="card-title">Registros de Vitales</div>
                    <div class="card-value">1,245</div>
                </div>
                <div class="card">
                    <div class="card-title">Alertas Generadas</div>
                    <div class="card-value">48</div>
                </div>
                <div class="card">
                    <div class="card-title">Uptime del Sistema</div>
                    <div class="card-value">99.9%</div>
                </div>
            </div>

            <div class="form-section" style="margin-top: 2rem;">
                <h3>Configuración del Sistema</h3>
                <form>
                    <div class="form-group">
                        <label for="backupFreq">Frecuencia de Respaldos</label>
                        <select id="backupFreq">
                            <option value="daily">Diariamente</option>
                            <option value="weekly">Semanalmente</option>
                            <option value="monthly">Mensualmente</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="alertTimeout">Timeout de Alertas (minutos)</label>
                        <input type="number" id="alertTimeout" value="30" min="1" max="1440">
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Notificaciones por Email
                        </label>
                    </div>
                    <div class="form-group">
                        <label>
                            <input type="checkbox" checked> Registros de Auditoría
                        </label>
                    </div>
                    <button type="button" class="btn btn-primary">Guardar Configuración</button>
                </form>
            </div>
        `;
    }

    // ========== FUNCIONES AUXILIARES ==========
    showSection(sectionId) {
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');
    }

    viewPatientDetails(patientId) {
        alert('Vista detallada del paciente: ' + patientId);
    }

    logout() {
        auth.logout();
        this.init();
    }

    // ========== DATA LOADING ==========
    loadPatientData() {
        return [
            { id: 'p001', name: 'Juan Pérez López', rut: '12.345.678-9', age: 58, phone: '+56912345678', riskLevel: 'Alto', active: true },
            { id: 'p002', name: 'Rosa Martínez Díaz', rut: '11.234.567-8', age: 65, phone: '+56987654321', riskLevel: 'Alto', active: true },
            { id: 'p003', name: 'Carlos López García', rut: '10.123.456-7', age: 52, phone: '+56945678901', riskLevel: 'Medio', active: true },
            { id: 'p004', name: 'Ana Rodríguez Silva', rut: '13.456.789-0', age: 48, phone: '+56932109876', riskLevel: 'Bajo', active: true }
        ];
    }

    loadVitalData() {
        return [
            { patientId: 'paciente1', date: '2024-06-11', systolic: 138, diastolic: 88, heartRate: 75, weight: 82 },
            { patientId: 'paciente1', date: '2024-06-10', systolic: 142, diastolic: 90, heartRate: 78, weight: 82.2 },
            { patientId: 'paciente1', date: '2024-06-09', systolic: 135, diastolic: 85, heartRate: 72, weight: 81.8 },
            { patientId: 'paciente2', date: '2024-06-11', systolic: 145, diastolic: 92, heartRate: 82, weight: 68 },
            { patientId: 'paciente2', date: '2024-06-10', systolic: 148, diastolic: 95, heartRate: 85, weight: 68.1 }
        ];
    }

    loadReminderData() {
        return [
            { userId: 'paciente1', type: 'medication', description: 'Tomar Lisinopril', date: '2024-06-12', time: '08:00', frequency: 'daily', completed: false },
            { userId: 'paciente1', type: 'checkup', description: 'Cita con Dr. Rodríguez', date: '2024-06-15', time: '10:00', frequency: 'once', completed: false },
            { userId: 'paciente1', type: 'measurement', description: 'Medir presión arterial', date: '2024-06-12', time: '18:00', frequency: 'daily', completed: true },
            { userId: 'paciente2', type: 'medication', description: 'Tomar Furosemida', date: '2024-06-12', time: '09:00', frequency: 'daily', completed: false },
            { userId: 'paciente2', type: 'lab', description: 'Examen de sangre', date: '2024-06-20', time: '08:30', frequency: 'once', completed: false }
        ];
    }

    loadLabResultData() {
        return [
            { patientId: 'p001', test: 'Colesterol Total', date: '2024-06-05', result: '245 mg/dL', status: 'Elevado' },
            { patientId: 'p002', test: 'Glucosa en Ayunas', date: '2024-06-08', result: '115 mg/dL', status: 'Límite' },
            { patientId: 'p001', test: 'Triglicéridos', date: '2024-06-05', result: '180 mg/dL', status: 'Elevado' }
        ];
    }
}

const cardioApp = new CardioHelpApp();
