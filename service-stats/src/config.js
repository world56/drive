import { dirname } from "path";
import { fileURLToPath } from "url";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const GRPC_DEFAULT_CONFIG = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  arrays: true,
  objects: true,
  oneofs: true,
};


export const TIME_ONE_HOUR = 60 * 30