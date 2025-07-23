import React, { CSSProperties } from 'react';

export function pseudoSelectorApplier(
  pseudoSelector: string,
  style: CSSProperties,
  specificClassName?: string,
) {
  const className =
    specificClassName ?? `pseudo-${Math.floor(Math.random() * 1000000)}`;
  const stylePropertiesStringArray = cssPropertiesToStringArray(style);
  const styleCSS =
    '{' +
    stylePropertiesStringArray
      .map(([name, value]) => `${name}: ${value};`)
      .join('') +
    '}';

  return {
    className,
    injectStyle: () => (
      <style>{`.${className}${pseudoSelector} ${styleCSS}`}</style>
    ),
  };
}

function cssPropertiesToStringArray(props: CSSProperties): [string, any][] {
  const propEntries = Object.entries(props).filter(([_, val]) => val != null);
  return propEntries.map(value => {
    const key = value[0];
    let convertedKey = '';
    for (const c of key) {
      if (c === c.toUpperCase()) {
        convertedKey += `-${c.toLowerCase()}`;
      } else convertedKey += c;
    }
    return [convertedKey, value[1]];
  });
}
