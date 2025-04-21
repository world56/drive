import {
  MediaTimeRange,
  MediaController,
  MediaControlBar,
  MediaMuteButton,
  MediaPlayButton,
  MediaVolumeRange,
  MediaTimeDisplay,
  MediaFullscreenButton,
} from "media-chrome/react";
import Container from "../Container";
import styles from "./index.module.sass";

import { API_PROXY_EXPLORER_URL } from "@/config/request";

import { TypeResource } from "@/interface/resource";

/**
 * @name Video 视频播放
 */
const Video: React.FC<{ data: TypeResource.DTO }> = ({ data }) => (
  <Container hover type="videos" data={data} className={styles.video}>
    <MediaController>
      <video
        slot="media"
        preload="auto"
        src={`${API_PROXY_EXPLORER_URL}resource/${data.path}`}
      />
      <MediaControlBar>
        <MediaPlayButton />
        <MediaTimeRange />
        <MediaTimeDisplay showDuration />
        <MediaMuteButton />
        <MediaVolumeRange />
        <MediaFullscreenButton />
      </MediaControlBar>
    </MediaController>
  </Container>
);

export default Video;
