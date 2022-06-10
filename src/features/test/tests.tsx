import { FC } from "react";
import { Subtract } from "utility-types";

// this works perfectly
const removeProp = <T extends { propName: string }>(x: T): Omit<T, "propName"> => {
  const { propName, ...otherProps } = x;
  return otherProps;
};

const TestComponent: FC<{propName: string}> = () => null;
const TestComponent_1: FC<{propName: string, otherPropName: number}> = () => null;
const EmptyTestComponent: FC = () => null;
const TestComponentWithWrongPropType: FC<{propName: number}> = () => null;

export const testHOC0 = <Props extends {}>(Component: FC<Props & { propName: string }>) => {
  return (props: Omit<Props, "propName">) => {
    return <Component {...props} propName={"value"} />;
  };
};
const EmptyResultComponent0 = testHOC0(EmptyTestComponent); // this should error but it does not (even though nothing actually breaks)
const ResultComponentWithWrongProptType0 = testHOC0(TestComponentWithWrongPropType); // this finally errors; 



const ResultComponent = testHOC0(TestComponent);
const ResultComponent_1 = testHOC0(TestComponent_1);
<ResultComponent_1 otherPropName={1}></ResultComponent_1>

// does not give error, but the type of the resulting component, if the original component has properties, also includes the property I want to exclude
const testHOC1 = <Props extends {}>(Component: FC<Props & { propName: string }>) => {
  return (props: Props) => {
    return <Component {...props} propName={"value"} />;
  };
};

let x

const ResultComponent1 = testHOC1(TestComponent); // type: (props: {}) => JSX.Element

const ResultComponent1_1 = testHOC1(TestComponent_1);
/*
  The type for previous:  
  (props: {
    propName: string;
    otherPropName: number;
  }) => JSX.Element
 */

const testHOC2 = <Props extends { propName: string }>(Component: FC<Props>) => {
  return (props: Omit<Props, "propName">) => {
    return <Component {...props} propName={"value"} />;
  };
};


type TResultComponent2 = (props: Omit<{
  propName: string;
}, "propName">) => JSX.Element
const ResultComponent2 = testHOC2(TestComponent); // type: (props: {}) => JSX.Element

const ResultComponent2_1 = testHOC2(TestComponent_1)

const testHOC3 = <Props extends { propName: string }>(Component: FC<Props>): FC<Omit<Props, 'propName'>> => {
  return (props) => {
    return <Component {...props as Props} propName={"value"} />;
  };
};

const testHOC5 = <Props extends { propName: string }>(Component: FC<Props>): FC<Omit<Props, 'propName'>> => {
  return (props) => {
    return <Component {...props as Props} />; // this should error as it breaks the component
  };
};

const ResultComponent5_1 = testHOC5(TestComponent_1)
x = () => <ResultComponent5_1 otherPropName={1}/> // using this will break TestComponent_1
const EmptyResultComponent5 = testHOC5(EmptyTestComponent); // this should error but it does not 


const testHOC6 = <Props extends {}>(Component: FC<Props & { propName: string }>): FC<Omit<Props, 'propName'>> => {
  return (props) => {
    return <Component {...props as Props} />; // this does error as it breaks the component
  };
};

const ResultComponent6_1 = testHOC6(TestComponent_1)
x = () => <ResultComponent6_1 otherPropName={1}/>
const EmptyResultComponent6 = testHOC6(EmptyTestComponent); // this should error but it does not 

// this is my solution
const testHOC7 = <Props extends {}>(Component: FC<Props & { propName: string }>): FC<Omit<Props, 'propName'>> => {
  return (props) => {
    return <Component {...props as Props} propName="value"/>;
  };
};

const ResultComponent7_1 = testHOC7(TestComponent_1)
x = () => <ResultComponent7_1 otherPropName={1}/> // ok
const EmptyResultComponent7 = testHOC7(EmptyTestComponent); // this should error but it does not

const testHOC4 = <Props extends { propName: string }>(Component: FC<Props>): FC<Subtract<Props, {propName: string}>> => {
  return (props) => {
    return <Component {...props} propName={"value"} />;
  };
};

// https://www.pluralsight.com/guides/higher-order-composition-typescript-react article with the `as` Solution