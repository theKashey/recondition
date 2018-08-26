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
  timeouts?: number[];
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

  tm: number = 0;

  componentDidUpdate(prevProps: PhaseProps<T>, oldState: PhaseState<T>) {
    const {value, phases = 0} = this.props;
    if (prevProps.value !== value) {
      this.shift();
      this.setState({
        nextValue: this.props.value,
        phase: 0,
        phasing: true
      });
    } else {
      if (this.state !== oldState) {
        this.shift();
        clearTimeout(this.tm);
        this.tm = window.setTimeout(() => {
          if (this.state.phase < phases) {
            this.setState(({phase}) => ({phase: phase + 1}));
          } else {
            if (this.state.value !== value) {
              this.setState(({phase}) => ({phase: phase + 1, value}))
            } else {
              if (this.state.phasing) {
                this.setState({phasing: false})
              }
            }
          }
        }, (this.props.timeouts || [])[this.state.phase] || 0);
      }
    }
  }

  shift = () => this.props.onShift && this.props.onShift(this.state);

  render() {
    return this.props.children(this.state)
  }
}