import React from "react";
import { SkeletonBar } from "@/components/ui/loading/skeleton-bar";

const FetchedSkeleton = () => {
  return (
    <>
      <SkeletonBar width={183} margin="28px 0px 16px 0px" />
      <SkeletonBar width={485} />
      <SkeletonBar width={485} margin="16px 0px" />
      <SkeletonBar width={485} />
      <SkeletonBar width={377} margin="16px 0px" />
    </>
  );
};

export default FetchedSkeleton;
