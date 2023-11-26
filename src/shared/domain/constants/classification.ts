import { ClassificationGroup, ClassificationRecord } from '../types';
import { TRANSACTION_TYPE, TRANSACTION_TYPES } from './transaction';

export const CLASSIFICATION_TYPES = TRANSACTION_TYPES;
export const CLASSIFICATION_TYPE = TRANSACTION_TYPE;

export const CLASSIFICATION_SUPPORT_LANGUAGES = ['en', 'pl'] as const;
export type ClassificationGroupKey =
  | 'group-shopping'
  | 'group-housing'
  | 'group-transport'
  | 'group-healthcare'
  | 'group-entertainment'
  | 'group-other-expenses'
  | 'group-salary'
  | 'group-investments'
  | 'group-other-incomes';

export const DEFAULT_CLASSIFICATION_GROUP: Record<
  ClassificationGroupKey,
  ClassificationGroup
> = {
  'group-entertainment': {
    _id: 'group-entertainment',
    label: [
      {
        lang: 'pl',
        value: 'Rozrywka',
      },
      {
        lang: 'en',
        value: 'Entertainment',
      },
    ],
    decorationColor: '#DCAE96',
  },
  'group-healthcare': {
    _id: 'group-healthcare',
    label: [
      {
        lang: 'pl',
        value: 'Opieka zdrowotna',
      },
      {
        lang: 'en',
        value: 'Healthcare',
      },
    ],
    decorationColor: '#B2AC88',
  },
  'group-housing': {
    _id: 'group-housing',
    label: [
      {
        lang: 'pl',
        value: 'Mieszkanie',
      },
      {
        lang: 'en',
        value: 'Housing',
      },
    ],
    decorationColor: '#E6E6FA',
  },
  'group-investments': {
    _id: 'group-investments',
    label: [
      {
        lang: 'pl',
        value: 'Inwestycje',
      },
      {
        lang: 'en',
        value: 'Investments',
      },
    ],
    decorationColor: '#87CEEB',
  },
  'group-other-expenses': {
    _id: 'group-other-expenses',
    label: [
      {
        lang: 'pl',
        value: 'Inne wydatki',
      },
      {
        lang: 'en',
        value: 'Other expenses',
      },
    ],
    decorationColor: '#FFE5B4',
  },
  'group-salary': {
    _id: 'group-salary',
    label: [
      {
        lang: 'pl',
        value: 'Wynagrodzenie',
      },
      {
        lang: 'en',
        value: 'Salary',
      },
    ],
    decorationColor: '#FFFACD',
  },
  'group-shopping': {
    _id: 'group-shopping',
    label: [
      {
        lang: 'pl',
        value: 'Zakupy',
      },
      {
        lang: 'en',
        value: 'Shopping',
      },
    ],
    decorationColor: '#F88379',
  },
  'group-transport': {
    _id: 'group-transport',
    label: [
      {
        lang: 'pl',
        value: 'Transport',
      },
      {
        lang: 'en',
        value: 'Transport',
      },
    ],

    decorationColor: '#B0E0E6',
  },
  'group-other-incomes': {
    _id: 'group-other-incomes',
    label: [
      {
        lang: 'pl',
        value: 'Inne dochody',
      },
      {
        lang: 'en',
        value: 'Other incomes',
      },
    ],
    decorationColor: '#98FF98',
  },
};

export const DEFAULT_CLASSIFICATION_RECORDS: Omit<
  ClassificationRecord,
  '_id' | 'householdId'
>[] = [
  {
    // _id: 'default-food',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-shopping'],
    labels: [
      {
        lang: 'pl',
        value: 'Jedzenie',
      },
      {
        lang: 'en',
        value: 'Food',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-takeaway',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-shopping'],
    labels: [
      {
        lang: 'pl',
        value: 'Na wynos',
      },
      {
        lang: 'en',
        value: 'Takeaway',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-alcohol',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-shopping'],
    labels: [
      {
        lang: 'pl',
        value: 'Alkohol',
      },
      {
        lang: 'en',
        value: 'Alcohol',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-rent',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-housing'],
    labels: [
      {
        lang: 'pl',
        value: 'Czynsz',
      },
      {
        lang: 'en',
        value: 'Rent',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-utilities',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-housing'],
    labels: [
      {
        lang: 'pl',
        value: 'Media',
      },
      {
        lang: 'en',
        value: 'Utilities',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-maintenance',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-housing'],
    labels: [
      {
        lang: 'pl',
        value: 'Naprawy',
      },
      {
        lang: 'en',
        value: 'Maintenance',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-public-transport',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-transport'],
    labels: [
      {
        lang: 'pl',
        value: 'Komunikacja miejska',
      },
      {
        lang: 'en',
        value: 'Public transport',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-fuel',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-transport'],
    labels: [
      {
        lang: 'pl',
        value: 'Paliwo',
      },
      {
        lang: 'en',
        value: 'Fuel',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-car',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-transport'],
    labels: [
      {
        lang: 'pl',
        value: 'Samochód',
      },
      {
        lang: 'en',
        value: 'Car',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-doctor',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-healthcare'],
    labels: [
      {
        lang: 'pl',
        value: 'Lekarz',
      },
      {
        lang: 'en',
        value: 'Doctor',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-pharmacy',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-healthcare'],
    labels: [
      {
        lang: 'pl',
        value: 'Leki',
      },
      {
        lang: 'en',
        value: 'Pharmacy',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-gym',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-entertainment'],
    labels: [
      {
        lang: 'pl',
        value: 'Siłownia',
      },
      {
        lang: 'en',
        value: 'Gym',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-cinema',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-entertainment'],
    labels: [
      {
        lang: 'pl',
        value: 'Kino',
      },
      {
        lang: 'en',
        value: 'Cinema',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-books',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-entertainment'],
    labels: [
      {
        lang: 'pl',
        value: 'Książki',
      },
      {
        lang: 'en',
        value: 'Books',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-other',
    type: CLASSIFICATION_TYPE.EXPENSE,
    group: DEFAULT_CLASSIFICATION_GROUP['group-other-expenses'],
    labels: [
      {
        lang: 'pl',
        value: 'Inne',
      },
      {
        lang: 'en',
        value: 'Other',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-full-time',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-salary'],
    labels: [
      {
        lang: 'pl',
        value: 'Praca etatowa',
      },
      {
        lang: 'en',
        value: 'Full time',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-part-time',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-salary'],
    labels: [
      {
        lang: 'pl',
        value: 'Praca dorywcza',
      },
      {
        lang: 'en',
        value: 'Part time',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-freelance',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-salary'],
    labels: [
      {
        lang: 'pl',
        value: 'Praca na zlecenie',
      },
      {
        lang: 'en',
        value: 'Freelance',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-interest',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-investments'],
    labels: [
      {
        lang: 'pl',
        value: 'Odsetki',
      },
      {
        lang: 'en',
        value: 'Interest',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-dividends',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-investments'],
    labels: [
      {
        lang: 'pl',
        value: 'Dywidendy',
      },
      {
        lang: 'en',
        value: 'Dividends',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
  {
    // _id: 'default-other',
    type: CLASSIFICATION_TYPE.INCOME,
    group: DEFAULT_CLASSIFICATION_GROUP['group-other-incomes'],
    labels: [
      {
        lang: 'pl',
        value: 'Inne',
      },
      {
        lang: 'en',
        value: 'Other',
      },
    ],
    isDeletable: false,
    isEditable: false,
  },
];
