import React from "react";

import IconInfo from "@/assets/svgs/icon-info.svg";
import { Button } from "@/components/ui/button";
import { PaletteKeyType } from "@/styles";
import Tooltip from "./tooltip";

interface InfoTooltipProps {
  content: React.ReactNode | string;
  width?: number;
  bgColor?: PaletteKeyType;
  iconClassName?: string;
}

export const InfoTooltip = ({ content, width, bgColor = "surface", iconClassName = "svg-info" }: InfoTooltipProps) => (
  <Tooltip width={width} content={content}>
    <Button width="16px" height="16px" radius="50%" bgColor={bgColor}>
      <IconInfo className={iconClassName} />
    </Button>
  </Tooltip>
);
