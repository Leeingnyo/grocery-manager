const { el } = redom;
import { app } from './app.js';

class Layout {
  constructor(app) {
    this.el = el('section.layout',
      this.h1 = el('h1', 'Home Grocery Manager'),
      el('section',
        this.app = app,
      ),
    );
  }
}

export const layout = new Layout(app);

