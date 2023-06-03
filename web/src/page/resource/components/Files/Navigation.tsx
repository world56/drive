import { useMemo } from "react";
import { Breadcrumb } from "antd";
import { useStore, useToFolder } from "@/hooks";
import { HomeOutlined } from "@ant-design/icons";

/**
 * @name Navigation 面包屑
 * @description 扩展目录跳转功能
 */
const Navigation = () => {
  const resource = useStore("resource");

  const toFolder = useToFolder();

  const { path, foldersObj } = resource;

  const route = useMemo(
    () => [
      {
        title: (
          <>
            <HomeOutlined /> 主目录
          </>
        ),
        key: "resource",
        onClick: () => toFolder(),
      },
      ...path.map((id) => ({
        key: id,
        title: <>{foldersObj?.[id]?.name}</>,
        onClick: () => toFolder(id),
      })),
    ],
    [path, foldersObj, toFolder],
  );

  return <Breadcrumb items={route} />;
};

export default Navigation;
