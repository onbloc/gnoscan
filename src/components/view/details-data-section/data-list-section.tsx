import React from "react";
import styled from "styled-components";
import Text from "@/components/ui/text";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useSteadyTabSwitch } from "@/common/hooks/detail-tabs/use-steady-tab-switch";
import { parseNftTokenHash } from "@/common/utils/nft-token-hash.utility";
import {
  getHashTabToApply,
  holdElementInView,
  markHoldHandled,
  writeTabHash,
} from "@/common/hooks/detail-tabs/tab-hash";

const TAB_HOLD_SCOPE = "tab";

interface DataListSectionProps {
  children: React.ReactNode;
  tabs: {
    tabName: string;
    size?: number;
  }[];
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const DataListSection = ({ children, tabs, currentTab, setCurrentTab }: DataListSectionProps) => {
  const { contentRef, contentStyle, selectTab, setPadding } = useSteadyTabSwitch<HTMLDivElement>(
    currentTab,
    setCurrentTab,
  );
  const latestRef = React.useRef({ currentTab, setPadding });
  latestRef.current = { currentTab, setPadding };

  const tabAreaRef = React.useRef<HTMLDivElement>(null);
  const cancelHoldRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => cancelHoldRef.current?.(), []);
  const lastHandledUrlRef = React.useRef<string | null>(null);
  // Next.js does not re-render when only the hash changes.
  const [, rerenderOnHashChange] = React.useReducer((count: number) => count + 1, 0);
  React.useEffect(() => {
    window.addEventListener("hashchange", rerenderOnHashChange);
    return () => window.removeEventListener("hashchange", rerenderOnHashChange);
  }, []);
  // A new setter means a new state scope (e.g. a route param that was empty before the router was ready).
  // Must run before the effect below.
  React.useEffect(() => {
    lastHandledUrlRef.current = null;
  }, [setCurrentTab]);
  // Opens the tab named in the URL hash once per URL. Checked on every render because tabs can load late.
  React.useEffect(() => {
    const { pathname, search, hash } = window.location;
    const url = `${pathname}${search}${hash}`;
    const hashTab = getHashTabToApply(
      url,
      lastHandledUrlRef.current,
      tabs.map(tab => tab.tabName),
    );
    if (!hashTab) return;
    lastHandledUrlRef.current = url;
    if (hashTab !== currentTab) setCurrentTab(hashTab);
    // Deep links land on the tab, not the page top, and stay there while content above finishes loading.
    // Clicked tabs mark their URL handled first, so they never scroll. A token link lands on its detail
    // panel instead, which holds its own position.
    cancelHoldRef.current?.();
    if (parseNftTokenHash(hash)) return;
    if (tabAreaRef.current) {
      cancelHoldRef.current = holdElementInView(
        tabAreaRef.current,
        contentRef.current,
        TAB_HOLD_SCOPE,
        url,
        // Keep the height with the history entry so Back/Forward has it before Next.js restores the scroll.
        // Only once the hash tab is showing, because the padding is stored per tab.
        minHeight => {
          if (latestRef.current.currentTab !== hashTab) return false;
          latestRef.current.setPadding(minHeight);
          return true;
        },
      );
    }
  });

  const onClickTab = (tabName: string) => {
    selectTab(tabName);
    const url = writeTabHash(tabName);
    lastHandledUrlRef.current = url;
    markHoldHandled(TAB_HOLD_SCOPE, url);
  };

  return (
    <DetailsContainer>
      <div className="tab-area" ref={tabAreaRef}>
        {tabs.map((tab, index) => {
          const isSelected = currentTab === tab.tabName;
          return (
            <button
              type="button"
              className="tab-item"
              key={index}
              aria-current={isSelected}
              onClick={() => onClickTab(tab.tabName)}
            >
              <Text
                type={isSelected ? "h6" : "h7"}
                desktopType={isSelected ? "h4" : "h6"}
                color={isSelected ? "primary" : "tertiary"}
              >
                {tab.tabName}
              </Text>
              {tab.size !== undefined && (
                <div className="badge">
                  <Text type={"p4"} color={"primary"}>
                    {makeDisplayNumber(tab.size)}
                  </Text>
                </div>
              )}
            </button>
          );
        })}
      </div>
      <TabContent ref={contentRef} style={contentStyle}>
        {children}
      </TabContent>
    </DetailsContainer>
  );
};

export default DataListSection;

// Mirrors DetailsContainer's column layout so tab content lays out as before the wrapper.
// overflow-anchor: none keeps Chrome's scroll anchoring from following rows that
// swap or load under the viewport, which would shift the page after a tab switch.
const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  overflow-anchor: none;
`;
