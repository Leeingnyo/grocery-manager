const { produce } = immer;
const { el, list, place } = redom;
const { fromEvent, withLatestFrom, tap } = rxjs;
import { store, stateEmitter$, APP_STATE_KEY } from './state.js';
import { Item } from './item-grocery.js';
import { GroceryInput } from './grocery-input.js';

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
  #toggleButton;
  #sectionSelect;
  #groceryInputPlace;
  #groceryInput;
  #addButton;
  #largeSection;

  constructor() {
    this.el = el('section.list-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        this.#toggleButton = el('button.btn', '물품 추가'),
        el('a', { href: '/list-template' }, el('button.btn', '템플릿 관리')),
        el('button.btn', '장보기'),
      ),
      this.#groceryInputPlace = place(el('div',
        el('div.my-2',
          el('label', el('span', '위치'),
            this.#sectionSelect = el('select.ml-2',
              el('option', { value: 0 }, '냉장고'),
              el('option', { value: 1 }, '냉동고'),
              el('option', { value: 2 }, '실온'),
            ),
          ),
        ),
        this.#groceryInput = new GroceryInput(),
        this.#addButton = el('button.btn', '추가'),
      )),
      this.#largeSection = list('section', LargeSection),
    );

    fromEvent(this.#toggleButton, 'click')
        .subscribe(() => {
          if (this.#groceryInputPlace.visible === false) {
            this.#groceryInput.reset();
          }
          this.#groceryInputPlace.update(!this.#groceryInputPlace.visible);
        });

    fromEvent(this.#addButton, 'click')
        .pipe(withLatestFrom(stateEmitter$))
        .pipe(tap(console.log))
        .subscribe(([, state]) => {
          if (!this.#groceryInput.valid) return;
          const section = Number.parseInt(this.#sectionSelect.value);
          const grocery = this.#groceryInput.value;

          console.debug('[GROCERY] Adding item: ', section, grocery);
          store.save(APP_STATE_KEY, produce(state, (draft) => {
            if (!draft.largeSections.map(({ id }) => id).includes(section)) return;
            if (!draft.itemMap[section]) {
              draft.itemMap[section] = [];
            }

            draft.itemMap[section].push(grocery);
          }));
          this.#groceryInput.reset();
        });

    stateEmitter$.subscribe((state) => {
      this.#largeSection.update(state.largeSections, state);
    });
  }
}

