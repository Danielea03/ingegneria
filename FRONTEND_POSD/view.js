// LISTA PKB
var elements = [];
// Seleziona il div in cui verranno aggiunti i pulsanti
var elementButtonsDiv = document.getElementById('element-buttons');
var resultsDiv = document.querySelector('.results');
// Funzione per creare i pulsanti
function createButtons() {
    elements.forEach(function(element, index) { 
        var button = document.createElement('button');
        button.type = 'button'; // Imposta il tipo del pulsante
        button.className = 'dropdown_buttons';
        button.style.setProperty('--i', index + 1); // Settiamo la variabile CSS per l'animazione
        button.innerText = element[0]; // Usa il primo elemento per il testo del pulsante

        var span = document.createElement('span');
        button.prepend(span);

        elementButtonsDiv.appendChild(button);
    });
}

fetch('http://localhost:1337/api/pkbs')  // Esegui la richiesta API e aggiungi le categorie alla lista
  .then(response => response.json())
  .then(data => {
    // Estraiamo i nomi e le api dai dati ricevuti
    data.data.forEach(item => {
        elements.push([item.attributes.Name, item.attributes.API]);
    });

    
  createButtons();  // Chiamata alla funzione per creare i pulsanti
  })
  .catch(error => {
    console.error('Si è verificato un errore durante la richiesta API:', error);
  });

 //----------------------------------------------------------- 
 //-----MOSTRA LISTA
 async function fetchLista() {
    let nomePath = document.getElementById('search-list').value.trim();
    nomePath = capitalizeFirstLetter(nomePath); // Trasforma le iniziali in maiuscolo
    const apiPath = trovaApiPath(nomePath, elements);
    const apiUrl = `http://localhost:1337/api/${apiPath}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const elements = data.data;

        let resultsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">${nomePath} list:</h2><ul>`;

        elements.forEach(element => {
            resultsHTML += '<li>';
            resultsHTML += `<strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">ID</strong>: <span style="font-family: 'Lato', sans-serif;">${element.id}</span><br>`; // Aggiungi l'ID
            Object.keys(element.attributes).forEach(key => {
                // Ignora gli attributi specificati
                if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') {
                    resultsHTML += `<strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span><br>`;
                }
            });
            resultsHTML += '</li>';
            resultsHTML += '<br>'; // Aggiungi uno spazio tra gli elementi
        });
        
        resultsHTML += '</ul>';
        document.querySelector('.results').innerHTML = resultsHTML;
    } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
        document.querySelector('.results').innerHTML = '<p>An error occurred while retrieving data.</p>';
    }
}


function trovaApiPath(nomePath, elements) {
    // Dichiarazione della variabile apiPath che sarà restituita
    let apiPath = null;
    // Iterazione attraverso la lista elements
    for (let i = 0; i < elements.length; i++) {
        // Ottieni la coppia [nome, api] corrente
        let [nome, api] = elements[i];

        // Controlla se il nome corrente corrisponde a nomePath
        if (nome === nomePath) {
            // Se corrisponde, assegna il valore api a apiPath
            apiPath = api;
            // Esci dal ciclo poiché abbiamo trovato il valore desiderato
            break;
        }
    }
    // Restituisci il valore trovato di apiPath
    return apiPath;
}





//-------------------------------------------------------------------------------------------------------------
//---------MOSTRA ELEMENTI PER ID
async function fetchElementId() {
    let nomePath = document.getElementById('search-api-input_element').value.trim();
    nomePath = capitalizeFirstLetter(nomePath); // Trasforma le iniziali in maiuscolo
    
    const apiPath = trovaApiPath(nomePath, elements);
    const elementId = document.getElementById('search-id-input_element').value.trim();
    const apiUrl = `http://localhost:1337/api/${apiPath}/${elementId}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const element = data.data;
        let detailsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">Search results for ${nomePath}:</h2><ul>`;
        detailsHTML += `<li><strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">ID</strong>: ${element.id}</li>`; // Aggiungi l'ID
        Object.keys(element.attributes).forEach(key => {
            // Ignora gli attributi specificati
            if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') { 
                detailsHTML += `<li><strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span></li>`;
            }
        });
        detailsHTML += '</ul>';

        document.getElementById('element-details').innerHTML = detailsHTML;
    } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
        document.getElementById('element-details').innerHTML = '<p>An error occurred while retrieving data.</p>';
    }
}

