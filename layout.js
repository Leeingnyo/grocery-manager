const { el, place } = redom;
const { fromEvent, switchMap, map } = rxjs;
import { getUserInfo } from './google-drive-sync/google-api.js';

import { app } from './app.js';
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';

class Layout {
  #syncButton;
  #nav;
  #authorizeButton;
  #signOutButton;
  #username;
  #app;

  constructor(app) {
    this.el = el('section',
      el('header.p-2.sticky.top-0.bg-slate-500/50.backdrop-blur',
        el('div.flex.items-center',
          el('h1.text-3xl.grow.text-slate-900', '식료품 관리'),
          this.#syncButton = el('button.btn', 'Sync'),
        ),
        this.#nav = place(el('nav.mt-2.flex.flex-row-reverse.items-center',
          this.#authorizeButton = place(el('button.btn', 'Authorize to Google')),
          this.#signOutButton = place(el('button.btn', 'Sign Out')),
          this.#username = el('span.mx-2.text-slate-900'),
        )),
      ),
      el('section.p-2',
        this.#app = app,
      ),
    );

    let showNav = false;
    fromEvent(this.#syncButton, 'click').subscribe((e) => {
      this.#nav.update(showNav = !showNav);
    });

    fromEvent(this.#authorizeButton._el, 'click').subscribe((e) => {
      googleDriveSyncInstance.login();
    });
    fromEvent(this.#signOutButton._el, 'click').subscribe((e) => {
      googleDriveSyncInstance.logout();
    });

    this.#authorizeButton.update(true);
    fromEvent(window, 'SyncReady').subscribe((e) => {
      this.#syncButton.textContent = 'Synced';
      this.#authorizeButton.update(false);
      this.#signOutButton.update(true);
    });
    fromEvent(window, 'UserLogout').subscribe((e) => {
      this.#syncButton.textContent = 'Sync';
      this.#authorizeButton.update(true);
      this.#signOutButton.update(false);
      this.#username.textContent = '';
    });

    fromEvent(window, 'SyncReady')
      .pipe(
        switchMap(() => getUserInfo()),
        map(({ result }) => result),
        map(({ email }) => email),
      )
      .subscribe((username) => {
        this.#username.textContent = `User: ${username}`;
      });
  }
}

export const layout = new Layout(app);

