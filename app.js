const { el, router } = redom;
import { ListGrocery } from './list-grocery.js';
import { ListTemplate } from './list-template.js';

export const app = router('.app', {
  'list-grocery': new ListGrocery(),
  'list-template': new ListTemplate(),
  'shopping-list': el('.span', 'shopping list'),

  'not-found': el('.span', 'not found'),
});

