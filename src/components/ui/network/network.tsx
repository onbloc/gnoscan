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
import { useThemeMode } from "@/common/hooks/use-theme-mode";
import LoadingSpinner from "../loading-spinner/LoadingSpinner";
import { NodeRPCClient } from "@/common/clients/node-client";
import { IndexerClient } from "@/common/clients/indexer-client/indexer-client";
import { sleep } from "@/common/utils/common.utility";
import { getDefaultChain } from "@/common/config/network.config";
import { media } from "@/common/values/ui.constant";

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

interface ConnectionErrorState {
  customRpcUrl: boolean;
  customIndexerUrl: boolean;
}

const Network = ({ entry, chains, toggle, toggleHandler, networkSettingHandler, setToggle }: NetworkProps) => {
  const { currentNetwork } = useNetworkProvider();
  const { currentNetwork: currentNetworkInfo, changeCustomNetwork } = useNetwork();

  const [isNetworkSwitching, setIsNetworkSwitching] = useState(false);
  const [customRpcUrl, setCustomRpcUrl] = useState("");
  const [indexerUrl, setIndexerUrl] = useState("");
  const [connectionErrors, setConnectionErrors] = useState<ConnectionErrorState>({
    customRpcUrl: false,
    customIndexerUrl: false,
  });

  const ref = useOutSideClick(() => setToggle(false));

  const { isDark, isLight } = useThemeMode();

  // entry is home or dark mode, so this is the light home header.
  const isReverseColor = entry && isLight;

  const availCustomConnect = useMemo(() => {
    if (connectionErrors.customRpcUrl || connectionErrors.customIndexerUrl || !customRpcUrl) {
      return false;
    }
    return true;
  }, [connectionErrors, customRpcUrl]);

  const setConnectionError = useCallback((field: keyof ConnectionErrorState, value: boolean) => {
    setConnectionErrors(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetConnectionErrors = useCallback(() => {
    setConnectionErrors({ customRpcUrl: false, customIndexerUrl: false });
  }, []);

  const connect = useCallback(async () => {
    if (!customRpcUrl) {
      setConnectionError("customRpcUrl", true);
      return;
    }

    setIsNetworkSwitching(true);
    resetConnectionErrors();

    try {
      const tempRpcClient = new NodeRPCClient(customRpcUrl, "");

      try {
        await tempRpcClient.health();
      } catch {
        await sleep(500);
        setConnectionError("customRpcUrl", true);
        return;
      }

      if (indexerUrl) {
        const tempIndexerClient = new IndexerClient(indexerUrl);

        try {
          await tempIndexerClient.health();
        } catch {
          await sleep(500);
          setConnectionError("customIndexerUrl", true);
          return;
        }
      }

      await changeCustomNetwork(customRpcUrl, indexerUrl);
    } finally {
      setIsNetworkSwitching(false);
    }
  }, [customRpcUrl, indexerUrl, changeCustomNetwork, setConnectionError, resetConnectionErrors]);

  useEffect(() => {
    if (toggle && currentNetworkInfo?.isCustom) {
      setCustomRpcUrl(currentNetworkInfo.rpcUrl || "");
      setIndexerUrl(currentNetworkInfo.indexerUrl || "");
      resetConnectionErrors();
    }
  }, [toggle, currentNetworkInfo, resetConnectionErrors]);

  // Default network until it resolves after hydration, so the button keeps its width
  const networkName = (currentNetwork ?? getDefaultChain(chains))?.name || "";

  return (
    <NetworkWrapper entry={entry} ref={ref}>
      <NetworkInfoWrapper
        type="button"
        onClick={toggleHandler}
        aria-expanded={!!toggle}
        aria-label={`Select network, current network: ${networkName}`}
      >
        {isReverseColor || isDark ? (
          <GnoscanSymbol className="svg-icon" />
        ) : (
          <GnoscanSymbolLight className="svg-icon" />
        )}
        <Text type="h7" color={isReverseColor ? "white" : "primary"} className="network-name">
          {networkName}
        </Text>
      </NetworkInfoWrapper>
      <NetworkList toggle={toggle} entry={entry}>
        {chains.map((chain: ChainModel, index: number) => (
          <li key={index} className={currentNetwork?.chainId === chain.chainId ? "selected" : ""}>
            <button
              type="button"
              className="item row"
              onClick={() => networkSettingHandler(chain.chainId)}
              aria-current={currentNetwork?.chainId === chain.chainId}
            >
              {isDark ? <GnoscanSymbol className="svg-icon" /> : <GnoscanSymbolLight className="svg-icon" />}
              <div className="info-wrapper">
                <Text type="h7" color="primary">
                  {chain.name}
                </Text>
                <Text type="body1" color="tertiary" className="ellipsis">
                  {chain.rpcUrl}
                </Text>
              </div>
            </button>
          </li>
        ))}
        <li className={currentNetwork?.chainId === "" ? "selected" : ""}>
          <div className="item">
            <div className="input-wrapper">
              <Text type="p4" color="primary">
                Custom Network
              </Text>
              <input
                className={`custom-input ${connectionErrors.customRpcUrl ? "error" : ""}`}
                value={customRpcUrl}
                onChange={e => {
                  setCustomRpcUrl(e.target.value);
                  if (connectionErrors.customRpcUrl) {
                    setConnectionError("customRpcUrl", false);
                  }
                }}
                placeholder="RPC URL"
                aria-label="RPC URL"
              />
              <input
                className={`custom-input ${connectionErrors.customIndexerUrl ? "error" : ""}`}
                value={indexerUrl}
                onChange={e => {
                  setIndexerUrl(e.target.value);
                  if (connectionErrors.customIndexerUrl) {
                    setConnectionError("customIndexerUrl", false);
                  }
                }}
                placeholder="Tx Indexer URL (Optional)"
                aria-label="Tx Indexer URL (Optional)"
              />
              <button
                type="button"
                className={availCustomConnect ? "connect active" : "connect"}
                onClick={connect}
                aria-label="Connect"
                aria-busy={isNetworkSwitching}
              >
                <Text type="body1" color="primary">
                  {isNetworkSwitching ? <LoadingSpinner size={16} /> : "Connect"}
                </Text>
              </button>
            </div>
          </div>
        </li>
      </NetworkList>
    </NetworkWrapper>
  );
};

const NetworkWrapper = styled.div<StyleProps>`
  position: relative;
  display: flex;
  background-color: ${({ entry }) => (entry ? theme.lightTheme.reverse : theme.lightTheme.base)};
  width: fit-content;
  height: 44px;
  border-radius: 12px;
  justify-content: center;
  align-items: center;
  // Header dropdowns stay above page content, but below modal backdrops.
  z-index: ${zindex.headerDropdown};

  .svg-icon {
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    flex-shrink: 0;
  }
`;

const NetworkInfoWrapper = styled.button<StyleProps>`
  display: flex;
  padding: 10px 15px;
  height: 44px;
  border-radius: 12px;
  gap: 8px;
  justify-content: center;
  align-items: center;

  ${media.NOT_DESKTOP} {
    .network-name {
      display: none;
    }
  }
  ${media.MOBILE} {
    padding: 10px;
  }
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
    text-align: left;
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
      min-width: 0;
      overflow: hidden;
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

        &.error {
          border: ${({ theme }) => `1px solid ${theme.colors.failed}`};
        }

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
