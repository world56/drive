import {
  TagOutlined,
  // UserOutlined,
  AudioOutlined,
  FolderOutlined,
  PictureOutlined,
  FileZipOutlined,
  AppstoreOutlined,
  // CalendarOutlined,
  FileTextOutlined,
  VideoCameraOutlined,
  SortDescendingOutlined,
} from "@ant-design/icons";
import { Dropdown, Radio, Checkbox } from "antd";

import styles from "./index.module.sass";

import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";
import { CONSTANT_COMMON } from "@/constant/common";

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
    <span>
      {ICON[v.id]} {v.name}
    </span>
  ),
  value: v.id,
}));

/**
 * @name Select 单选
 */
const Select = () => {
  return (
    <>
      <Dropdown
        dropdownRender={() => (
          <Checkbox.Group
            options={SEARCH_OPTIONS}
            className={styles.selectType}
          />
        )}
      >
        <span className={styles.select}>
          <AppstoreOutlined />
          资源类型
        </span>
      </Dropdown>

      {/* <Dropdown
        dropdownRender={() => (
          <DatePicker.RangePicker open showTime />
        )}
      >
        <span className={styles.select}>
          <CalendarOutlined />
          时间
        </span>
      </Dropdown> */}

      {/* <span className={styles.select}>
        <UserOutlined />
        创建人
      </span> */}

      <Dropdown
        dropdownRender={() => (
          <Radio.Group className={styles.selectType}>
            {CONSTANT_COMMON.SORT.LIST.map((v) => (
              <Radio key={v.id} value={v.id} children={v.name} />
            ))}
          </Radio.Group>
        )}
      >
        <span className={styles.select}>
          <SortDescendingOutlined />
          排序
        </span>
      </Dropdown>
    </>
  );
};

export default Select;
