import { Divider, Skeleton } from "antd";

const SkeletonLoading = () => {
  return (
    <>
      <Skeleton active avatar paragraph={{ rows: 4 }} />
      <Divider />
      <Skeleton active avatar paragraph={{ rows: 4 }} />
      <Divider />
      <Skeleton active avatar paragraph={{ rows: 4 }} />
    </>
  );
};

export default SkeletonLoading;
