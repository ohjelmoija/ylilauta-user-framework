# ylilauta-user-framework

Kehikko, jonka tarkoituksena on auttaa Ylilaudalle käyttäjäskriptien tekijöitä keskittymään ominaisuuksien luontiin.

## Käyttö
YUF on helppo ottaa käyttöön seuraavalla tavalla.
```
// ==UserScript==
// @name Ylilauta: Käyttäjäskriptini
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://raw.githubusercontent.com/ohjelmoija/ylilauta-user-framework/master/ylilauta-user-framework.js
// @version 0.1
// @description Demonstraatio
// ==/UserScript==

new Yliscript('Käyttäjäskriptini', () => {
  console.log('Tämä on ensimmäinen käyttäjäskriptini');
});
```
Huomaa `@require` -rivi, jossa YUF haetaan käyttöön.

`Yliscript`-luokkaan liittyy myös metodeja, jotka helpottavat skriptien luomista.
```
function alertUserOnNewReplies() {
  alert('Uusia viestejä on saapunut');
}

new Yliscript('Käyttäjäskriptini', () => {
  alert('Sivu on ladattu.')
}).listenNewReplies(() => {
  alertUserOnNewReplies();
});
```

Skriptejä ei kannata selvyyden vuoksi koodata suoraan Yliscript-luokan sisälle, vaan kannattaa luoda funktio, jonka Yliscript ajaa.

```
function breakEverything() {
  $('body').html('');
}

new Yliscript('Riko kaikki', () => {
  breakEverything();
});
```