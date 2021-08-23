import { Text, TextContent } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { EventLogTable } from '../../../components/Notifications/EventLog/EventLogTable';
import { EventLogToolbar } from '../../../components/Notifications/EventLog/EventLogToolbar';
import { Messages } from '../../../properties/Messages';
import { NotificationEvent } from '../../../types/Event';
import { useEventLogFilter } from './useEventLogFilter';
import { useGetBundles } from '../../../services/Notifications/GetBundles';
import { useGetApplications, useGetApplicationsLazy } from '../../../services/Notifications/GetApplications';

const events: ReadonlyArray<NotificationEvent> = [
    {
        id: '1',
        event: 'pretzel',
        application: 'Ferrari Land Cruiser',
        bundle: 'Pierino',
        date: new Date('09/16/2038 06:09:02')
    },
    {
        id: '2',
        event: 'pain au levain',
        application: 'Hyundai Model 3',
        bundle: 'Valdeón cheese',
        date: new Date('03/12/2036 02:03:40')
    },
    {
        id: '3',
        event: 'rye',
        application: 'Jeep Mercielago',
        bundle: 'Casera Crotto',
        date: new Date('11/12/2032 10:11:02')
    },
    {
        id: '4',
        event: 'pretzel',
        application: 'Porsche Model 3',
        bundle: 'Strachet',
        date: new Date('12/14/1998 11:12:01')
    },
    {
        id: '5',
        event: 'boule',
        application: 'Bugatti Beetle',
        bundle: 'Zamorano cheese',
        date: new Date('05/22/2035 16:05:57')
    },
    {
        id: '6',
        event: 'muffin',
        application: 'Chrysler Model 3',
        bundle: 'Peretta',
        date: new Date('10/24/1982 03:10:58')
    },
    {
        id: '7',
        event: 'fruit bread',
        application: 'Polestar Sentra',
        bundle: 'Italico',
        date: new Date('04/14/2029 09:04:45')
    },
    {
        id: '8',
        event: 'ciabatta',
        application: 'Cadillac V90',
        bundle: 'Toma ovicaprina',
        date: new Date('07/17/1982 13:07:44')
    },
    {
        id: '9',
        event: 'rugbrød',
        application: 'Land Rover El Camino',
        bundle: 'Tipo malga friulano',
        date: new Date('03/10/2035 18:03:14')
    },
    {
        id: '10',
        event: 'naan',
        application: 'Kia XC90',
        bundle: 'Ossau-Iraty',
        date: new Date('11/27/2045 14:11:07')
    },
    {
        id: '11',
        event: 'hamburger bun',
        application: 'Bugatti Accord',
        bundle: 'Hoch Pustertaler',
        date: new Date('03/26/1989 20:03:54')
    },
    {
        id: '12',
        event: 'hardtack',
        application: 'Mini Altima',
        bundle: 'Erborinato di Artavaggio',
        date: new Date('12/26/2007 23:12:51')
    },
    {
        id: '13',
        event: 'matzoh',
        application: 'BMW Volt',
        bundle: 'Boves',
        date: new Date('11/19/1984 01:11:08')
    },
    {
        id: '14',
        event: 'flatbread',
        application: 'Bentley V90',
        bundle: 'Aglino',
        date: new Date('04/20/1970 23:04:40')
    },
    {
        id: '15',
        event: 'scone',
        application: 'Chevrolet Land Cruiser',
        bundle: 'Chechil',
        date: new Date('12/17/2026 13:12:03')
    },
    {
        id: '16',
        event: 'pain au levain',
        application: 'BMW F-150',
        bundle: 'Pastorella del Cerreto di Sorano',
        date: new Date('11/30/2039 01:11:58')
    },
    {
        id: '17',
        event: 'ficelle',
        application: 'BMW Altima',
        bundle: 'koumis',
        date: new Date('09/28/2013 09:09:27')
    },
    {
        id: '18',
        event: 'hamburger bun',
        application: 'Rolls Royce Beetle',
        bundle: 'Fonduta savoiarda',
        date: new Date('07/20/2006 23:07:43')
    },
    {
        id: '19',
        event: 'lavash',
        application: 'Aston Martin Colorado',
        bundle: 'Formaggio in crema',
        date: new Date('03/20/1983 14:03:06')
    },
    {
        id: '20',
        event: 'pumpernickel',
        application: 'Mercedes Benz Beetle',
        bundle: 'Canestrato trentino',
        date: new Date('11/01/1988 09:11:36')
    },
    {
        id: '21',
        event: 'cornbread',
        application: 'Hyundai Expedition',
        bundle: 'Tomino del Talucco',
        date: new Date('03/05/2030 08:03:29')
    },
    {
        id: '22',
        event: 'tortilla',
        application: 'Dodge El Camino',
        bundle: 'Gorgonzola a due paste',
        date: new Date('07/25/1984 02:07:00')
    },
    {
        id: '23',
        event: 'fruit bread',
        application: 'Toyota XC90',
        bundle: 'Peretta',
        date: new Date('09/15/2031 09:09:17')
    },
    {
        id: '24',
        event: 'lavash',
        application: 'Jeep Escalade',
        bundle: 'Nocciolino di ceva',
        date: new Date('04/25/2029 11:04:49')
    },
    {
        id: '25',
        event: 'pane d\'olive',
        application: 'Aston Martin Spyder',
        bundle: 'Queso Panela',
        date: new Date('01/09/1985 08:01:16')
    },
    {
        id: '26',
        event: 'ciabatta',
        application: 'Smart 911',
        bundle: 'Brânză de vaci',
        date: new Date('02/27/1969 08:02:19')
    },
    {
        id: '27',
        event: 'tortilla',
        application: 'Chrysler Grand Cherokee',
        bundle: 'Stracchino nostrano di Monte Bronzone',
        date: new Date('04/06/1985 08:04:35')
    },
    {
        id: '28',
        event: 'brioche',
        application: 'Honda El Camino',
        bundle: 'Harlech',
        date: new Date('07/28/2005 00:07:54')
    },
    {
        id: '29',
        event: 'pita',
        application: 'Ford Civic',
        bundle: 'Ormea',
        date: new Date('10/26/1998 07:10:20')
    },
    {
        id: '30',
        event: 'muffin',
        application: 'Audi Spyder',
        bundle: 'Bovški sir',
        date: new Date('05/01/2016 14:05:55')
    },
    {
        id: '31',
        event: 'matzoh',
        application: 'Dodge Charger',
        bundle: 'Cheese curds',
        date: new Date('04/19/1999 10:04:38')
    },
    {
        id: '32',
        event: 'pita',
        application: 'Bugatti Sentra',
        bundle: 'Snøfrisk',
        date: new Date('10/07/2041 19:10:27')
    },
    {
        id: '33',
        event: 'naan',
        application: 'Land Rover Mercielago',
        bundle: 'Banon',
        date: new Date('09/18/2033 15:09:59')
    },
    {
        id: '34',
        event: 'baguette',
        application: 'Jaguar Camry',
        bundle: 'Queso de Mahón',
        date: new Date('09/27/2044 16:09:29')
    },
    {
        id: '35',
        event: 'soda bread',
        application: 'Land Rover Model T',
        bundle: 'Mohant',
        date: new Date('09/19/2007 05:09:39')
    },
    {
        id: '36',
        event: 'naan',
        application: 'Bentley Charger',
        bundle: 'Kőrözött',
        date: new Date('08/04/2013 22:08:57')
    },
    {
        id: '37',
        event: 'hardtack',
        application: 'Mini Model S',
        bundle: 'Stintino di Luino',
        date: new Date('02/21/2021 20:02:27')
    },
    {
        id: '38',
        event: 'soda bread',
        application: 'Hyundai Explorer',
        bundle: 'Scamorza calabra',
        date: new Date('12/17/2049 17:12:34')
    },
    {
        id: '39',
        event: 'pita',
        application: 'Toyota Model T',
        bundle: 'Formadi',
        date: new Date('11/16/2010 00:11:21')
    },
    {
        id: '40',
        event: 'cornbread',
        application: 'Toyota F-150',
        bundle: 'Piramide di capra',
        date: new Date('11/17/2021 16:11:41')
    },
    {
        id: '41',
        event: 'lavash',
        application: 'Bentley XTS',
        bundle: 'Formaggio del Gleno',
        date: new Date('02/19/1980 01:02:20')
    },
    {
        id: '42',
        event: 'brioche',
        application: 'Mazda XTS',
        bundle: 'Dolce Isola misto',
        date: new Date('03/25/1990 11:03:32')
    },
    {
        id: '43',
        event: 'lavash',
        application: 'Porsche XTS',
        bundle: 'Mascarpone di bufala',
        date: new Date('11/14/1972 10:11:59')
    },
    {
        id: '44',
        event: 'pumpernickel',
        application: 'Kia Camaro',
        bundle: 'Tupí',
        date: new Date('11/21/2013 02:11:43')
    },
    {
        id: '45',
        event: 'hamburger bun',
        application: 'Toyota Cruze',
        bundle: 'Maccagno',
        date: new Date('01/08/1972 18:01:51')
    },
    {
        id: '46',
        event: 'pretzel',
        application: 'Audi Volt',
        bundle: 'Babybel',
        date: new Date('02/23/2020 19:02:16')
    },
    {
        id: '47',
        event: 'rugbrød',
        application: 'Cadillac CTS',
        bundle: 'Queso Ibores',
        date: new Date('06/23/2024 03:06:34')
    },
    {
        id: '48',
        event: 'muffin',
        application: 'Maserati ATS',
        bundle: 'Formaggio di colostro ovino',
        date: new Date('01/20/2016 23:01:08')
    },
    {
        id: '49',
        event: 'baguette',
        application: 'Lamborghini Grand Caravan',
        bundle: 'Caprino a coagulazione lattica',
        date: new Date('05/13/2019 15:05:19')
    },
    {
        id: '50',
        event: 'paratha',
        application: 'Jaguar Focus',
        bundle: 'Mezzapasta',
        date: new Date('07/21/1973 06:07:01')
    },
    {
        id: '51',
        event: 'scone',
        application: 'Hyundai Colorado',
        bundle: 'Tara Ban',
        date: new Date('04/29/2013 15:04:59')
    },
    {
        id: '52',
        event: 'cornbread',
        application: 'Maserati Malibu',
        bundle: 'seré',
        date: new Date('10/18/2038 19:10:24')
    },
    {
        id: '53',
        event: 'pain de mie',
        application: 'Cadillac Mercielago',
        bundle: 'Formandi frant',
        date: new Date('04/26/2000 09:04:47')
    },
    {
        id: '54',
        event: 'boule',
        application: 'Toyota Taurus',
        bundle: 'Formaggio pecorino di Atri',
        date: new Date('03/24/1972 21:03:24')
    },
    {
        id: '55',
        event: 'pain au levain',
        application: 'Porsche Roadster',
        bundle: 'Piramide di capra',
        date: new Date('10/22/1976 11:10:24')
    }
];

export const EventLogPage: React.FunctionComponent = () => {

    const getBundles = useGetBundles();
    const bundles = React.useMemo(() => {
        const payload = getBundles.payload;
        if (payload?.status === 200) {
            return payload.value;
        }

        return [];
    }, [ getBundles.payload ]);

    const getApplications = useGetApplications();
    const applications = React.useMemo(() => {
        const payload = getApplications.payload;
        if (payload?.status === 200) {
            return payload.value;
        }

        return [];
    }, [ getApplications.payload ]);

    const eventLogFilters = useEventLogFilter();

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.notifications.eventLog.title } />
                <TextContent>
                    <Text>{ Messages.pages.notifications.eventLog.subtitle }</Text>
                </TextContent>
            </PageHeader>
            <Main>
                <EventLogToolbar
                    { ...eventLogFilters }
                    bundleOptions={ bundles }
                    applicationOptions={ applications }
                >
                    <EventLogTable events={ events } />
                </EventLogToolbar>
            </Main>
        </>
    );
};
