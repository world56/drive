import { useState } from "react";

import type { TypeCommon } from "@/interface/common";

const pageSizeOptions = ["20", "50", "80", "100"];

function showTotal(total: number) {
  return `共 ${total} 条`;
}

/**
 * @name usePageTurning antd翻页
 * @param total 总数
 */
export default function usePageTurning(total?: number) {
  const [pagination, setPage] = useState<TypeCommon.PageTurning>({
    pageSize: 20,
    currentPage: 1,
  });

  const { pageSize, currentPage } = pagination;
  const pageIndex = (currentPage - 1) * pageSize; // 方便计算Index

  function onChange(currentPage: number, pageSize: number) {
    setPage({ currentPage, pageSize });
  }

  return {
    total,
    pageSize,
    onChange,
    showTotal,
    pageIndex,
    currentPage,
    pageSizeOptions,
    showSizeChanger: true,
    showQuickJumper: true,
  };
}
