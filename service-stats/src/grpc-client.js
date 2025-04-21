import grpc from "@grpc/grpc-js";
import { loadGrpcPackage } from "./utils.js";

const RPC_EXPLORER = loadGrpcPackage("../../proto/explorer.proto");

const ExplorerService = new RPC_EXPLORER.explorer.ExplorerService(
  "0.0.0.0:9001",
  grpc.credentials.createInsecure(),
);

export function getCount() {
  return new Promise((resolve, reject) => {
    ExplorerService.getCount(null, (err, res) => {
      if (err) reject(err);
      else resolve(res.count);
    });
  });
}

export function getExplorerRecently() {
  return new Promise((resolve, reject) => {
    ExplorerService.getRecently(null, (err, res) => {
      if (err) reject(err);
      else resolve(res.data);
    });
  });
}

export function getFavoriteRanking() {
  return new Promise((resolve, reject) => {
    ExplorerService.getFavorite(null, (err, res) => {
      if (err) reject(err);
      else resolve(res.data);
    });
  });
}
