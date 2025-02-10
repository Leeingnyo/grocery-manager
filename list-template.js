const { produce } = immer;
const { el, place, list } = redom;
const { fromEvent, withLatestFrom, tap } = rxjs;
import { store, stateEmitter$, APP_STATE_KEY } from './state.js';
import { Template } from './item-template.js';
import { TemplateInput } from './template-input.js';

export class ListTemplate {
  #toggleButton;
  #templateInputPlace;
  #templateInput;
  #addButton;
  #list;

  constructor() {
    this.el = el('section.add-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        el('a', { href: '/grocery' }, el('button.btn', '물품 목록')),
        this.#toggleButton = el('button.btn', '템플릿 추가'),
      ),
      this.#templateInputPlace = place(el('div',
        this.#templateInput = new TemplateInput(),
        this.#addButton = el('button.btn', '추가'),
      )),
      el('section.my-2',
        el('h2', '목록'),
        this.#list = list('ul', Template),
      ),
    );

    fromEvent(this.#toggleButton, 'click')
        .subscribe(() => {
          if (this.#templateInputPlace.visible === false) {
            this.#templateInput.reset();
          }
          this.#templateInputPlace.update(!this.#templateInputPlace.visible);
        });

    fromEvent(this.#addButton, 'click')
        .pipe(withLatestFrom(stateEmitter$))
        .pipe(tap(console.log))
        .subscribe(([, state]) => {
          console.log('hi');
          if (!this.#templateInput.valid) return;
          const template = this.#templateInput.value;

          console.log(template);
          store.save(APP_STATE_KEY, produce(state, (draft) => {
            draft.templates = draft.templates ?? [];
            draft.templates.push(template);
          }));
        });

    stateEmitter$.subscribe((state) => {
      this.#list.update(state.templates);
    });
  }

  onunmount() {
    this.#templateInputPlace.update(false);
  }
}

