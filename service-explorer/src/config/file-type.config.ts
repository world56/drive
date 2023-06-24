import { ENUM_RESOURCE } from '@/enum/explorer';

/**
 * @name VIDEO 视频
 */
export const VIDEO = ['mp4', 'rmvb', 'avi', 'mkv', 'mpg', 'mpeg', '3gp'];

/**
 * @name IMAGE 图片
 */
export const IMAGE = [
  'jpg',
  'png',
  'gif',
  'svg',
  'bmp',
  'jpeg',
  'tiff',
  'webp',
];

/**
 * @name AUDIO 音频
 */
export const AUDIO = [
  'cd',
  'mp3',
  'ogg',
  'wmv',
  'asf',
  'rm',
  'ape',
  'wav',
  'flac',
  'cue',
  'pcm',
];

/**
 * @name COMPRESS 压缩文件
 */
export const COMPRESS = ['7z', 'rar', 'zip', 'tar', 'gzip', 'iso'];

/**
 * @name DOC 文档
 */
export const DOC = [
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'txt',
  'md',
  'dox',
  'htm',
  'html',
  'wps',
  'xml',
  'csv',
  'pdf',
  'xps',
  'bmp',
  'ppam',
  'ppsx',
  'pptm',
  'potx',
  'pot',
  'pps',
  'ppa',
  'ppsm',
  'xlsm',
  'xlsb',
  'xltx',
  'xltm',
  'xlt',
  'mobi',
  'epub',
  'azw3',
];

function toObj(list: string[], type: ENUM_RESOURCE.TYPE) {
  return Object.fromEntries(list.map((k) => [k, type]));
}

export default () => ({
  FILE_TYPE: {
    ...toObj(VIDEO, ENUM_RESOURCE.TYPE.VIDEO),
    ...toObj(IMAGE, ENUM_RESOURCE.TYPE.IMAGE),
    ...toObj(AUDIO, ENUM_RESOURCE.TYPE.AUDIO),
    ...toObj(COMPRESS, ENUM_RESOURCE.TYPE.COMPRESSED),
    ...toObj(DOC, ENUM_RESOURCE.TYPE.DOCUMENT),
  },
});
