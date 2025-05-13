/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import GnoscanSymbol from "@/assets/svgs/icon-gnoscan-symbol.svg";
import GnoscanSymbolLight from "@/assets/svgs/icon-gnoscan-symbol-light.svg";
import Text from "@/components/ui/text";
import theme from "@/styles/theme";
import mixins from "@/styles/mixins";
import useOutSideClick from "@/common/hooks/use-outside-click";
import { zindex } from "@/common/values/z-index";
import { ChainModel } from "@/models/chain-model";
import { useNetworkProvider } from "@/common/hooks/provider/use-network-provider";
import { useNetwork } from "@/common/hooks/use-network";
import { useRouter } from "next/router";
import { useThemeMode } from "@/common/hooks/use-theme-mode";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { NodeRPCClient } from "@/common/clients/node-client";

export interface NetworkData {
  all: string[];
  current: string;
}

interface StyleProps {
  entry?: boolean;
  toggle?: boolean;
  ref?: any;
}

interface NetworkProps extends StyleProps {
  chains: ChainModel[];
  toggleHandler: () => void;
  networkSettingHandler: (chainId: string) => void;
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

const Network = ({ entry, chains, toggle, toggleHandler, networkSettingHandler, setToggle }: NetworkProps) => {
  const { currentNetwork, nodeRPCClient } = useNetworkProvider();
  const { currentNetwork: currentNetworkInfo, changeCustomNetwork } = useNetwork();
  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);
  const ref = useOutSideClick(() => setToggle(false));
  const [customRpcUrl, setCustomRpcUrl] = useState("");
  const [indexerUrl, setIndexerUrl] = useState("");
  const [isErrorRpcUrl, setIsErrorRpcUrl] = useState(false);
  const [isErrorIndexerUrl, setIsErrorIndexerUrl] = useState(false);
  const { pathname } = useRouter();
  const { isDark, isLight } = useThemeMode();

  const isReverseColor = useMemo(() => {
    const isHome = pathname === "" || pathname === "/";
    return isHome && isLight;
  }, [pathname, isLight]);

  const availCustomConnect = useMemo(() => {
    if (isErrorRpcUrl || isErrorIndexerUrl || !customRpcUrl) {
      return false;
    }
    return true;
  }, [isErrorRpcUrl, isErrorIndexerUrl]);

  const connect = useCallback(async () => {
    if (!customRpcUrl) {
      setIsErrorRpcUrl(true);
      return;
    }

    setIsNetworkSwitching(true);

    await changeCustomNetwork(customRpcUrl, indexerUrl);

    const tempRpcClient = new NodeRPCClient(customRpcUrl, "");
    await tempRpcClient.health().finally(() => setIsNetworkSwitching(false));
  }, [nodeRPCClient, customRpcUrl, indexerUrl]);

  useEffect(() => {
    if (toggle && currentNetworkInfo?.isCustom) {
      setCustomRpcUrl(currentNetworkInfo.rpcUrl || "");
      setIndexerUrl(currentNetworkInfo.indexerUrl || "");
    }
  }, [toggle]);

