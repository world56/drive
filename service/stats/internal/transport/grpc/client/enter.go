package grpcclient

type GrpcClient struct {
	Storage *StorageGrpcClient
}

func NewGrpcClient(storageAddr string) (*GrpcClient, error) {
	storage, err := newStorageGrpcClient(storageAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{
		Storage: storage,
	}, nil
}

func (g *GrpcClient) Close() {
	if g.Storage != nil {
		g.Storage.Close()
	}
}
