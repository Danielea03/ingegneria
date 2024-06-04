/* EXIT */
document.getElementById('popup-trigger').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'grid';
  });
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  
  function closeWindow() {
    var isConfirmed = confirm("Vuoi davvero chiudere la finestra?");
    if (isConfirmed) {
      try {
        window.close();
        setTimeout(function() {
          localStorage.removeItem('cronologia');
          window.location.href = "exit.html";
        }, 1000);
      } catch (e) {
        localStorage.removeItem('cronologia');
        window.location.href = "exit.html";
      }
    }
  }
  
  var exitIcon = document.querySelector('.exit_icon img');
  
  exitIcon.addEventListener('mouseover', function() {
    // Cambia l'immagine al passaggio del mouse
    exitIcon.src = 'img_layout/exit_close_con_cursore.png'; // Sostituisci 'nuova_icona.png' con il percorso della tua nuova icona
  });
  
  exitIcon.addEventListener('mouseout', function() {
    // Ripristina l'immagine al passaggio del mouse
    exitIcon.src = 'img_layout/exit_close_senza_cursore.png'; // Sostituisci con il percorso dell'immagine originale
  });
  
  // Aggiorna questa parte di codice per chiudere il popup quando viene cliccata l'icona "exit_icon"
  exitIcon.addEventListener('click', function() {
    closePopup();
  });
  
  
  
  // Funzione per cambiare l'utente e rimuovere la cronologia
  function changeUserAndClearHistory() {
    // Conferma se l'utente vuole cambiare
    var isConfirmed = confirm("Sei sicuro di voler cambiare utente?");
    if (isConfirmed) {
      try {
        // Esegui il cambio utente
        window.location.href = "user.html";
        // Rimuovi la cronologia salvata fino ad ora
        localStorage.removeItem('cronologia');
      } catch (e) {
        // Se si verifica un errore, rimuovi comunque la cronologia
        localStorage.removeItem('cronologia');
      }
    }
  }
  
/* MENU */
document.addEventListener('DOMContentLoaded', function() {
  const dropdowns = document.querySelectorAll('.dropdown');
  let activeDropdown = null;

  dropdowns.forEach((dropdown) => {
      dropdown.addEventListener('click', () => {
          // Verifica se hai cliccato sullo stesso dropdown
          const isSameDropdown = dropdown === activeDropdown;

          // Rimuovi la classe 'active' dal dropdown attualmente attivo
          if (activeDropdown && !isSameDropdown) {
              activeDropdown.classList.remove('active');
          }

          // Applica o rimuovi la classe 'active' sull'elemento cliccato
          dropdown.classList.toggle('active');

          // Imposta il nuovo dropdown come attivo
          activeDropdown = isSameDropdown ? null : dropdown;
          
          // Chiudi il dropdown del footer se aperto
          const feedbackDropdown = document.querySelector('#footerFeedbackDropdown');
          if (feedbackDropdown.classList.contains('show')) {
              feedbackDropdown.classList.remove('show');
          }
      });
  });
});

/* FUNZIONI FRECCE */

function goBack() {
  window.history.back();
}

function goForward() {
  window.history.forward();
}

/* FUNZIONI MENU A SCOMPARSA */

document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('.items a');
  links.forEach(link => {
      link.addEventListener('click', function (event) {
          event.preventDefault();
          const contentId = this.getAttribute('data-content');
          const contents = document.querySelectorAll('.hidden-content');
          contents.forEach(content => {
              content.classList.remove('content-visible');
          });
          document.getElementById(contentId).classList.add('content-visible');
          const visibleContent = document.getElementById(contentId).innerHTML;
          document.querySelector('.right_section').innerHTML = visibleContent;
          
          // Chiudi il dropdown del footer se aperto
          const feedbackDropdown = document.querySelector('#footerFeedbackDropdown');
          if (feedbackDropdown.classList.contains('show')) {
              feedbackDropdown.classList.remove('show');
          }
      });
  });
});



// INTERFACCIA FOOTER

document.addEventListener('DOMContentLoaded', function() {
  const sendFeedbackDropdown = document.querySelector('.send_feedback_dropdown');
  const feedbackDropdown = document.querySelector('#footerFeedbackDropdown');
  const sendIcon = sendFeedbackDropdown.querySelector('.send_icon');
  
  sendFeedbackDropdown.addEventListener('click', function(event) {
      event.stopPropagation();
      
      // Chiudi tutti gli altri menu
      const dropdowns = document.querySelectorAll('.dropdown.active');
      dropdowns.forEach(dropdown => {
          dropdown.classList.remove('active');
      });

      // Toggle del feedback dropdown e gestione dello stato attivo
      feedbackDropdown.classList.toggle('show');
      sendIcon.classList.toggle('active1');
  });
});



// Chiudi il dropdown se l'utente clicca fuori
window.onclick = function(event) {
  if (!event.target.closest('.send_feedback_dropdown')) {
      var dropdowns = document.getElementsByClassName("footer-items");
      for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
      document.querySelector('.send_icon').classList.remove('active1');
  }
}