"use client";

import React, { useCallback, useMemo, useState } from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import styled from "styled-components";
import theme from "@/styles/theme";
import { DatatableItem } from "..";
import { EventDetail } from "./event-detail";
import { useRecoilValue } from "recoil";
import { themeState } from "@/states";
import { GnoEvent } from "@/types/data-type";
import { Button } from "@/components/ui/button";
import { useWindowSize } from "@/common/hooks/use-window-size";

/**
 * - "default": Block page events (Identifier, Tx Hash, Block, Event Name, Caller, Time).
 * - "activity": Realm/Token Events tab (Identifier, Tx Hash, Event Type, Attributes, Block, Time).
 */
export type EventDatatableVariant = "default" | "activity";

interface Props {
  isFetched: boolean;
  events: GnoEvent[];
  hasNextPage?: boolean;
  nextPage?: () => void;
  variant?: EventDatatableVariant;
}

const TOOLTIP_TYPE = (
  <>
    Hover on each value to <br />
    view the raw GnoEvent <br />
    type and package path.
  </>
);

export const StandardNetworkEventDatatable = ({
  isFetched,
  events,
  hasNextPage,
  nextPage,
  variant = "default",
}: Props) => {
  const { breakpoint } = useWindowSize();
  const themeMode = useRecoilValue(themeState);
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  // Activity widths sum to the 1146px table min-width so columns stay evenly spaced.
  const isActivity = variant === "activity";

  const loaded = useMemo(() => {
    return isFetched;
  }, [isFetched]);

  const toggleEventDetails = (eventId: string) => {
    setActiveEvents(prev => (prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]));
  };

  const createHeaders = () => {
    if (variant === "activity") {
      return [
        createHeaderEventId(),
        createHeaderTxHash(),
        createHeaderEventName(),
        createHeaderAttributes(),
        createHeaderBlock(),
        createHeaderTime(),
        createToggleDetails(),
      ];
    }

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
      .key("id")
      .name("Identifier")
      .width(isActivity ? 190 : 200)
      .renderOption(id => <DatatableItem.EventId eventId={id} />)
      .build();
  };

  const createHeaderTxHash = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("transactionHash")
      .name("Tx Hash")
      .width(200)
      .colorName("blue")
      .tooltip(TOOLTIP_TYPE)
      .renderOption(txHash => <DatatableItem.TxHashCopy txHash={txHash} />)
      .build();
  };

  const createHeaderBlock = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("blockHeight")
      .name("Block")
      .width(isActivity ? 110 : 93)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderEventName = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("type")
      .name(variant === "activity" ? "Event Type" : "Event Name")
      .width(160)
      .colorName("blue")
      .renderOption(eventType => {
        return <DatatableItem.EventName eventName={eventType} />;
      })
      .build();
  };

  const createHeaderAttributes = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("attrs")
      .name("Attributes")
      .width(256)
      .renderOption(attrs => <DatatableItem.EventAttributes attributes={attrs} />)
      .build();
  };

  const createHeaderEmittedFrom = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("caller")
      .name("Caller")
      .width(180)
      .colorName("blue")
      .renderOption((_, data) => (
        <DatatableItem.CallerCopy
          caller={data.caller}
          username={data.callerName}
          label={data.callerLabel}
          labelType={data.callerLabelType}
        />
      ))
      .build();
  };

  const createHeaderTime = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("time")
      .name("Time")
      .width(isActivity ? 120 : 180)
      .className("time")
      .renderOption((date, data) =>
        !!date ? <DatatableItem.Date date={date} /> : <DatatableItem.LazyDate blockHeight={data.blockHeight} />,
      )
      .build();
  };

  const createToggleDetails = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("id")
      .name("")
      .width(isActivity ? 110 : 133)
      .renderOption(id => (
        <DatatableItem.ToggleDetails active={activeEvents.includes(id)} onClick={() => toggleEventDetails(id)} />
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

      {hasNextPage ? (
        <Button className={`more-button ${breakpoint}`} radius={"4px"} onClick={nextPage}>
          {"View More Events"}
        </Button>
      ) : (
        <React.Fragment />
      )}
    </Container>
  );
};

const Container = styled.div<{ maxWidth?: number }>`
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
      color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.surface};
      ${theme.fonts.p4}
      font-weight: 600;
      margin-top: 24px;

      &.desktop {
        width: 344px;
      }
    }
  }
`;
