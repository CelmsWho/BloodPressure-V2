const form = document.getElementById('bpForm');
const resultCard = document.getElementById('result');
const statusEl = document.getElementById('status');
const classificationEl = document.getElementById('classification');
const mapEl = document.getElementById('map');
const pulsePressEl = document.getElementById('pulsePress');
const notesEl = document.getElementById('notes');
const warningEl = document.getElementById('warning');
const pulseWarningEl = document.getElementById('pulseWarning');
const sampleBtn = document.getElementById('sampleBtn');
const resetBtn = document.getElementById('resetBtn');

/* Asinsspiediena klasifikācija pēc sistoliska/diastoliska */
function classifyBP(sys, dia) {
    if (sys >= 180 || dia >= 120) return 'Hypertensive Crisis';
    if (sys >= 140 || dia >= 90) return 'Stage 2 Hypertension';
    if (sys >= 130 || dia >= 81) return 'Stage 1 Hypertension';
    if (sys >= 120 && dia <= 80) return 'Elevated';
    if (sys <90 || dia <60) return 'Low Blood Pressure';
    return 'Normal';
}

/* Aprēķina (MAP) */
function calculateMAP(sys, dia) {
return Math.round((sys + 2 * dia) / 3);
}

/* Aprēķina pulsa spiedienu (sistoliskā - diastoliskā) */
function calculatePulsePressure(sys, dia) {
return sys - dia;
}

/* Atgriež ieteikumus pēc klasifikācijas */
function getNotes(classification) {
if (classification === 'Hypertensive Crisis') 
    return 'Seek immediate medical attention.';
if (classification.includes('Hypertension'))
    return 'Consult your healthcare provider.';
if (classification === 'Elevated')
    return 'Lifestyle changes recommended.';
if (classification === 'Normal')
    return 'Keep up a healthy lifestyle.';
if (classification === 'Low Blood Pressure')
    return 'Consult your healthcare provider if symptomatic.';
return '';
}

/* Pārbauda, vai pulss ir ārpus normas un atgriež brīdinājumu */
function checkPulseWarning(pulse) {
if (pulse === '—') return '';
if (pulse < 60) return 'Pulse below 60 bpm may indicate bradycardia.';
if (pulse > 85) return 'Pulse above 85 bpm may indicate tachycardia.';
return '';
}

/* Atjauno UI */
form.addEventListener('submit', function(e) {
e.preventDefault();
const sys = Number(form.systolic.value);
const dia = Number(form.diastolic.value);
const pulseVal = form.pulse.value ? Number(form.pulse.value) : '—';
const ageVal = form.age.value ? Number(form.age.value) : '—';

// Validācija: pārbauda vai ievadītas derīgas vērtības
if (isNaN(sys) || isNaN(dia) || sys <= 0 || dia <= 0) {
    alert('Please enter valid systolic and diastolic values.');
    return;
}
if (dia > sys) {
    alert('Diastolic pressure cannot be higher than systolic pressure.');
    return;
  }


const classification = classifyBP(sys, dia);
const map = calculateMAP(sys, dia);
const pulsePressure = calculatePulsePressure(sys, dia);
const notes = getNotes(classification);
const pulseWarning = checkPulseWarning(pulseVal);

// Pielāgo attēlojumu, ja lietotājam ir jaunāks vecums
let displayClassification = classification;
let displayNotes = notes;
if (ageVal !== '—' && ageVal < 20 && (classification === 'Elevated' || classification === 'Stage 1 Hypertension')) {
    displayClassification = `Normal / ${classification}`;
    displayNotes = notes + ' Age under 20: adult thresholds may not apply, consult a pediatrician.';
}

// Atjauno UI elementus ar aprēķinātajiem datiem
statusEl.textContent = displayClassification;
classificationEl.textContent = displayClassification;
mapEl.textContent = map + ' mmHg';
pulsePressEl.textContent = pulsePressure + ' mmHg';
notesEl.textContent = displayNotes;

// Parāda vai slēpj brīdinājuma paziņojumu par krīzi
warningEl.style.display = (classification === 'Hypertensive Crisis') ? 'block' : 'none';

// Pulsa brīdinājuma rādīšana
if (pulseWarning) {
    pulseWarningEl.textContent = pulseWarning;
    pulseWarningEl.style.display = 'block';
} else {
    pulseWarningEl.style.display = 'none';
}

resultCard.style.display = 'block';

// Pievieno dzelteno brīdinājuma izskatu, ja nepieciešams
if (classification === 'Normal' || (ageVal !== '—' && ageVal < 20 && (classification === 'Elevated' || classification === 'Stage 1 Hypertension'))) {
    resultCard.classList.remove('result-warning');
} else {
    resultCard.classList.add('result-warning');
}

});

/* Parauga pogas apstrādātājs: aizpilda formu ar testvērtībām un iesniedz */
sampleBtn.addEventListener('click', () => {
form.systolic.value = 128;
form.diastolic.value = 82;
form.pulse.value = '';
form.age.value = '';
form.dispatchEvent(new Event('submit', {cancelable: true, bubbles:true}));
});

/* Atiestatīšanas pogas apstrādātājs: iztīra formu un paslēpj rezultātus */
resetBtn.addEventListener('click', () => {
form.reset();
resultCard.style.display = 'none';
resultCard.classList.remove('result-warning');
});