import styled from "styled-components";

import Tooltip from "@/components/ui/tooltip";
import { IconCopy } from "@/components/icons/IconCopy";
import { TriggerType } from "../tooltip/tooltip";

interface CopyButtonProps {
  tooltipText: string;
  copyText: string;
  iconSize?: number;
  width?: number;
  svgClassname?: string;
  trigger?: TriggerType;
}

export const CopyButton = ({ tooltipText, copyText, iconSize = 24, width, svgClassname, trigger }: CopyButtonProps) => {
  return (
    <Copy content={tooltipText} copyText={copyText} width={width} trigger={trigger}>
      <IconCopy className={svgClassname} size={iconSize} />
    </Copy>
  );
};

const Copy = styled(Tooltip)`
  cursor: pointer;
  position: absolute;
  top: 24px;
  right: 24px;
`;
