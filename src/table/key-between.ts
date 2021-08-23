import { asTableKey, TableKey } from "./table-key.js";

// TODO: Make these keys more efficient by using a wider range of characters.
export function keyBetween(low: TableKey | null, high: TableKey | null): TableKey {
  const lowStr: String = low ?? '0';
  const highStr: String = high ?? '1';

  let key = '';
  let keysDifferent = false;
  let i = 0;
  for (; i < lowStr.length || i < highStr.length; ++i) {
    const lowChar = i >= lowStr.length ? '0' : lowStr.charAt(i);
    const highChar = i >= highStr.length ? '0' : highStr.charAt(i);
    if (lowChar !== highChar) {
      keysDifferent = true
      break;
    }
    key += lowChar;
  }
  if (!keysDifferent) {
    throw 'keys cannot be split';
  }

  const highCandidate = key + '1';
  if (highCandidate < highStr) {
    return asTableKey(highCandidate);
  }

  key += '0';
  ++i;
  for (; lowStr.charAt(i) === '1'; ++i) {
    key += '1';
  }

  key += 1;
  return asTableKey(key);
}
