import { createLookup } from '../../utils';

export const TRANSACTION_TYPES = ['EXPENSE', 'INCOME'] as const;

export const TRANSACTION_TYPE = createLookup([...TRANSACTION_TYPES]);
