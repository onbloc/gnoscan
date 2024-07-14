'use client';

import React, {useLayoutEffect} from 'react';
import styled, {css} from 'styled-components';
import Portal from '@/components/core/portal';
import mixins from '@/styles/mixins';
import MenuIcon from '@/assets/svgs/icon-menu-button.svg';
import CloseIcon from '@/assets/svgs/icon-close.svg';
import GnoscanLogo from '@/assets/svgs/icon-gnoscan-logo.svg';
import GnoscanLogoLight from '@/assets/svgs/icon-gnoscan-logo-light.svg';
import {navItems} from './top-nav';
import Link from 'next/link';
import {v1} from 'uuid';
import Text from '@/components/ui/text';
import {zindex} from '@/common/values/z-index';
import {useNetwork} from '@/common/hooks/use-network';

interface LinkStyleProps {
  current: boolean;
}

interface SubMenuProps {
  entry: boolean;
  open: boolean;
  onClick: (e: React.MouseEvent) => void;
  selector?: string;
  darkMode?: boolean;
  currentPath: string;
}

export const SubMenu: React.FC<SubMenuProps> = ({
  entry,
  open,
  onClick,
  selector = 'modal-root',
  darkMode,
  currentPath,
}) => {
  const {getUrlWithNetwork} = useNetwork();
  useLayoutEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [open]);

  const close = (e: React.MouseEvent<HTMLElement>) => setTimeout(() => onClick(e), 100);

  return (
    <>
      <MenuButton entry={entry} onClick={onClick}>
        <MenuIcon className="menu-icon" />
      </MenuButton>
      <Portal selector={selector}>
        <Container open={open}>
          <TopHeader>
            {darkMode ? <GnoscanLogo /> : <GnoscanLogoLight />}
            <CloseButton onClick={onClick}>
              <CloseIcon className="close-icon" />
            </CloseButton>
          </TopHeader>
          <Nav>
            {navItems.map((v, i) => (
              <Link href={getUrlWithNetwork(v.path)} passHref key={v1()}>
                <StyledA current={currentPath === v.path} onClick={close}>
                  <Text type="h4" color="primary">
                    {v.name}
                  </Text>
                </StyledA>
              </Link>
            ))}
          </Nav>
        </Container>
      </Portal>
    </>
  );
};

const Container = styled.div<{open: boolean}>`
  ${mixins.flexbox('column', 'center', 'flex-start')}
  background-color: ${({theme}) => theme.colors.base};
  position: fixed;
  top: 0px;
  right: ${({open}) => (open ? '0px' : '100%')};
  width: 100%;
  height: 100%;
  z-index: ${zindex.modal};
  transition: all 0.4s ease-out;
  padding: 20px 24px 20px;
  overflow: hidden;
`;

const MenuButton = styled.button<{entry: boolean}>`
  margin-left: 16px;
  .menu-icon {
    stroke: ${({entry, theme}) => (entry ? theme.colors.white : theme.colors.primary)};
  }
`;

const TopHeader = styled.div`
  ${mixins.flexbox('row', 'center', 'space-between')};
  width: 100%;
`;

const Nav = styled.nav`
  ${mixins.flexbox('column', 'center', 'center')};
  gap: 48px;
  margin-top: 32px;
  ${mixins.positionCenter()};
`;

const StyledA = styled.a<LinkStyleProps>`
  padding: 10px 10px 12px;
  ${({current}) =>
    current &&
    css`
      text-decoration-line: underline;
      text-underline-offset: 9px;
      text-decoration-thickness: 2px;
      text-decoration-color: ${({theme}) => theme.colors.primary};
    `}
`;

const CloseButton = styled.button`
  width: 24px;
  height: 24px;
  .close-icon {
    stroke: ${({theme}) => theme.colors.reverse};
  }
`;
