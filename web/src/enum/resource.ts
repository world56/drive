export namespace ENUM_RESOURCE {
  export enum TYPE {
    OTHER = -1,
    FOLDER,
    IMAGE,
    VIDEO,
    AUDIO,
    DOCUMENT,
    COMPRESSED,
  }

  export enum SORT {
    NAME,
    SIZE,
    TYPE,
    SUFFIX,
    CREATOR,
    CREATION_TIME,
  }

  export enum MENU_OPTIONS {
    INSERT,
    UPDATE,
    DELETE,
    SHARE,
    PREVIEW,
    DOWNLOAD
  }
}
