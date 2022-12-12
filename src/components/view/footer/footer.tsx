'use client';

import mixins from '@/styles/mixins';
import React from 'react';
import styled, {css} from 'styled-components';
import dynamic from 'next/dynamic';
import {DarkModeToggle} from '@/components/ui/button';
import Discord from '@/assets/svgs/icon-discord.svg';
import Twitter from '@/assets/svgs/icon-twitter.svg';
import GnoscanSymbol from '@/assets/svgs/icon-gnoscan-symbol.svg';
import Text from '@/components/ui/text';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {v1} from 'uuid';

const Desktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.Desktop), {
  ssr: false,
});
const NotDesktop = dynamic(() => import('@/common/hooks/use-media').then(mod => mod.NotDesktop), {
  ssr: false,
});

interface ModProps {
  isDesktop: boolean;
}

const termsText = [
  {title: 'Terms of Use', path: '/terms/service'},
  {title: 'Contract', path: 'mailto:info@gnoscan.io'},
  {title: 'Feedback', path: ''},
];

const Definition = ({isDesktop}: ModProps) => (
  <DefinitionWrapper isDesktop={isDesktop}>
    <GnoscanSymbol className="svg-icon" width="18" height="18" />
    <Text type={isDesktop ? 'p4' : 'body1'} color="tertiary">
      Powered by Gnoland Blockchain
    </Text>
  </DefinitionWrapper>
);

const Copyright = ({isDesktop}: ModProps) => (
  <Text type={isDesktop ? 'p4' : 'body1'} color="tertiary" margin="0 9px 0 0">
    @ 2022 Gnoscan
  </Text>
);

const Terms = ({isDesktop}: ModProps) => (
  <FTextWrapper isDesktop={isDesktop}>
    {termsText.map((v, i) => (
      <a className="hr-text" href={v.path} target="_blank" key={v1()}>
        <Text type={isDesktop ? 'p4' : 'body1'} color="tertiary">
          {v.title}
        </Text>
      </a>
    ))}
  </FTextWrapper>
);

const Community = ({isDesktop}: ModProps) => (
  <CommunityWrapper isDesktop={isDesktop}>
    <Text type={isDesktop ? 'p4' : 'body1'} color="tertiary" className="hr-text">
      Community:
    </Text>
    <SNS href="https://twitter.com/gnoscan" target="_blank">
      <Twitter className="svg-icon" />
    </SNS>
    <SNS href="https://discord.gg/Bhgkr7hMEz" target="_blank">
      <Discord className="svg-icon" />
    </SNS>
    <DarkModeToggle className="f-toggle" />
  </CommunityWrapper>
);

export const Footer = () => {
  return (
    <>
      <Desktop>
        <Wrapper isDesktop={true}>
          <div className="inner-layout">
            <Definition isDesktop={true} />
            <Copyright isDesktop={true} />
            <Terms isDesktop={true} />
            <Community isDesktop={true} />
          </div>
        </Wrapper>
      </Desktop>
      <NotDesktop>
        <Wrapper isDesktop={false}>
          <div className="inner-layout">
            <Copyright isDesktop={false} />
            <Terms isDesktop={false} />
            <Community isDesktop={false} />
            <Definition isDesktop={false} />
          </div>
        </Wrapper>
      </NotDesktop>
    </>
  );
};

const Wrapper = styled.footer<ModProps>`
  ${mixins.flexbox('row', 'center', 'center')}
  background-color: ${({theme}) => theme.colors.base};
  margin-top: auto;
  padding: 24px 18px;
  ${({isDesktop}) =>
    isDesktop
      ? css`
          height: 80px;
          .inner-layout {
            height: 100%;
            ${mixins.flexbox('row', 'center', 'flex-start')}
          }
        `
      : css`
          height: 194px;
          .inner-layout {
            height: 100%;
            ${mixins.flexbox('column', 'center', 'center')};
          }
        `}
  .svg-icon {
    fill: ${({theme}) => theme.colors.primary};
  }
`;

const DefinitionWrapper = styled.div<ModProps>`
  ${mixins.flexbox('row', 'center', 'center')};
  margin-right: ${({isDesktop}) => isDesktop && 'auto'};
  margin-top: ${({isDesktop}) => !isDesktop && 'auto'};
  gap: 6px;
`;

const Hr = css`
  content: '';
  height: 12px;
  width: 1px;
  background-color: ${({theme}) => theme.colors.tertiary};
  ${mixins.posTopCenterLeft('-9px')}
`;

const FTextWrapper = styled.div<ModProps>`
  ${mixins.flexbox('row', 'center', 'center', false)};
  margin: ${({isDesktop}) => !isDesktop && '16px auto 24px'};
  .hr-text {
    margin: 0px 9px;
    ${mixins.flexbox('row', 'center', 'center', false)};
    flex-wrap: wrap;
    position: relative;
    :before {
      ${Hr};
    }
    &:first-of-type:before {
      display: ${({isDesktop}) => !isDesktop && 'none'};
    }
  }
`;

const CommunityWrapper = styled(FTextWrapper)`
  margin: 0px;
  .f-toggle {
    margin-left: 9px;
    :before {
      ${Hr};
    }
  }
`;

const SNS = styled.a`
  ${mixins.flexbox('row', 'center', 'center')};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${({theme}) => theme.colors.surface};
  margin-right: 9px;
  :first-of-type {
    margin-left: 9px;
  }
`;
