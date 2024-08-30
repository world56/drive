import { join } from "path";
import diskusage from "diskusage";
import { loadSync } from "@grpc/proto-loader";
import { loadPackageDefinition } from "@grpc/grpc-js";
import { __dirname, GRPC_DEFAULT_CONFIG } from "./config.js";

export function getStorage() {
  return new Promise((resolve, reject) => {
    diskusage.check("/", (err, info) => {
      if (err) return reject(err);
      resolve(info);
    });
  });
}

export function loadGrpcPackage(path) {
  return loadPackageDefinition(
    loadSync(join(__dirname, path), GRPC_DEFAULT_CONFIG),
  );
}
