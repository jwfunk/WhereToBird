import { defineFunction } from '@aws-amplify/backend';

export const ebirdProxy = defineFunction({
  name: 'ebird-proxy',
  entry: './handler.ts'
});