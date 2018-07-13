<div align="center">
  <h1>reCONDITION</h1>
  <br/>
  React render props at your service
  <br/>
    
  <a href="https://www.npmjs.com/package/recondition">
   <img src="https://img.shields.io/npm/v/recondition.svg?style=flat-square" />
  </a>

  <br/>  
</div>  

# API
1. Trigger - dispatch an action when some condition is true
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
- `finally` - event on unmount, optional.
- `async` - defer execution my one "tick", always fires, even if Trigger got unmounted, optional, overrides delay
- `delay` - execution delay, if Trigger got unmounted before timeout - it will not fire, optional 

2. Mask - mask based selector. Masks(FeatureFlags) in declaration form, like react-router
```js
import {createMaskedProvider} from 'recondition';

const Mask = createMaskedProvider({ flag1: true, flag2: false });

<div>
 <Mask.Case flag1>
   will render, as long flag1 is true
 </Mask.Case>
 
 <Mask.Case flag1 flag2>
   will NOT render, as long flag1 is true, but flag is false
 </Mask.Case>
  
 <Mask.Case flag1 flag2={false}>
   will  render, as long flag1 is true, but flag is false, but we are looking for false
 </Mask.Case>
 
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

You also might create your own react-router

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

3. LatestSource - data source "ziper". Gets multiple source as input, and provide
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


4. Catcher - Error Boundary based promise collector (~Suspense, experimental)
`Thrower` - Error trigger. Also could provides throw-as-children prop, to give you API to throw react-catchable messages.
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

# Licence
 MIT
 
 
