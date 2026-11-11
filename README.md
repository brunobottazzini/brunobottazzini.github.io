# Bruno Bottazzini · Personal website

Sito personale statico per https://brunobottazzini.github.io, in italiano, inglese e portoghese (Brasile).
Tema scuro, interattivo, senza framework e senza dipendenze: HTML, CSS e JavaScript vanilla.

## Anteprima

Dalla cartella del progetto:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Aprire http://127.0.0.1:8080. Nessun processo di compilazione o dipendenza da installare.
Meglio non aprire i file con doppio clic: alcuni browser bloccano i font locali su `file://`.

## GitHub Pages

1. Usare un repository pubblico chiamato `brunobottazzini.github.io`, nell'account `brunobottazzini`.
2. Caricare i file di questa cartella nella radice del branch `main`, mantenendo `assets/`, `en/` e `pt-br/`.
3. In **Settings → Pages**, scegliere **Deploy from a branch**, branch **main**, cartella **/ (root)** e salvare.
4. Attendere la pubblicazione e verificare https://brunobottazzini.github.io, `/en/` e `/pt-br/`.

Il file `.nojekyll` segnala che i file devono essere serviti come sito statico. Non serve un dominio a pagamento.

## Struttura

- `index.html`: versione italiana.
- `en/index.html`: versione inglese.
- `pt-br/index.html`: versione portoghese (Brasile).
  Le tre pagine hanno la stessa identica struttura, cambiano solo i testi.
- `assets/style.css`: design system (token colore e font in cima al file), layout e responsive.
- `assets/script.js`: tutte le parti interattive, commentate blocco per blocco.
- `assets/fonts/`: Manrope, JetBrains Mono e Instrument Serif Italic in formato woff2, con licenza in `OFL.txt`.
- `assets/projects/`: icone originali dei progetti personali Vinoozy e Trasloco.
- `assets/social-preview.jpg`: anteprima 1200 × 630 per LinkedIn e altri social.
- `404.html`, `robots.txt`, `sitemap.xml`, metadati Open Graph, hreflang e JSON-LD: indicizzazione e condivisione.

## Il design in breve

Il colore ha un significato: **lime = quello che fa l'AI**, **ambra = quello che decidono le persone**.
Vale nella rete animata dell'hero (il puntatore del visitatore accende nodi ambra), nell'agente
(domanda in ambra, risposta in lime) e nel ciclo AI-DLC.

## Parti interattive

Tutte in `assets/script.js`. Il contenuto resta leggibile anche con JavaScript disattivato e le animazioni
si fermano con `prefers-reduced-motion`.

| Cosa | Dove | Note |
| --- | --- | --- |
| Rete neurale animata | hero | Canvas 2D. Reagisce a puntatore e clic. Si mette in pausa fuori schermo. |
| Agente `bruno.agent` | hero | Demo dichiarata: risposte scritte a mano, ricerca per parole chiave, nessun modello e nessuna chiamata di rete. Risponde nella lingua della pagina. |
| Command palette | ovunque | `Cmd/Ctrl + K` oppure `/`. Naviga le sezioni, copia l'email, cambia lingua, passa una domanda all'agente. |
| Ciclo AI-DLC | sezione Metodo | Tre fasi a schede con avanzamento automatico; si ferma al primo clic o tasto. |
| Competenze con riscontro | sezione Competenze | Ogni competenza mostra dove è stata messa in pratica. |
| Registro di addestramento e stack nel tempo | sezione Studio continuo | Le righe e le barre compaiono quando la sezione entra in vista. Le barre sono in scala sulle date dei ruoli del CV: lime se la tecnologia è in uso oggi. |
| Mostra tutti i progetti | sezione Progetti | Elemento `<details>`: apre i progetti Soletta. Funziona anche senza JavaScript. |

### Aggiornare le risposte dell'agente

In `assets/script.js` cercare `const KB`. Ogni voce ha:

- `k`: parole chiave (senza accenti, minuscole; uno spazio finale richiede la parola intera, es. `'ai '`).
  Italiano, inglese e portoghese stanno nella stessa lista;
- `p`: peso dell'argomento (più alto = vince sugli argomenti generici);
- `c`: sezioni citate sotto la risposta;
- `a`: risposta in italiano (`it`), inglese (`en`) e portoghese (`pt`).

Se nessuna voce corrisponde, l'agente lo dice e rimanda all'email: non inventa.

