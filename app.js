document.getElementById('patientForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
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

    // Crear el objeto Patient en formato FHIR
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
            system: formData.identifierSystem,
            value: formData.identifierValue
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

    try {
        const response = await fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(patient)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error al crear el paciente');
        }

        console.log('Success:', data);
        alert('Paciente creado exitosamente!');
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
});
