package grpcclient

type GrpcClients struct {
	Asset *AssetGrpcClient
}

func NewGrpcClients(assetAddr string) (*GrpcClients, error) {
	asset, err := newAssetGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClients{
		Asset: asset,
	}, nil
}

func (s *GrpcClients) Close() error {
	if s.Asset != nil {
		return s.Asset.Close()
	}

	return nil
}
