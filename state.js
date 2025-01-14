const { Subject, BehaviorSubject, filter, map } = rxjs;
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';

const largeSections = [
  { id: 0, name: '냉장고' },
  { id: 1, name: '냉동고' },
  { id: 2, name: '실온' },
];

const INITIAL_STATE = {
  largeSections,
  itemMap: {},
};

export const APP_STATE_KEY = 'grocery-manager.state';

export const store = new Proxy(googleDriveSyncInstance, {
  get(target, prop, receiver) {
    const value = Reflect.get(target, prop, receiver);
    if (value instanceof Function) {
      return function (...args) {
        const result = value.apply(this === receiver ? target : this, args);
        if (prop === 'save' || prop === 'saveRemote') {
          const [key] = args;
          if (key === APP_STATE_KEY) {
            const updatedValue = target['load'](key);
            stateEmitter$.next(updatedValue);
            saveEventEmitter$.next(new Date());
          }
        }
        return result;
      }
    }
    return value;
  }
});

export const stateEmitter$ = new BehaviorSubject(googleDriveSyncInstance.load(APP_STATE_KEY) ?? INITIAL_STATE);

export const saveEventEmitter$ = new Subject();

