import * as React from 'react';

export type ErrorThrower = (error: any) => any;

export interface IThrowProps {
  when?: boolean;
  what?: any;
  children?: (thrower: ErrorThrower) => React.ReactNode;
}

interface IThrowState {
  throwed: any;
}

export class Throw extends React.Component<IThrowProps, IThrowState> {
  state = {
    throwed: undefined as any
  };

  componentDidMount() {
    this.componentDidUpdate(this.props, this.state);
  }

  componentDidUpdate(oldProps: IThrowProps, oldState: IThrowState) {
    if (this.props.when !== oldProps.when) {
      throw Promise.resolve(this.props.what)
    }
    if (oldState.throwed !== this.state.throwed) {
      throw Promise.resolve(this.state.throwed)
    }
  }

  shouldComponentUpdate(props: IThrowProps, oldState: IThrowState) {
    return this.props.when !== props.when || this.state.throwed !== oldState.throwed;
  }

  thrower: ErrorThrower = (event: any) => {
    this.setState({throwed: event});
  };

  render() {
    if (!this.props.children) {
      return null;
    }
    return this.props.children!(this.thrower)
  }
}