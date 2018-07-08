import * as React from 'react';
import {mount, configure} from 'enzyme';
// @ts-ignore
import * as Adapter from 'enzyme-adapter-react-16';
import {
  Trigger,
  Catcher,
  Throw,
  MaskProvider,
  Switch,
  Case,
  CaseDefault,

  createMask
} from '../src';

configure({adapter: new Adapter()});

describe('Specs', () => {

  describe('Trigger', () => {
    it('when/then', () => {
      class A extends React.Component<{}, { x: number }> {
        state = {x: 0};

        SS = (s: any) => {
          this.setState(s);
        }

        render() {
          const {x} = this.state;
          return (
            <div>
              <Trigger when={x == 0} then={() => this.SS({x: 1})}/>
              <Trigger when={x == 1} then={() => this.SS({x: 2})}/>
              {x == 2 && <Trigger when={x == 2} then={() => this.SS({x: 3})} finally={() => this.SS({x: 4})}/>}
            </div>
          )
        }
      }

      const wrapper = mount(<A/>);
      expect(wrapper.update().instance().state.x).toBe(4);
    })
  });

  describe('Mask', () => {
    it('Switch', () => {
      const wrapper = mount(
        <MaskProvider bits={{XX: 1, YY: 0}}>
          <div>
            <Switch>
              <Case XX={1}>case 1</Case>
              <Case YY={1}>case 2</Case>
              <CaseDefault>case default</CaseDefault>
            </Switch>
          </div>
        </MaskProvider>
      );
      expect(wrapper.text()).toBe("case 1");
      wrapper.setProps({bits: {XX: 0, YY: 0}});
      expect(wrapper.text()).toBe("case default");
      wrapper.setProps({bits: {XX: 0, YY: 1}});
      expect(wrapper.text()).toBe("case 2");
      wrapper.setProps({bits: {XX: 1, YY: 1}});
      expect(wrapper.text()).toBe("case 1");
      wrapper.setProps({bits: {ZZ: 1}});
      expect(wrapper.text()).toBe("case default");
    })
  });

  // React is not ready yet
  describe.skip('Catcher', () => {
    it('Throw', () => {

      let pr:any;

      const p = new Promise( resolve => {
        pr = resolve;
      });

      class A extends React.Component<{}, { x: number, secret: string }> {
        state = {x: 0, secret: ""};

        SS = (s: any) => {
          this.setState(s);
        }

        render() {
          const {x} = this.state;
          return (
            <Catcher onCatch={(secret:string) => this.SS({x:x+1, secret})}>
              { (state) => (
              <div>
                <Throw when={x==1} what="XX"/>
                <Throw>
                  { th => (
                    x==2 && th(p)
                  )}
                </Throw>
                {state.caught}+{state.pending && "p"}+{state.resolved && "ok"}
              </div>
              )}
            </Catcher>
          )
        }
      }
      const wrapper = mount(<A />);
      expect(wrapper.text()).toBe('0++');
      wrapper.instance().setState({x:1});
      expect(wrapper.text()).toBe('0++');
    });
  });
});
