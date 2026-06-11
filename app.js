// ============= DATA MANAGEMENT =============
const users = [
    { id: 1, username: 'doctor1', password: '1234', role: 'medico', name: 'Dr. Carlos García' },
    { id: 2, username: 'patient1', password: '1234', role: 'paciente', name: 'Juan Pérez' },
    { id: 3, username: 'admin', password: '1234', role: 'admin', name: 'Admin Sistema' },
    { id: 4, username: 'patient2', password: '1234', role: 'paciente', name: 'María López' },
    { id: 5, username: 'doctor2', password: '1234', role: 'medico', name: 'Dra. Ana Martínez' }
];

const patients = [
    {
        id: 1,
        name: 'Juan Pérez',
        age: 58,
        gender: 'Masculino',
        email: 'juan@email.com',
        phone: '555-1234',
        medicalHistory: 'Hipertensión, Colesterol Alto',
        currentMedications: ['Lisinopril 10mg', 'Atorvastatina 20mg'],
        doctorId: 1
    },
    {
        id: 2,
        name: 'María López',
        age: 45,
        gender: 'Femenino',
        email: 'maria@email.com',
        phone: '555-5678',
        medicalHistory: 'Diabetes tipo 2',
        currentMedications: ['Metformina 500mg'],
        doctorId: 1
    },
    {
        id: 3,
        name: 'Roberto Sánchez',
        age: 62,
        gender: 'Masculino',
        email: 'roberto@email.com',
        phone: '555-9012',
        medicalHistory: 'Insuficiencia cardíaca, Arritmia',
        currentMedications: ['Digoxina', 'Furosemida'],
        doctorId: 1
    }
];

