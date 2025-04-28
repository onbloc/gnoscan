import React from "react";

import Error404Layout from "@/layouts/error/error-404/Error404Layout";
const NotFoundContainer = React.lazy(() => import("@/containers/error/not-found-container/NotFoundContainer"));

const NotFoundPage = () => {
  return (
    <>
      <Error404Layout notFound={<NotFoundContainer />} />
    </>
  );
};

export default NotFoundPage;
