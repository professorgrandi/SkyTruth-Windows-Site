// ============================================================================
// config.js — SkyTruth-Windows-Site
// Modifica SOLO questo file per personalizzare il sito con i tuoi dati.
// Non serve toccare nessun altro file HTML/CSS/JS.
// ============================================================================

const SKYTRUTH_CONFIG = {
  // Titolo mostrato in cima al sito
  titoloSito: "SkyTruth",
  sottotitolo: "Sessioni di rilevazione pubbliche",

  // Nome utente GitHub: impostato AUTOMATICAMENTE da SkyTruth (main.py) la
  // prima volta che carichi una sessione, tramite il popup del programma.
  // Non serve modificarlo a mano qui.
  nomeUtenteGitHub: "professorgrandi",

  // Email di contatto (mostrata in testa e nella pagina di dettaglio
  // sessione, per chi vuole richiedere il video completo). Personalizzala
  // pure con la tua email, oppure lasciala vuota ("") se non vuoi
  // ricevere richieste di questo tipo: in quel caso il sito mostrerà
  // automaticamente "Email non presente" al posto del link.
  emailContatto: "professor.grandi@protonmail.com",

  // Indirizzo Monero (XMR) dell'autore originale del progetto SkyTruth.
  // NON MODIFICARE: resta invariato in ogni copia/fork del sito, cosi'
  // chi vuole sostenere lo sviluppo del progetto puo' sempre farlo,
  // indipendentemente da quale copia del sito sta visitando.
  indirizzoMonero: "45QW5EeHKzjFhwhhjB6byJdSXd7ZUR4FgELHGz1e4Mt5M3Yt6TSiXzaEHdcEeneWVX3FtCpdvt4toge3aqCvrihf38SSVGv",

  // Quante sessioni mostrare per pagina (griglia 3 colonne x 5 righe = 15)
  sessioniPerPagina: 15,
  colonneGriglia: 3
};
