import * as React from 'react';
import { RenderIf } from './RenderIf';
import {
  BetaEnvironment,
  Environment,
  NonBetaEnvironment,
} from './Environment';
import { InsightsType } from './InsightsType';

interface EnvDetectorProps {
  onEnvironment: ReadonlyArray<Environment> | Environment;
  currentEnvironment: Environment;
}

export const EnvDetector: React.FunctionComponent<
  React.PropsWithChildren<EnvDetectorProps>
> = (props) => {
  const environment = React.useMemo(
    () =>
      Array.isArray(props.onEnvironment)
        ? props.onEnvironment
        : [props.onEnvironment],
    [props.onEnvironment]
  );

  const renderIf = React.useCallback(
    () => environment.includes(props.currentEnvironment),
    [props.currentEnvironment, environment]
  );

  return <RenderIf renderIf={renderIf}>{props.children}</RenderIf>;
};

interface InsightsBetaDetectorProps
  extends Omit<EnvDetectorProps, 'currentEnvironment'> {
  insights: InsightsType;
}

export const InsightsEnvDetector: React.FunctionComponent<
  React.PropsWithChildren<InsightsBetaDetectorProps>
> = (props) => {
  const currentEnvironment: Environment = React.useMemo(() => {
    const isBeta = props.insights.chrome.isBeta();
    const env: NonBetaEnvironment = props.insights.chrome.getEnvironment();
    if (isBeta) {
      return `${env}-beta` as BetaEnvironment;
    } else {
      return env;
    }
  }, [props.insights]);

  return (
    <EnvDetector
      onEnvironment={props.onEnvironment}
      currentEnvironment={currentEnvironment}
    >
      {props.children}
    </EnvDetector>
  );
};
