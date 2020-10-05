import { Category } from '../types';

const parseCategory = (str: string): Category => {
  const [ id, flag ] = str.split(':');
  const value = flag === '0';

  return {
    id,
    value,
  };
};

const getCategoryIndex = (category: Category) => {
  return Number((category.id ?? '').replace(/[a-zA-Z]/g, ''));
};

const parseContent = (str: string = '') => {
  return str
    .split('|')
    .map(parseCategory)
    .sort((a, b) => {
      const i = getCategoryIndex(a);
      const j = getCategoryIndex(b);
      return i - j;
    });
};

const parse = (consent: string) => {
  return parseContent(consent);
};

export default parse;
