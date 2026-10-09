package grpcclient

type GrpcClients struct {
	Resource *ResourceGrpcClient
}

func NewGrpcClients(assetAddr string) (*GrpcClients, error) {
	Resource, err := newResourceGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClients{
		Resource: Resource,
	}, nil
}

func (s *GrpcClients) Close() error {
	if s.Resource != nil {
		return s.Resource.Close()
	}

	return nil
}
