import { ENUM_RESOURCE } from "@/enum/resource";
import { CONSTANT_RESOURCE } from "@/constant/resource";

import type { TypeResource } from "@/interface/resource";

type Item = TypeResource.DTO;

const textCollator = new Intl.Collator("zh-CN", {
  sensitivity: "variant",
  caseFirst: "upper",
});

const latinCollator = new Intl.Collator("en", {
  sensitivity: "accent",
  caseFirst: "upper",
});

const pinyinCollator = new Intl.Collator("zh-CN", {
  sensitivity: "variant",
  caseFirst: "upper",
});

function text(a?: string, b?: string) {
  return textCollator.compare(a || "", b || "");
}

type NameToken =
  | { kind: "sym"; char: string }
  | { kind: "num"; digits: string; zeros: number }
  | { kind: "lat"; text: string }
  | { kind: "han"; text: string };

const RANK: Record<NameToken["kind"], number> = {
  sym: 0,
  num: 1,
  lat: 2,
  han: 3,
};

function isHan(char: string) {
  return /\p{Script=Han}/u.test(char);
}

/** 资源管理器：符号 < 数字 < 英文 < 汉字；数字按数值，汉字按拼音。 */
function tokenizeName(input: string): NameToken[] {
  const source = (input || "").normalize("NFKC");
  const tokens: NameToken[] = [];
  let i = 0;

  while (i < source.length) {
    const char = source[i];
    if (char >= "0" && char <= "9") {
      let j = i + 1;
      while (j < source.length && source[j] >= "0" && source[j] <= "9") j++;
      const raw = source.slice(i, j);
      const significant = raw.replace(/^0+/, "");
      tokens.push({
        kind: "num",
        digits: significant || "0",
        zeros: raw.length - significant.length,
      });
      i = j;
      continue;
    }

    if (isHan(char)) {
      let j = i + 1;
      while (j < source.length && isHan(source[j])) j++;
      tokens.push({ kind: "han", text: source.slice(i, j) });
      i = j;
      continue;
    }

    if (/[A-Za-z]/.test(char)) {
      let j = i + 1;
      while (j < source.length && /[A-Za-z]/.test(source[j])) j++;
      tokens.push({ kind: "lat", text: source.slice(i, j) });
      i = j;
      continue;
    }

    tokens.push({ kind: "sym", char });
    i++;
  }

  return tokens;
}

function compareDigits(a: string, b: string) {
  if (a.length !== b.length) return a.length - b.length;
  return a < b ? -1 : a > b ? 1 : 0;
}

/**
 * 模拟 Windows 资源管理器（简体中文）文件名序，对应 StrCmpLogicalW + 拼音区域：
 * 符号 → 数字（按数值，前导零只在其余都相同才比较，零越多越靠前）→ 英文 → 汉字拼音。
 */
export function compareWindowsFileName(a?: string, b?: string) {
  if (a === b) return 0;
  const left = tokenizeName(a || "");
  const right = tokenizeName(b || "");
  let zeroBias = 0;
  let caseBias = 0;
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i++) {
    const x = left[i];
    const y = right[i];
    if (!x) return -1;
    if (!y) return 1;
    if (x.kind !== y.kind) return RANK[x.kind] - RANK[y.kind];

    if (x.kind === "num" && y.kind === "num") {
      const diff = compareDigits(x.digits, y.digits);
      if (diff) return diff;
      if (!zeroBias && x.zeros !== y.zeros) zeroBias = y.zeros - x.zeros;
      continue;
    }

    if (x.kind === "lat" && y.kind === "lat") {
      const diff = latinCollator.compare(x.text, y.text);
      if (diff) return diff;
      if (!caseBias && x.text !== y.text) {
        caseBias = x.text < y.text ? -1 : 1;
      }
      continue;
    }

    if (x.kind === "han" && y.kind === "han") {
      const diff = pinyinCollator.compare(x.text, y.text);
      if (diff) return diff;
      continue;
    }

    if (x.kind === "sym" && y.kind === "sym" && x.char !== y.char) {
      return x.char < y.char ? -1 : 1;
    }
  }

  return caseBias || zeroBias;
}

export function compareName(a: Item, b: Item) {
  return compareWindowsFileName(a.fullName, b.fullName);
}

export function compareSize(a: Item, b: Item) {
  return (a.size || 0) - (b.size || 0);
}

export function compareSuffix(a: Item, b: Item) {
  return text(a.suffix, b.suffix);
}

export function compareType(a: Item, b: Item) {
  return text(
    CONSTANT_RESOURCE.TYPE.OBJ[a.type]?.name,
    CONSTANT_RESOURCE.TYPE.OBJ[b.type]?.name,
  );
}

export function compareCreator(a: Item, b: Item) {
  return text(a.creatorName || a.creatorId, b.creatorName || b.creatorId);
}

export function compareTime(a: Item, b: Item) {
  return new Date(a.createTime).valueOf() - new Date(b.createTime).valueOf();
}

export const RESOURCE_SORTERS: Record<string, (a: Item, b: Item) => number> = {
  [ENUM_RESOURCE.MENU.SORT_NAME]: compareName,
  [ENUM_RESOURCE.MENU.SORT_SIZE]: compareSize,
  [ENUM_RESOURCE.MENU.SORT_SUFFIX]: compareSuffix,
  [ENUM_RESOURCE.MENU.SORT_TYPE]: compareType,
  [ENUM_RESOURCE.MENU.SORT_CREATOR_ID]: compareCreator,
  [ENUM_RESOURCE.MENU.SORT_CREATE_TIME]: compareTime,
};
