import { nanoid } from "nanoid";
import { filesize } from "filesize";

import { ENUM_RESOURCE } from "@/enum/resource";
import { UPLOAD_SLICE_SIZE } from "@/config/file";

import type { TypeResource } from "@/interface/resource";

/**
 * @name TypeUploadStatus 上传进度
 */
export type TypeUploadStatus = Record<
  string,
  Pick<TypeResource.DTO, "id" | "name" | "parentId"> & {
    /** @param 文件大小 */
    size: string;
    // /** @param index 位置 */
    // index: number;
    /** @param length 总长度 */
    length: number;
    /** @param 文件格式（后缀） */
    suffix?: string;
    /** @param status 状态 */
    status: ENUM_RESOURCE.STATUS;
    /** @param progress 进度百分比 */
    progress: number;
    /** @param 上传成功后的路径 */
    paths?: TypeResource.DTO["paths"];
  }
>;

/**
 * @name TypeUploadProgress 上传状态
 */
export type TypeUploadProgress = Record<
  string,
  {
    /** @param id uuid */
    id: string;
    /** @param run 运行状态 */
    run: boolean;
    /** @param index 上传的位置 */
    index: number;
    /** @param control 暂停 */
    control?: AbortController;
    /** @param chunks 分割 */
    chunks: FormData[] | null;
  }
>;

/**
 * @name splitFiles 分割文件
 */
export function splitFiles(
  file: File,
  params: Pick<
    TypeUploadStatus[keyof TypeUploadStatus],
    "id" | "parentId" | "name"
  >,
) {
  const chunks: FormData[] = [];
  const length = parseInt(`${file.size / UPLOAD_SLICE_SIZE + 1}`);
  for (let i = 0; i < length; i++) {
    const start = i * UPLOAD_SLICE_SIZE;
    const data = new FormData();
    data.append("id", params.id);
    data.append("name", params.name);
    data.append("total", length.toString());
    data.append("index", (i + 1).toString());
    data.append("size", file.size.toString());
    data.append("segment", start.toString());
    params.parentId && data.append("parentId", params.parentId);
    data.append("chunk", file.slice(start, start + UPLOAD_SLICE_SIZE));
    chunks.push(data);
  }
  return chunks;
}

/**
 * @name filesFormat 格式化文件状态
 */
export function filesFormat(
  files: FileList,
  parentId?: TypeResource.DTO["id"],
) {
  const status: TypeUploadStatus = {};
  const progress: TypeUploadProgress = {};
  for (const file of files) {
    const id = nanoid();
    const { name } = file;
    const suffix = name.split(".").pop();
    const param = { id, name, parentId };
    const chunks = splitFiles(file, param);
    status[id] = {
      ...param,
      suffix,
      progress: 0,
      length: chunks.length,
      size: filesize(file.size).toString(),
      status: ENUM_RESOURCE.STATUS.UPLOADING,
    };
    progress[id] = { id, chunks, index: 0, run: true };
  }
  return { status, progress };
}
