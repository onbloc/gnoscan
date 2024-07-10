'use client';

import React, {useCallback, useMemo, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import styled from 'styled-components';
import theme from '@/styles/theme';
import {DatatableItem} from '..';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {GnoEvent} from '@/types/data-type';
import Text from '@/components/ui/text';
import Link from 'next/link';
import {useNetwork} from '@/common/hooks/use-network';
import Tooltip from '@/components/ui/tooltip';
import IconCopy from '@/assets/svgs/icon-copy.svg';
import {useUsername} from '@/common/hooks/account/use-username';

interface Props {
  isFetched: boolean;
  events: GnoEvent[];
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw GnoEvent <br />
    type and package path.
  </>
);

export const EventDatatable = ({isFetched, events}: Props) => {
  const themeMode = useRecoilValue(themeState);
  const {isFetched: isFetchedUsername, getName} = useUsername();
  const [activeEvents, setActiveEvents] = useState<string[]>([]);

  const loaded = useMemo(() => {
    return isFetched && isFetchedUsername;
  }, [isFetched, isFetchedUsername]);

  const toggleEventDetails = (eventId: string) => {
    setActiveEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId],
    );
  };

  const createHeaders = () => {
    return [
      createHeaderEventId(),
      createHeaderTxHash(),
      createHeaderBlock(),
      createHeaderEventName(),
      createHeaderEmittedFrom(),
      createHeaderTime(),
      createToggleDetails(),
    ];
  };

  const createHeaderEventId = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('id')
      .name('Identifier')
      .width(200)
      .renderOption(id => <DatatableItem.EventId eventId={id} />)
      .build();
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('transactionHash')
      .name('Tx hash')
      .width(200)
      .colorName('blue')
      .tooltip(TOOLTIP_TYPE)
      .renderOption(txHash => <DatatableItem.TxHashCopy txHash={txHash} />)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('blockHeight')
      .name('Block')
      .width(93)
      .colorName('blue')
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderEventName = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('type')
      .name('Event Name')
      .width(160)
      .colorName('blue')
      .renderOption(eventType => {
        return <DatatableItem.EventName eventName={eventType} />;
      })
      .build();
  };

  const createHeaderEmittedFrom = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('caller')
      .name('Caller')
      .width(180)
      .colorName('blue')
      .renderOption(caller => (
        <DatatableItem.CallerCopy caller={caller} username={getName(caller)} />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('time')
      .name('Time')
      .width(180)
      .className('time')
      .renderOption(date => <DatatableItem.Date date={date} />)
      .build();
  };

  const createToggleDetails = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key('id')
      .name('')
      .width(133)
      .renderOption(id => (
        <DatatableItem.ToggleDetails
          active={activeEvents.includes(id)}
          onClick={() => toggleEventDetails(id)}
        />
      ))
      .build();
  };

  const renderDetails = useCallback(
    (event: GnoEvent) => {
      return <EventDetail visible={activeEvents.includes(event.id)} event={event} />;
    },
    [activeEvents],
  );

  return (
    <Container>
      <Datatable
        loading={!loaded}
        headers={createHeaders().map(item => {
          return {
            ...item,
            themeMode: themeMode,
          };
        })}
        datas={events}
        renderDetails={renderDetails}
      />
    </Container>
  );
};

