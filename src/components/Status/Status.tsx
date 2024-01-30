import React from 'react';

interface StatusProps {
  text: string;
}

export const Status: React.FunctionComponent<
  React.PropsWithChildren<StatusProps>
> = (props) => (
  <span>
    {props.children}
    <span className="pg-v5-u-ml-sm">{props.text}</span>
  </span>
);
