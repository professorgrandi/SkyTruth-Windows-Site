<div align="center">

# 🛰️ SkyTruth-Windows-Site

### Il sito pubblico delle sessioni di rilevazione di SkyTruth

**Un sito web statico, gratuito e personalizzabile, che mostra le tue sessioni di rilevazione aerea pubblicate direttamente dal programma [SkyTruth](https://github.com/professorgrandi/SkyTruth-Windows).**

![Platform](https://img.shields.io/badge/hosting-GitHub%20Pages-181717?logo=github&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-v1.0-brightgreen)

</div>

---

## Indice

- [Cos'è questo sito](#cosè-questo-sito)
- [Come funziona](#come-funziona)
- [Installazione e pubblicazione](#installazione-e-pubblicazione)
- [Personalizzazione](#personalizzazione)
- [Struttura dei file](#struttura-dei-file)
- [Come pubblicare una sessione (dal programma SkyTruth)](#come-pubblicare-una-sessione-dal-programma-skytruth)
- [Privacy](#privacy)
- [Test in locale](#test-in-locale)
- [Risoluzione problemi](#risoluzione-problemi)
- [Consigli di sicurezza e privacy](#consigli-di-sicurezza-e-privacy)
- [Licenza](#licenza)
- [Crediti](#crediti)
- [Donazioni](#donazioni)

---

## Cos'è questo sito

**SkyTruth-Windows-Site** è la "vetrina pubblica" del programma [SkyTruth](https://github.com/professorgrandi/SkyTruth-Windows): ogni volta che catturi una sessione di rilevazione con il dongle RTL-SDR, puoi pubblicarla qui con due click, direttamente dal menu del programma.

Il sito mostra, per ogni sessione:
- Data e ora di inizio/fine della rilevazione
- Numero di aerei rilevati "ghost" (dal tuo dongle) e "mainstream" (da OpenSky Network)
- Un piccolo grafico di confronto tra i due conteggi
- Uno snapshot della webcam rivolta al cielo (catturato al momento della sessione)

È un sito **completamente statico** (nessun database, nessun server da gestire): gira gratuitamente su **GitHub Pages**, e tutti i dati vivono in un semplice file `sessions.json` dentro il repository stesso.

---

## Come funziona

- La **home page** (`index.html`) legge `sessions.json` e costruisce automaticamente una griglia di riquadri, uno per sessione, ordinati dal più recente al meno recente
- La griglia è divisa in **3 colonne fisse**; ogni pagina mostra fino a **15 sessioni** (5 righe da 3); se le sessioni sono di più, compare automaticamente la **pagina 2, 3, ecc.**
- Se una riga non è completamente piena (es. resta un solo riquadro su 3), gli spazi restanti vengono lasciati semplicemente **vuoti** — non si allargano né si deformano gli altri riquadri
- Cliccando su una sessione si apre `sessione.html`, che mostra tutti i dettagli di quella sessione specifica (letti sempre dallo stesso `sessions.json`, tramite il suo `id`)
- Il sito è **responsive**: su schermi più piccoli, la griglia passa automaticamente a 2 colonne, poi a 1

---

## Installazione e pubblicazione

1. **Crea un tuo repository pubblico** su GitHub, chiamato **esattamente** `SkyTruth-Windows-Site` (il nome deve essere identico: è quello che il programma SkyTruth cerca automaticamente quando pubblichi una sessione)
2. **Scarica il template pulito** dalla sezione [Releases](https://github.com/professorgrandi/SkyTruth-Windows-Site/releases/latest) di questo repository (file `SkyTruth-Windows-Site-Template.zip`) — contiene solo il codice, **senza nessuna sessione precaricata**. *(Non usare "Code → Download ZIP": scaricherebbe anche le sessioni reali eventualmente già pubblicate su questo repository.)*
3. Estrai il contenuto dello zip ed caricalo nel tuo nuovo repository
4. Vai su **Settings** del tuo nuovo repository → **Pages** (nel menu a sinistra)
5. In **"Source"**, seleziona il branch **`main`** e la cartella **`/ (root)`**, poi **Save**
6. Dopo qualche minuto, il tuo sito sarà online all'indirizzo:
   ```
   https://<tuo-nome-utente>.github.io/SkyTruth-Windows-Site/
   ```

Non serve nessun altro passaggio tecnico: GitHub Pages si occupa di tutto il resto automaticamente.

---

## Personalizzazione

**Devi modificare un solo file**: `config.js`. Non serve toccare nessun altro file HTML/CSS/JS.

```javascript
const SKYTRUTH_CONFIG = {
  titoloSito: "SkyTruth",
  sottotitolo: "Sessioni di rilevazione pubbliche",
  nomeUtenteGitHub: "tuo-nome-utente",   // <-- lo aggiorna anche SkyTruth da solo
  emailContatto: "tuaemail@protonmail.com",   // <-- oppure "" se non vuoi impostarla
  indirizzoMonero: "45QW5EeHKzjFhwhhjB6byJdSXd7ZUR4FgELHGz1e4Mt5M3Yt6TSiXzaEHdcEeneWVX3FtCpdvt4toge3aqCvrihf38SSVGv",
  sessioniPerPagina: 15,
  colonneGriglia: 3
};
```

- **`nomeUtenteGitHub`**: usato per costruire automaticamente il titolo del sito ("SkyTruth tuo-nome-utente") e il link al repository del programma principale. **Viene aggiornato automaticamente** da SkyTruth stesso la prima volta che carichi una sessione dal programma — non è strettamente necessario modificarlo a mano, ma puoi farlo comunque se preferisci impostarlo subito

- **`emailContatto`**: personalizzala con la tua email. **Dove diventa visibile online:**
  - In testa al sito, come link cliccabile ("Contatta via ProtonMail")
  - In **ogni pagina di dettaglio sessione**, con la dicitura: *"Per richiedere la registrazione video completa della sessione, scrivi a: [la tua email]"*

  Se lasci questo campo **vuoto** (`""`), sulla pagina di dettaglio comparirà automaticamente **"Email non presente"** al posto del link, senza generare errori.

  ⚠️ **Nota importante**: sotto quella dicitura, il sito mostra sempre anche un avviso automatico che ricorda che le registrazioni video possono contenere dati sensibili (inquadrature dell'ambiente, orari di presenza, dettagli riconoscibili della zona) — valuta sempre attentamente cosa condividi e con chi, prima di inviare un video a chi te lo richiede via email.

- **`indirizzoMonero`**: ⚠️ **questo campo NON è pensato per essere personalizzato**. È l'indirizzo dell'autore originale del progetto SkyTruth, e resta invariato in ogni copia/fork del sito — così chiunque usi il progetto (in qualunque sua copia pubblicata) può comunque scegliere di sostenere lo sviluppo originale. Ti chiediamo di lasciarlo così com'è, per rispetto verso chi ha reso disponibile gratuitamente questo progetto

- **`sessioniPerPagina`** e **`colonneGriglia`**: di norma non serve cambiarli, ma puoi farlo se vuoi una griglia diversa (es. 2 colonne x 10 righe)

---

## Struttura dei file

```
SkyTruth-Windows-Site/
│
├── index.html          ← home page (griglia sessioni + paginazione)
├── sessione.html        ← pagina di dettaglio di una singola sessione
├── style.css             ← grafica del sito (tema scuro, stile "terminale")
├── script.js             ← logica della home page
├── sessione.js           ← logica della pagina di dettaglio
├── config.js             ← UNICO file da personalizzare (vedi sopra)
├── sessions.json         ← dati di tutte le sessioni pubblicate ("database" del sito)
├── snapshots/            ← immagini snapshot di ogni sessione
├── LICENSE
└── README.md             ← questo file
```

---

## Come pubblicare una sessione (dal programma SkyTruth)

1. Nel programma **SkyTruth**, dopo aver avviato la webcam, clicca **"Cattura snapshot per il sito"**
2. Clicca **"Carica sessione sul sito"**
3. Inserisci:
   - **Nome utente GitHub**: il nome del tuo account (dove hai pubblicato questo sito)
   - **Token GitHub**: un token di accesso personale (vedi sotto come generarlo)
4. Clicca **"Invia"** — la sessione viene caricata automaticamente: aggiorna `sessions.json`, carica lo snapshot dentro `snapshots/`, e aggiorna anche `nomeUtenteGitHub` in `config.js`

### Come generare il token GitHub

1. Sul tuo account GitHub: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**
2. Dai un nome al token (es. "SkyTruth upload"), imposta una scadenza a tua scelta
3. Spunta il permesso **`repo`** (necessario per poter scrivere nel repository del sito)
4. **Generate token**, poi **copia subito il codice mostrato** (GitHub lo mostra una sola volta)
5. Incollalo nel popup di SkyTruth quando richiesto

Il token **non viene mai salvato** dal programma: va incollato ogni volta che pubblichi una sessione. Se lo perdi o scade, puoi sempre generarne uno nuovo dal pannello GitHub.

---

## Privacy

Il sito **non pubblica mai**:
- Latitudine, longitudine o raggio di rilevazione (la tua posizione)
- Dati identificativi del tuo PC o della tua rete

Il sito pubblica **solo**:
- Data e ora della sessione
- Conteggio numerico degli aerei rilevati (ghost e mainstream)
- Uno snapshot della **sola finestra webcam** (il cielo, non l'intero schermo)

Se qualcuno richiede via email la registrazione video completa di una sessione, ricorda che quei filmati **possono contenere dati sensibili** (inquadrature dell'ambiente circostante, orari precisi di presenza, dettagli riconoscibili della zona) — il sito mostra sempre un avviso in tal senso nella pagina di ogni sessione, ma la responsabilità di cosa condividere, e con chi, resta comunque tua.

Se vuoi rivedere/eliminare una sessione già pubblicata, puoi modificare o cancellare manualmente la voce corrispondente in `sessions.json` (e l'immagine in `snapshots/`) direttamente da GitHub.

---

## Test in locale

Se vuoi provare il sito sul tuo PC prima di pubblicarlo, **non aprire `index.html` con doppio click**: i browser bloccano per sicurezza la lettura di `sessions.json` quando la pagina è aperta come file locale (`file://`).

Usa invece un piccolo server web locale (incluso in Python, nessuna installazione aggiuntiva):

```
cd SkyTruth-Windows-Site
python -m http.server 8000
```

Poi apri il browser su `http://localhost:8000/`.

---

## Risoluzione problemi

<details>
<summary><b>La griglia resta vuota</b></summary>

Controlla che `sessions.json` sia nella cartella principale del sito (non dentro una sottocartella), e che il sito sia servito tramite un server locale o GitHub Pages (non aperto come file locale — vedi sopra).
</details>

<details>
<summary><b>Le immagini snapshot non si vedono</b></summary>

Verifica che i file indicati nel campo `"snapshot"` di ogni sessione (dentro `sessions.json`) esistano davvero nella cartella `snapshots/`, con lo stesso nome esatto (maiuscole/minuscole comprese).
</details>

<details>
<summary><b>Ho aggiornato un'immagine ma il sito mostra ancora quella vecchia</b></summary>

È quasi sempre un problema di cache di GitHub sulle immagini. Aggiungi un parametro finto all'URL nel punto in cui l'immagine viene referenziata (es. `?v=2`, poi `?v=3` alla prossima modifica) per forzare il ricaricamento.
</details>

<details>
<summary><b>"Carica sessione sul sito" da SkyTruth restituisce un errore</b></summary>

- **Token non valido**: verifica di averlo copiato per intero e che non sia scaduto
- **Repository non trovato**: verifica che il nome utente inserito sia corretto e che il repository si chiami esattamente `SkyTruth-Windows-Site`
- Controlla anche il file di log di SkyTruth (`C:\SkyTruth\logs\`) per il messaggio di errore completo
</details>

---

## Consigli di sicurezza e privacy

Se tieni alla tua privacy nella gestione di questo sito (account GitHub, token, ecc.), ti consigliamo:

- 🛡️ **[ProtonVPN](https://protonvpn.com/)**: usa una VPN mentre gestisci il tuo account GitHub e questo sito, per non esporre il tuo indirizzo IP reale
- ✉️ **[ProtonMail](https://proton.me/mail)**: per contattare il Professor Grandi, o per registrare un account GitHub dedicato a questo progetto, ti consigliamo un indirizzo email creato su ProtonMail (cifrato, orientato alla privacy)

Nessuno di questi due servizi è obbligatorio per far funzionare il sito, ma sono un buon punto di partenza se vuoi mantenere un profilo pubblico "SkyTruth" separato dalla tua identità personale.

---

## Licenza

Questo progetto è distribuito con **licenza MIT** — vedi il file [LICENSE](LICENSE) per il testo completo.

---

## Crediti

Sviluppato da **Professor Grandi (Mahatma)** & **Claude Sonnet 5** (Anthropic), come progetto complementare a [SkyTruth](https://github.com/professorgrandi/SkyTruth-Windows).

---

## Donazioni

Se questo progetto ti è stato utile, puoi supportarne lo sviluppo con una donazione volontaria in Monero (XMR). Questo è l'indirizzo dell'**autore originale** del progetto: resta lo stesso in fondo ad ogni copia/fork di questo sito, così chiunque usi SkyTruth (in qualunque sua versione pubblicata) può comunque scegliere di sostenere chi lo ha creato:

```
45QW5EeHKzjFhwhhjB6byJdSXd7ZUR4FgELHGz1e4Mt5M3Yt6TSiXzaEHdcEeneWVX3FtCpdvt4toge3aqCvrihf38SSVGv
```

---

<div align="center">

*SkyTruth-Windows-Site è un progetto amatoriale, sviluppato per hobby e curiosità personale. Non è affiliato a GitHub, OpenSky Network o Microsoft.*

</div>
