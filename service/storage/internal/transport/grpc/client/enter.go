package grpcclient

type GrpcClient struct {
	Resource *ResourceGrpcClient
}

func NewGrpcClient(assetAddr string) (*GrpcClient, error) {
	resource, err := newResourceGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClient{
		Resource: resource,
	}, nil
}

func (s *GrpcClient) Close() error {
	if s.Resource != nil {
		return s.Resource.Close()
	}

	return nil
}
