const { el } = redom;

export class AddGrocery {
  constructor() {
    this.el = el('section.add-grocery',
      el('nav.flex.flex-wrap.items-center.gap-2',
        this.button = el('button.btn', 'Back to Grocery List'),
      ),
    );

    this.button.addEventListener('click', () => {
      page('/grocery');
    });
  }
}

