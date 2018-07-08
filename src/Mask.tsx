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

type ContextType<Bits extends object> = {
  bits: Partial<Bits>,
  rules: Partial<IRulesProps<Bits>>
};

const defaultComparator = (a: any, b: any) => a === b;

const match = (bits: ContextType<any>, mask: { [k:string]: any}): boolean => (
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

function createMaskedProvider<Bits extends object>(initial: Bits, rules: Partial<IRulesProps<Bits>> = {}) {
  type ContextType = {
    bits: Partial<Bits>,
    rules: Partial<IRulesProps<Bits>>
  };

  type ProviderType = {
    bits: Partial<Bits>,
    rules?: Partial<IRulesProps<Bits>>
  };

  const context = React.createContext<ContextType>({
    bits: initial,
    rules: rules
  });

  const {Consumer} = context;

  const empty: any = {
    value: {},
    rules: {}
  };

  const Provider: React.SFC<ProviderType> = ({bits, rules = {}, children}) => (
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

  const Case: React.SFC<IMaskProps<Bits> & IMaskChildren<Bits>> = (props) => {
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

  const Default: React.SFC = ({children}) => (children as any);

  const CaseType = (<Case/>).type;
  const DefaultType = (<Default/>).type;

  const pickCase = (mask: any, children: React.ReactChild[]) => (
    find(children, child => typeof child === 'object' && CaseType === child.type && match(mask, getProps(child.props))) ||
    find(children, child => typeof child === 'object' && DefaultType === child.type) ||
    null
  );

  const Switch: React.SFC<{
    bits?: Partial<Bits>,
    // children: { type:typeof Case | typeof Default | string}[]
  }> = ({children, bits}) => (
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
    Default
  }
}

export default createMaskedProvider;