const Container = styled.div<{maxWidth?: number}>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;

    & > div {
      padding: 0;
    }

    .more-button {
      width: 100%;
      padding: 16px;
      color: ${({theme}) => theme.colors.primary};
      background-color: ${({theme}) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;

const EventDetail: React.FC<{visible: boolean; event: GnoEvent}> = ({visible, event}) => {
  const {getUrlWithNetwork} = useNetwork();
  const {getName} = useUsername();

  return (
    <EventDetailWrapper className={visible ? 'active' : 'hidden'}>
      {visible && (
        <div className="container">
          <div className="event-details-header">
            <div className="path-wrapper">
              <Text type="p4" color={'primary'}>
                Current Realm Path:{' '}
                <Text type="p4" color={'blue'}>
                  <Link
                    href={getUrlWithNetwork(`/realms/details?path=${event.packagePath}`)}
                    passHref>
                    {event.packagePath}
                  </Link>
                  <Tooltip
                    className="path-copy-tooltip"
                    content="Copied!"
                    trigger="click"
                    copyText={event.packagePath}
                    width={85}>
                    <IconCopy className="svg-icon" />
                  </Tooltip>
                </Text>
              </Text>
            </div>
            <div className="caller-wrapper">
              <Text type="p4" color={'primary'}>
                OriginCaller:{' '}
                <Text type="p4" color={'blue'}>
                  <Link href={getUrlWithNetwork(`/accounts/${event.caller}`)} passHref>
                    {getName(event.caller) || event.caller}
                  </Link>
                  <Tooltip
                    className="path-copy-tooltip"
                    content="Copied!"
                    trigger="click"
                    copyText={event.caller}
                    width={85}>
                    <IconCopy className="svg-icon" />
                  </Tooltip>
                </Text>
              </Text>
            </div>
          </div>
          <div className="event-details-used">
            <div className="used-wrapper">
              <Text type="p4" color={'primary'}>
                <span className="func-definition">func </span>
                <span className="func-name">{event.functionName}</span>
                {' → std.Emit("'}
                <span className="event-name">{event.type}</span>
                {'"'}
                {event.attrs.map((attr, index) => (
                  <React.Fragment key={index}>
                    {', '}
                    <span className="event-param">{attr.key}</span>
                    {', '}
                    <span className="event-param">{attr.key + '_value'}</span>
                  </React.Fragment>
                ))}
                {')'}
              </Text>
            </div>
          </div>
          {event.attrs.length > 0 && (
            <div className="event-details-attributes">
              <div className="data-header">
                <Text className="key" type="h7" color={'primary'}>
                  Key
                </Text>
                <Text className="value" type="h7" color={'primary'}>
                  Value
                </Text>
              </div>
              {event.attrs.map((attribute, index) => (
                <div key={index} className="data-value">
                  <Text className="key" type="p4" color={'primary'}>
                    {attribute.key}
                  </Text>
                  <Text className="value" type="p4" color={'primary'}>
                    {`"${attribute.value}"`}
                  </Text>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </EventDetailWrapper>
  );
};

const EventDetailWrapper = styled.div<{maxWidth?: number}>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 323px;
    overflow: hidden;
    transition: all 0.4s ease;

    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      align-items: center;
      background-color: ${({theme}) => theme.colors.surface};
      gap: 16px;
      padding: 24px;
      border-radius: 10px;
    }

    &.hidden {
      height: 0;
    }

    .event-details-header {
      display: flex;
      flex-direction: row;
      width: 100%;
      height: 40px;
      gap: 16px;
      justify-content: center;
      /* align-items: center; */

      .path-wrapper,
      .caller-wrapper {
        display: flex;
        width: 100%;
        background-color: ${({theme}) => theme.colors.base};
        padding: 10px 12px;
        border-radius: 10px;

        & > * {
          display: inline-flex;
          align-items: center;
        }
      }
    }

    .event-details-used,
    .event-details-attributes {
      display: flex;
      width: 100%;
      background-color: ${({theme}) => theme.colors.base};
      border-radius: 10px;
    }

    .used-wrapper {
      display: flex;
      padding: 10px 12px;
      flex-direction: row;

      .func-definition {
        color: ${({theme}) => theme.colors.funcDefinition};
      }

      .func-name {
        color: ${({theme}) => theme.colors.funcName};
      }

      .event-name {
        color: ${({theme}) => theme.colors.eventName};
      }

      .event-param {
        color: ${({theme}) => theme.colors.eventParam};
      }
    }

    .event-details-attributes {
      flex-direction: column;

      & > div:not(:last-child) {
        border-bottom: 1px solid ${({theme}) => theme.colors.surface};
      }

      .data-header {
        display: flex;
        width: 100%;
        padding: 10px 12px;

        .key {
          min-width: 180px;
        }

        .value {
          width: 100%;
        }
      }

      .data-value {
        display: flex;
        width: 100%;
        padding: 10px 12px;

        .key {
          min-width: 180px;
        }

        .value {
          width: 100%;
          color: ${({theme}) => theme.colors.eventParam};
        }
      }
    }
  }
`;
