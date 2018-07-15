import * as React from 'react';

export interface IRevalueProps<T> {
  value: T
  children: (v:T) => React.ReactNode;
}

export class Revalue<T> extends React.Component<IRevalueProps<T>> {
  render() {
    return this.props.children(this.props.value);
  }
}