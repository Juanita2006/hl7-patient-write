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
            birthDate: document.getElementById('birthDate').value
        };

        // 2. Validación básica
        if (!formData.name || !formData.familyName || !formData.gender || !formData.birthDate) {
            throw new Error('Complete los campos obligatorios');
        }

        // 3. URL de prueba - CAMBIAR POR TU URL REAL
        const API_URL = 'https://hl7-fhir-ehr-juanita-123.onrender.com/patient';
        
        // 4. Prueba de conexión primero
        const testResponse = await fetch(API_URL, {
            method: 'OPTIONS'
        });
        
        if (!testResponse.ok) {
            throw new Error(`El servidor no responde (${testResponse.status}). Verifica: 1) Que la URL ${API_URL} sea correcta, 2) Que el servidor esté activo`);
        }

        // 5. Enviar datos reales
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                resourceType: "Patient",
                name: [{
                    use: "official",
                    given: [formData.name],
                    family: formData.familyName
                }],
                gender: formData.gender,
                birthDate: formData.birthDate
            })
        });

        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        alert('Paciente creado exitosamente!');
        event.target.reset();

    } catch (error) {
        console.error('Error completo:', error);
        alert(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }
});
