import { textEllipsis } from "@/common/utils/string-util";
import React from "react";

interface Props {
  eventId: string;
}

export const EventId = ({ eventId }: Props) => {
  return <span>{textEllipsis(eventId ?? "", 8)}</span>;
};
