const { el } = redom;

export class AddGrocery {
  constructor() {
    this.el = el('section.add-grocery',
      this.button = el('button', 'Back to Grocery List'),
    );

    this.button.addEventListener('click', () => {
      page('/grocery');
    });
  }
}

