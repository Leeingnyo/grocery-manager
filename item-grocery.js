const { produce } = immer;
const { el, router, place } = redom;
const { fromEvent, map, combineLatestWith } = rxjs;
import { store, stateEmitter$, APP_STATE_KEY } from './state.js';

class NumberInput {
  #minus;
  #unit2;
  #number;
  #unit;
  #plus;

  constructor() {
    this.el = el('.flex.items-center',
      this.#minus = el('button.btn', '-'),
      this.#unit2 = el('span.ml-1.invisible'),
      this.#number = el('input.w-10.text-center'),
      this.#unit = el('span.mr-1'),
      this.#plus = el('button.btn', '+'),
    );

    this.minus$ = fromEvent(this.#minus, 'click').pipe(map((e) => -1));
    this.number$ = fromEvent(this.#number, 'input').pipe(map((e) => {
      console.log(
        e.currentTarget.value, (+e.currentTarget.value).toString(),
        e.currentTarget.value === (+e.currentTarget.value).toString()
      );
      return (
        e.currentTarget.value === (+e.currentTarget.value).toString() ?
          e.currentTarget.value : undefined
      );
    }));
    this.plus$ = fromEvent(this.#plus, 'click').pipe(map((e) => 1));
  }

  setNumber(number, unit) {
    this.#number.value = number;
    this.#unit2.textContent =
    this.#unit.textContent = unit;
  }
}

class PercentInput {
  #percent;
  #percentValue;

  constructor() {
    this.el = el('.flex.items-center',
      this.#percent = el('input', { type: 'range', min: 0, max: 100, value: 0 }),
      this.#percentValue = el('span.ml-1.min-w-11.text-right'),
    );

    this.percent$ = fromEvent(this.#percent, 'input').pipe(map((e) => +e.currentTarget.value));
  }

  setPercent(percent) {
    this.#percent.value = percent;
    this.#percentValue.textContent = `${percent}%`;
  }
}

class AbundanceInput {
  #less;
  #much;

  constructor() {
    this.el = router('', {
      true:
        el('.flex.gap-2',
          this.#less = el('button', '부족'),
          el('button.font-bold', '많음'),
        ),
      false: 
        el('.flex.gap-2',
          el('button.font-bold', '부족'),
          this.#much = el('button', '많음'),
        ),
    });

    this.less$ = fromEvent(this.#less, 'click').pipe(map((e) => false));
    this.much$ = fromEvent(this.#much, 'click').pipe(map((e) => true));
  }

  setAbundance(abundance) {
    this.el.update(abundance);
  }
}

export class Item {
  #name;
  #router;
  #subscriptions;

  constructor() {
    this.el = el('article.flex.gap-1.items-center.min-h-9',
      this.#name = el('span.grow'),
      this.#router = router('.contents', {
        '수량': NumberInput,
        '퍼센트': PercentInput,
        '대충': AbundanceInput,
      }),
    );
  }

  update(
    {
      name,
      kind,
      number,
      unit,
      amount,
      abundance,
      productionDate,
      expirationDate,
    },
    index,
    items,
    { id } = {}
  ) {
    if (this.#subscriptions?.length) {
      this.#subscriptions.forEach((subscription) => subscription.unsubscribe());
    }
    this.#name.textContent = name;
    this.#time.update({ productionDate, expirationDate });
    this.#router.update(kind);
    if (kind === '수량') {
      this.#router.view.setNumber(number, unit);
      const minusSubscription = this.#router.view.minus$.pipe(combineLatestWith(stateEmitter$)).subscribe(([, state]) => {
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].number -= 1;
        }));
      });
      const numberSubscription = this.#router.view.number$.pipe(combineLatestWith(stateEmitter$)).subscribe(([number, state]) => {
        if (number === undefined) {
          return;
        }
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].number = number;
        }));
      });
      const plusSubscription = this.#router.view.plus$.pipe(combineLatestWith(stateEmitter$)).subscribe(([, state]) => {
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].number += 1;
        }));
      });
      this.#subscriptions = [minusSubscription, numberSubscription, plusSubscription];
    } else if (kind === '퍼센트') {
      this.#router.view.setPercent(amount);
      const percentSubscription = this.#router.view.percent$.pipe(combineLatestWith(stateEmitter$)).subscribe(([amount, state]) => {
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].amount = amount;
        }));
      });
      this.#subscriptions = [percentSubscription];
    } else if (kind === '대충') {
      this.#router.view.setAbundance(abundance);
      const lessSubscription = this.#router.view.less$.pipe(combineLatestWith(stateEmitter$)).subscribe(([abundance, state]) => {
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].abundance = abundance;
        }));
      });
      const muchSubscription = this.#router.view.much$.pipe(combineLatestWith(stateEmitter$)).subscribe(([abundance, state]) => {
        store.save(APP_STATE_KEY, produce(state, (draft) => {
          draft.itemMap[id][index].abundance = abundance;
        }));
      });
      this.#subscriptions = [lessSubscription, muchSubscription];
    }
  }
}

