import * as S from "./TableSkeleton.styles";

const TableSkeleton = () => {
  return (
    <S.Card>
      <S.SkeletonBox width="30%" height={16} marginBottom={20} />
      <S.SkeletonBox width="100%" height={18} />
      <S.SkeletonBox width="100%" height={18} />
      <S.SkeletonBox width="100%" height={18} />
      <S.SkeletonBox width="100%" height={18} />
      <S.SkeletonBox width="30%" height={16} />
    </S.Card>
  );
};

export default TableSkeleton;
