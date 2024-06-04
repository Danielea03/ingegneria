function sendFeedback() {
    // Logica per inviare il feedback
    const detailsDiv = document.getElementById('element-details');
    detailsDiv.innerHTML = `
    <form id="feedbackForm" class="spaced-form">
    <div class="form-group">
        <label for="username">User Name:</label>
        <input type="text" id="username" name="username" required><br>
    </div>
    <div class="form-group">
        <label for="feedback">Description of Feedback:</label>
        <textarea id="feedbackText" name="feedback" required></textarea><br>
    </div>
    <div class="form-group">
        <button type="submit">Send feedback</button>
    </div>
    </form>
    `;

    // Aggiungi un gestore di eventi per l'invio del form
    const feedbackForm = document.getElementById('feedbackForm');
    feedbackForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita il comportamento predefinito di inviare il form
        saveFeedbackToStrapi()
        
    });
}

function saveFeedbackToStrapi() {
    // Recupera i valori dai campi del modulo
    const username = document.getElementById('username').value.trim();
    const feedbackText = document.getElementById('feedbackText').value.trim();

    console.log("CS:", username); // Aggiungi questo console.log()
    
    console.log("CSWDF3:", feedbackText); // Aggiungi questo console.log()
  
    // Costruisci il payload da inviare
    const payload = {
    data: {
        "User": username,
        "Description": feedbackText
    }
    };


    console.log("Payload:", payload); // Aggiungi questo console.log()

    // URL del tuo endpoint Strapi per il modello "Feedback"
    const apiUrl = 'http://localhost:1337/api/feedbacks';

    // Effettua la richiesta fetch e restituisci la promessa
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    .then(response => {
        if (!response.ok) {
            throw new Error('Error during batch request to Strapi');
        }
        return response.json();
    })
    .then(data => {
        console.log('Feedback inviato con successo:', data);
        const responseDiv = document.querySelector('.response_operation_user');
        responseDiv.textContent = 'Feedback submitted'; 
        const detailsDiv = document.getElementById('element-details');
         detailsDiv.innerHTML = '';
         // Chiudi i campi dopo 2 secondi
         setTimeout(() => {
          
            responseDiv.textContent = '';
        }, 2000);
        return data; // Assicurati di restituire i dati per mantenere la catena delle promesse
    })
    .catch(error => {
        console.error('Error during batch request to Strapi:', error);
        throw error; // Rilancia l'errore per consentire la gestione nell'ambiente esterno
    });
}


///-----------------------------------------------------------------------------

function reportVulnerability() {
    console.log("Report Vulnerability clicked");

    const detailsDiv = document.getElementById('element-details');
    const form = document.createElement('form');
    form.id = 'reportForm';
    form.classList.add('spaced-form'); // Aggiungi questa riga per aggiungere la classe spaced-form

    const fields = [
        { label: 'User Name:', type: 'text', name: 'User', id: "username", required: true },
        { label: 'Email:', type: 'email', name: 'Email', id: "email",  required: true },
        { label: 'Mobile phone:', type: 'tel', name: 'Cell', id:"phone", required: true },
        { label: 'Description of the Report:', type: 'textarea', name: 'Description', id: "report", required: true }
    ];
   

    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');

        const label = document.createElement('label');
        label.textContent = field.label;
        label.htmlFor = field.id;
        label.classList.add('form-group-label'); // Aggiungi questa riga per aggiungere la classe form-group-label
        formGroup.appendChild(label);

        const input = document.createElement(field.type === 'textarea' ? 'textarea' : 'input');
        input.rows = 10; // Adjust this value for the desired height (number of lines)
        input.cols = 50; 
        input.type = field.type;
        input.name = field.name;
        input.id = field.id;
        input.required = field.required;
        input.classList.add('form-group-input'); // Aggiungi questa riga per aggiungere la classe form-group-input
        formGroup.appendChild(input);

        form.appendChild(formGroup);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Send Report';
    submitButton.classList.add('form-group-button'); // Aggiungi questa riga per aggiungere la classe form-group-button
    form.appendChild(submitButton);

    detailsDiv.innerHTML = '';
    detailsDiv.appendChild(form);

    const responseDiv = document.querySelector('.response_operation_user');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const phoneInput = document.getElementById('phone');
        const phoneValue = phoneInput.value.trim();
        const phonePattern = /^\d{9,}$/;

       


        if (!phonePattern.test(phoneValue)) {
            responseDiv.style.color = 'red'; // Imposta il colore del testo a rosso
             responseDiv.textContent = 'Please enter a valid phone number with at least 9 digits.';
             setTimeout(() => {
                responseDiv.style.color = '';
                responseDiv.textContent = '';
            }, 3000);
            
           
            
           
            return;
        }
              saveReportToStrapi()  
               .then(() => {
              
                responseDiv.textContent = 'Report submitted';
                detailsDiv.innerHTML = '';
                setTimeout(() => {
                    responseDiv.textContent = '';
                }, 3000);
            })
            .catch((error) => {
                console.error('Error saving report to Strapi:', error);
            });     
    });                   
}



function saveReportToStrapi() {
    // Recupera i valori dai campi del modulo
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const reportDescription = document.getElementById('report').value.trim();
 
       // URL del tuo endpoint Strapi per il modello "Report"
    const apiUrl = 'http://localhost:1337/api/reports';

    // Costruisci il payload da inviare
    
    const payload = {
        data: { User: username,
        Email: email,
        Cell: phone,
        Description: reportDescription
        }
    };

 

    // Effettua la richiesta fetch e restituisci la promessa
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error requesting Strapi');
        }
        return response.json();
    })
    .then(data => {
        console.log('Report submitted:', data);
        // Aggiungi qui il codice per mostrare un messaggio di conferma all'utente
    })
    .catch(error => {
        console.error('Error requesting Strapi:', error);
        // Aggiungi qui il codice per gestire l'errore
        throw error; // Rilancia l'errore per consentire la gestione nell'ambiente esterno
    });
}

