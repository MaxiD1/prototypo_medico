// Sistema de Autenticación - CardioHelp

const demoUsers = {
    // Médicos
    'medico1': {
        password: '123456',
        role: 'doctor',
        name: 'Dr. Carlos Rodríguez',
        email: 'carlos.rodriguez@cardiohelp.com',
        specialty: 'Cardiología',
        license: 'CMF-001234',
        permissions: ['view_patients', 'view_vitals', 'edit_records', 'generate_alerts', 'view_lab_results'],
        department: 'Cardiología'
    },
    'medico2': {
        password: 'password123',
        role: 'doctor',
        name: 'Dra. María García',
        email: 'maria.garcia@cardiohelp.com',
        specialty: 'Medicina Interna',
        license: 'CMF-005678',
        permissions: ['view_patients', 'view_vitals', 'view_records', 'view_lab_results'],
        department: 'Medicina Interna'
    },
    // Pacientes
    'paciente1': {
        password: '123456',
        role: 'patient',
        name: 'Juan Pérez López',
        email: 'juan.perez@email.com',
        age: 58,
        rut: '12.345.678-9',
        phone: '+56912345678',
        address: 'Calle Principal 123, Santiago',
        permissions: ['view_own_vitals', 'register_vitals', 'view_own_records', 'export_data', 'set_reminders'],
        medicalHistory: ['Hipertensión', 'Diabetes tipo 2'],
        currentMedications: ['Lisinopril', 'Metformina']
    },
    'paciente2': {
        password: 'secure456',
        role: 'patient',
        name: 'Rosa Martínez Díaz',
        email: 'rosa.martinez@email.com',
        age: 65,
        rut: '11.234.567-8',
        phone: '+56987654321',
        address: 'Avenida Secundaria 456, Valparaíso',
        permissions: ['view_own_vitals', 'register_vitals', 'view_own_records', 'export_data', 'set_reminders'],
        medicalHistory: ['Insuficiencia Cardíaca', 'Hipertensión', 'Colesterol elevado'],
        currentMedications: ['Furosemida', 'Bisoprolol', 'Atorvastatina']
    },
    // Administrador
    'admin': {
        password: 'admin123',
        role: 'admin',
        name: 'Administrador Sistema',
        email: 'admin@cardiohelp.com',
        permissions: ['manage_users', 'view_all_data', 'audit_logs', 'system_config', 'manage_patients', 'manage_doctors'],
        department: 'TI'
    },
    // Técnico/Asistente
    'asistente': {
        password: '123456',
        role: 'assistant',
        name: 'Jorge Rodríguez López',
        email: 'jorge.rodriguez@cardiohelp.com',
        permissions: ['register_vitals', 'view_patients', 'input_lab_results', 'manage_reminders'],
        department: 'Enfermería'
    }
};

class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.loadSession();
    }

    login(username, password) {
        const user = demoUsers[username];
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Contraseña incorrecta' };
        }

        this.currentUser = { ...user, username };
        this.saveSession();
        return { success: true, message: 'Inicio de sesión exitoso' };
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('cardiohelp_session');
    }

    getCurrentUser() {
        return this.currentUser;
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes(permission);
    }

    isDoctor() {
        return this.currentUser && this.currentUser.role === 'doctor';
    }

    isPatient() {
        return this.currentUser && this.currentUser.role === 'patient';
    }

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    saveSession() {
        localStorage.setItem('cardiohelp_session', JSON.stringify(this.currentUser));
    }

    loadSession() {
        const session = localStorage.getItem('cardiohelp_session');
        if (session) {
            this.currentUser = JSON.parse(session);
        }
    }

    getAllUsers() {
        return Object.keys(demoUsers).map(username => ({
            username,
            ...demoUsers[username],
            password: '***'
        }));
    }
}

const auth = new AuthSystem();
