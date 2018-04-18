import { $, switch_preferences_tab } from 'yboard';

const LOCALSTORAGE_KEY = 'ylilauta-userscripts-pack';

interface Script {
  name: string;
  enabled: boolean;
}

export class Yliscript {
  public scriptName: string;

  constructor(scriptName: string, main: () => void) {
    this.scriptName = scriptName;

    this.run(main);
  }

  public listenNewReplies(callback: MutationCallback) {
    const observer = new MutationObserver(callback);

    if ($('.answers')[0]) {
      observer.observe($('.answers')[0], { childList: true });
    }
  }

  private run(main: () => void) {
    if (!main) {
      return this.error(
        `Skriptiä <${
          this.scriptName
        }> ei ladattu! Lue esimerkit: http://github.com/ohjelmoija/ylilauta-user-framework/`
      );
    }

    const currentUrl = window.location.href;

    if (currentUrl.includes('/preferences?')) {
      this.addToPreferences();
    }

    if (this.isScriptEnabled()) {
      main();
    }
  }

  private isScriptEnabled() {
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);

    if (!storage) {
      this.createStorage();

      return true;
    }

    const script = this.getScriptFromStorage(storage);
    if (!script) {
      this.addScriptToStorage(storage);
      return true;
    }

    return script.enabled;
  }

  private getScriptFromStorage(storage: string) {
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
    const scripts = JSON.parse(storage);

    const scriptsWithThisName = scripts.filter(
      (script: Script) => script.name === this.scriptName
    );

    if (scriptsWithThisName.length === 0) {
      return undefined;
    }

    return scriptsWithThisName[0];
  }

  private createStorage() {
    const scriptData = [
      {
        enabled: true,
        name: this.scriptName
      }
    ];

    const scriptToJson = JSON.stringify(scriptData);
    localStorage.setItem(LOCALSTORAGE_KEY, scriptToJson);
  }

  private addScriptToStorage(storage: string) {
    const scripts = JSON.parse(storage);
    scripts.push({
      enabled: true,
      name: this.scriptName
    });
    const scriptsToString = JSON.stringify(scripts);
    localStorage.setItem(LOCALSTORAGE_KEY, scriptsToString);
  }

  private toggleScriptStorage(value: boolean) {
    const storage = localStorage.getItem(LOCALSTORAGE_KEY);

    if (storage === null) {
      return;
    }

    const scripts = JSON.parse(storage);
    const newScripts = scripts.map((script: Script) => {
      const newScript = script;
      newScript.enabled = value;

      return script;
    });

    const newScriptsToString = JSON.stringify(newScripts);
    localStorage.setItem(LOCALSTORAGE_KEY, newScriptsToString);
  }

  private addToPreferences() {
    if (!$('li[data-tabid="userscripts"]').get(0)) {
      this.addPreferenceTab();
    }

    if (!$('div.preferences>#userscripts').get(0)) {
      this.addPreferenceWrapper();
      this.loaded();
    }

    if (
      !$(
        `#userscripts>div.script>span.name:contains("${this.scriptName}")`
      ).get(0)
    ) {
      this.addScriptToWrapper();
    }
  }

  private addPreferenceTab() {
    const preferenceTab = $(
      '<li class="tab" data-tabid="userscripts">Käyttäjäskriptit</li>'
    );
    // tslint:disable-next-line:no-any
    preferenceTab.on('click', (event: any) => {
      switch_preferences_tab($(event.currentTarget).data('tabid'), true);
    });

    $('#tabchooser li:last-child').before(preferenceTab);
  }

  private addPreferenceWrapper() {
    const preferenceWrapper = $(
      `<div id="userscripts" class="tab" style="display: none">
        <h3>JavaScript-käyttäjäskriptit</h3>
        <p>Huom! Skriptit eivät käynnisty/sammu ilman sivujen uudelleenpäivitystä.</p>
      </div>`
    );

    $('div.preferences>#sessions').after(preferenceWrapper);
  }

  private addScriptToWrapper() {
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
        ${this.isScriptEnabled() ? 'checked' : ''}
      />`
      // tslint:disable-next-line:no-any
    ).change((event: any) =>
      this.toggleScriptStorage(event.currentTarget.checked)
    );

    const script = $(scriptBox).prepend(checkBox);

    $('#userscripts').append(script);
  }

  private error(message = 'Virhe!') {
    console.error(
      '%c    Ylilauta.fi: pack     ',
      'background: #000; color: #0f0',
      '\n' + message
    );
  }

  private loaded() {
    console.log(
      '%c Ylilauta.fi: pack loaded ',
      'background: #000; color: #0f0'
    );
  }
}
