import React from "react";
import styled from "styled-components";
import Link from "next/link";
import { GnoEvent } from "@/types/data-type";
import Text from "@/components/ui/text";
import { CopyTooltip } from "@/components/ui/tooltip/copy-tooltip";
import { useNetwork } from "@/common/hooks/use-network";
import { getAddressLinkPath } from "@/common/utils/address-label.utility";

export const EventDetail: React.FC<{ visible: boolean; event: GnoEvent }> = ({ visible, event }) => {
  const { getUrlWithNetwork } = useNetwork();

  return (
    <EventDetailWrapper className={visible ? "active" : "hidden"}>
      {visible && (
        <div className="container">
          <div className="event-details-header">
            <div className="path-wrapper">
              <Text type="p4" color={"primary"}>
                Realm Path:{" "}
                <Text type="p4" color={"blue"} display="inline">
                  <Link href={getUrlWithNetwork(`/realms/details?path=${event.packagePath}`)} passHref>
                    {event.packagePath}
                  </Link>
                  <CopyTooltip variant="path" copyText={event.packagePath} />
                </Text>
              </Text>
            </div>
            <div className="caller-wrapper">
              <Text type="p4" color={"primary"}>
                OriginCaller:{" "}
                <Text type="p4" color={"blue"} display="inline">
                  <Link
                    href={getUrlWithNetwork(
                      getAddressLinkPath({
                        address: event.originCaller,
                        label: event.originCallerLabel,
                        labelType: event.originCallerLabelType,
                      }),
                    )}
                    passHref
                  >
                    {event.originCallerLabel || event.originCaller}
                  </Link>
                  <CopyTooltip variant="path" copyText={event.originCaller || ""} />
                </Text>
              </Text>
            </div>
          </div>
          <div className="event-details-used">
            <div className="used-wrapper">
              <Text type="p4" color={"primary"}>
                <span className="func-definition">func </span>
                <span className="func-name">{event.functionName}</span>
                {' → std.Emit("'} {/* eslint-disable-line quotes */}
                <span className="event-name">{event.type}</span>
                {'"'} {/* eslint-disable-line quotes */}
                {(event.attrs || []).map((attr, index) => (
                  <React.Fragment key={index}>
                    {", "}
                    <span className="event-param">{attr.key}</span>
                    {", "}
                    <span className="event-param">{attr.key + "_value"}</span>
                  </React.Fragment>
                ))}
                {")"}
              </Text>
            </div>
          </div>
          {(event.attrs || []).length > 0 && (
            <div className="event-details-attributes">
              <div className="data-header">
                <Text className="key" type="h7" color={"primary"}>
                  Key
                </Text>
                <Text className="value" type="h7" color={"primary"}>
                  Value
                </Text>
              </div>
              {event.attrs.map((attribute, index) => (
                <div key={index} className="data-value">
                  <Text className="key" type="p4" color={"primary"}>
                    {attribute.key}
                  </Text>
                  <Text className="value" type="p4" color={"primary"}>
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

const EventDetailWrapper = styled.div<{ maxWidth?: number }>`
  & {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 323px;
    height: fit-content;
    overflow: hidden;
    transition: all 0.4s ease;

    .container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: auto;
      align-items: center;
      background-color: ${({ theme }) => theme.colors.surface};
      gap: 16px;
      padding: 24px;
      border-radius: 10px;
      overflow-wrap: anywhere;
    }

    &.hidden {
      min-height: 0;
      height: 0;
    }

    .event-details-header {
      display: flex;
      flex-direction: row;
      width: 100%;
      min-height: 40px;
      gap: 16px;
      justify-content: center;

      .path-wrapper,
      .caller-wrapper {
        display: flex;
        width: 100%;
        background-color: ${({ theme }) => theme.colors.base};
        padding: 10px 12px;
        border-radius: 10px;
      }
    }

    .event-details-used,
    .event-details-attributes {
      display: flex;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.base};
      border-radius: 10px;
    }

    .used-wrapper {
      display: flex;
      padding: 10px 12px;
      flex-direction: row;

      .func-definition {
        color: ${({ theme }) => theme.colors.funcDefinition};
      }

      .func-name {
        color: ${({ theme }) => theme.colors.funcName};
      }

      .event-name {
        color: ${({ theme }) => theme.colors.eventName};
      }

      .event-param {
        color: ${({ theme }) => theme.colors.eventParam};
      }
    }

    .event-details-attributes {
      flex-direction: column;

      & > div:not(:last-child) {
        border-bottom: 1px solid ${({ theme }) => theme.colors.surface};
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
          color: ${({ theme }) => theme.colors.eventParam};
        }
      }
    }
  }
`;
