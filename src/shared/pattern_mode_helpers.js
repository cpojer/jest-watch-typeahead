// @flow

import chalk from 'chalk';
import ansiEscapes from 'ansi-escapes';
import stringLength from 'string-length';
import stripAnsi from 'strip-ansi';
import Prompt from '../shared/Prompt';

const pluralize = (count: number, text: string) =>
  count === 1 ? text : `${text}s`;

export const printPatternMatches = (
  count: number,
  entity: string,
  pipe: stream$Writable | tty$WriteStream,
  extraText: string = '',
) => {
  const pluralized = pluralize(count, entity);
  const result = count
    ? `\n\n Pattern matches ${count} ${pluralized}`
    : `\n\n Pattern matches no ${pluralized}`;

  pipe.write(result + extraText);
};

export const printPatternCaret = (
  pattern: string,
  pipe: stream$Writable | tty$WriteStream,
) => {
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(ansiEscapes.eraseDown);
  pipe.write(inputText);
  pipe.write(ansiEscapes.cursorSavePosition);
};

export const printRestoredPatternCaret = (
  pattern: string,
  currentUsageRows: number,
  pipe: stream$Writable | tty$WriteStream,
) => {
  const inputText = `${chalk.dim(' pattern \u203A')} ${pattern}`;

  pipe.write(
    ansiEscapes.cursorTo(stringLength(inputText), currentUsageRows - 1),
  );
  pipe.write(ansiEscapes.cursorRestorePosition);
};

export const printStartTyping = (
  entity: string,
  pipe: stream$Writable | tty$WriteStream,
) => {
  pipe.write(
    `\n\n ${chalk.italic.yellow(
      `Start typing to filter by a ${entity} regex pattern.`,
    )}`,
  );
};

export const printMore = (
  entity: string,
  pipe: stream$Writable | tty$WriteStream,
  more: number,
) => {
  pipe.write(
    `\n   ${chalk.dim(`...and ${more} more ${pluralize(more, entity)}`)}`,
  );
};

export const printTypeaheadItem = (
  item: string,
  pipe: stream$Writable | tty$WriteStream,
) => pipe.write(`\n ${chalk.dim('\u203A')} ${item}`);

export const formatTypeaheadSelection = (
  item: string,
  index: number,
  activeIndex: number,
  prompt: Prompt,
) => {
  if (index === activeIndex) {
    prompt.setTypheadheadSelection(stripAnsi(item));
    return chalk.black.bgYellow(stripAnsi(item));
  }
  return item;
};