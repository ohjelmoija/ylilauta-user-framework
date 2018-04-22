const LOCALSTORAGE_KEY = 'ylilauta-userscripts-pack';

// eslint-disable-next-line no-unused-vars
class Yliscript {
  constructor(scriptName, main) {
    this.scriptName = scriptName;

    if (main) {
      this.main = main;
    } else {
      this.main = () => {
        this._noScriptError();
      }
    }

    this._run();
  }

  listenNewReplies(callback) {
    const observer = new MutationObserver(mutations => {
      if (mutations[0]) {
        const newReplies = [...mutations[0].addedNodes].filter(node =>
          $(node).hasClass('answer')
        );

        if (newReplies.length > 0) {
          // Gives an array of new replies to callback
          callback(newReplies);
        }
      }
    });

    if ($('.answers')[0]) {
      observer.observe($('.answers')[0], { childList: true });
    }

    return this;
  }

  _run() {
    this._addToPreferences();

    if (this._isScriptEnabled()) {
      this.main();
    }
  }

  _isScriptEnabled() {
    const isStorageCreated = !!localStorage.getItem(LOCALSTORAGE_KEY);

    if (!isStorageCreated) {
      this._createStorage();
      return true;
    }

    const script = this._getScriptFromStorage();
    if (!script) {
      this._addScriptToStorage();
      return true;
    }

    return script.enabled;
  }

  _getScriptFromStorage() {
    /* * * Storage: * * *
    ylilauta-userscripts-pack: JSON.stringify([
      {
        name: string,
        enabled: boolean
      },
      ...,
      ...,
    ]);
    */
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);

    const scripts = JSON.parse(storage);

    const scriptsWithThisName = scripts.filter(
      script => script.name === this.scriptName
    );

    if (scriptsWithThisName.length === 0) {
      return undefined;
    }

    return scriptsWithThisName[0];
  }

  _createStorage() {
    const scriptData = [
      {
        name: this.scriptName,
        enabled: true
      }
    ];

    const scriptToJson = JSON.stringify(scriptData);
    localStorage.setItem(LOCALSTORAGE_KEY, scriptToJson);
  }

  _addScriptToStorage() {
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);
    const scripts = JSON.parse(storage);
    scripts.push({
      name: this.scriptName,
      enabled: true
    });
    
    const scriptsToString = JSON.stringify(scripts);
    localStorage.setItem(LOCALSTORAGE_KEY, scriptsToString);
  }

  _toggleScriptStorage(value) {
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);
    const scripts = JSON.parse(storage);
    const newScripts = scripts.map(script => {
      const newScript = script;
      newScript.enabled = value;

      return script;
    });

    const newScriptsToString = JSON.stringify(newScripts);
    localStorage.setItem(LOCALSTORAGE_KEY, newScriptsToString);
  }

  _addToPreferences() {
    const currentUrl = window.location.href;

    if (!currentUrl.includes('/preferences?')) {
      return;
    }

    if (!$('li[data-tabid="userscripts"]').get(0)) {
      this._addPreferenceTab();
    }

    if (!$('div.preferences>#userscripts').get(0)) {
      this._addPreferenceWrapper();
      this._loaded();
    }

    if (
      !$(
        `#userscripts>div.script>span.name:contains("${this.scriptName}")`
      ).get(0)
    ) {
      this._addScriptToWrapper();
    }
  }

  _addPreferenceTab() {
    const preferenceTab = $(
      '<li class="tab" data-tabid="userscripts">Käyttäjäskriptit</li>'
    );
    preferenceTab.on('click', function() {
      // eslint-disable-next-line no-undef, yboard.js defined
      switch_preferences_tab($(this).data('tabid'), true);
    });

    $('#tabchooser li:last-child').before(preferenceTab);
  }

  _addPreferenceWrapper() {
    const preferenceWrapper = $(
      `<div id="userscripts" class="tab" style="display: none">
        <h3>JavaScript-käyttäjäskriptit</h3>
        <p>Huom! Skriptit eivät käynnisty/sammu ilman sivujen uudelleenpäivitystä.</p>
      </div>`
    );

    $('div.preferences>#sessions').after(preferenceWrapper);
  }

  _addScriptToWrapper() {
    const scriptBox = $(
      `<div class="script">
        <span class="name">
          ${this.scriptName}
        </span>
      </div>`
    );

    const checkBox = $(
      `<input
        type="checkbox"
        ${this._isScriptEnabled() ? 'checked' : ''}
      />`
    ).change(event => this._toggleScriptStorage(event.currentTarget.checked));

    const script = $(scriptBox).prepend(checkBox);

    $('#userscripts').append(script);
  }

  _noScriptError() {
    return this._error(
      `Skriptiä <${
        this.scriptName
      }> ei ladattu! Lue esimerkit: http://github.com/ohjelmoija/ylilauta-user-framework/`
    );
  }

  _error(message = 'Virhe!') {
    console.error(
      '%c    Ylilauta.fi: pack     ',
      'background: #000; color: #0f0',
      '\n' + message
    );
  }

  _loaded() {
    console.log(
      '%c Ylilauta.fi: pack loaded ',
      'background: #000; color: #0f0'
    );
  }
}
