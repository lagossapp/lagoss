const colorCodes = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
};

const colored = (color: 'red' | 'green' | 'yellow') => (text: unknown) => [colorCodes[color], text, '\x1b[0m'].join('');

export const color = {
  red: colored('red'),
  green: colored('green'),
  yellow: colored('yellow'),
};
