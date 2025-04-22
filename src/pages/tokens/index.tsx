import useLoading from "@/common/hooks/use-loading";
import Text from "@/components/ui/text";
import { TokenDatatable } from "@/components/view/datatable/token";
import LoadingPage from "@/components/view/loading/page";
import React from "react";
import styled from "styled-components";

const Tokens = () => {
  const { loading } = useLoading();

  return (
    <Container>
      <div className="inner-layout">
        <LoadingPage visible={loading} />
        <Wrapper visible={!loading}>
          <Text type="h2" margin={"0 0 24px 0"} color="primary">
            {"Tokens"}
          </Text>
          <TokenDatatable />
        </Wrapper>
      </div>
    </Container>
  );
};

const Container = styled.main`
  width: 100%;
  flex: 1;
`;

const Wrapper = styled.div<{ visible?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 40px 0;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 10px;
  ${({ visible }) => !visible && "display: none;"}
`;

export default Tokens;
