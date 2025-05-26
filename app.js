document.getElementById('patientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const name = document.getElementById('name').value;
    const familyName = document.getElementById('familyName').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birthDate').value;
    const identifierSystem = document.getElementById('identifierSystem').value;
    const identifierValue = document.getElementById('identifierValue').value;
    const cellPhone = document.getElementById('cellPhone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const postalCode = document.getElementById('postalCode').value;

    // Crear el objeto Patient en formato FHIR
    const patient = {
        resourceType: "Patient",
        name: [{
            use: "official",
            given: [name],
            family: familyName
        }],
        gender: gender,
        birthDate: birthDate,
        identifier: [{
            system: identifierSystem,
            value: identifierValue
        }],
        telecom: [{
            system: "phone",
            value: cellPhone,
            use: "home"
        }, {
            system: "email",
            value: email,
            use: "home"
        }],
        address: [{
            use: "home",
            line: [address],
            city: city,
            postalCode: postalCode,
            country: "Colombia"
        }]
    };

    // Enviar los datos usando Fetch API con manejo de CORS
    fetch('https://hl7-fhir-ehr-juanita-123.onrender.com/patient', {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(patient)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        alert('Paciente creado exitosamente!');
    })
    .catch((error) => {
        console.error('Error:', error);
        if (error.message.includes('Failed to fetch')) {
            alert('Error de conexión con el servidor. Verifica CORS.');
        } else {
            alert('Hubo un error al crear el paciente.');
        }
    });
});
