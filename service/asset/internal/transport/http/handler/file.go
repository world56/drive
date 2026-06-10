package handler

import "asset/internal/service"

type FileHandler struct {
	fileService *service.FileService
}

func NewFileHandler(f *service.FileService) *FileHandler {
	return &FileHandler{
		fileService: f,
	}
}

// 查询全部文件资源
func (s *FileHandler) SearchFiles() {}

// 获取全部文件夹
func (s *FileHandler) FindFolders() {}
