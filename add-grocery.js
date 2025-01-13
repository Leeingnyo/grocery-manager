const { el } = redom;

export class AddGrocery {
  constructor() {
    this.el = el('section.add-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        this.button = el('button.btn', '물품 목록'),
      ),
    );

    this.button.addEventListener('click', () => {
      page('/grocery');
    });
  }
}

