"use client";

import React, { useCallback, useMemo, useState } from "react";
import Datatable, { DatatableOption } from "@/components/ui/datatable";
import { DatatableItem } from "..";
import { FlushTableContainer } from "../datatable.styles";
import { EventDetail } from "./event-detail";
import { GnoEvent } from "@/types/data-type";
import { EVENT_TABLE_PAGE_SIZE } from "@/common/values/ui.constant";
import { ViewMoreButton } from "@/components/ui/button";

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

export const EventDatatable = ({ isFetched, events }: Props) => {
  const [activeEvents, setActiveEvents] = useState<string[]>([]);
  const [page, setPage] = useState(0);

  const loaded = useMemo(() => {
    return isFetched;
  }, [isFetched]);

  const hasNextPage = useMemo(() => {
    if (!loaded) {
      return false;
    }
    return events.length > (page + 1) * EVENT_TABLE_PAGE_SIZE;
  }, [events.length, loaded, page]);

  const nextPage = useCallback(() => {
    if (!hasNextPage) {
      return;
    }
    setPage(page => page + 1);
  }, [hasNextPage]);

  const filteredEvents = useMemo(() => {
    const endIndex = (page + 1) * EVENT_TABLE_PAGE_SIZE;
    return events.slice(0, endIndex);
  }, [events, page]);

  const toggleEventDetails = (eventId: string) => {
    setActiveEvents(prev => (prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]));
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
      .key("id")
      .name("Identifier")
      .width(200)
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
      .width(93)
      .colorName("blue")
      .renderOption(height => <DatatableItem.Block height={height} />)
      .build();
  };

  const createHeaderEventName = () => {
    return DatatableOption.Builder.builder<GnoEvent>()
      .key("type")
      .name("Event Name")
      .width(160)
      .colorName("blue")
      .renderOption(eventType => {
        return <DatatableItem.EventName eventName={eventType} />;
      })
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
      .width(180)
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
      .width(133)
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
    <FlushTableContainer>
      <Datatable loading={!loaded} headers={createHeaders()} datas={filteredEvents} renderDetails={renderDetails} />

      {hasNextPage && (
        <div className="button-wrapper">
          <ViewMoreButton variant="table" text="View More Events" onClick={nextPage} />
        </div>
      )}
    </FlushTableContainer>
  );
};
