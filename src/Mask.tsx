import * as React from 'react';

export type IMaskProps<T extends object> = {
  [K in keyof T]?: T[K];
};

export type IRulesProps<T extends object> = {
  [K in keyof T]: (value1: T[K], value2: T[K], name: string) => boolean
};

export type IMaskChildren<T> = {
  bits?: Partial<T>;
};

export type IReadChildren<T> = {
  children: (match: boolean, flags: T) => React.ReactNode;
};

export type IChildren<T> = {
  bits?: Partial<T>;
};

export type ContextType<Bits extends object> = {
  bits: Partial<Bits>,
  rules: Partial<IRulesProps<Bits>>
};

export type ProviderType<Bits extends object> = {
  bits: Partial<Bits>,
  rules?: Partial<IRulesProps<Bits>>
};

export type CaseProps<Bits extends object> = IMaskProps<Bits> & IMaskChildren<Bits>

export type ReadProps<Bits extends object> = IMaskProps<Bits> & IMaskChildren<Bits> & IReadChildren<Bits>;

export type SwitchProps<Bits extends object> = { bits?: Partial<Bits> };

export type MaskPack<Bits extends object> = {
  Provider: React.SFC<ProviderType<Bits>>,
  Switch: React.SFC<SwitchProps<Bits>>,
  Case: React.SFC<CaseProps<Bits>>,
  Read: React.SFC<ReadProps<Bits>>,
  Default: React.SFC<any>,
}

const defaultComparator = (a: any, b: any) => a === b;

const match = (bits: ContextType<any>, mask: { [k: string]: any }): boolean => (
  Object
    .keys(mask)
    .every(key => (bits.rules[key] || defaultComparator)(mask[key], bits.bits[key], key))
);

function find<T>(array: T[], predicate: (v: T) => boolean) {
  return (array).filter(predicate)[0];
}

const merge = (a: any, key: string, c: any) => ({
  ...(a[key]),
  ...c
});

const getProps = ({bits, children, ...mask}: { [key: string]: any }) => mask;

function createMaskedProvider<Bits extends object>(initial: Bits, rules: Partial<IRulesProps<Bits>> = {}):MaskPack<Bits> {
  const context = React.createContext<ContextType<Bits>>({
    bits: initial,
    rules: rules
  });

  const {Consumer} = context;

  const empty: any = {
    value: {},
    rules: {}
  };

  const Provider: React.SFC<ProviderType<Bits>> = ({bits, rules = {}, children}) => (
    <Consumer>
      {
        (value = empty) =>
          <context.Provider value={{
            bits: merge(value, 'value', bits),
            rules: merge(value, 'rules', rules),
          }}>
            {children}
          </context.Provider>
      }
    </Consumer>
  );

  const Case: React.SFC<CaseProps<Bits>> = (props) => {
    const {bits, children} = props;
    const mask = getProps(props);
    if (bits) {
      return (match({bits, rules: {}}, mask) ? children : null) as any;
    }
    return (
      <Consumer>{
        value => match(value, mask) ? children : null
      }</Consumer>
    )
  };

  const Read: React.SFC<ReadProps<Bits>> = (props) => {
    const {bits, children} = props;
    const mask = getProps(props);
    if (bits) {
      return children(match({bits, rules: {}}, mask), bits as Bits) as any;
    }
    return (
      <Consumer>{
        value => children(match(value, mask), value.bits as Bits)
      }</Consumer>
    )
  }

  const Default: React.SFC = ({children}) => (children as any);

  const CaseType = (<Case/>).type;
  const DefaultType = (<Default/>).type;

  const pickCase = (mask: any, children: React.ReactChild[]) => (
    find(children, child => typeof child === 'object' && CaseType === child.type && match(mask, getProps(child.props))) ||
    find(children, child => typeof child === 'object' && DefaultType === child.type) ||
    null
  );

  const Switch: React.SFC<SwitchProps<Bits>> = ({children, bits}) => (
    bits
      ? pickCase({values: bits}, React.Children.toArray(children)) as any
      : (
        <Consumer>
          {mask => pickCase(mask, React.Children.toArray(children))}
        </Consumer>
      )
  );

  return {
    Provider,
    Switch,
    Case,
    Read,
    Default
  }
}

export default createMaskedProvider;