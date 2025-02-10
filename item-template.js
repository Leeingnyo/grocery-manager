const { produce } = immer;
const { el, router, place } = redom;
const { fromEvent, map, withLatestFrom } = rxjs;
import { store, stateEmitter$, APP_STATE_KEY } from './state.js';

class NumberInput {
  #number;
  #unit;

  constructor() {
    this.el = el('.flex.items-center',
      this.#number = el('input.w-10.text-center', { readonly: true }),
      this.#unit = el('span.mr-1'),
    );
  }

  setNumber(number, unit) {
    this.#number.value = number;
    this.#unit.textContent = unit;
  }
}

class PercentInput {
  #percent;
  #percentValue;

  constructor() {
    this.el = el('.flex.items-center',
      this.#percent = el('input', { disabled: true, type: 'range', min: 0, max: 100, value: 0 }),
      this.#percentValue = el('span.ml-1.min-w-11.text-right'),
    );
  }

  setPercent(percent) {
    this.#percent.value = percent;
    this.#percentValue.textContent = `${percent}%`;
  }
}

class AbundanceInput {
  constructor() {
    this.el = router('', {
      true: el('button.font-bold', '많음'),
      false: el('button.font-bold', '부족'),
    });
  }

  setAbundance(abundance) {
    this.el.update(abundance);
  }
}

export class Template {
  #name;
  #router;
  #comment;

  constructor() {
    this.el = el('article.min-h-9.pt-2.pb-1',
      el('.flex.gap-1.items-center',
        this.#name = el('span.grow'),
        this.#router = router('.contents', {
          '수량': NumberInput,
          '퍼센트': PercentInput,
          '대충': AbundanceInput,
        }),
      ),
      this.#comment = el('span'),
    );
  }

  update(
    {
      name,
      kind,
      number,
      unit,
      step = 1,
      amount,
      abundance,
      expirationDays,
      comment,
    },
    index,
    items,
    { id } = {}
  ) {
    this.#name.textContent = name;
    this.#router.update(kind);
    if (kind === '수량') {
      this.#router.view.setNumber(number, unit);
    } else if (kind === '퍼센트') {
      this.#router.view.setPercent(100);
    } else if (kind === '대충') {
      this.#router.view.setAbundance(true);
    }
    this.#comment.textContent = comment;
  }
}

