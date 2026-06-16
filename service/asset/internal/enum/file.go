package enum

type FileType = int

const (
	FileTypeOther      FileType = -1 // 其他资源类型 （服务器不能解析识别的资源文件）
	FileTypeFolder                   // 文件夹
	FileTypeImage                    // 图片
	FileTypeVideo                    // 视频
	FileTypeAudio                    // 音频
	FileTypeDocument                 // 文档
	FileTypeCompressed               // 压缩文件（zip tar rar）
)
