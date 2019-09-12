export const extracFragmentstFrom = ({ currency, formatted }) =>
  formatted.split(/[\d,.]/gi).reduce(
    ({ fragments, reverse, index }, fragment) => {
      const type = fragment ? 'symbol' : 'value';
      const current = fragments[type];
      const next = fragment || formatted[index];

      return {
        fragments: Object.assign(fragments, { [type]: current.concat(next) }),
        reverse: reverse === null ? !fragment : reverse,
        index: index + Math.max(fragment.length, 1),
      };
    },
    {
      fragments: { value: '', symbol: '', currency },
      reverse: null,
      index: 0,
    }
  );
