import * as React from 'react';

export interface ITriggerProps {
  when: boolean;
  then: () => any;
  finally?: () => any;
  async?: boolean;
  delay?: number;
}

export class Trigger extends React.Component<ITriggerProps> {

  private _timeout: number = 0;

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.props.when
      ? this.trigger()
      : this.clearTrigger();
  }

  componentWillUnmount() {
    this.props.finally && this.props.finally();
    this.clearTrigger();
  }

  shouldComponentUpdate(props: ITriggerProps) {
    return this.props.when !== props.when;
  }

  trigger() {
    const {async, delay} = this.props;
    if (async) {
      Promise.resolve().then(this.props.then);
    } else if (delay) {
      this._timeout = window.setTimeout(() => {
        this.props.then()
      }, delay);
    } else {
      this.props.then();
    }
  }

  clearTrigger() {
    if(this._timeout) {
      window.clearTimeout(this._timeout);
      this._timeout = 0;
    }
  }

  render(): null {
    return null;
  }
}