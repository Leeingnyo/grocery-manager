const { Subject, BehaviorSubject, filter, map } = rxjs;
import { googleDriveSyncInstance } from './google-drive-sync-instance.js';

const largeSections = [
  { id: 0, name: '냉장고' },
  { id: 1, name: '냉동고' },
  { id: 2, name: '실온' },
];
const categories = [
  '채소',
  '과일',
  '쌀',
  '떡',

  '육류',
  '가공육',

  '해산물',
  '가공해산물',

  '계란',
  '우유',
  '유제품',
  '치즈',

  '건면',
  '즉석면',

  '기본 조미료',
  '양념',
  '장류',
  '소스류',
  '향신료',

  '반찬',

  '가루류',

  '즉석식품',
  '통조림',
  '건어물',

  '음료',
  '주류',

  '과자류',
  '아이스크림',
  '기타간식',
];

/**
// item
{
  id: string;
  name: string;
  kind: '수량' | '퍼센트' | '대충';
  comment?: string;
}
{ kind: '수량'; number: number; step: number; unit: string }
{ kind: '퍼센트'; amount: number }
{ kind: '대충'; abundance: boolean }
{
  expirationDate: string; // ISO-8601 yyyy-MM-dd
  productionDate: string; // ISO-8601 yyyy-MM-dd
}

// template
{
  expirationDays: number;
}
 */

const INITIAL_STATE = {
  largeSections,
  itemMap: {},
  templates: [],
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

