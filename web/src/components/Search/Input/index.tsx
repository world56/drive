import {
  TagOutlined,
  ClearOutlined,
  AudioOutlined,
  SearchOutlined,
  FolderOutlined,
  PictureOutlined,
  FileZipOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import Item from "./Item";
import dayjs from "dayjs";
import Date from "@/components/Date";
import { Radio, Checkbox } from "antd";
import styles from "./index.module.sass";
import { useMemo, useState } from "react";

import { ENUM_COMMON } from "@/enum/common";
import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_COMMON } from "@/constant/common";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

const ICON = {
  [ENUM_RESOURCE.TYPE.AUDIO]: <AudioOutlined />,
  [ENUM_RESOURCE.TYPE.COMPRESSED]: <FileZipOutlined />,
  [ENUM_RESOURCE.TYPE.DOCUMENT]: <FileTextOutlined />,
  [ENUM_RESOURCE.TYPE.FOLDER]: <FolderOutlined />,
  [ENUM_RESOURCE.TYPE.IMAGE]: <PictureOutlined />,
  [ENUM_RESOURCE.TYPE.VIDEO]: <VideoCameraOutlined />,
  [ENUM_RESOURCE.TYPE.OTHER]: <TagOutlined />,
};

const SEARCH_OPTIONS = CONSTANT_RESOURCE.TYPE.LIST.map((v) => ({
  label: (
    <>
      {ICON[v.id]} {v.name}
    </>
  ),
  value: v.id,
}));

/**
 * @name Input 搜索查询
 */
const Input = () => {
  const [search, setSearch] = useState<TypeResource.ReqGlobalResources>({
    name: "",
    type: [],
    desc: ENUM_COMMON.SORT.ASC,
  });

  function onChange<T = typeof search>(key: keyof T, value: T[keyof T]) {
    setSearch((s) => ({ ...s, [key]: value }));
  }

  function onTimeScopeChange(e: number[]) {
    const [startTime, endTime] = e;
    setSearch((e) => ({ ...e, startTime, endTime }));
  }

  function onClearName() {
    setSearch((e) => ({ ...e, name: "" }));
  }

  const timeValue = [search.startTime, search.endTime].filter(
    Boolean,
  ) as number[];

  const SHOW = useMemo(() => {
    const { type, desc, startTime, endTime } = search;
    const TYPE = type.map((k) => CONSTANT_RESOURCE.TYPE.OBJ[k].name);
    const TYPE_LENGTH = TYPE.length;
    const TYPE_SPLIT = TYPE.splice(0, 3);
    const DESC = CONSTANT_COMMON.SORT.OBJ[desc].name;
    return {
      TYPE: TYPE_LENGTH
        ? `资源类型：${TYPE_SPLIT.join("、")}${TYPE_LENGTH > 3 ? " ..." : ""}`
        : "资源类型",
      DESC: DESC ? `排序：${DESC}` : "排序",
      TIME_SCOPE:
        startTime && endTime
          ? `日期：${dayjs(startTime).format("YYYY-MM-DD")} ~ ${dayjs(
              endTime,
            ).format("YYYY-MM-DD")}`
          : "日期",
    };
  }, [search]);

  return (
    <>
      <div className={styles.input}>
        <div className={styles.icon}>
          <SearchOutlined />
        </div>
        <input
          value={search.name}
          placeholder="请输入关键字进行查询"
          onChange={(e) => onChange("name", e.target.value)}
        />
        <div className={styles.icon}>
          {search.name ? <ClearOutlined onClick={onClearName} /> : null}
        </div>
      </div>

      <div className={styles.filter}>
        <Item name={SHOW.TYPE} icon={<AppstoreOutlined />}>
          <Checkbox.Group
            value={search.type}
            options={SEARCH_OPTIONS}
            className={styles.selectType}
            onChange={(e) => onChange("type", e)}
          />
        </Item>

        <Item name={SHOW.TIME_SCOPE} icon={<CalendarOutlined />}>
          <Date value={timeValue} onChange={onTimeScopeChange} />
        </Item>

        {/* <Item name="创建人" icon={<UserOutlined />}>
          123213
        </Item> */}

        <Item name={SHOW.DESC} icon={<SortDescendingOutlined />}>
          <Radio.Group
            value={search.desc}
            className={styles.selectType}
            onChange={(e) => onChange("desc", e.target.value)}
          >
            {CONSTANT_COMMON.SORT.LIST.map((v) => (
              <Radio key={v.id} value={v.id} children={v.name} />
            ))}
          </Radio.Group>
        </Item>
      </div>
    </>
  );
};

export default Input;
