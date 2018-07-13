import * as React from 'react';
import {Component} from 'react';
import {AppWrapper} from './styled';
import {Catcher, Trigger, createMask, Throw, Read} from '../src';
import {LatestSource} from "../src/LatestSource";


export interface AppState {
  XX: number,
  YY: number;
  c1: number;
  c2: number;
}

const Mask = createMask({XX: 1, YY: 1});

const delay = (n: number) => new Promise((resolve) => setTimeout(resolve, n, 'delay'));

export default class App extends Component <{}, AppState> {
  state: AppState = {
    XX: 1,
    YY: 0,
    c1: 0,
    c2: 0
  }

  render() {
    return (
      <AppWrapper>
        <div>-XX{this.state.XX}-YY{this.state.YY}-c1|{this.state.c1}-c2|{this.state.c2}</div>

        <Catcher
          onCatch={() => this.setState({c1: this.state.c1 + 1})}>
          {() => (
            <Catcher
              onCatch={() => this.setState({c2: this.state.c2 + 1})}
            >
              {(catcher) => (
                <React.Fragment>
                  <p>
                    c:
                    pending:{catcher.pending && "pending"}, {catcher.resolved && "ok"}/{catcher.caught} {JSON.stringify(catcher)}
                  </p>

                  <Throw when={this.state.XX == 4} what="c2"/>

                  {this.state.XX < 3 && (
                    <Trigger
                      when={this.state.XX === 2}
                      then={() => this.setState({XX: 3})}
                      finally={() => this.setState({XX: 4})}
                    />
                  )}


                  <button onClick={() => {
                    throw Promise.resolve("c1")
                  }}>throw simple
                  </button>
                  <Throw>
                    {thrower => (
                      <button onClick={() => {
                        thrower("c1")
                      }}>throw throw
                      </button>
                    )}
                  </Throw>
                  <Throw>
                    {thrower => (
                      <button onClick={() => {
                        thrower(delay(1000))
                      }}>throw delayed
                      </button>
                    )}
                  </Throw>

                  <Trigger when={this.state.XX === 5} then={() => this.setState({XX: 0})}/>
                  <button onClick={() => this.setState({XX: this.state.XX + 1})}>XX++</button>
                  <button onClick={() => this.setState({YY: this.state.YY + 1})}>YY++</button>

                  <Read YY={1} bits={this.state}>
                    {(match, flags) => (<div>{match ? 'MATCH!' : 'no match'} {JSON.stringify(flags)}</div>)}
                  </Read>

                  <div>
                    # Merge
                    <LatestSource
                      input={{
                      XX:{y:this.state.XX},
                      YY:{y:this.state.YY}
                    }}
                      shallowEqual
                      filter={x => !!(x.y %2)}
                    >
                      {(value, ghost, key) => <div>{value.y}/{ghost.y}({key})</div>}
                    </LatestSource>
                  </div>

                  <Mask.Provider bits={this.state}>
                    <Mask.Switch>
                      <Mask.Case YY={1}> v is 1</Mask.Case>
                      <Mask.Case YY={2}> v is 2</Mask.Case>

                      <Mask.Default>default value</Mask.Default>

                    </Mask.Switch>
                  </Mask.Provider>

                </React.Fragment>
              )}
            </Catcher>
          )}
        </Catcher>

      </AppWrapper>
    )
  }
}