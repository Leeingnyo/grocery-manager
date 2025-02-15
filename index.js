const { mount } = redom;
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';
import { layout } from './layout.js';
import { app } from './app.js';

page('/grocery', () => app.update('list-grocery'));
page('/list-template', () => app.update('list-template'));
page('/shopping-list', () => app.update('shopping-list'));

page('*', () => app.update('not-found'));
page({
  hashbang: true,
});

googleDriveSyncInstance.initGoogleLibrary();

mount(document.body, layout);