  return (
    <NetworkButton entry={entry} onClick={toggleHandler} ref={ref}>
      <NetworkInfoWrapper>
        {isReverseColor || isDark ? (
          <GnoscanSymbol className="svg-icon" />
        ) : (
          <GnoscanSymbolLight className="svg-icon" />
        )}
        <Text type="h7" color={isReverseColor ? "white" : "primary"}>
          {currentNetwork?.name || ""}
        </Text>
      </NetworkInfoWrapper>
      <NetworkList toggle={toggle} entry={entry}>
        {chains.map((chain: ChainModel, index: number) => (
          <li
            key={index}
            onClick={e => {
              e.stopPropagation();
              networkSettingHandler(chain.chainId);
            }}
            className={currentNetwork?.chainId === chain.chainId ? "selected" : ""}
          >
            <div className="item row">
              {isDark ? <GnoscanSymbol className="svg-icon" /> : <GnoscanSymbolLight className="svg-icon" />}
              <div className="info-wrapper">
                <Text type="h7" color="primary">
                  {chain.name}
                </Text>
                <Text type="body1" color="tertiary">
                  {chain.rpcUrl}
                </Text>
              </div>
            </div>
          </li>
        ))}
        <li className={currentNetwork?.chainId === "" ? "selected" : ""}>
          <div className="item">
            <div className="input-wrapper">
              <Text type="p4" color="primary">
                Custom Network
              </Text>
              <input
                className="custom-input"
                value={customRpcUrl}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  setCustomRpcUrl(e.target.value);
                  setIsErrorRpcUrl(false);
                }}
                placeholder="RPC URL"
              />
              <input
                className="custom-input"
                value={indexerUrl}
                onClick={e => e.stopPropagation()}
                onChange={e => {
                  setIndexerUrl(e.target.value);
                  setIsErrorIndexerUrl(false);
                }}
                placeholder="Tx Indexer URL (Optional)"
              />
              <div
                className={availCustomConnect ? "connect active" : "connect"}
                onClick={e => {
                  e.stopPropagation();
                  connect();
                }}
              >
                <Text type="body1" color="primary">
                  {isNetworkSwitching ? <LoadingSpinner size={16} /> : "Connect"}
                </Text>
              </div>
            </div>
          </div>
        </li>
      </NetworkList>
    </NetworkButton>
  );
};

const NetworkButton = styled.button<StyleProps>`
  position: relative;
  display: flex;
  background-color: ${({ entry }) => (entry ? theme.lightTheme.reverse : theme.lightTheme.base)};
  width: fit-content;
  height: 44px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  z-index: 99;

  .svg-icon {
    width: 24px;
    height: 24px;
  }
`;

const NetworkInfoWrapper = styled.div<StyleProps>`
  display: flex;
  padding: 10px 15px;
  height: 44px;
  border-radius: 12px;
  gap: 8px;
  justify-content: center;
  align-items: center;
`;

const NetworkList = styled.ul<StyleProps>`
  width: 280px;
  opacity: ${({ toggle }) => (toggle ? "1" : "0")};
  visibility: ${({ toggle }) => (toggle ? "visible" : "hidden")};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.dimmed50};
  padding: 8px;
  transition: all 0.3s ease;
  transform: ${({ toggle }) => (toggle ? "scale(1)" : "scale(0.5)")};
  z-index: ${zindex.scrollbar};
  ${({ toggle }) => mixins.posMoveToTopAndRight(toggle ? "50px" : "0px")};

  & li {
    ${mixins.flexbox("row", "center", "center")};
    color: ${({ theme }) => theme.colors.tertiary};
    height: auto;
    transition: background-color 0.4s ease;
    cursor: pointer;
    border-radius: 8px;

    &.selected {
      background-color: ${({ theme }) => theme.colors.select};
      color: ${({ theme }) => theme.colors.reverse};
    }
  }

  & .item {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 8px 12px;
    gap: 12px;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    border-radius: 8px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.hover};
    }

    &.row {
      flex-direction: row;
    }

    .info-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 6px;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 10px;

      .custom-input {
        display: flex;
        padding: 8px;
        align-items: flex-start;
        gap: 10px;
        align-self: stretch;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.05);
        background: ${({ theme }) => theme.colors.base};
        color: ${({ theme }) => theme.colors.primary};
        font-size: 12px;

        &::placeholder {
          color: ${({ theme }) => theme.colors.tertiary};
          opacity: 1; /* Firefox */
        }
      }

      .connect {
        display: flex;
        width: 100%;
        height: 33px;
        justify-content: center;
        align-items: center;
        align-self: stretch;
        border-radius: 8px;
        background: ${({ theme }) => theme.colors.base};

        &.active {
          background: ${({ theme }) => theme.colors.base};
        }
      }
    }
  }
`;

export default Network;
