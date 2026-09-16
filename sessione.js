// ============================================================================
// sessione.js — logica della pagina di dettaglio (sessione.html)
// ============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  applicaConfigurazioneComune();

  const parametri = new URLSearchParams(window.location.search);
  const idRichiesto = parseInt(parametri.get("id"), 10);

  const contenitore = document.getElementById("contenuto-dettaglio");

  try {
    const risposta = await fetch("sessions.json");
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

function calcolaConfrontoAerei(listaGhost, listaMainstream) {
  const mappaGhost = new Map(listaGhost.map(a => [(a.icao || "").toUpperCase(), a]));
  const mappaMainstream = new Map(listaMainstream.map(a => [(a.icao || "").toUpperCase(), a]));

  const inComune = [];
  const soloGhost = [];
  const soloMainstream = [];

  for (const [icao, aereo] of mappaGhost) {
    if (mappaMainstream.has(icao)) {
      inComune.push(aereo);
    } else {
      soloGhost.push(aereo);
    }
  }
  for (const [icao, aereo] of mappaMainstream) {
    if (!mappaGhost.has(icao)) {
      soloMainstream.push(aereo);
    }
  }

  return { inComune, soloGhost, soloMainstream };
}

function formattaAltitudine(altitudine) {
  if (altitudine === undefined || altitudine === null || altitudine === "") return "";
  const numero = Math.round(Number(altitudine));
  if (isNaN(numero)) return "";
  return ` · ${numero.toLocaleString("it-IT")} ft`;
}

function creaListaAerei(titolo, aerei, classeExtra) {
  if (aerei.length === 0) {
    return `<div class="gruppo-aerei ${classeExtra}"><h4>${titolo} (0)</h4></div>`;
  }
  const voci = aerei.map(a =>
    `<li><span class="callsign">${a.callsign || a.icao}</span> <span class="icao">(${a.icao})</span><span class="altitudine">${formattaAltitudine(a.altitudine)}</span></li>`
  ).join("");
  return `
    <div class="gruppo-aerei ${classeExtra}">
      <h4>${titolo} (${aerei.length})</h4>
      <ul>${voci}</ul>
    </div>
  `;
}

function creaDiagrammaVenn(confronto) {
  const nSoloGhost = confronto.soloGhost.length;
  const nComune = confronto.inComune.length;
  const nSoloMainstream = confronto.soloMainstream.length;
  const totale = nSoloGhost + nComune + nSoloMainstream;
  const percentualeMatch = totale > 0 ? Math.round((nComune / totale) * 100) : 0;

  return `
    <div class="venn-contenitore">
      <div class="venn-statistica">
        🎯 <strong>${percentualeMatch}%</strong> degli aerei rilevati corrispondono tra le due fonti
      </div>
      <svg viewBox="0 0 480 260" class="venn-svg" role="img" aria-label="Diagramma di confronto tra aerei rilevati dal dongle e da OpenSky">
        <circle cx="185" cy="130" r="95" class="venn-cerchio venn-ghost" />
        <circle cx="295" cy="130" r="95" class="venn-cerchio venn-mainstream" />

        <text x="130" y="45" class="venn-titolo venn-titolo-ghost">GHOST</text>
        <text x="290" y="45" class="venn-titolo venn-titolo-mainstream">MAINSTREAM</text>

        <text x="125" y="135" class="venn-numero">${nSoloGhost}</text>
        <text x="240" y="135" class="venn-numero venn-numero-comune">${nComune}</text>
        <text x="355" y="135" class="venn-numero">${nSoloMainstream}</text>

        <text x="125" y="160" class="venn-sottoetichetta">solo dongle</text>
        <text x="240" y="160" class="venn-sottoetichetta">in comune</text>
        <text x="355" y="160" class="venn-sottoetichetta">solo OpenSky</text>
      </svg>
    </div>
  `;
}

function mostraDettaglio(contenitore, sessione) {
  const email = (typeof SKYTRUTH_CONFIG !== "undefined") ? SKYTRUTH_CONFIG.emailContatto : "";

  const totale = sessione.aerei_ghost + sessione.aerei_mainstream;
  const percentualeGhost = totale > 0 ? (sessione.aerei_ghost / totale) * 100 : 0;
  const percentualeMainstream = totale > 0 ? (sessione.aerei_mainstream / totale) * 100 : 0;

  // Se l'email di contatto non e' stata impostata in config.js, mostriamo
  // un testo semplice invece di un link "mailto" rotto.
  const rigaRichiestaVideo = email
    ? `Per richiedere la registrazione video completa della sessione, scrivi a
       <a href="mailto:${email}">${email}</a>`
    : `Per richiedere la registrazione video completa della sessione, scrivi a:
       <strong>Email non presente</strong>`;

  // Le liste dettagliate esistono solo per le sessioni caricate dopo
  // l'introduzione di questa funzionalita': se mancano (sessioni piu'
  // vecchie o demo), mostriamo comunque i conteggi normalmente, ma
  // saltiamo l'elenco/confronto dettagliato senza generare errori.
  const listaGhost = sessione.aerei_ghost_lista || null;
  const listaMainstream = sessione.aerei_mainstream_lista || null;

  let sezioneElenchi = "";
  if (listaGhost && listaMainstream) {
    const confronto = calcolaConfrontoAerei(listaGhost, listaMainstream);
    sezioneElenchi = `
      <div class="confronto-aerei">
        <h3>Confronto dettagliato</h3>
        ${creaDiagrammaVenn(confronto)}
        ${creaListaAerei("In comune (stesso aereo, entrambe le fonti)", confronto.inComune, "in-comune")}
        ${creaListaAerei("Solo Ghost (solo dongle)", confronto.soloGhost, "solo-ghost")}
        ${creaListaAerei("Solo Mainstream (solo OpenSky)", confronto.soloMainstream, "solo-mainstream")}
      </div>
    `;
  }

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

    ${sezioneElenchi}

    <img class="snapshot-grande" src="${sessione.snapshot}" alt="Snapshot ${sessione.titolo}">

    <div class="richiesta-video">
      ${rigaRichiestaVideo}
      <div class="avviso-privacy">
        ⚠️ Attenzione: le registrazioni video delle sessioni possono contenere
        dati sensibili (es. inquadrature dell'ambiente circostante, orari
        precisi di presenza, dettagli riconoscibili della zona). Valuta con
        attenzione cosa condividi, e con chi, prima di inviare un video
        richiesto via email.
      </div>
    </div>
  `;
  contenitore.appendChild(blocco);
}
