import dayjs from "dayjs";
import { useState } from "react";
import { Button, Calendar } from "antd";
import styles from "./index.module.sass";

interface TypeDateProps<T = number[]> {
  value?: T;
  onChange?(value: T): void;
}

/**
 * @name Date 日期范围筛选
 */
const Date: React.FC<TypeDateProps> = ({ value, onChange }) => {
  const [select, setSelect] = useState<number[]>([]);

  function onSelect(e: dayjs.Dayjs) {
    const target = e.startOf("day").valueOf();
    const val = getValue();
    if (val.length === 1) {
      setValue()([...val, target].sort((a, b) => a - b));
    } else {
      setValue()([target]);
    }
  }

  function onClear() {
    setValue()([]);
  }

  function setValue() {
    return onChange || setSelect;
  }

  function getValue() {
    return value || select;
  }

  const val = getValue();
  const [start, end] =val;

  return (
    <div className={styles.date}>
      {val.length ? (
        <Button
          type="link"
          size="small"
          onClick={onClear}
          className={styles.clear}
        >
          清除
        </Button>
      ) : null}
      <Calendar
        fullscreen={false}
        fullCellRender={(e) => {
          const time = e.startOf("day").valueOf();
          const selectClass = val.includes(time) ? styles.select : "";
          const IS_SCOPE = time >= start && time <= end;
          const IS_TODAY = time === start && time === end;
          return (
            <div
              style={{
                borderRadius: IS_TODAY
                  ? "8px"
                  : time === start
                  ? "8px 0 0 8px"
                  : time === end
                  ? "0 8px 8px 0"
                  : "",
                background: IS_SCOPE ? "rgba(0,0,0,.1)" : "",
              }}
              onClick={() => onSelect(e)}
              className={`${styles.day} ${selectClass}`}
            >
              <p>{e.date()}</p>
            </div>
          );
        }}
      />
    </div>
  );
};

export default Date;
