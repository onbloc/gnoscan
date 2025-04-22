import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import NotFound from "@/components/view/not-found/not-found";

const NotFoundPage = () => {
  const { asPath } = useRouter();

  return (
    <Wrapper>
      <div className="inner-layout">
        <NotFound keyword={asPath} />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  width: 100%;
  flex: 1;
`;

export default NotFoundPage;
