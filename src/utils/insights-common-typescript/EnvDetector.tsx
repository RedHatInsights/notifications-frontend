import * as React from 'react';
import { RenderIf } from './RenderIf';
import { BetaEnvironment, Environment, NonBetaEnvironment } from './Environment';

interface EnvDetectorProps {
  onEnvironment: ReadonlyArray<Environment> | Environment;
  currentEnvironment: Environment;
}

export const EnvDetector: React.FunctionComponent<React.PropsWithChildren<EnvDetectorProps>> = (
  props
) => {
  const environment = React.useMemo(
    () => (Array.isArray(props.onEnvironment) ? props.onEnvironment : [props.onEnvironment]),
    [props.onEnvironment]
  );

  const renderIf = React.useCallback(
    () => environment.includes(props.currentEnvironment),
    [props.currentEnvironment, environment]
  );

  return <RenderIf renderIf={renderIf}>{props.children}</RenderIf>;
};

interface InsightsEnvDetectorProps extends Omit<EnvDetectorProps, 'currentEnvironment'> {
  isBeta: boolean;
  environment: string;
}

export const InsightsEnvDetector: React.FunctionComponent<
  React.PropsWithChildren<InsightsEnvDetectorProps>
> = (props) => {
  const currentEnvironment: Environment = React.useMemo(() => {
    if (props.isBeta) {
      return `${props.environment}-beta` as BetaEnvironment;
    }
    return props.environment as NonBetaEnvironment;
  }, [props.isBeta, props.environment]);

  return (
    <EnvDetector onEnvironment={props.onEnvironment} currentEnvironment={currentEnvironment}>
      {props.children}
    </EnvDetector>
  );
};
