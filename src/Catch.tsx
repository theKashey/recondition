import * as React from 'react';

export interface ICatchState {
  caught: number;
  pending: boolean[];
  resolved: any[];
  rejected: boolean[];

  throw: any;
  catched: any
}

export interface IChildrenProps {
  caught: number;
  pending: boolean;
  rejected: boolean;
  resolved: boolean;
  results: any[];
}

export interface ICatchProps {
  onCatch?: (event: any) => any;
  children: (state: IChildrenProps) => React.ReactNode;
}

function replaceIn<T>(a: T[], index: number, newValue: T): T[] {
  const b = [...a];
  b.splice(index, 1, newValue);
  return b;
}

const resolvedMagically = {};

const isResolved = (a: any) => a !== undefined;

export class Catcher extends React.Component<ICatchProps, ICatchState> {

  state = {
    caught: 0,
    pending: [] as any,
    resolved: [] as any,
    rejected: [] as any,

    throw: undefined as any,
    catched: undefined as any,
  };

  componentDidUpdate(_: any, oldState: ICatchState) {
    if (oldState.throw !== this.state.throw) {
      throw this.state.throw;
    }

    if (oldState.catched !== this.state.catched) {
      if (this.props.onCatch) {
        this.props.onCatch(this.state.catched)
      }
    }
  }

  static getDerivedStateFromError() {
    return null;
  }

  componentDidCatch(error: Error | Promise<any>) {
    if ('then' in error) {
      this.setState({
        catched: error
      });

      this.setState(state => {
        const id = state.caught;

        error
          .then((value: any) => this.setState(
            ({resolved, pending}) => ({
              resolved: replaceIn(resolved, id, value === undefined ? resolvedMagically : value),
              pending: replaceIn(pending, id, false)
            }))
          )
          .catch(() => this.setState(
            ({rejected, pending}) => ({
              rejected: replaceIn(rejected, id, true),
              pending: replaceIn(pending, id, false)
            }))
          );

        return {
          caught: id + 1,
          pending: [...state.pending, true],
          resolved: [...state.resolved, undefined],
          rejected: [...state.rejected, false],
        }
      });
    } else {
      // re-throw
      this.setState({throw: error})
    }
  }

  render() {
    const {caught, pending, rejected, resolved} = this.state;
    return this.props.children({
      caught,
      pending: pending.some(Boolean),
      rejected: rejected.some(Boolean),
      resolved: resolved.some(isResolved),
      results: resolved
    });
  }
}