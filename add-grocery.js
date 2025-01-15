const { el } = redom;

export class AddGrocery {
  constructor() {
    this.el = el('section.add-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        el('a', { href: '/grocery' }, el('button.btn', '물품 목록')),
      ),
    );
  }
}

