import * as React from 'react';


interface PhaseState<T> {
  value: T;
  nextValue: T;
  phase: number;
  phasing: boolean;
}

interface PhaseProps<T> {
  value: T;
  phases?: number;
  children: (state: PhaseState<T>) => React.ReactNode;
  onShift?: (state: PhaseState<T>) => any;
}

export class Phased<T> extends React.Component<PhaseProps<T>, PhaseState<T>> {
  state = {
    value: this.props.value,
    nextValue: this.props.value,
    phase: 0,
    phasing: false,
  };

  componentDidUpdate(prevProps: PhaseProps<T>) {
    const {value, phases = 0} = this.props;
    if (prevProps.value !== value) {
      this.setState({
        nextValue: this.props.value,
        phase: 0,
        phasing: true
      }, this.shift);
    } else {
      if (this.state.phase < phases) {
        this.setState(({phase}) => ({phase: phase + 1}), this.shift);
      } else {
        if (this.state.value !== value) {
          this.setState({
            value,
            phasing: false
          }, this.shift);
        }
      }
    }
  }

  shift = () => this.props.onShift && this.props.onShift(this.state);

  render() {
    return this.props.children(this.state)
  }
}