import { createContext } from "react";
import { listToTree } from "@/utils/format";

import type { TypeResource } from "@/interface/resource";

type TypeFolder = ReturnType<typeof listToTree<TypeResource.DTO>>;

interface TypeResourceContextProps {
  folders: TypeFolder["list"];
  foldersObj: TypeFolder["obj"];
  files: TypeResource.DTO[];
}

export default createContext<Partial<TypeResourceContextProps>>({});
