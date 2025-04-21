import dayjs from "dayjs";
import { Button, Calendar } from "antd";
import styles from "./index.module.sass";
import { useEffect, useState } from "react";

interface TypeDateProps<T = number[]> {
  value?: T;
  onChange?(value: T): void;
}

const FORMAT = "YYYY-MM-DD";

/**
 * @name Date 日期范围筛选
 */
const Date: React.FC<TypeDateProps> = ({ value, onChange }) => {
  const [select, setSelect] = useState<number[]>([]);

  function onSelect(e: dayjs.Dayjs) {
    const isEnd = select.length === 1;
    const target = isEnd
      ? e.endOf("day").valueOf()
      : e.startOf("day").valueOf();
    if (isEnd) {
      setValue([...select, target].sort((a, b) => a - b));
    } else {
      setValue([target]);
    }
  }

  function onClear() {
    onChange?.([]);
    setSelect([]);
  }

  function setValue(date: number[]) {
    date.length === 2 && onChange?.(date);
    setSelect(date);
  }

  useEffect(() => {
    value?.length !== 1 && setSelect(value!);
  }, [value]);

  const [start, end] = select;

  return (
    <div className={styles.date}>
      {select.length ? (
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
          const today = e.startOf("day").format(FORMAT);
          const starFormat = start ? dayjs(start).format(FORMAT) : undefined;
          const endFormat = end ? dayjs(end).format(FORMAT) : undefined;
          const i = [starFormat, endFormat].indexOf(e.format(FORMAT));
          const IS_SCOPE = time >= start && time <= end;
          const IS_TODAY = starFormat === today && endFormat === today;
          return (
            <div
              style={{
                borderRadius: IS_TODAY
                  ? "8px"
                  : today === starFormat
                  ? "8px 0 0 8px"
                  : today === endFormat
                  ? "0 8px 8px 0"
                  : "",
                background: IS_SCOPE ? "rgba(0,0,0,.1)" : "",
              }}
              onClick={() => onSelect(e)}
              className={`${styles.day} ${i > -1 ? styles.select : ""}`}
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
