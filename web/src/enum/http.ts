export namespace ENUM_HTTP {
  export const enum PROXY {
    AUTH = "auth",
    EXPLORER = "explorer",
  }

  export const enum REQUEST_MODE {
    GET = "GET",
    POST = "POST",
  }

  export const enum CONTENT_TYPE {
    TEXT = "text/xml",
    JSON = "application/json",
    MULTIPART = "multipart/form-data",
    FORM_DATA = "application/x-www-form-urlencoded",
  }

  export const enum HTTP_CODE {
    OK = 200,
    UNAUTHORIZED = 401,
    NOT_FOUND = 404,
  }
}