// Generate realistic medical data for 7 days
function generateMedicalData() {
    const data = {};
    const today = new Date();
    
    patients.forEach(patient => {
        data[patient.id] = {
            bloodPressure: [],
            heartRate: [],
            weight: [],
            alerts: []
        };
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Simulate daily readings (3 per day)
            for (let j = 0; j < 3; j++) {
                const hour = 6 + (j * 8) + Math.floor(Math.random() * 2);
                const timeStr = `${String(hour).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
                
                // Blood Pressure data
                const systolic = 110 + Math.floor(Math.random() * 40) - 10;
                const diastolic = 70 + Math.floor(Math.random() * 25) - 8;
                data[patient.id].bloodPressure.push({
                    date: dateStr,
                    time: timeStr,
                    systolic,
                    diastolic,
                    timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, Math.floor(Math.random() * 60)).getTime()
                });
                
                // Heart Rate data
                const heartRate = 60 + Math.floor(Math.random() * 50) - 10;
                data[patient.id].heartRate.push({
                    date: dateStr,
                    time: timeStr,
                    value: heartRate,
                    timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, Math.floor(Math.random() * 60)).getTime()
                });
                
                // Weight data (only once per day)
                if (j === 0) {
                    const weight = 75 + (Math.random() * 10) - 5;
                    data[patient.id].weight.push({
                        date: dateStr,
                        time: '08:00',
                        value: weight.toFixed(2),
                        timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0).getTime()
                    });
                }
            }
        }
    });
    
    return data;
}

let medicalData = generateMedicalData();

// Current logged-in user
let currentUser = null;
let reminders = [];
let auditLog = [];

function logAudit(action, details) {
    auditLog.push({
        timestamp: new Date().toLocaleString(),
        user: currentUser ? currentUser.username : 'Unknown',
        action,
        details
    });
}

// ============= AUTHENTICATION =============
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = user;
        logAudit('LOGIN', `User ${username} logged in`);
        document.getElementById('loginError').style.display = 'none';
        switchToApp();
    } else {
        const errorDiv = document.getElementById('loginError');
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
        errorDiv.style.display = 'block';
    }
}

function logout() {
    logAudit('LOGOUT', `User ${currentUser.username} logged out`);
    currentUser = null;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    switchToLogin();
}

function switchToApp() {
    document.getElementById('loginScreen').classList.remove('active');
    document.getElementById('dashboard').classList.add('active');
    
    // Setup user greeting and menu visibility
    document.getElementById('userGreeting').textContent = `Bienvenido, ${currentUser.name} (${currentUser.role})`;
    
    // Show/hide menu sections based on role
    document.getElementById('menuMedico').style.display = currentUser.role === 'medico' ? 'block' : 'none';
    document.getElementById('menuPaciente').style.display = currentUser.role === 'paciente' ? 'block' : 'none';
    document.getElementById('menuAdmin').style.display = currentUser.role === 'admin' ? 'block' : 'none';
    
    // Set default view based on role
    if (currentUser.role === 'medico') {
        switchView('pacientes');
        loadPatients();
    } else if (currentUser.role === 'paciente') {
        switchView('misDatos');
        loadPatientData();
    } else if (currentUser.role === 'admin') {
        switchView('usuarios');
        loadUsers();
    }
}

function switchToLogin() {
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('loginScreen').classList.add('active');
}

function switchView(viewName) {
    // Hide all views
    const views = document.querySelectorAll('.view');
    views.forEach(view => view.classList.remove('active'));
    
    // Show selected view
    const view = document.getElementById(`view-${viewName}`);
    if (view) {
        view.classList.add('active');
        
        // Load data based on view
        switch(viewName) {
            case 'pacientes':
                loadPatients();
                break;
            case 'misDatos':
                loadPatientData();
                break;
            case 'registros':
                loadRegistros();
                break;
            case 'recordatorios':
                loadReminders();
                break;
            case 'alertas':
                loadAlerts();
                break;
            case 'usuarios':
                loadUsers();
                break;
            case 'auditoria':
                loadAudit();
                break;
        }
    }
}

// ============= MEDICAL DATA FUNCTIONS =============

function loadPatients() {
    const patientsList = document.getElementById('patientsList');
    patientsList.innerHTML = '';
    
    const doctorPatients = patients.filter(p => p.doctorId === currentUser.id);
    
    doctorPatients.forEach(patient => {
        const riskStatus = calculateRiskStatus(patient.id);
        const card = document.createElement('div');
        card.className = 'patient-card';
        card.innerHTML = `
            <h3>${patient.name}</h3>
            <p><strong>Edad:</strong> ${patient.age} años</p>
            <p><strong>Correo:</strong> ${patient.email}</p>
            <p><strong>Teléfono:</strong> ${patient.phone}</p>
            <p><strong>Antecedentes:</strong> ${patient.medicalHistory}</p>
            <div class="risk-status ${riskStatus.class}">${riskStatus.text}</div>
        `;
        card.onclick = () => showPatientDetail(patient.id);
        patientsList.appendChild(card);
    });
}

function showPatientDetail(patientId) {
    const patient = patients.find(p => p.id === patientId);
    const data = medicalData[patientId];
    
    switchView('pacienteDetail');
    
    const content = document.getElementById('patientDetailContent');
    content.innerHTML = `
        <div class="patient-info">
            <div class="info-card">
                <h3>${patient.name}</h3>
                <div class="info-item">
                    <span class="info-label">Edad:</span>
                    <span class="info-value">${patient.age} años</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Género:</span>
                    <span class="info-value">${patient.gender}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Correo:</span>
                    <span class="info-value">${patient.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Teléfono:</span>
                    <span class="info-value">${patient.phone}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Antecedentes:</span>
                    <span class="info-value">${patient.medicalHistory}</span>
                </div>
            </div>
            
            <div class="info-card">
                <h3>Medicamentos Actuales</h3>
                ${patient.currentMedications.map(med => `<div class="info-item"><span class="info-value">• ${med}</span></div>`).join('')}
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart-card">
                <h3>Presión Arterial (últimos 7 días)</h3>
                <canvas id="doctorBloodPressureChart"></canvas>
            </div>
            
            <div class="chart-card">
                <h3>Frecuencia Cardíaca (últimos 7 días)</h3>
                <canvas id="doctorHeartRateChart"></canvas>
            </div>
        </div>
        
        <div class="charts-container">
            <div class="chart-card">
                <h3>Peso (últimos 7 días)</h3>
                <canvas id="doctorWeightChart"></canvas>
            </div>
            
            <div class="chart-card">
                <h3>Última Medición</h3>
                <div id="lastMeasurement" class="info-card"></div>
            </div>
        </div>
    `;
    
    // Load charts
    setTimeout(() => {
        drawChart('doctorBloodPressureChart', data.bloodPressure, 'Presión Arterial (mmHg)', 'blood-pressure');
        drawChart('doctorHeartRateChart', data.heartRate, 'Frecuencia Cardíaca (lpm)', 'heart-rate');
        drawChart('doctorWeightChart', data.weight, 'Peso (kg)', 'weight');
        displayLastMeasurement(patientId);
    }, 100);
}

function displayLastMeasurement(patientId) {
    const data = medicalData[patientId];
    const lastBP = data.bloodPressure[data.bloodPressure.length - 1];
    const lastHR = data.heartRate[data.heartRate.length - 1];
    const lastWeight = data.weight[data.weight.length - 1];
    
    const container = document.getElementById('lastMeasurement');
    container.innerHTML = `
        <div class="info-item">
            <span class="info-label">Presión Arterial:</span>
            <span class="info-value">${lastBP.systolic}/${lastBP.diastolic} mmHg (${lastBP.date} ${lastBP.time})</span>
        </div>
        <div class="info-item">
            <span class="info-label">Frecuencia Cardíaca:</span>
            <span class="info-value">${lastHR.value} lpm (${lastHR.date} ${lastHR.time})</span>
        </div>
        <div class="info-item">
            <span class="info-label">Peso:</span>
            <span class="info-value">${lastWeight.value} kg (${lastWeight.date})</span>
        </div>
    `;
}

function loadPatientData() {
    // Find patient user
    const patientUser = patients.find(p => p.id === currentUser.id || currentUser.username.includes('patient'));
    const patientId = patientUser ? patientUser.id : 2; // Default to patient1
    const data = medicalData[patientId];
    
    // Load personal info
    const patient = patients.find(p => p.id === patientId);
    const infoDiv = document.getElementById('personalInfo');
    infoDiv.innerHTML = `
        <div class="info-item">
            <span class="info-label">Nombre:</span>
            <span class="info-value">${patient.name}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Edad:</span>
            <span class="info-value">${patient.age} años</span>
        </div>
        <div class="info-item">
            <span class="info-label">Género:</span>
            <span class="info-value">${patient.gender}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Email:</span>
            <span class="info-value">${patient.email}</span>
        </div>
    `;
    
    // Load charts
    setTimeout(() => {
        drawChart('bloodPressureChart', data.bloodPressure, 'Presión Arterial (mmHg)', 'blood-pressure');
        drawChart('heartRateChart', data.heartRate, 'Frecuencia Cardíaca (lpm)', 'heart-rate');
        drawChart('weightChart', data.weight, 'Peso (kg)', 'weight');
        displayRiskStatus(patientId);
    }, 100);
}

function drawChart(canvasId, data, label, type) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    let chartData = {};
    let options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: label
                }
            }
        }
    };
    
    if (type === 'blood-pressure') {
        const systolicValues = data.map(d => d.systolic);
        const diastolicValues = data.map(d => d.diastolic);
        const labels = data.map(d => `${d.date} ${d.time}`);
        
        chartData = {
            labels: labels,
            datasets: [
                {
                    label: 'Sistólica (mmHg)',
                    data: systolicValues,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: true
                },
                {
                    label: 'Diastólica (mmHg)',
                    data: diastolicValues,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    tension: 0.4,
                    borderWidth: 2,
                    fill: true
                }
            ]
        };
    } else if (type === 'heart-rate') {
        const values = data.map(d => d.value);
        const labels = data.map(d => `${d.date} ${d.time}`);
        
        chartData = {
            labels: labels,
            datasets: [{
                label: 'Frecuencia Cardíaca (lpm)',
                data: values,
                borderColor: '#f39c12',
                backgroundColor: 'rgba(243, 156, 18, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                fill: true
            }]
        };
    } else if (type === 'weight') {
        const values = data.map(d => parseFloat(d.value));
        const labels = data.map(d => d.date);
        
        chartData = {
            labels: labels,
            datasets: [{
                label: 'Peso (kg)',
                data: values,
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4,
                borderWidth: 2,
                fill: true
            }]
        };
    }
    
    // Destroy existing chart if it exists
    if (window.chartInstances && window.chartInstances[canvasId]) {
        window.chartInstances[canvasId].destroy();
    }
    
    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    
    window.chartInstances[canvasId] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: options
    });
}

function calculateRiskStatus(patientId) {
    const data = medicalData[patientId];
    const lastBP = data.bloodPressure[data.bloodPressure.length - 1];
    const lastHR = data.heartRate[data.heartRate.length - 1];
    
    let riskScore = 0;
    
    // Pressure risk calculation
    if (lastBP.systolic > 180 || lastBP.diastolic > 120) {
        riskScore += 3; // High risk
    } else if (lastBP.systolic > 140 || lastBP.diastolic > 90) {
        riskScore += 2; // Medium risk
    } else if (lastBP.systolic > 130 || lastBP.diastolic > 80) {
        riskScore += 1; // Mild risk
    }
    
    // Heart rate risk calculation
    if (lastHR.value > 100 || lastHR.value < 50) {
        riskScore += 1;
    }
    
    if (riskScore <= 1) {
        return { text: 'Riesgo Bajo', class: 'risk-low' };
    } else if (riskScore <= 3) {
        return { text: 'Riesgo Medio', class: 'risk-medium' };
    } else {
        return { text: 'Riesgo Alto', class: 'risk-high' };
    }
}

function displayRiskStatus(patientId) {
    const data = medicalData[patientId];
    const riskStatus = calculateRiskStatus(patientId);
    
    let riskPercentage = 0;
    if (riskStatus.class === 'risk-low') riskPercentage = 20;
    if (riskStatus.class === 'risk-medium') riskPercentage = 50;
    if (riskStatus.class === 'risk-high') riskPercentage = 85;
    
    const container = document.getElementById('riskStatusChart');
    const fillClass = riskStatus.class;
    
    container.innerHTML = `
        <div class="risk-meter">
            <span class="risk-label">Estado Cardiovascular:</span>
            <div class="risk-bar">
                <div class="risk-fill ${fillClass}" style="width: ${riskPercentage}%; background: ${fillClass === 'risk-low' ? '#2ecc71' : fillClass === 'risk-medium' ? '#f39c12' : '#e74c3c'};">
                    ${riskStatus.text}
                </div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <p><strong>Última Presión Arterial:</strong> ${data.bloodPressure[data.bloodPressure.length - 1].systolic}/${data.bloodPressure[data.bloodPressure.length - 1].diastolic} mmHg</p>
            <p><strong>Última Frecuencia Cardíaca:</strong> ${data.heartRate[data.heartRate.length - 1].value} lpm</p>
        </div>
    `;
}

function loadRegistros() {
    const patientUser = patients.find(p => currentUser.username.includes('patient'));
    const patientId = patientUser ? patientUser.id : 2;
    const data = medicalData[patientId];
    const registrosList = document.getElementById('registrosList');
    
    registrosList.innerHTML = '';
    
    // Combine all readings
    let allReadings = [];
    data.bloodPressure.forEach(bp => {
        allReadings.push({
            date: bp.date,
            time: bp.time,
            type: 'Presión Arterial',
            value: `${bp.systolic}/${bp.diastolic} mmHg`,
            unit: 'mmHg'
        });
    });
    data.heartRate.forEach(hr => {
        allReadings.push({
            date: hr.date,
            time: hr.time,
            type: 'Frecuencia Cardíaca',
            value: `${hr.value} lpm`,
            unit: 'lpm'
        });
    });
    data.weight.forEach(w => {
        allReadings.push({
            date: w.date,
            time: w.time,
            type: 'Peso',
            value: `${w.value} kg`,
            unit: 'kg'
        });
    });
    
    // Sort by date and time
    allReadings.sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateB - dateA;
    });
    
    allReadings.forEach(reading => {
        const card = document.createElement('div');
        card.className = 'registro-card';
        card.innerHTML = `
            <strong>${reading.type}</strong><br>
            Valor: ${reading.value}<br>
            Fecha: ${reading.date} ${reading.time}
        `;
        registrosList.appendChild(card);
    });
}

function filterRegistros() {
    // Implementation for filtering registros
    loadRegistros();
}

function loadReminders() {
    const remindersList = document.getElementById('remindersList');
    remindersList.innerHTML = '';
    
    if (reminders.length === 0) {
        remindersList.innerHTML = '<p>No hay recordatorios. Crea uno nuevo!</p>';
        return;
    }
    
    reminders.forEach((reminder, index) => {
        const card = document.createElement('div');
        card.className = 'reminder-card';
        card.innerHTML = `
            <strong>${reminder.description}</strong><br>
            Fecha: ${reminder.date} ${reminder.time}<br>
            <button class="btn btn-secondary" onclick="deleteReminder(${index})">Eliminar</button>
        `;
        remindersList.appendChild(card);
    });
}

function openReminderModal() {
    document.getElementById('reminderModal').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function saveReminder(event) {
    event.preventDefault();
    
    const reminder = {
        description: document.getElementById('reminderDesc').value,
        date: document.getElementById('reminderDate').value,
        time: document.getElementById('reminderTime').value
    };
    
    reminders.push(reminder);
    logAudit('REMINDER_CREATED', `Reminder: ${reminder.description}`);
    
    document.getElementById('reminderForm').reset();
    closeModal('reminderModal');
    loadReminders();
}

function deleteReminder(index) {
    reminders.splice(index, 1);
    loadReminders();
}

function loadAlerts() {
    const alertsList = document.getElementById('alertsList');
    alertsList.innerHTML = '';
    
    // Check all patients for critical values
    const alerts = [];
    patients.forEach(patient => {
        if (patient.doctorId === currentUser.id) {
            const data = medicalData[patient.id];
            const lastBP = data.bloodPressure[data.bloodPressure.length - 1];
            
            if (lastBP.systolic > 180 || lastBP.diastolic > 120) {
                alerts.push({
                    patient: patient.name,
                    type: 'CRÍTICO',
                    message: `Presión arterial muy elevada: ${lastBP.systolic}/${lastBP.diastolic} mmHg`,
                    date: lastBP.date,
                    time: lastBP.time
                });
            } else if (lastBP.systolic > 140 || lastBP.diastolic > 90) {
                alerts.push({
                    patient: patient.name,
                    type: 'ADVERTENCIA',
                    message: `Presión arterial elevada: ${lastBP.systolic}/${lastBP.diastolic} mmHg`,
                    date: lastBP.date,
                    time: lastBP.time
                });
            }
        }
    });
    
    if (alerts.length === 0) {
        alertsList.innerHTML = '<p>No hay alertas críticas en este momento.</p>';
        return;
    }
    
    alerts.forEach(alert => {
        const card = document.createElement('div');
        card.className = 'alert-card';
        const alertClass = alert.type === 'CRÍTICO' ? 'risk-high' : 'risk-medium';
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between;">
                <div>
                    <strong>${alert.patient}</strong><br>
                    <span class="risk-status ${alertClass}">${alert.type}</span><br>
                    ${alert.message}<br>
                    <small>${alert.date} ${alert.time}</small>
                </div>
            </div>
        `;
        alertsList.appendChild(card);
    });
}

function loadUsers() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <strong>${user.name}</strong><br>
            Usuario: ${user.username}<br>
            Rol: ${user.role}<br>
            ID: ${user.id}
        `;
        usersList.appendChild(card);
    });
}

function loadAudit() {
    const auditList = document.getElementById('auditList');
    auditList.innerHTML = '';
    
    if (auditLog.length === 0) {
        auditList.innerHTML = '<p>No hay registros de auditoría.</p>';
        return;
    }
    
    [...auditLog].reverse().forEach(entry => {
        const card = document.createElement('div');
        card.className = 'audit-card';
        card.innerHTML = `
            <strong>${entry.action}</strong><br>
            Usuario: ${entry.user}<br>
            Hora: ${entry.timestamp}<br>
            Detalles: ${entry.details}
        `;
        auditList.appendChild(card);
    });
}

function openUserModal() {
    alert('Función de agregar usuario no implementada en demo');
}

function exportPDF() {
    const patientUser = patients.find(p => currentUser.username.includes('patient'));
    const patient = patientUser ? patientUser : patients[0];
    const data = medicalData[patient.id];
    
    let content = `REPORTE DE SALUD CARDIOVASCULAR\n`;
    content += `Paciente: ${patient.name}\n`;
    content += `Edad: ${patient.age} años\n`;
    content += `Fecha de Reporte: ${new Date().toLocaleDateString()}\n\n`;
    
    content += `ANTECEDENTES MÉDICOS:\n${patient.medicalHistory}\n\n`;
    content += `MEDICAMENTOS ACTUALES:\n${patient.currentMedications.join('\n')}\n\n`;
    
    content += `REGISTROS DE LOS ÚLTIMOS 7 DÍAS:\n`;
    content += `\nPRESIÓN ARTERIAL (mmHg):\n`;
    data.bloodPressure.forEach(bp => {
        content += `${bp.date} ${bp.time}: ${bp.systolic}/${bp.diastolic}\n`;
    });
    
    content += `\nFRECUENCIA CARDÍACA (lpm):\n`;
    data.heartRate.forEach(hr => {
        content += `${hr.date} ${hr.time}: ${hr.value}\n`;
    });
    
    content += `\nPESO (kg):\n`;
    data.weight.forEach(w => {
        content += `${w.date}: ${w.value}\n`;
    });
    
    // Create blob and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `CardioHelp_${patient.name}_${new Date().toISOString().split('T')[0]}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    logAudit('EXPORT', `PDF exported for patient ${patient.name}`);
}

function exportCSV() {
    const patientUser = patients.find(p => currentUser.username.includes('patient'));
    const patient = patientUser ? patientUser : patients[0];
    const data = medicalData[patient.id];
    
    let csv = 'Tipo,Fecha,Hora,Valor\n';
    
    data.bloodPressure.forEach(bp => {
        csv += `Presión Arterial,${bp.date},${bp.time},${bp.systolic}/${bp.diastolic} mmHg\n`;
    });
    
    data.heartRate.forEach(hr => {
        csv += `Frecuencia Cardíaca,${hr.date},${hr.time},${hr.value} lpm\n`;
    });
    
    data.weight.forEach(w => {
        csv += `Peso,${w.date},${w.time},${w.value} kg\n`;
    });
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `CardioHelp_${patient.name}_${new Date().toISOString().split('T')[0]}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    logAudit('EXPORT', `CSV exported for patient ${patient.name}`);
}

// Initialize on page load
window.addEventListener('load', function() {
    console.log('CardioHelp Application Loaded');
});