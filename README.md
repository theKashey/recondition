<div align="center">
  <h1>reCONDITION</h1>
  <br/>
  React render props at your service
  <br/>
    
  <a href="https://www.npmjs.com/package/recondition">
   <img src="https://img.shields.io/npm/v/recondition.svg?style=flat-square" />
  </a>
  
  <a href="https://codecov.io/github/thekashey/recondition">
   <img src="https://img.shields.io/codecov/c/github/thekashey/recondition.svg?style=flat-square)" />
  </a>
  
  <a href="https://travis-ci.org/theKashey/recondition">
   <img src="https://travis-ci.org/theKashey/recondition.svg?branch=master" />
  </a>

  <br/>  
</div>  

# API
## Trigger
Trigger - dispatch an action when some condition is true. Trigger just executes actions in the right time, in the right React Life Cycles.
```js
import {Trigger} from 'recondition';

<div>
 <Trigger 
     when={someCondition & this.state.variable} 
     then={() => someAction(1)} 
     finally={() => someAction(0)}
     async
     delay={100}
 />
</div>
```
- `when` - boolean prop, activates Trigger
- `then` - callback
- `finally` - event on unmount, _optional_.
- `async` - defer execution by one "tick", always fires, even if Trigger got unmounted, _optional, overrides delay_
- `delay` - execution delay, if Trigger got unmounted before timeout - it will not fire, _optiona_ 

## Mask
Mask - mask based selector. Masks in declaration form, like react-router. FeatureFlags, Media selectors, A/B tests - any condition based logic.
```js
import {createMaskedProvider} from 'recondition';

// define the shape of mask
const Mask = createMaskedProvider({ flag1: true, flag2: false });

<div>
 <Mask.Case flag1> // only of flag1 is defined
   will render, as long flag1 is true
 </Mask.Case>
 
 <Mask.Case flag1 flag2>
   will NOT render, as long flag1 is true, but flag is false
 </Mask.Case>
  
 <Mask.Case flag1 flag2={false}>
   will  render, as long flag1 is true, but flag is false, but(!) we are looking for false
 </Mask.Case>
 
 // more complex example?
 <Mask.Switch>
   <Mask.Case flag1 flag2>
      display when flags are met
   </Mask.Case>
   <Mask.Default>
      display the default, when nothing got renderer
   </Mask.Default>   
 </Mask.Switch>   
 
 <Mask.Return flag1>
    { (match) => ( <div>this condition is { match ? true : false }</div>)}
 </Mask.Return>
</div>
```

By default flags are compared using strict equal, but you can override rule

```js
const Mask = createMaskedProvider(
  { flag:'html,js,css' }, 
  { flag: (base, flag) => base.indexOf(flag)>-1}
);

<Mask.Case flag="html" />
```

You also might create your own react-router. Switch is a Switch and Case is a Route.

```js
import {createMaskedProvider} from 'recondition';

const Mask = createMaskedProvider(
  { path: 'https://github.com/theKashey/recondition' },
  { path: (base, right) => base.startsWith(right)}
);

<div>
 <Mask.Switch>
   <Mask.Case path="https://github.com/theKashey/recondition">
      You are here
   </Mask.Case>
   <Mask.Case path="https://github.com/theKashey/faste">
      Another great library!
   </Mask.Case>
   <Mask.Default>
      More to come!
   </Mask.Default>   
 </Mask.Switch>   
</div>
```
## LatestSource
LatestSource - data source "ziper". Gets multiple source as input, and provide
last changed source as output. Additional feature - it would keep the last value
passed thought `filter`(optional), making multi-source data picking easier.

Could help with controlled from _more that one place_ components, and also capable to "Freeze",
values is they are not acceptable. For example - after mouseout value from "mouse in", is not
acceptable, but required for fade animation. 
```js
import {LatestSource} from 'recondition';

<LatestSource 
  input={{
    x: this.state.sourceX,
    y: this.state.sourceY,
  }}
  filter={ x => x.enabled }
>
 {(value, real, key) => (
   <>
     current value {value.position}
     in real {value.position}
     from source {value.enabled}
   </>
 )}
</LatestSource> 
```

+ there is `GhostValue` component, which does the same for a single value.

Both components are more about _preserving_ some value, you have to preserve. Tooltips are quite good example.

## Phased
Phased - the Schrodinger's state - once value changed - it will be actually changed
after few _phases_.
Useful when you have react flip some value, and have to react on that change.
```js
import {Phased} from 'recondition';

<Phased value={value} phases={1}>
  {({value, nextValue, phase}) => {
    value && <SomeComponent animated={phase && nextValue}/>
  }} 
</Phased>
``` 
Default value for a `phases` prop - 0, that means 1 step for "enter", and 1 step for "exit".

## Catcher
- `Catcher` - Error Boundary based promise collector (~Suspense, experimental)
- `Thrower` - Error trigger. Also could provides throw-as-children prop, to give you API to throw react-catchable messages.
```js
import {Catcher, Throw} from 'recondition';

<div>
 <Catcher 
    onCatch{ (e:Promise<any>) => doSomething(e)}
 }>
   {({
       caught, // number of Promised caught
       pending, // is anything pending
       rejected, // is anything rejected
       resolved, // is all resolved
       results, // array of results (in the caught order)
   }) => (
     <div>
       do anything async
       
       <Throw when={condition} what={data} />
       
       <Throw>
        {thrower => thrower(data)}
       </Thrower>
     </div>
   )}
 </Catcher>
</div>   
```
`catch`(event filter) - is optional 

# Written in TypeScript

# Licence
 MIT
 
 
