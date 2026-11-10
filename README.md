# Bruno Bottazzini · Personal website

Sito personale statico per https://brunobottazzini.github.io, in italiano e inglese.

## Anteprima

Dalla cartella del progetto:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Aprire http://127.0.0.1:8080. Nessun processo di compilazione o dipendenza da installare.

## GitHub Pages

1. Usare un repository pubblico chiamato `brunobottazzini.github.io`, nell'account `brunobottazzini`.
2. Caricare i file di questa cartella nella radice del branch `main`, mantenendo `assets/` ed `en/`.
3. In **Settings → Pages**, scegliere **Deploy from a branch**, branch **main**, cartella **/ (root)** e salvare.
4. Attendere la pubblicazione e verificare https://brunobottazzini.github.io e https://brunobottazzini.github.io/en/.

Il file `.nojekyll` segnala che i file devono essere serviti come sito statico. Non serve un dominio a pagamento.

## Contenuti

- `index.html`: versione italiana.
- `en/index.html`: versione inglese.
- `assets/style.css`: stile condiviso e layout responsive.
- `assets/script.js`: menu mobile e copia dell'indirizzo email. Tutti i contenuti e i link principali sono disponibili anche senza JavaScript.
- `assets/projects/`: icone originali dei progetti personali Vinoozy e Trasloco.
- `assets/social-preview.jpg`: anteprima 1200 × 630 per LinkedIn e altri social.
- `robots.txt`, `sitemap.xml`, metadati Open Graph e JSON-LD: indicizzazione e condivisione.

Contenuti biografici ricavati da `Profile.pdf`, fornito il 10 novembre 2026. Il ruolo corrente e le certificazioni rispecchiano il CV; non sono state aggiunte metriche di impatto o referenze non documentate. Foto dal profilo GitHub pubblico dell'utente, ID 4460234. Non sono inclusi analytics, cookie, moduli o servizi di terze parti caricati durante la visita. I font Manrope sono ospitati localmente, con licenza SIL Open Font License in `assets/manrope-license.txt`.

Per aggiornare il sito, modificare entrambe le versioni HTML. Verificare il ruolo corrente, i contatti e le certificazioni quando il profilo cambia. Se il dominio cambia, aggiornare canonical, Open Graph, JSON-LD, hreflang, sitemap e robots.txt.

## Progetti personali

La sezione Progetti presenta Vinoozy e Trasloco, con descrizioni ricavate dai repository pubblici e dalla scheda Google Play di Trasloco. I link portano ai repository originali e, per Trasloco, anche allo store. Le icone provengono dai rispettivi repository dell’autore.

- Vinoozy: https://github.com/brunobottazzini/Vinoozy
- Trasloco: https://github.com/brunobottazzini/Trasloco
- Google Play: https://play.google.com/store/apps/details?id=com.bottazzini.trasloco

Il CV scaricabile è stato rimosso dal sito su richiesta del proprietario. Il PDF originale fornito nella conversazione rimane invariato.
