// @ts-ignore
import * as React from 'react';
// @ts-ignore
import createMask, { MaskPack, ProviderType, SwitchProps, CaseProps, ReadProps } from "./Mask";
import {Catcher} from './Catch';
import {Throw} from './Throw';
import {Trigger} from './Trigger';
import {GhostValue, LatestSource} from "./LatestSource";
import {Revalue} from "./Revalue";
import {Phased} from './Phased';

const def: {[key:string]:any} = {};
const {Provider: MaskProvider, Switch, Case, Default: CaseDefault, Read } = createMask(def);

export {
  Catcher,
  Throw,

  Trigger,

  MaskProvider,
  Switch,
  Case,
  Read,
  CaseDefault,

  createMask,

  LatestSource,
  GhostValue,

  Revalue,
  Phased
}
