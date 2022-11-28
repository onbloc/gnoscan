import {ComponentProps, DOMAttributes} from 'react';

export type TimeOutType = ReturnType<typeof setTimeout>;

export type Without<T, U> = {[P in Exclude<keyof T, keyof U>]?: never};
export type XOR<T, U> = T | U extends Record<string, unknown>
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;

/**
 * ex: Event<'input', 'onChange'>
 */
type EventHandlers<T> = Omit<DOMAttributes<T>, 'children' | 'dangerouslySetInnerHTML'>;
export type Event<
  TElement extends keyof JSX.IntrinsicElements,
  TEventHandler extends keyof EventHandlers<TElement>,
> = ComponentProps<TElement>[TEventHandler];
