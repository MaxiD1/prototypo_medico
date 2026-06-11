const users = [
{
username:"admin",
password:"admin123",
role:"admin",
name:"Administrador Sistema"
},
{
username:"medico",
password:"medico123",
role:"doctor",
name:"Dr. Carlos Mendoza"
},
{
username:"paciente1",
password:"paciente123",
role:"patient",
patientId:1,
name:"Juan Pérez"
},
{
username:"paciente2",
password:"paciente123",
role:"patient",
patientId:2,
name:"María González"
}
];

const patients = [

{
id:1,
name:"Juan Pérez",
age:65,
diagnosis:"Hipertensión Arterial",
medication:"Losartán 50mg",
adherence:92,
lastDose:"2026-06-10",

vitals:[
{
date:"2026-06-01",
sistolica:135,
diastolica:85,
heartRate:78,
weight:82
},
{
date:"2026-06-05",
sistolica:145,
diastolica:92,
heartRate:81,
weight:81
},
{
date:"2026-06-10",
sistolica:162,
diastolica:100,
heartRate:105,
weight:80
}
],

symptoms:[
{
date:"2026-06-09",
name:"Fatiga",
severity:8
},
{
date:"2026-06-10",
name:"Dolor torácico",
severity:6
}
],

labs:[
{
date:"2026-06-01",
exam:"Colesterol LDL",
result:"165 mg/dL"
},
{
date:"2026-06-01",
exam:"Glucosa",
result:"110 mg/dL"
}
]
},

{
id:2,
name:"María González",
age:58,
diagnosis:"Arritmia",
medication:"Bisoprolol",

adherence:45,

lastDose:"2026-06-05",

vitals:[
{
date:"2026-06-01",
sistolica:120,
diastolica:75,
heartRate:95,
weight:71
},
{
date:"2026-06-07",
sistolica:130,
diastolica:80,
heartRate:110,
weight:71
},
{
date:"2026-06-10",
sistolica:155,
diastolica:95,
heartRate:130,
weight:72
}
],

symptoms:[
{
date:"2026-06-10",
name:"Mareo",
severity:9
}
],

labs:[
{
date:"2026-06-03",
exam:"ECG",
result:"Arritmia Detectada"
}
]
}

];

let records = [];
let symptoms = [];
let reminders = [];
let logs = [];

const bpCtx =
document.getElementById("bpChart");

const hrCtx =
document.getElementById("hrChart");

const bpChart =
new Chart(bpCtx,{
    type:'line',
    data:{
        labels:[],
        datasets:[
            {
                label:'Sistólica',
                data:[]
            },
            {
                label:'Diastólica',
                data:[]
            }
        ]
    }
});

const hrChart =
new Chart(hrCtx,{
    type:'line',
    data:{
        labels:[],
        datasets:[
            {
                label:'Frecuencia Cardíaca',
                data:[]
            }
        ]
    }
});

document
.getElementById("vitalsForm")
.addEventListener("submit",e=>{

    e.preventDefault();

    const record={
        date:date.value,
        sistolica:+sistolica.value,
        diastolica:+diastolica.value,
        heartRate:+heartRate.value,
        weight:+weight.value
    };

    records.push(record);

    updateDashboard();

    logAction(
        "Ficha Paciente",
        "Nuevo Registro"
    );

});

function updateDashboard(){

    let last=records[records.length-1];

    document
    .getElementById("lastRecord")
    .innerHTML=
    `
    PA: ${last.sistolica}/${last.diastolica}
    <br>
    FC: ${last.heartRate}
    `;

    bpChart.data.labels=
    records.map(r=>r.date);

    bpChart.data.datasets[0].data=
    records.map(r=>r.sistolica);

    bpChart.data.datasets[1].data=
    records.map(r=>r.diastolica);

    bpChart.update();

    hrChart.data.labels=
    records.map(r=>r.date);

    hrChart.data.datasets[0].data=
    records.map(r=>r.heartRate);

    hrChart.update();

    updateRisk(last);

    renderHistory();

    checkCritical(last);
}

function updateRisk(record){

    let risk="low";

    if(
        record.sistolica > 160 ||
        record.heartRate > 120
    )
        risk="high";

        else if(
            record.sistolica > 140
        )
            risk="medium";

            const div=
            document.getElementById(
                "riskIndicator"
            );

            div.className=risk;

            div.innerHTML=
            risk==="low"
            ?"Riesgo Bajo"
            :risk==="medium"
            ?"Riesgo Medio"
            :"Riesgo Alto";
}

function checkCritical(record){

    if(
        record.sistolica >180 ||
        record.diastolica >120
    ){

        alert(
            "ALERTA CRÍTICA: Presión Arterial"
        );

    }
}

function renderHistory(){

    let html="";

    records.forEach(r=>{

        html+=`
        <tr>
        <td>${r.date}</td>
        <td>${r.sistolica}/${r.diastolica}</td>
        <td>${r.heartRate}</td>
        <td>${r.weight}</td>
        </tr>
        `;

    });

    historyTable.innerHTML=html;
}

document
.getElementById("symptomForm")
.addEventListener("submit",e=>{

    e.preventDefault();

    symptoms.push({
        symptom:symptom.value,
        severity:severity.value
    });

    renderSymptoms();
});

function renderSymptoms(){

    symptomList.innerHTML=
    symptoms
    .map(s=>
    `<li>${s.symptom} (${s.severity}/10)</li>`
    )
    .join("");
}

