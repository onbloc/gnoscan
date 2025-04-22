import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import React from "react";
import styled from "styled-components";

interface Props {
  eventName: string;
}

export const EventName = ({ eventName }: Props) => {
  return (
    <EventNameWrapper className="ellipsis">
      <Badge className="event-name" type="blue" margin={"0"}>
        <Text type="p4" color="white">
          {eventName}
        </Text>
      </Badge>
    </EventNameWrapper>
  );
};

const EventNameWrapper = styled.span`
  & {
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    height: auto;
    justify-content: flex-start;
    align-items: center;
  }
`;
