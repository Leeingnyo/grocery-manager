const { mount } = redom;
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';
import { layout } from './layout.js';
import { app } from './app.js';

page('/grocery', () => app.update('list-grocery'));
page('/add-grocery', () => app.update('add-grocery'));
page('/list-item', () => app.update('list-item'));
page('/add-item', () => app.update('add-item'));
page('/shopping-list', () => app.update('shopping-list'));

page('*', () => app.update('not-found'));
page({
  hashbang: true,
});

googleDriveSyncInstance.initGoogleLibrary();

mount(document.body, layout);

