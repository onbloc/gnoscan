import Link from "next/link";

import { useNetwork } from "@/common/hooks/use-network";

import * as S from "./TitleOption.styles";
import IconArrow from "@/assets/svgs/icon-arrow.svg";

interface TitleOptionProps {
  prevProps: {
    disabled: boolean;
    path: string;
  };
  nextProps: {
    disabled: boolean;
    path: string;
  };
}

const TitleOption = ({ prevProps, nextProps }: TitleOptionProps) => {
  const { getUrlWithNetwork } = useNetwork();

  const ArrowButton = ({
    disabled,
    href,
    direction = "right",
  }: {
    disabled: boolean;
    href: string;
    direction?: "left" | "right";
  }) => {
    const className = direction === "left" ? "icon-arrow-left" : "icon-arrow-right";

    return disabled ? (
      <S.ArrowButton disabled>
        <IconArrow className={className} />
      </S.ArrowButton>
    ) : (
      <Link href={href}>
        <S.ArrowButton>
          <IconArrow className={className} />
        </S.ArrowButton>
      </Link>
    );
  };

  return (
    <S.TitleWrap>
      <ArrowButton disabled={prevProps.disabled} href={getUrlWithNetwork(prevProps.path)} direction="right" />
      <ArrowButton disabled={nextProps.disabled} href={getUrlWithNetwork(nextProps.path)} direction="left" />
    </S.TitleWrap>
  );
};

export default TitleOption;
