import * as React from 'react';

export interface ITriggerProps {
  when: boolean;
  then: () => any;
  finally?: () => any;
}

export class Trigger extends React.Component<ITriggerProps> {
  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    this.props.when && this.props.then();
  }

  componentWillUnmount(){
    this.props.finally && this.props.finally();
  }

  shouldComponentUpdate(props:ITriggerProps) {
    return this.props.when !== props.when;
  }

  render():null {
    return null;
  }
}