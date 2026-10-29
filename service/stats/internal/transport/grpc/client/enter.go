package grpcclient

type GrpcClient struct {
	Asset   *AssetGrpcClient
	Storage *StorageGrpcClient
}

func NewGrpcClient(storageAddr, assetAddr string) (*GrpcClient, error) {
	asset, err := newAssetGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	storage, err := newStorageGrpcClient(storageAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{
		Asset:   asset,
		Storage: storage,
	}, nil
}

func (g *GrpcClient) Close() {
	if g.Storage != nil {
		g.Storage.Close()
	}
}
