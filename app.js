document.getElementById('patientForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        // 1. Obtener datos del formulario
        const formData = {
            name: document.getElementById('name').value,
            familyName: document.getElementById('familyName').value,
            gender: document.getElementById('gender').value,
            birthDate: document.getElementById('birthDate').value,
            identifierSystem: document.getElementById('identifierSystem').value,
            identifierValue: document.getElementById('identifierValue').value,
            cellPhone: document.getElementById('cellPhone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            postalCode: document.getElementById('postalCode').value
        };

        // 2. Validación básica
        if (!formData.name || !formData.familyName || !formData.gender || !formData.birthDate) {
            throw new Error('Complete los campos obligatorios');
        }

        // 3. Crear objeto FHIR
        const patient = {
            resourceType: "Patient",
            name: [{
                use: "official",
                given: [formData.name],
                family: formData.familyName
            }],
            gender: formData.gender,
            birthDate: formData.birthDate,
            identifier: [{
                system: formData.identifierSystem || "undefined",
                value: formData.identifierValue || "undefined"
            }],
            telecom: [{
                system: "phone",
                value: formData.cellPhone,
                use: "home"
            }, {
                system: "email",
                value: formData.email,
                use: "home"
            }],
            address: [{
                use: "home",
                line: [formData.address],
                city: formData.city,
                postalCode: formData.postalCode,
                country: "Colombia"
            }]
        };

        // 4. Enviar al servidor
        const API_URL = 'https://hl7-fhir-ehr-juanita-123.onrender.com/patient';
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(patient)
        });

        // 5. Manejar respuesta
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.detail || 
                errorData.message || 
                `Error HTTP ${response.status}`
            );
        }

        const result = await response.json();
        alert(`Paciente creado con ID: ${result.patient_id}`);
        event.target.reset();

    } catch (error) {
        console.error('Error completo:', error);
        alert(error.message.includes('Failed to fetch') 
            ? 'No se pudo conectar al servidor. Verifique: 1) La URL del backend, 2) Si el servicio está activo, 3) Problemas de CORS' 
            : error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
