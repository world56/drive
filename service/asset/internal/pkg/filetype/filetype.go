package filetype

import "asset/internal/enum"

var video = []string{"mp4", "rmvb", "avi", "mkv", "mpg", "mpeg", "3gp"}

var image = []string{
	"jpg", "png", "gif", "svg", "bmp", "jpeg", "tiff", "webp",
}

var audio = []string{
	"cd", "mp3", "ogg", "wmv", "asf", "rm", "ape", "wav", "flac", "cue", "pcm",
}

var compress = []string{"7z", "rar", "zip", "tar", "gzip", "iso"}

var document = []string{
	"doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "md",
	"dox", "htm", "html", "wps", "xml", "csv", "pdf", "xps",
	"ppam", "ppsx", "pptm", "potx", "pot", "pps", "ppa",
	"ppsm", "xlsm", "xlsb", "xltx", "xltm", "xlt", "mobi", "epub", "azw3",
}

func toMap(list []string, typ enum.ResourceType) map[string]enum.ResourceType {
	m := make(map[string]enum.ResourceType, len(list))
	for _, suffix := range list {
		m[suffix] = typ
	}
	return m
}

func merge(items ...map[string]enum.ResourceType) map[string]enum.ResourceType {
	result := make(map[string]enum.ResourceType)
	for _, item := range items {
		for suffix, typ := range item {
			result[suffix] = typ
		}
	}
	return result
}

var SuffixType = merge(
	toMap(video, enum.ResourceTypeVideo),
	toMap(image, enum.ResourceTypeImage),
	toMap(audio, enum.ResourceTypeAudio),
	toMap(compress, enum.ResourceTypeCompressed),
	toMap(document, enum.ResourceTypeDocument),
)

func DetectBySuffix(suffix string) enum.ResourceType {
	if typ, ok := SuffixType[suffix]; ok {
		return typ
	}

	return enum.ResourceTypeOther
}
