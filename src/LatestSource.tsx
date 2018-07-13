import * as React from 'react';

export interface Hash {
  [key: string]: any
}

export type IMergeProps<T> = {
  [key: string]: T;
}

export type IMergeRender<T> = {
  input: IMergeProps<T>;
  shallowEqual?: boolean;
  filter?: (value: T) => boolean,
  children: (value: T, real: T, key: string) => React.ReactNode;
}

type IMergeState<T> = {
  activeKey: string,
  value: T,
  values: IMergeProps<T>
}

const keyChangedKey = (props: Hash, values: Hash, shallow: boolean) => {
  const keys = Object.keys(props);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    if (props[key] !== values[key]) {
      if (shallow && typeof props[key] === 'object') {
        if (keyChangedKey(props[key], values[key], false)) {
          return key;
        }
      } else {
        return key;
      }
    }
  }
  return null;
};

export class LatestSource<T> extends React.Component<IMergeRender<T>, IMergeState<T>> {

  state = this.initState();

  static getDerivedStateFromProps(props: IMergeRender<any>, state: IMergeState<any>) {
    //find changed
    const values = props.input;
    const key = keyChangedKey(values, state.values, !!props.shallowEqual);
    if (key) {
      return {
        values,
        value: (!props.filter || props.filter(values[key])) ? values[key] : state.value,
        activeKey: key
      }
    }
    return null;
  }

  initState(): IMergeState<T> {
    const {input, filter} = this.props;
    const values = input;
    const keys = Object.keys(values);
    let activeKey = keys[0];
    if (filter) {
      for (let i = 0; i < keys.length; i++) {
        if (filter(values[keys[i]])) {
          activeKey = keys[i];
          break;
        }
      }
    }
    return {activeKey, values, value: values[activeKey]}
  }

  render() {
    const {value, values, activeKey} = this.state;
    return this.props.children(value, values[activeKey], activeKey)
  }
}