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

  return (
    <S.TitleWrap>
      <Link href={getUrlWithNetwork(prevProps.path)}>
        <S.ArrowButton disabled={prevProps.disabled}>
          <IconArrow className="icon-arrow-right" />
        </S.ArrowButton>
      </Link>
      <Link href={getUrlWithNetwork(nextProps.path)}>
        <S.ArrowButton disabled={nextProps.disabled}>
          <IconArrow className="icon-arrow-left" />
        </S.ArrowButton>
      </Link>
    </S.TitleWrap>
  );
};

export default TitleOption;
