import * as React from 'react';

export interface RenderIfProps {
  renderIf: () => boolean;
  children: React.ReactNode;
}

export interface RenderIfTrueFalse {
  _value?: boolean;
  children: React.ReactNode;
}

const checkRenderIfTrueFalse = (props: RenderIfTrueFalse) => {
  if (props._value === undefined) {
    throw new Error(
      'Invalid usage of RenderIf*, must be immediately after a RenderIf'
    );
  }
};

export const RenderIfTrue: React.FunctionComponent<RenderIfTrueFalse> = (
  props
) => {
  checkRenderIfTrueFalse(props);
  if (props._value) {
    return <> {props.children} </>;
  }

  return null;
};

export const RenderIfFalse: React.FunctionComponent<RenderIfTrueFalse> = (
  props
) => {
  checkRenderIfTrueFalse(props);
  if (props._value) {
    return null;
  }

  return <> {props.children} </>;
};

export const RenderIf: React.FunctionComponent<RenderIfProps> = (props) => {
  const { renderIf } = props;
  const value: boolean = React.useMemo(() => renderIf(), [renderIf]);

  const children = React.Children.map(props.children, (child) => {
    if (
      React.isValidElement(child) &&
      (child.type === RenderIfTrue || child.type === RenderIfFalse)
    ) {
      return React.cloneElement<RenderIfTrueFalse>(
        child as unknown as React.FunctionComponentElement<RenderIfTrueFalse>,
        {
          _value: value,
        }
      );
    } else {
      throw new Error(
        'Only RenderIfTrue and RenderIfFalse are accepted Elements in RenderIf'
      );
    }
  });

  return <> {children} </>;
};
