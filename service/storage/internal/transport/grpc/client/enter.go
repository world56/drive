package grpcclient

type GrpcClients struct {
	Resource *ResourceGrpcClient
}

func NewGrpcClients(assetAddr string) (*GrpcClients, error) {
	resource, err := newResourceGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClients{
		Resource: resource,
	}, nil
}

func (s *GrpcClients) Close() error {
	if s.Resource != nil {
		return s.Resource.Close()
	}

	return nil
}
