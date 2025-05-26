document.getElementById('patientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Mostrar estado de carga
    const submitBtn = document.getElementById('submitBtn');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
        // Obtener valores del formulario
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

        // Validación básica
        if (!formData.name || !formData.familyName || !formData.gender || !formData.birthDate) {
            throw new Error('Por favor complete los campos obligatorios');
        }

        // Crear objeto Patient en formato FHIR
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

        // Enviar datos al servidor
        const response = await fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear el paciente');
        }

        if (data.status !== "success") {
            throw new Error(data.message || 'Error en la respuesta del servidor');
        }

        alert('Paciente creado exitosamente! ID: ' + data.patient_id);
        document.getElementById('patientForm').reset();

    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error al procesar la solicitud');
    } finally {
        // Restaurar botón
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