//---------MOSTRA ELEMENTI PER NOME
async function fetchElementName() {
    let nomePath = document.getElementById('search-api-input_element').value.trim();
    nomePath = capitalizeFirstLetter(nomePath); // Trasforma le iniziali in maiuscolo


    const apiPath = trovaApiPath(nomePath, elements);
    let elementId = document.getElementById('search-name-input_element').value.trim();
    elementId = capitalizeFirstLetterOfEachWord(elementId); // Trasforma le iniziali in maiuscolo e tutte le altre lettere in minuscolo
    const apiUrl = `http://localhost:1337/api/${apiPath}?filters[Name][$eq]=${elementId}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const element = data.data[0];
            let detailsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">Search results for ${nomePath}:</h2><ul>`;
            Object.keys(element.attributes).forEach(key => {
                // Ignora gli attributi specificati
                if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') {
                    detailsHTML += `<li><strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span></li>`;
                }
            });
            detailsHTML += '</ul>';
            document.getElementById('element-details').innerHTML = detailsHTML;
        } else {
            document.getElementById('element-details').innerHTML = '<p>No results.</p>';
        }
    } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
        document.getElementById('element-details').innerHTML = '<p>An error occurred while retrieving data.</p>';
    }
}


//------------------ Mostra elementi per numero dell'articolo GDPR 

async function fetchElementGDPR() {
    const nomePath = document.getElementById('search-api-input_element').value.trim();
    const apiPath = trovaApiPath(nomePath, elements);
    const articleNumber = document.getElementById('search-number-input_element').value.trim();
    const apiUrl = `http://localhost:1337/api/${apiPath}?filters[Number][$eq]=${articleNumber}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const element = data.data[0];
            let detailsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">Search results for ${nomePath}:</h2><ul>`;
            Object.keys(element.attributes).forEach(key => {
                if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') {
                    detailsHTML += `<li><strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span></li>`;
                }
            });
            detailsHTML += '</ul>';
            document.getElementById('element-details').innerHTML = detailsHTML;
        } else {
            document.getElementById('element-details').innerHTML = '<p>No results.</p>';
        }
    } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
        document.getElementById('element-details').innerHTML = '<p>An error occurred while retrieving data.</p>';
    }
}


//------------------ Mostra elementi per codice ( vulnerabilità)
async function fetchElementVuln() {
    let nomePath = document.getElementById('search-api-input_element').value.trim();
    nomePath = capitalizeFirstLetter(nomePath); // Trasforma le iniziali in maiuscolo
    const apiPath = trovaApiPath(nomePath, elements);
    let vulnerabilityCode = document.getElementById('search-code-input_element').value.trim();
    vulnerabilityCode = capitalizeFirstLetterOfEachWord(vulnerabilityCode);
    const apiUrl = `http://localhost:1337/api/${apiPath}?filters[Code][$eq]=${vulnerabilityCode}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.data && data.data.length > 0) {
            const element = data.data[0];
            let detailsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">Search results for ${nomePath}:</h2><ul>`;
            Object.keys(element.attributes).forEach(key => {
                if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') {
                    detailsHTML += `<li><strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span></li>`;
                }
            });
            detailsHTML += '</ul>';
            document.getElementById('element-details').innerHTML = detailsHTML;
        } else {
            document.getElementById('element-details').innerHTML = '<p>No results.</p>';
        }
    } catch (error) {
        console.error('Errore durante il recupero dei dati:', error);
        document.getElementById('element-details').innerHTML = '<p>An error occurred while retrieving data.</p>';
    }
}



