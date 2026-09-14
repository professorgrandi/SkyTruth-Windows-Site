// ============================================================================
// script.js — logica della home page (index.html)
// ============================================================================

let tutteLeSessioni = [];
let paginaCorrente = 1;

document.addEventListener("DOMContentLoaded", async () => {
  applicaConfigurazioneComune();

  try {
    const risposta = await fetch("sessions.json");
    tutteLeSessioni = await risposta.json();
  } catch (errore) {
    console.error("Impossibile caricare sessions.json:", errore);
    tutteLeSessioni = [];
  }

  // Ordine cronologico: dalla piu' recente alla meno recente.
  tutteLeSessioni.sort((a, b) => new Date(b.data_inizio) - new Date(a.data_inizio));

  disegnaPagina(1);
});

function applicaConfigurazioneComune() {
  if (typeof SKYTRUTH_CONFIG === "undefined") return;

  document.getElementById("titolo-sito").textContent = costruisciTitoloConUtente();
  document.getElementById("sottotitolo-sito").textContent = SKYTRUTH_CONFIG.sottotitolo;

  const linkRepo = document.getElementById("link-repo");
  if (linkRepo) linkRepo.href = `https://github.com/${SKYTRUTH_CONFIG.nomeUtenteGitHub}/SkyTruth-Windows`;

  const linkEmail = document.getElementById("link-email");
  if (linkEmail) linkEmail.href = "mailto:" + SKYTRUTH_CONFIG.emailContatto;

  const indirizzoMonero = document.getElementById("indirizzo-monero");
  if (indirizzoMonero) indirizzoMonero.textContent = SKYTRUTH_CONFIG.indirizzoMonero;
}

function costruisciTitoloConUtente() {
  return SKYTRUTH_CONFIG.nomeUtenteGitHub
    ? `${SKYTRUTH_CONFIG.titoloSito} ${SKYTRUTH_CONFIG.nomeUtenteGitHub}`
    : SKYTRUTH_CONFIG.titoloSito;
}

function formattaIntervalloData(inizioIso, fineIso) {
  const opzioni = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
  const inizio = new Date(inizioIso).toLocaleString("it-IT", opzioni);
  const fine = new Date(fineIso).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  return `${inizio} - ${fine}`;
}

function creaRiquadroSessione(sessione) {
  const link = document.createElement("a");
  link.className = "riquadro-sessione";
  link.href = `sessione.html?id=${sessione.id}`;

  const totale = sessione.aerei_ghost + sessione.aerei_mainstream;
  const percentualeGhost = totale > 0 ? (sessione.aerei_ghost / totale) * 100 : 0;
  const percentualeMainstream = totale > 0 ? (sessione.aerei_mainstream / totale) * 100 : 0;

  link.innerHTML = `
    <img class="miniatura" src="${sessione.snapshot}" alt="Snapshot ${sessione.titolo}">
    <h3>${sessione.titolo}</h3>
    <div class="data-range">${formattaIntervalloData(sessione.data_inizio, sessione.data_fine)}</div>
    <div class="mini-grafico">
      <div class="barra-riga">
        <span class="etichetta">Ghost</span>
        <div class="barra-contenitore"><div class="barra-riempimento" style="width:${percentualeGhost}%"></div></div>
        <span>${sessione.aerei_ghost}</span>
      </div>
      <div class="barra-riga">
        <span class="etichetta">Mainstream</span>
        <div class="barra-contenitore"><div class="barra-riempimento mainstream" style="width:${percentualeMainstream}%"></div></div>
        <span>${sessione.aerei_mainstream}</span>
      </div>
    </div>
  `;
  return link;
}

function creaRiquadroVuoto() {
  const div = document.createElement("div");
  div.className = "riquadro-sessione vuoto";
  return div;
}

function disegnaPagina(numeroPagina) {
  paginaCorrente = numeroPagina;

  const perPagina = (typeof SKYTRUTH_CONFIG !== "undefined") ? SKYTRUTH_CONFIG.sessioniPerPagina : 15;
  const colonne = (typeof SKYTRUTH_CONFIG !== "undefined") ? SKYTRUTH_CONFIG.colonneGriglia : 3;

  const inizio = (numeroPagina - 1) * perPagina;
  const sessioniPagina = tutteLeSessioni.slice(inizio, inizio + perPagina);

  const griglia = document.getElementById("griglia-sessioni");
  griglia.innerHTML = "";

  sessioniPagina.forEach(sessione => {
    griglia.appendChild(creaRiquadroSessione(sessione));
  });

  // Riempiamo gli slot mancanti dell'ULTIMA riga con riquadri vuoti,
  // cosi' la griglia mantiene sempre la sua struttura a colonne fisse.
  const restoUltimaRiga = sessioniPagina.length % colonne;
  const daRiempire = restoUltimaRiga === 0 ? 0 : colonne - restoUltimaRiga;
  for (let i = 0; i < daRiempire; i++) {
    griglia.appendChild(creaRiquadroVuoto());
  }

  disegnaPaginazione(perPagina);
}

function disegnaPaginazione(perPagina) {
  const totalePagine = Math.max(1, Math.ceil(tutteLeSessioni.length / perPagina));
  const contenitore = document.getElementById("paginazione");
  contenitore.innerHTML = "";

  if (totalePagine <= 1) return; // niente paginazione se sta tutto in una pagina

  const bottonePrec = document.createElement("button");
  bottonePrec.textContent = "< Precedente";
  bottonePrec.disabled = paginaCorrente === 1;
  bottonePrec.onclick = () => disegnaPagina(paginaCorrente - 1);
  contenitore.appendChild(bottonePrec);

  for (let p = 1; p <= totalePagine; p++) {
    const bottone = document.createElement("button");
    bottone.textContent = p;
    if (p === paginaCorrente) bottone.classList.add("attiva");
    bottone.onclick = () => disegnaPagina(p);
    contenitore.appendChild(bottone);
  }

  const bottoneSucc = document.createElement("button");
  bottoneSucc.textContent = "Successiva >";
  bottoneSucc.disabled = paginaCorrente === totalePagine;
  bottoneSucc.onclick = () => disegnaPagina(paginaCorrente + 1);
  contenitore.appendChild(bottoneSucc);
}
