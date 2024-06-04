
//-----------------------------
//---------MOSTRA ASSOCIAZIONI
// Funzione per trovare le associazioni tra elementi
async function fetchAssociations() {
    let nomePath = document.getElementById('search-api-input_element').value.trim();
    let elementName = document.getElementById('search-name-input_element').value.trim();
    let targetTopic = document.getElementById('search-api-input_association_topic').value.trim();

    // Trasforma le prime lettere in maiuscolo
    nomePath = capitalizeFirstLetter(nomePath);
    elementName = capitalizeFirstLetterOfEachWord(elementName);
    targetTopic = capitalizeFirstLetter(targetTopic);
    
    let apiPath = trovaApiPath(nomePath, elements);
    let apiPath1 = trovaApiPath(targetTopic, elements);

    // Verifica che tutti i campi siano stati riempiti
    if (!nomePath || !elementName || !targetTopic) {
        document.getElementById('element-details').innerHTML = '<p>Please fill in all the fields.</p>';
        return;
    }
    
    const apiUrl = `http://localhost:1337/api/${apiPath1}?filters[${apiPath}][Name][$eq]=${elementName}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const data = await response.json();
        if (data.data && data.data.length > 0) {
            let detailsHTML = `<h2 style="font-family: 'Lato', sans-serif; font-size: 26px;">Search results for ${nomePath}:</h2><ul style="font-family: 'Lato', sans-serif;">`;
            data.data.forEach(element => {
                detailsHTML += '<li style="font-family: \'Lato\', sans-serif;">';
                // Aggiungi l'ID dell'elemento
                detailsHTML += `<strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">ID</strong>: <span style="font-family: 'Lato', sans-serif;">${element.id}</span><br>`;
                Object.keys(element.attributes).forEach(key => {
                    // Ignora gli attributi specificati
                    if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'publishedAt') {
                        detailsHTML += `<strong style="font-family: 'Lato', sans-serif; font-size: 18px; font-weight: bold;">${key}</strong>: <span style="font-family: 'Lato', sans-serif;">${element.attributes[key]}</span><br>`;
                    }
                });
                detailsHTML += '</li><br>'; // Aggiungi uno spazio tra gli elementi
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

// Trasforma le iniziali in maiuscolo e le altre lettere in minuscolo
function capitalizeFirstLetterOfEachWord(string) {
    return string
        .split(' ')
        .map(word => word
            .split('-')
            .map(subWord => subWord.charAt(0).toUpperCase() + subWord.slice(1).toLowerCase())
            .join('-')
        )
        .join(' ');
}

// Per i topic tutti maiuscoli tipo GDPR, PBD ecc..
function capitalizeFirstLetter(string) {
    const exceptions = ["pattern", "vulnerability", "strategy"]; // Array di parole da trattare in modo differente

    return string
    // Viene estratta la parola
      .split(' ') 
      // La funzione itera su ogni parola  separata da uno spazio usando map
      // word  assume il valore di ogni singola parola separata da uno spazio all'interno della stringa
      .map(word => {
        const lowerCaseWord = word.toLowerCase(); // Converte la parola in minuscolo
        if (exceptions.includes(lowerCaseWord)) {
          // Se la parola è nell'elenco delle eccezioni, capitalizza solo la prima lettera
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        } else {
          // Per le altre parole, converti tutto in maiuscolo
          return word.toUpperCase();
        }
      })
      .join(' ');
}