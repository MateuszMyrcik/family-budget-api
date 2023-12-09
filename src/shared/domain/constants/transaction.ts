import { createLookup } from '../../utils';
import { Frequency } from '../types';

export const TRANSACTION_TYPES = ['EXPENSE', 'INCOME'] as const;

export const TRANSACTION_TYPE = createLookup([...TRANSACTION_TYPES]);

export const TRANSACTION_FREQUENCIES: Frequency[] = [
  'DAILY',
  'WEEKLY',
  'MONTHLY',
  'YEARLY',
];

export const TRANSACTION_FREQUENCY = createLookup(TRANSACTION_FREQUENCIES);

export const MAX_OCCURRENCES = 30;
export const MIN_OCCURRENCES = 1;
