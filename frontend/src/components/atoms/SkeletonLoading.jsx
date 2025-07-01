import { Divider, Skeleton } from "antd";

const SkeletonLoading = () => {
  return (
    <>
      <Skeleton avatar paragraph={{ rows: 4 }} />
      <Divider />
      <Skeleton avatar paragraph={{ rows: 4 }} />
      <Divider />
      <Skeleton avatar paragraph={{ rows: 4 }} />
    </>
  );
};

export default SkeletonLoading;
