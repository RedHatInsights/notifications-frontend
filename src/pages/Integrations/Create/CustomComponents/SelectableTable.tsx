import React, { useEffect, useMemo, useState } from 'react';
import { AssociateEventTypesStep } from '../../../Notifications/BehaviorGroupWizard/Steps/AssociateEventTypesStep';
import { useGetBundleByName } from '../../../../services/Notifications/GetBundles';
import { useGetApplicationsLazy } from '../../../../services/Notifications/GetApplications';
import { Facet } from '../../../../types/Notification';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const SelectableTable = () => {
  const [bundle, setBundle] = useState<Facet | undefined>();
  const { getState } = useFormApi();

  const getBundles = useGetBundleByName();
  useEffect(() => {
    // use the value from form to determine which bundle to pull from
    getBundles(getState().values['product-family']).then((data) => {
      setBundle({ ...data, displayName: data?.display_name } as Facet);
    });
  }, [getBundles, getState]);
  const getApplications = useGetApplicationsLazy();

  React.useEffect(() => {
    const query = getApplications.query;
    // use the value from form to determine which bundle to pull from
    query('rhel');
  }, [bundle, getApplications.query]);

  const applications: Array<Facet> | null | undefined = useMemo(() => {
    if (getApplications.payload) {
      return getApplications.payload.status === 200
        ? getApplications.payload.value
        : null;
    }

    return undefined;
  }, [getApplications.payload]);

  return applications && bundle ? (
    <AssociateEventTypesStep
      applications={applications}
      bundle={bundle}
      setValues={(values) => {
        console.log(values);
      }}
      values={{ events: [] }}
    />
  ) : (
    'loading'
  );
};

export default SelectableTable;
