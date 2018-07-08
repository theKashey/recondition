// @ts-ignore
import * as React from 'react';
import createMask from "./Mask";
import {Catcher} from './Catch';
import {Throw} from './Throw';
import {Trigger} from './Trigger';

const def: {[key:string]:any} = {};
const {Provider: MaskProvider, Switch, Case, Default: CaseDefault } = createMask(def);

export {
  Catcher,
  Throw,

  Trigger,

  MaskProvider,
  Switch,
  Case,
  CaseDefault,

  createMask
}