## Aggiornare i contenuti

Modificare **tutte e tre** le versioni HTML (`index.html`, `en/index.html`, `pt-br/index.html`). Dopo una
modifica a CSS o JS, aumentare il numero in `style.css?v=4` e `script.js?v=4` dentro le tre pagine e in
`404.html`, così i browser scaricano la versione nuova. Verificare ruolo corrente, contatti e certificazioni
quando il profilo cambia. Se il dominio cambia, aggiornare canonical, Open Graph, JSON-LD, hreflang, sitemap
e robots.txt.

## Fonti dei contenuti

- Percorso, certificazioni, lingue e riconoscimenti: `Profile.pdf` (export LinkedIn), fornito l'11 novembre 2026.
  "15+ anni" deriva dalle date del CV (primo ruolo: agosto 2010).
- AI Competence Center, Spec-Driven Development, AWS AI-DLC, abilitazione e formazione, skill e connettori MCP,
  dominio digital trust / eIDAS2: indicazioni dirette del proprietario. Nessun nome di cliente o progetto interno.
- Descrizione di AI-DLC (fasi, bolt, unit of work, Mob Elaboration / Mob Construction):
  https://aws.amazon.com/blogs/devops/ai-driven-development-life-cycle/
- CKA: resta tra le certificazioni, ma su indicazione del proprietario non compare tra i dati in evidenza.
- Non sono state aggiunte metriche di impatto o referenze non documentate.
- Foto dal profilo GitHub pubblico dell'utente, ID 4460234.

### Contributi open source

Verificati l'11 novembre 2026 cercando nella storia git dei repository i commit con autore
`Bruno Bottazzini <bruno.bottazzini@intel.com>`. Sul sito sono linkati questi:

| Progetto | Repository | Commit |
| --- | --- | --- |
| systemd | systemd/systemd | `9cad100` util: use a shared lookup function for string tables (in v219) |
| Yocto Project | yoctoproject/poky | `935a8bd` mkefidisk: Create interactive menu for the script · `942ec74` e `7bfc989` sulla recipe di systemd |
| Yocto Project | openembedded/meta-openembedded | `c22af99` libmicrohttpd: update to 0.9.49 |
| Clear Linux | clearlinux/autospec | `d29199f`, `0ee281a` |
| Clear Linux | clearlinux/clr-bundles | `6260ba1` Add libmicrohttpd in iot bundle |
| Clear Linux | clearlinux-pkgs/nodejs | `1288de6` Initial packaging (in tutto 17 commit di packaging tra nodejs, connman, mosquitto, libmicrohttpd, soletta e soletta-dev-app) |
| Soletta | solettaproject/soletta-dev-app | primo commit `0c32bf1`; 125 dei 148 commit |
| Soletta | solettaproject/meta-soletta | primo commit `56cb2d2`; 61 dei 99 commit |
| Soletta | solettaproject/soletta | 14 commit, il primo è `2e3e2a4` |

`edison-linux` non è citato: né in `intel/edison-linux` né nel fork personale risultano commit a quel nome.

## Progetti personali

- Vinoozy: https://github.com/brunobottazzini/Vinoozy · descrizione dal README; "sviluppata seguendo AI-DLC"
  perché il repository contiene la cartella `aidlc/` con gli intenti del progetto.
- Trasloco: https://github.com/brunobottazzini/Trasloco ·
  Google Play: https://play.google.com/store/apps/details?id=com.bottazzini.trasloco
- Tiramisù: https://github.com/brunobottazzini/Tiramisu · un gioco, per indicazione del proprietario.
  Il repository per ora contiene solo titolo e licenza MIT.
- ledfbp: https://github.com/brunobottazzini/ledfbp · esempio FBP per Soletta.

Le icone di Vinoozy e Trasloco provengono dai rispettivi repository dell'autore.
Il CV scaricabile non è pubblicato sul sito, su richiesta del proprietario.

## Privacy

Nessun analytics, cookie, modulo o servizio di terze parti caricato durante la visita. Font e script sono
ospitati localmente. L'agente dimostrativo gira nel browser e non invia nulla.

## File non più usati

`assets/manrope-regular.ttf`, `assets/manrope-bold.ttf` e `assets/manrope-license.txt` appartenevano alla
prima versione e non sono più referenziati: si possono rimuovere con `git rm`.
