const { el, router } = redom;
import { ListGrocery } from './list-grocery.js';
import { AddGrocery } from './add-grocery.js';

export const app = router('.app', {
  'list-grocery': new ListGrocery(),
  'add-grocery': new AddGrocery(),
  'list-item': el('.span', 'list item'),
  'add-item': el('.span', 'add item'),
  'shopping-list': el('.span', 'shopping list'),

  'not-found': el('.span', 'not found'),
});

