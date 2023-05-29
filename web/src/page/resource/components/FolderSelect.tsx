import { useMemo } from "react";
import { useStore } from "@/hooks";
import { TreeSelect, TreeSelectProps } from "antd";

import type { TypeResource } from "@/interface/resource";

interface TypeFolderTreeProps extends TreeSelectProps {
  /**
   * @param disabledId 禁止选择的文件夹ID
   * @description 禁止选择的文件夹，包括它的子级文件夹目录，也无法选择
   */
  disabledId?: TypeResource.DTO["id"][];
}

const FolderSelect: React.FC<TypeFolderTreeProps> = ({
  disabledId = [],
  ...treeSelectProps
}) => {
  const { resource } = useStore();

  const idKeys = useMemo(
    () =>
      Object.fromEntries(disabledId.filter(Boolean).map((id) => [id, true])),
    [disabledId],
  );

  function formatFolderTree(
    list: typeof resource.folderTree,
    disabled?: boolean,
  ) {
    return list.map((v) => {
      const isDisabled = disabled || idKeys[v.id];
      return (
        <TreeSelect.TreeNode
          key={v.id}
          value={v.id}
          title={v.name}
          disabled={isDisabled}
        >
          {v.children?.length ? formatFolderTree(v.children, isDisabled) : null}
        </TreeSelect.TreeNode>
      );
    });
  }

  return (
    <TreeSelect
      treeLine
      allowClear
      treeDefaultExpandAll
      placeholder="请选择所属模块（为空则展示在根目录）"
      {...treeSelectProps}
    >
      {formatFolderTree(resource.folderTree)}
    </TreeSelect>
  );
};

export default FolderSelect;
