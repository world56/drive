package grpcclient

type GrpcClients struct {
	File *FileGrpcClient
}

func NewGrpcClients(assetAddr string) (*GrpcClients, error) {
	file, err := newFileGrpcClient(assetAddr)
	if err != nil {
		return nil, err
	}

	return &GrpcClients{
		File: file,
	}, nil
}

func (s *GrpcClients) Close() error {
	if s.File != nil {
		return s.File.Close()
	}

	return nil
}
