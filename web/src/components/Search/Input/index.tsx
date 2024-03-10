import {
  ClearOutlined,
  SearchOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import Item from "./Item";
import dayjs from "dayjs";
import { Radio } from "antd";
import { useMemo } from "react";
import Date from "@/components/Date";
import styles from "./index.module.sass";
import ResourcesSelect from "../../Resource/Select";

import { CONSTANT_COMMON } from "@/constant/common";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

export interface TypeInputProps<T = TypeResource.ReqGlobalResources> {
  value: T;
  onChange(value: T): void;
}

/**
 * @name Input 搜索查询
 */
const Input: React.FC<TypeInputProps> = ({ value, onChange }) => {
  function onMergeValue<T = typeof value>(key: keyof T, val: T[keyof T]) {
    onChange({ ...value, [key]: val });
  }

  function onTimeScopeChange(e: number[]) {
    const [startTime, endTime] = e;
    onChange({ ...value, startTime, endTime });
  }

  function onClearName() {
    onChange({ ...value, name: "" });
  }

  const timeValue = [value.startTime, value.endTime].filter(
    Boolean,
  ) as number[];

  const SHOW = useMemo(() => {
    const { type, sort, startTime, endTime } = value;
    const TYPE = type.map((k) => CONSTANT_RESOURCE.TYPE.OBJ[k].name);
    const TYPE_LENGTH = TYPE.length;
    const TYPE_SPLIT = TYPE.splice(0, 3);
    const DESC = CONSTANT_COMMON.SORT.OBJ[sort].name;
    return {
      TYPE: TYPE_LENGTH
        ? `资源类型：${TYPE_SPLIT.join("、")}${TYPE_LENGTH > 3 ? " ..." : ""}`
        : "资源类型",
      DESC: DESC ? `时间排序：${DESC}` : "时间排序",
      TIME_SCOPE:
        startTime && endTime
          ? `日期：${dayjs(startTime).format("YYYY-MM-DD")} ~ ${dayjs(
              endTime,
            ).format("YYYY-MM-DD")}`
          : "日期",
    };
  }, [value]);

  return (
    <>
      <div className={styles.input}>
        <div className={styles.icon}>
          <SearchOutlined />
        </div>
        <input
          value={value.name}
          placeholder="请输入关键字进行查询"
          onChange={(e) => onMergeValue("name", e.target.value)}
        />
        <div className={styles.icon}>
          {value.name ? <ClearOutlined onClick={onClearName} /> : null}
        </div>
      </div>

      <div className={styles.filter}>
        <Item name={SHOW.TYPE} icon={<AppstoreOutlined />}>
          <ResourcesSelect
            value={value.type}
            onChange={(e) => onMergeValue("type", e)}
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
            value={value.sort}
            className={styles.selectType}
            onChange={(e) => onMergeValue("sort", e.target.value)}
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
