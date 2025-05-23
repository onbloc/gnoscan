import React from "react";

import { useWindowSize } from "@/common/hooks/use-window-size";
import { DEVICE_TYPE } from "@/common/values/ui.constant";
import { makeTemplate } from "@/common/utils/template.utils";
import { GNOWEB_USER_TEMPLATE } from "@/common/values/url.constant";
import { GNOWEB_USER_DETAIL_PATH } from "@/common/values/url.constant";

import * as S from "./Username.styles";
import { Divider } from "@/components/ui/divider/Divider";
import IconLink from "@/assets/svgs/icon-link.svg";
import { useNetwork } from "@/common/hooks/use-network";
import { LinkWrapper } from "../detail-page-common-styles";

interface UsernameProps {
  username: string | null;
  userUrl?: string | null;
}

export const Username = ({ username, userUrl }: UsernameProps) => {
  const { gnoWebUrl } = useNetwork();
  const { breakpoint } = useWindowSize();

  const isDesktop = breakpoint === DEVICE_TYPE.DESKTOP;

  const handleGnoWebNavigation = React.useCallback(() => {
    if (!username) return;

    if (userUrl) {
      window.open(userUrl, "_blank", "noopener,noreferrer");
      return;
    }

    if (!gnoWebUrl) return;

    const url = makeTemplate(GNOWEB_USER_TEMPLATE, {
      GNOWEB_URL: gnoWebUrl,
      USER_ADDRESS: `${GNOWEB_USER_DETAIL_PATH}${username}`,
    });

    window.open(url, "_blank", "noopener,noreferrer");
  }, [gnoWebUrl, username, userUrl]);

  return (
    <>
      <S.ContentWrapper isDesktop={isDesktop}>
        <Divider size={1} length={18} orientation="vertical" />

        <LinkWrapper onClick={handleGnoWebNavigation} rel="noreferrer">
          <S.Username type="p4" color="blue" breakpoint={breakpoint}>
            {username}
            <IconLink />
          </S.Username>
        </LinkWrapper>
      </S.ContentWrapper>
    </>
  );
};
