import React from "react";
import styled from "styled-components";
import Text from "@/components/ui/text";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";
import { isDesktop } from "@/common/hooks/use-media";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useSteadyTabSwitch } from "@/common/hooks/detail-tabs/use-steady-tab-switch";
import { findTabByHash, writeTabHash } from "@/common/hooks/detail-tabs/tab-hash";

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
  const desktop = isDesktop();
  const { contentRef, contentStyle, selectTab } = useSteadyTabSwitch<HTMLDivElement>(currentTab, setCurrentTab);

  // Opens the tab named in the URL hash. Tabs can appear after data loads, so this
  // retries on tab changes until the hash matches one.
  const tabNamesKey = tabs.map(tab => tab.tabName).join("|");
  const hashAppliedRef = React.useRef(false);
  React.useEffect(() => {
    if (hashAppliedRef.current) return;
    const hashTab = findTabByHash(window.location.hash, tabNamesKey.split("|"));
    if (!hashTab) return;
    hashAppliedRef.current = true;
    if (hashTab !== currentTab) setCurrentTab(hashTab);
  }, [tabNamesKey, currentTab, setCurrentTab]);

  const onClickTab = (tabName: string) => {
    hashAppliedRef.current = true;
    selectTab(tabName);
    writeTabHash(tabName);
  };

  return (
    <DetailsContainer desktop={desktop}>
      <div className="tab-area">
        {tabs.map((tab, index) => {
          const isSelected = currentTab === tab.tabName;
          return (
            <div className="tab-item" key={index} onClick={() => onClickTab(tab.tabName)}>
              <Text
                type={desktop ? (isSelected ? "h4" : "h6") : isSelected ? "h6" : "h7"}
                color={isSelected ? "primary" : "tertiary"}
              >
                {tab.tabName}
              </Text>
              {tab.size !== undefined && (
                <div className={desktop ? "badge" : "badge small"}>
                  <Text type={"p4"} color={"primary"}>
                    {makeDisplayNumber(tab.size)}
                  </Text>
                </div>
              )}
            </div>
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
