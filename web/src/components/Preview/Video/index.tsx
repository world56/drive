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

const URL =
  "https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4";

/**
 * @name Video 视频播放
 */
const Video = () => {
  return (
    <Container title="不知名视频.mp4" className={styles.video}>
      <MediaController>
        <video muted slot="media" preload="auto" src={URL} />
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
};

export default Video;
