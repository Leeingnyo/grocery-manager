const { el } = redom;

export class ListGrocery {
  constructor() {
    this.el = el('section.list-grocery',
      this.button = el('button', 'Add Grocery'),
    );

    this.button.addEventListener('click', () => {
      page('/add-grocery');
    });
  }
}
