import { eachMedia } from "@/common/hooks/use-media";
import { SkeletonBoxStyle } from "@/components/ui/loading";
import mixins from "@/styles/mixins";
import React from "react";
import styled from "styled-components";

const Container = styled.main`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 24px;
  margin: 40px 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.base};
  border-radius: 10px;
`;

const RoundsBox = styled.div`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  margin-left: auto;
`;

const ListBoxWrap = styled.div<{ gap?: number }>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: 100%;
  gap: ${({ gap }) => (gap ? `${gap}px` : "35px")};
`;

const SkeletonBox = styled(SkeletonBoxStyle)<{
  width?: string;
  marginTop?: number;
  marginBottom?: number;
  height?: number;
}>`
  ${mixins.flexbox("column", "flex-start", "flex-start")};
  width: ${({ width }) => width ?? "100%"};
  margin-top: ${({ marginTop }) => (marginTop ? `${marginTop}px` : "0")};
  margin-bottom: ${({ marginBottom }) => (marginBottom ? `${marginBottom}px` : "0")};
  height: ${({ height }) => (height ? `${height}px` : "28px")};
`;

const LoadingPage = ({ visible = true }: { visible?: boolean }) => {
  const media = eachMedia();

  const renderContent = () => {
    if (media === "tablet") {
      return renderTabletContent();
    }
    if (media === "mobile") {
      return renderMobileContent();
    }
    return renderWindowContent();
  };

  const renderWindowContent = () => {
    return (
      <ListBoxWrap>
        <SkeletonBox width="30%" marginTop={35} marginBottom={35} />
        <SkeletonBox width="40%" />
        <SkeletonBox />
        <SkeletonBox />
        <SkeletonBox />
        <SkeletonBox width="70%" />

        <SkeletonBox width="30%" marginTop={70} />
        <SkeletonBox />
        <SkeletonBox />
        <SkeletonBox />
        <SkeletonBox width="70%" marginBottom={35} />
      </ListBoxWrap>
    );
  };

  const renderTabletContent = () => {
    return (
      <ListBoxWrap gap={16}>
        <SkeletonBox width="35%" height={14} marginBottom={10} />
        <SkeletonBox width="45%" height={14} />
        <SkeletonBox width="20%" height={14} />
        <SkeletonBox width="20%" height={14} />
        <SkeletonBox width="20%" height={14} />
        <SkeletonBox height={14} />
      </ListBoxWrap>
    );
  };

  const renderMobileContent = () => {
    return (
      <ListBoxWrap gap={16}>
        <SkeletonBox width="60%" height={14} marginBottom={10} />
        <SkeletonBox width="85%" height={14} />
        <SkeletonBox width="55%" height={14} />
        <SkeletonBox width="55%" height={14} />
        <SkeletonBox width="55%" height={14} />
        <SkeletonBox height={14} />
      </ListBoxWrap>
    );
  };

  return visible ? (
    <Container>
      <Wrapper>{renderContent()}</Wrapper>
    </Container>
  ) : (
    <></>
  );
};

export default LoadingPage;
