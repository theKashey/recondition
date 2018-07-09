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
 />
</div>
```
`finally`(event on unmount) is an optional field.

2. Catcher - Error Boundary based promise collector (~Suspense)
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

3. Mask - mask based selector. Masks(FeatureFlags) in declaration form, like react-router
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

# Licence
 MIT
 
 
