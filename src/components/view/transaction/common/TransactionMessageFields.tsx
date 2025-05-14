import React from "react";
import Link from "next/link";

import { PaletteKeyType } from "@/styles";

import * as S from "./TransactionMessageFields.styles";
import Badge from "@/components/ui/badge";
import Text from "@/components/ui/text";
import { DLWrap, FitContentA } from "@/components/ui/detail-page-common-styles";
import Tooltip from "@/components/ui/tooltip";

interface FieldProps {
  label: string;
  children: React.ReactNode;
  isDesktop: boolean;
}

export const Field: React.FC<FieldProps> = ({ label, children, isDesktop }) => (
  <DLWrap desktop={isDesktop}>
    <dt>{label}</dt>
    <dd>{children}</dd>
  </DLWrap>
);

interface BadgeTextProps {
  type?: PaletteKeyType;
  color?: string;
  children: React.ReactNode;
}

export const BadgeText: React.FC<BadgeTextProps> = ({ type, color = "secondary", children }) => (
  <Badge type={type}>
    <Text type="p4" color={color || "secondary"}>
      {children}
    </Text>
  </Badge>
);

interface AddressLinkProps {
  to: string;
  copyText: string;
  getUrlWithNetwork: (uri: string) => string;
}

export const AddressLink: React.FC<AddressLinkProps> = ({ to, copyText, getUrlWithNetwork }) => (
  <Badge>
    <S.AddressTextBox>
      <Text type="p4" color="blue" className="ellipsis">
        <Link href={getUrlWithNetwork(`/account/${to}`)} passHref>
          <FitContentA>{to}</FitContentA>
        </Link>
      </Text>
      <Tooltip content="Copied!" trigger="click" copyText={copyText} className="address-tooltip">
        <S.StyledIconCopy />
      </Tooltip>
    </S.AddressTextBox>
  </Badge>
);

interface PkgPathLinkProps {
  path: string;
  getUrlWithNetwork: (uri: string) => string;
}

export const PkgPathLink: React.FC<PkgPathLinkProps> = ({ path, getUrlWithNetwork }) => (
  <Badge>
    <S.AddressTextBox>
      <Text type="p4" color="blue" className="ellipsis">
        <Link href={getUrlWithNetwork(`/realms/details?path=${path}`)} passHref>
          <FitContentA>{path}</FitContentA>
        </Link>
      </Text>
      <Tooltip content="Copied!" trigger="click" copyText={path} className="address-tooltip">
        <S.StyledIconCopy />
      </Tooltip>
    </S.AddressTextBox>
  </Badge>
);
