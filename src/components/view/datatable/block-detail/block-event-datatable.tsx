'use client';

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Datatable, {DatatableOption} from '@/components/ui/datatable';
import styled from 'styled-components';
import theme from '@/styles/theme';
import {DatatableItem} from '..';
import {useRecoilValue} from 'recoil';
import {themeState} from '@/states';
import {useBlock} from '@/common/hooks/blocks/use-block';
import {GnoEvent} from '@/types/data-type';
import {useTokenMeta} from '@/common/hooks/common/use-token-meta';
import Text from '@/components/ui/text';

interface Props {
  height: string | number;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw GnoEvent <br />
    type and package path.
  </>
);

export const BlockEventDatatable = ({height}: Props) => {
  const themeMode = useRecoilValue(themeState);
  const [activeEvents, setActiveEvents] = useState<string[]>([]);

  const {isFetched, isFetchedBlockResult, events} = useBlock(Number(height));

  const loaded = useMemo(() => {
    return isFetched && isFetchedBlockResult;
  }, [isFetched, isFetchedBlockResult]);

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
      .renderOption(() => <DatatableItem.Block height={height} />)
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
      .renderOption(caller => <DatatableItem.TxHashCopy txHash={caller} />)
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
      if (!activeEvents.includes(event.id)) {
        return <></>;
      }

      return EventDetail(event);
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

const EventDetail = (event: GnoEvent) => {
  return (
    <EventDetailWrapper>
      <div className="event-details-header">
        <div className="path-wrapper">
          <Text type="p4" color={'primary'}>
            Current Realm Path:{' '}
            <Text type="p4" color={'blue'}>
              {event.packagePath}
            </Text>
          </Text>
        </div>
        <div className="caller-wrapper">
          <Text type="p4" color={'primary'}>
            OriginCaller:{' '}
            <Text type="p4" color={'blue'}>
              {event.caller}
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
    </EventDetailWrapper>
  );
};

const EventDetailWrapper = styled.div<{maxWidth?: number}>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: auto;
    align-items: center;
    background-color: ${({theme}) => theme.colors.surface};
    gap: 16px;
    padding: 24px;
    border-radius: 10px;

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
        color: #ff9492;
      }

      .func-name {
        color: #dbb7ff;
      }

      .event-name {
        color: #dbb7ff;
      }

      .event-param {
        color: #addcff;
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
          color: #addcff;
        }
      }
    }
  }
`;
