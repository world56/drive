package enum

type ResourceType = int8

const (
	ResourceTypeFolder     ResourceType = iota // 文件夹
	ResourceTypeImage                          // 图片
	ResourceTypeVideo                          // 视频
	ResourceTypeAudio                          // 音频
	ResourceTypeDocument                       // 文档
	ResourceTypeCompressed                     // 压缩文件（zip tar rar）
	ResourceTypeOther      ResourceType = -1   // 其他资源类型 （服务器不能解析识别的资源文件）
)

type ResourceRecycleStatus = int8

const (
	ResourceNormal   ResourceRecycleStatus = iota // 资源正常
	ResourceRecycled                              // 资源在回收站
)
