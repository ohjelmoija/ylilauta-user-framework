// ==UserScript==
// @name Ylilauta: Koodinväritys
// @namespace Violentmonkey Scripts
// @match *://ylilauta.org/*
// @require https://gitcdn.xyz/repo/ohjelmoija/ylilauta-user-framework/master/ylilauta-user-framework.js
// @require https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js
// @resource highlightCSS https://gitcdn.xyz/repo/isagalaev/highlight.js/cf4b46e5b7acfe2626a07914e1d0d4ef269aed4a/src/styles/darcula.css
// @grant GM_addStyle
// @grant GM_getResourceText
// @version 0.2
// @description Värittää [code]koodinpätkät[/code]
// ==/UserScript==

const highlightCSS = GM_getResourceText('highlightCSS');
GM_addStyle(highlightCSS);

function highlightCode() {
  $('pre.pre').each((i, block) => {
    hljs.highlightBlock(block);
  });
}

const codeHighlighter = new Yliscript('Koodinväritys', function() {
  highlightCode();
  this.listenNewReplies(() => highlightCode());
});
codeHighlighter.add();