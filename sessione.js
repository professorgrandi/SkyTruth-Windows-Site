// ============================================================================
// sessione.js — logica della pagina di dettaglio (sessione.html)
// ============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  applicaConfigurazioneComune();

  const parametri = new URLSearchParams(window.location.search);
  const idRichiesto = parseInt(parametri.get("id"), 10);

  const contenitore = document.getElementById("contenuto-dettaglio");

  try {
    const risposta = await fetch("data/sessions.json");
    const sessioni = await risposta.json();
    const sessione = sessioni.find(s => s.id === idRichiesto);

    if (!sessione) {
      mostraErrore(contenitore, "Sessione non trovata.");
      return;
    }

    mostraDettaglio(contenitore, sessione);
  } catch (errore) {
    console.error("Impossibile caricare i dati della sessione:", errore);
    mostraErrore(contenitore, "Impossibile caricare i dati di questa sessione.");
  }
});

function applicaConfigurazioneComune() {
  if (typeof SKYTRUTH_CONFIG === "undefined") return;

  document.getElementById("titolo-sito").textContent = costruisciTitoloConUtente();

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

function formattaData(iso) {
  const opzioni = { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(iso).toLocaleString("it-IT", opzioni);
}

function mostraErrore(contenitore, messaggio) {
  const div = document.createElement("div");
  div.textContent = messaggio;
  contenitore.appendChild(div);
}

function mostraDettaglio(contenitore, sessione) {
  const email = (typeof SKYTRUTH_CONFIG !== "undefined") ? SKYTRUTH_CONFIG.emailContatto : "";

  const totale = sessione.aerei_ghost + sessione.aerei_mainstream;
  const percentualeGhost = totale > 0 ? (sessione.aerei_ghost / totale) * 100 : 0;
  const percentualeMainstream = totale > 0 ? (sessione.aerei_mainstream / totale) * 100 : 0;

  const blocco = document.createElement("div");
  blocco.innerHTML = `
    <h2>${sessione.titolo}</h2>

    <div class="riga-dato">
      <span class="etichetta">Inizio rilevazione</span>
      <span>${formattaData(sessione.data_inizio)}</span>
    </div>
    <div class="riga-dato">
      <span class="etichetta">Fine rilevazione</span>
      <span>${formattaData(sessione.data_fine)}</span>
    </div>
    <div class="riga-dato">
      <span class="etichetta">Aerei rilevati (Ghost / dongle)</span>
      <span>${sessione.aerei_ghost}</span>
    </div>
    <div class="riga-dato">
      <span class="etichetta">Aerei rilevati (Mainstream / OpenSky)</span>
      <span>${sessione.aerei_mainstream}</span>
    </div>

    <div class="mini-grafico" style="margin-top:20px;">
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

    <img class="snapshot-grande" src="${sessione.snapshot}" alt="Snapshot ${sessione.titolo}">

    <div class="richiesta-video">
      Per richiedere il video completo della sessione, invia una email a
      <a href="mailto:${email}">${email}</a>
    </div>
  `;
  contenitore.appendChild(blocco);
}
