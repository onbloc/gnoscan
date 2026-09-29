import React from "react";
import styled from "styled-components";
import Text from "@/components/ui/text";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";
import { isDesktop } from "@/common/hooks/use-media";
import { makeDisplayNumber } from "@/common/utils/string-util";
import { useSteadyTabSwitch } from "@/common/hooks/detail-tabs/use-steady-tab-switch";

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
  return (
    <DetailsContainer desktop={desktop}>
      <div className="tab-area">
        {tabs.map((tab, index) => {
          const isSelected = currentTab === tab.tabName;
          return (
            <div className="tab-item" key={index} onClick={() => selectTab(tab.tabName)}>
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
