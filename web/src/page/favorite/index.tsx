import { useState } from "react";
import { filesize } from "filesize";
import { useRequest } from "ahooks";
import { toTime } from "@/utils/format";
import { useWindowSize } from "@/hooks";
import styles from "./index.module.sass";
import { Button, Input, Radio, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ResourceName from "@/components/Resource/Name";
import ResourcesSelect from "@/components/Resource/Select";
import { getFavorites, removeFavorite } from "@/api/favorite";

import { ENUM_COMMON } from "@/enum/common";
import { DB_PRIMARY_KEY } from "@/config/db";
import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_COMMON } from "@/constant/common";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";
import type { TypeFavorite } from "@/interface/favorite";

/**
 * @name Favorite 收藏列表
 */
const Favorite = () => {
  const [search, setSearch] = useState<TypeFavorite.ReqFavorites>({
    type: [],
    createTime: ENUM_COMMON.SORT.DESC,
  });

  const { height } = useWindowSize();

  const { data, run, loading } = useRequest(() => getFavorites(search), {
    debounceWait: 1000,
    debounceLeading: true,
    refreshDeps: [search],
  });

  async function onCancel(row: TypeResource.DTO) {
    await removeFavorite({ ids: [row.id] });
    run();
  }

  const columns = [
    {
      title: "资源名称",
      key: DB_PRIMARY_KEY,
      render: (row: TypeResource.DTO) => <ResourceName {...row} />,
      filterIcon: () => <SearchOutlined />,
      filterDropdown: () => (
        <Input
          allowClear
          placeholder="请输入资源名称"
          prefix={<SearchOutlined />}
          style={{ margin: 10, width: 400 }}
          onChange={(e) => setSearch((v) => ({ ...v, name: e.target.value }))}
        />
      ),
    },
    {
      title: "资源类型",
      width: 200,
      dataIndex: "type",
      filterDropdown: () => (
        <ResourcesSelect
          onChange={(type) => setSearch((v) => ({ ...v, type }))}
        />
      ),
      render: (type: TypeResource.DTO["type"]) =>
        CONSTANT_RESOURCE.TYPE.OBJ[type].name,
    },
    {
      title: "大小（数量）",
      id: DB_PRIMARY_KEY,
      width: 200,
      render: ({ type, size }: TypeResource.DTO) =>
        type === ENUM_RESOURCE.TYPE.FOLDER
          ? `${size} 个`
          : filesize(size).toString(),
    },
    {
      title: "收藏时间",
      width: 200,
      dataIndex: "createTime",
      render: toTime,
      filterDropdown: () => (
        <Radio.Group
          className={styles.selectType}
          defaultValue={search.createTime}
          onChange={(e) =>
            setSearch((v) => ({ ...v, createTime: e.target.value }))
          }
        >
          {CONSTANT_COMMON.SORT.LIST.map((v) => (
            <Radio key={v.id} value={v.id} children={v.name} />
          ))}
        </Radio.Group>
      ),
    },
    {
      title: "操作",
      width: 150,
      key: DB_PRIMARY_KEY,
      render: (row: TypeResource.DTO) => (
        <>
          <Button size="small" type="link">
            {row.type === ENUM_RESOURCE.TYPE.FOLDER ? "打开" : "预览"}
          </Button>
          <Button onClick={() => onCancel(row)} size="small" danger type="link">
            取消收藏
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      virtual
      loading={loading}
      columns={columns}
      pagination={false}
      dataSource={data}
      rowKey={DB_PRIMARY_KEY}
      scroll={{ y: height - 121 }}
    />
  );
};

export default Favorite;
