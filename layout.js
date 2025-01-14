const { el, place } = redom;
const { fromEvent, switchMap, map, throttleTime, debounceTime } = rxjs;
import { getUserInfo } from './google-drive-sync/google-api.js';

import { app } from './app.js';
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';
import { store, APP_STATE_KEY, stateEmitter$, saveEventEmitter$ } from './state.js';

class Layout {
  #syncButton;
  #nav;
  #authorizeButton;
  #signOutButton;
  #username;
  #app;

  #syncSubscripiton;
  #logoutSubscription;
  #loadInterval;
  #saveSubscription;

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

  onmount() {
    this.#syncSubscripiton = fromEvent(window, 'SyncReady').subscribe((e) => {
      const loadSyncedData = async () => {
        const previous = this.#syncButton.textContent;
        this.#syncButton.textContent = 'Syncing...';
        const remoteState = await store.loadRemote(APP_STATE_KEY);
        this.#syncButton.textContent = previous;
        stateEmitter$.next(remoteState);
      };
      this.#loadInterval = setInterval(() => {
        loadSyncedData();
      }, 5 * 60 * 1000);
      loadSyncedData();
    });
    this.#logoutSubscription = fromEvent(window, 'UserLogout').subscribe((e) => {
      clearInterval(this.#loadInterval);
    });

    this.#saveSubscription = saveEventEmitter$.pipe(throttleTime(5000), debounceTime(5000)).subscribe(async (e) => {
      console.log('try to sync data');
      const previous = this.#syncButton.textContent;
      this.#syncButton.textContent = 'Syncing...';
      await googleDriveSyncInstance.syncRemote();
      this.#syncButton.textContent = previous;
    });
  }

  onunmount() {
    this.#syncSubscripiton.unsubscribe();
    clearInterval(this.#loadInterval);
    this.#logoutSubscription.unsubscribe();
    this.#saveSubscription.unsubscribe();
  }
}

export const layout = new Layout(app);

