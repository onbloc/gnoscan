import React from "react";
import Text from "@/components/ui/text";
import { DetailsContainer } from "@/components/ui/detail-page-common-styles";
import { isDesktop } from "@/common/hooks/use-media";
import { makeDisplayNumber } from "@/common/utils/string-util";

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
  return (
    <DetailsContainer desktop={desktop}>
      <div className="tab-area">
        {tabs.map((tab, index) => {
          const isSelected = currentTab === tab.tabName;
          return (
            <div className="tab-item" key={index} onClick={() => setCurrentTab(tab.tabName)}>
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
      {children}
    </DetailsContainer>
  );
};

export default DataListSection;
