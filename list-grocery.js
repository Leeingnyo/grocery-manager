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
      this.#items = list('section.divide-y', Item),
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
        el('a', { href: '/add-grocery' }, el('button.btn', '물품 추가')),
        el('button.btn', '템플릿 추가'),
        el('button.btn', '템플릿 관리'),
        el('button.btn', '장보기'),
      ),
      this.#largeSection = list('section', LargeSection),
    );

    stateEmitter$.subscribe((state) => {
      this.#largeSection.update(state.largeSections, state);
    });
  }
}