document
.getElementById("medicationForm")
.addEventListener("submit",e=>{

    e.preventDefault();

    let adherenceValue=
    parseInt(adherence.value);

    medicationStatus.innerHTML=
    `
    Adherencia:
    ${adherenceValue}%
    `;

    if(adherenceValue<50){

        medAlert.innerHTML=
        `
        <div class="alert">
        Paciente en riesgo de incumplimiento
        </div>
        `;

    }
});

document
.getElementById("reminderForm")
.addEventListener("submit",e=>{

    e.preventDefault();

    reminders.push({
        date:reminderDate.value,
        text:reminderText.value
    });

    renderReminders();
});

function renderReminders(){

    reminderList.innerHTML=
    reminders
    .sort((a,b)=>
    new Date(a.date)-new Date(b.date)
    )
    .map(r=>
    `<li>${r.date} - ${r.text}</li>`
    )
    .join("");
}

function logAction(
    patient,
    action
){

    logs.push({
        date:new Date().toLocaleString(),
              patient,
              action
    });

    auditLog.innerHTML=
    logs.map(l=>
    `
    <tr>
    <td>${l.date}</td>
    <td>${l.patient}</td>
    <td>${l.action}</td>
    </tr>
    `
    ).join("");
}

document
.getElementById("labFile")
.addEventListener("change",e=>{

    const file=
    e.target.files[0];

    const reader=
    new FileReader();

    reader.onload=function(){

        labResults.innerHTML=
        `
        <h4>Resultados cargados</h4>
        <pre>${reader.result}</pre>
        `;

    };

    reader.readAsText(file);

});

function exportPDF(){

    const { jsPDF } =
    window.jspdf;

    const doc =
    new jsPDF();

    doc.text(
        "Reporte Clínico",
        20,
        20
    );

    doc.save(
        "reporte.pdf"
    );
}

let currentUser = null;
let currentPatient = null;

function login(){

const user =
users.find(
u =>
u.username === username.value &&
u.password === password.value
);

if(!user){

alert("Credenciales incorrectas");
return;

}

currentUser = user;

loginScreen.style.display = "none";
dashboard.style.display = "block";

configurePermissions();

}

function configurePermissions(){

if(currentUser.role === "admin"){

loadAuditLogs();

}

if(currentUser.role === "doctor"){

loadDoctorView();

}

if(currentUser.role === "patient"){

currentPatient =
patients.find(
p => p.id === currentUser.patientId
);

loadPatientView();

}

}

function loadDoctorView(){

const selector =
document.createElement("select");

selector.id="patientSelector";

patients.forEach(p=>{

selector.innerHTML +=
`
<option value="${p.id}">
${p.name}
</option>
`;

});

document.body.prepend(selector);

selector.addEventListener(
"change",
loadSelectedPatient
);

loadSelectedPatient();

}

function loadSelectedPatient(){

const id =
parseInt(
document.getElementById(
"patientSelector"
).value
);

currentPatient =
patients.find(
p=>p.id===id
);

records =
currentPatient.vitals;

updateDashboard();

renderPatientProfile();

renderLabResults();

checkMedicationRisk();

}

function renderPatientProfile(){

document.getElementById(
"lastRecord"
).innerHTML=
`
<h3>${currentPatient.name}</h3>

Edad:
${currentPatient.age}
<br>

Diagnóstico:
${currentPatient.diagnosis}
<br>

Medicamento:
${currentPatient.medication}
`;
}

function renderLabResults(){

let html = "";

currentPatient.labs.forEach(l=>{

html +=
`
<div>

<b>${l.date}</b>

<br>

${l.exam}

<br>

${l.result}

<hr>

</div>
`;

});

labResults.innerHTML = html;

}

function checkMedicationRisk(){

medicationStatus.innerHTML=
`
Adherencia:
${currentPatient.adherence}%
`;

if(currentPatient.adherence < 50){

medAlert.innerHTML=
`
<div class="alert">

⚠ Paciente con baja adherencia.

</div>
`;

}
}

function checkThreeDaysWithoutMedication(){

const lastDose =
new Date(
currentPatient.lastDose
);

const today =
new Date();

const diff =
(today-lastDose)
/(1000*60*60*24);

if(diff >= 3){

medAlert.innerHTML=
`
<div class="alert">

🚨 MÁS DE 3 DÍAS SIN MEDICARSE

</div>
`;

}

}

checkThreeDaysWithoutMedication();

const notifications = [

{
patientId:1,
message:
"Su dosis de Losartán fue aumentada a 100mg"
},

{
patientId:2,
message:
"Nuevo medicamento agregado: Aspirina"
}

];

function loadPatientView(){

records =
currentPatient.vitals;

updateDashboard();

renderPatientProfile();

renderLabResults();

showNotifications();

}

function showNotifications(){

const myNotifications =
notifications.filter(
n =>
n.patientId === currentPatient.id
);

myNotifications.forEach(n=>{

alert(n.message);

});

}

logs = [

{
date:"11/06/2026 08:00",
patient:"Juan Pérez",
action:"Ingreso Médico"
},

{
date:"11/06/2026 08:20",
patient:"María González",
action:"Modificación Ficha"
},

{
date:"11/06/2026 09:00",
patient:"Juan Pérez",
action:"Visualización Exámenes"
}

];
