const { el, router } = redom;
const { fromEvent, merge, map, tap } = rxjs;

export class GroceryInput {
  #form;

  #name;
  #kindRouter;
  #kind_수량;
  #kind_퍼센트;
  #kind_대충;

  #number;
  #step;
  #unit;

  #amount;

  #abundance;

  #expirationDate;
  #productionDate;
  #comment;

  latestTemplate$;

  constructor() {
    this.el = this.#form = el('form',
      el('div.my-1',
        el('label', el('span', '이름 '),
          this.#name = el('input.px-1.border.rounded', { name: 'name' }),
        ),
      ),
      el('fieldset.my-1.px-2.py-1.border',
        el('legend.px-2', '종류 '),
        el('label.mx-1',
          this.#kind_수량 = el('input', { type: 'radio', name: 'kind', value: '수량', checked: true }),
          el('span.ml-1', '수량'),
        ),
        el('label.mx-1',
          this.#kind_퍼센트 = el('input', { type: 'radio', name: 'kind', value: '퍼센트' }),
          el('span.ml-1', '퍼센트'),
        ),
        el('label.mx-1',
          this.#kind_대충 = el('input', { type: 'radio', name: 'kind', value: '대충' }),
          el('span.ml-1', '많고 적음'),
        ),
      ),
      this.#kindRouter = router('.contents', {
        '수량': el('.contents',
          el('div.my-1',
            el('label', el('span', '수량 '),
              this.#number = el('input.px-1.border.rounded', { type: 'number', name: 'number' }),
            ),
          ),
          el('div.my-1',
            el('label', el('span', '스텝 '),
              this.#step = el('input.px-1.border.rounded', { type: 'number', name: 'step', value: 1 }),
            ),
          ),
          el('div.my-1',
            el('label', el('span', '수량 '),
              this.#unit = el('input.px-1.border.rounded', { name: 'unit', value: '개' }),
            ),
          ),
        ),
        '퍼센트': el('.contents',
          el('div.my-1',
            el('label', el('span', '퍼센트 '),
              this.#amount = el('input.px-1.border.rounded', { type: 'number', name: 'amount', value: 100, max: 100, min: 0, step: 1 }),
            ),
          ),
        ),
        '대충': el('.contents',
          el('div.my-1',
            el('label', el('span', '충분 여부 '),
              this.#abundance = el('input', { type: 'checkbox', name: 'abundance', checked: true }),
            ),
          ),
        ),
      }),

      el('div.my-1',
        el('label', el('span', '만료일 '),
          this.#expirationDate = el('input.px-1.border.rounded', { type: 'date', name: 'expirationDate' }),
        ),
      ),
      el('div.my-1',
        el('label', el('span', '생산일 '),
          this.#productionDate = el('input.px-1.border.rounded', { type: 'date', name: 'productionDate' }),
        ),
      ),
      el('div.my-1',
        el('label', el('span', '집에 들어온지 '),
          el('input.px-1.border.rounded', { type: 'date' }),
        ),
      ),
      el('div.my-1',
        el('label', el('span', '코멘트 '), el('br'),
          this.#comment = el('textarea.px-1.border.rounded', { name: 'comment' }),
        ),
      ),
    );

    this.#form.addEventListener('submit', e => e.preventDefault());

    merge(
      fromEvent(this.#kind_수량, 'input'),
      fromEvent(this.#kind_퍼센트, 'input'),
      fromEvent(this.#kind_대충, 'input'),
    )
        .pipe(
          map(e => e.currentTarget.value),
        )
        .subscribe(value => {
          this.#kindRouter.update(value);
        });
    this.#kindRouter.update('수량');
  }

  update(grocery) {
    const {
      name,
      kind,
      number,
      step,
      unit,
      amount,
      abundance,
      comment,
      expirationDate,
      productionDate,
    } = grocery;

    this.#name.value = name;
    if (kind === '수량') {
      this.#kind_수량.checked = true;
    } else if (kind === '퍼센트') {
      this.#kind_퍼센트.checked = true;
    } else if (kind === '대충') {
      this.#kind_대충.checked = true;
    }
    this.#kindRouter.update(kind);
    this.#number.value = number;
    this.#step.value = step;
    this.#unit.value = unit;
    this.#amount.value = amount;
    this.#abundance.checked = abundance;
    this.#comment.value = comment ?? '';
    this.#expirationDate.value = expirationDate;
    this.#productionDate.value = productionDate;
  }

  reset() {
    this.#name.value = '';

    this.#number.value = '';
    this.#step.value = 1;
    this.#unit.value = '개';

    this.#amount.value = 100;

    this.#abundance.value = true;

    this.#expirationDate.value = '';
    this.#productionDate.value = '';
    this.#comment.value = '';
  }

  #formData() {
    return [...new FormData(this.#form).entries()].reduce((o, [k, v]) => {
      if (v.trim() !== '') {
        return Object.assign(o, { [k]: v.trim() });
      } else {
        return o;
      }
    }, {});
  }

  get value() {
    const { kind, number = 0, step = 1, unit, amount = 100, abundance, ...rest } = this.#formData();
    if (kind === '수량') {
      return {
        kind, number: +number, step: +step, unit,
        ...rest,
      };
    }
    if (kind === '퍼센트') {
      return {
        kind, amount: +amount,
        ...rest,
      };
    }
    if (kind === '대충') {
      return {
        kind, abundance: abundance === 'true',
        ...rest,
      };
    }
  }

  get valid() {
    const { name, kind, number, step, unit, amount, abundance, ...rest } = this.value;
    return !!(name && kind);
  }
}

