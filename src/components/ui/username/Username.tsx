import Link from "next/link";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { DEVICE_TYPE } from "@/common/values/ui.constant";

import * as S from "./Username.styles";
import { Divider } from "@/components/ui/divider/Divider";
import IconLink from "@/assets/svgs/icon-link.svg";

interface UsernameProps {
  username: string | null;
  userUrl: string | null;
}

export const Username = ({ userUrl, username }: UsernameProps) => {
  const { breakpoint } = useWindowSize();
  const isDesktop = breakpoint === DEVICE_TYPE.DESKTOP;

  return (
    <>
      <S.ContentWrapper isDesktop={isDesktop}>
        <Divider size={1} length={18} orientation="vertical" />
        <Link href={userUrl || ""} target="_blank" rel="noreferrer">
          <S.Username type="p4" color="blue" breakpoint={breakpoint}>
            {username}
            <IconLink />
          </S.Username>
        </Link>
      </S.ContentWrapper>
    </>
  );
};
