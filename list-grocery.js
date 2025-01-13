const { produce } = immer;
const { el, list } = redom;
import { stateEmitter$ } from './state.js';
import { Item } from './item-grocery.js';

class LargeSection {
  #name;
  #items;

  constructor() {
    this.el = el('section.my-2',
      this.#name = el('h2.text-2xl'),
      this.#items = list('section', Item),
    );
  }

  update({ id, name = '' } = {}, _index, _items, { itemMap } = {}) {
    this.#name.textContent = name;
    this.#items.update(itemMap?.[id] ?? [], { id });
  }
}

export class ListGrocery {
  #largeSection;

  constructor() {
    this.el = el('section.list-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        this.button = el('button.btn', 'Add Grocery'),
        el('button.btn', 'Add Item'),
        el('button.btn', 'Manage Items'),
        el('button.btn', 'Shopping List'),
      ),
      this.#largeSection = list('section', LargeSection),
    );

    this.button.addEventListener('click', () => {
      page('/add-grocery');
    });

    stateEmitter$.subscribe((state) => {
      this.#largeSection.update(state.largeSections, state);
    });
  }
}

