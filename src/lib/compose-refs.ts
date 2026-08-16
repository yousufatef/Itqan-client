import * as React from 'react';

type PossibleRef<T> = React.RefCallback<T> | React.MutableRefObject<T | null> | null | undefined;

export function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node: T) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}
