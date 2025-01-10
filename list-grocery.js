const { el, list } = redom;

class Item {
  #name;

  constructor() {
    this.el = el('article',
      this.#name = el('span'),
    );
  }

  update({ name }) {
    this.#name.textContext = name;
  }
}

class LargeSection {
  #name;
  #items;

  constructor() {
    this.el = el('section.my-2',
      this.#name = el('h2.text-2xl'),
      this.#items = list('section', Item),
    );
  }

  update({ id, name = '' } = {}, _index, _items, context) {
    this.#name.textContent = name;
    this.#items.update(context?.[id] ?? []);
  }
}

const largeSections = [
  { id: 0, name: '냉장고' },
  { id: 1, name: '냉동고' },
  { id: 2, name: '실온' },
];

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

    this.#largeSection.update(largeSections, {});
  }
}

