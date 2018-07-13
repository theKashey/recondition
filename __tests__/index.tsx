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

  createMask,

  LatestSource
} from '../src';

configure({adapter: new Adapter()});

describe('Specs', () => {

  describe('Trigger', () => {
    it('when/then', (done) => {
      let xx=0;
      class A extends React.Component<{}, { x: number }> {
        state = {x: 0};

        SS = (s: any) => {
          this.setState(s);
          xx=s.x;
        }

        render() {
          const {x} = this.state;
          return (
            <div>
              <Trigger when={x == 0} then={() => this.SS({x: 1})}/>
              <Trigger when={x == 1} then={() => this.SS({x: 2})}/>
              {x == 2 && <Trigger when={x == 2} then={() => this.SS({x: 3})} finally={() => this.SS({x: 4})}/>}
              <Trigger when={x == 4} then={() => this.SS({x: 5})} async/>
              <Trigger when={x == 5} then={() => this.SS({x: 6})} async/>
              <Trigger when={x == 6} then={() => this.SS({x: 7})} delay={10}/>
              <Trigger when={x == 7} then={() => this.SS({x: 8})} delay={100} finally={() => this.SS({x: 9})}/>}/>
            </div>
          )
        }
      }

      const wrapper = mount(<A/>);
      expect(wrapper.update().instance().state.x).toBe(4);
      setTimeout(() => {
        expect(wrapper.update().instance().state.x).toBe(6);
        setTimeout(() => {
          expect(wrapper.update().instance().state.x).toBe(7);
          expect(xx).toBe(7);
          wrapper.unmount();
          expect(xx).toBe(9);
          done();
        }, 20);

      }, 1);
    })
  });

  describe('LatestSource', () => {
    it('LatestSource', () => {
      const Provider = (props:any) => (
        <LatestSource input={...props}>
          {(value, real, key) => <div>{value}{real}{key}</div>}
        </LatestSource>
      );
      const wrapper = mount(<Provider a={1} b={2}/>);
      expect(wrapper.text()).toBe("11a");
      wrapper.setProps({a:2});
      expect(wrapper.text()).toBe("22a");
      wrapper.setProps({b:3});
      expect(wrapper.text()).toBe("33b");
      wrapper.setProps({a:1});
      expect(wrapper.text()).toBe("11a");
    })

    it('LatestSource  with filter', () => {
      const Provider = (props:any) => (
        <LatestSource input={...props} filter={ (x:number) => !(x%2)}>
          {(value, real, key) => <div>{value}{real}{key}</div>}
        </LatestSource>
      );
      const wrapper = mount(<Provider a={1} b={2}/>);
      expect(wrapper.text()).toBe("22b");
      wrapper.setProps({a:2});
      expect(wrapper.text()).toBe("22a");
      wrapper.setProps({b:3});
      expect(wrapper.text()).toBe("23b");
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

      let pr: any;

      const p = new Promise(resolve => {
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
            <Catcher onCatch={(secret: string) => this.SS({x: x + 1, secret})}>
              {(state) => (
                <div>
                  <Throw when={x == 1} what="XX"/>
                  <Throw>
                    {th => (
                      x == 2 && th(p)
                    )}
                  </Throw>
                  {state.caught}+{state.pending && "p"}+{state.resolved && "ok"}
                </div>
              )}
            </Catcher>
          )
        }
      }

      const wrapper = mount(<A/>);
      expect(wrapper.text()).toBe('0++');
      wrapper.instance().setState({x: 1});
      expect(wrapper.text()).toBe('0++');
    });
  });
});
