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

type ResourceSort = string

const (
	ResourceSortName    ResourceSort = "SORT_NAME"        // name 排序
	ResourceSortSize    ResourceSort = "SORT_SIZE"        // 大小排序
	ResourceSortSuffix  ResourceSort = "SORT_SUFFIX"      // 后缀排序
	ResourceSortType    ResourceSort = "SORT_TYPE"        // 类型排序
	ResourceSortCreator ResourceSort = "SORT_CREATOR_ID"  // 创建人排序
	ResourceSortTime    ResourceSort = "SORT_CREATE_TIME" // 时间排序
)

type ResourceRecycleStatus = int8

const (
	ResourceNormal   ResourceRecycleStatus = iota // 资源正常
	ResourceRecycled                              // 资源在回收站
)
