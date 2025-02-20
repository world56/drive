import {
  MediaTimeRange,
  MediaController,
  MediaControlBar,
  MediaMuteButton,
  MediaPlayButton,
  MediaVolumeRange,
  MediaTimeDisplay,
} from "media-chrome/react";
import Item from "./Item";
import Container from "../Container";
import styles from "./index.module.sass";

import ICON_NEXT from "@/assets/next.svg";
import ICON_PRE from "@/assets/previous.svg";

const URL =
  "https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG4P32xzV7u1j1FSzjNg/high.mp4";

const IMG = `https://img1.baidu.com/it/u=2949796277,2040339066&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=502`;

/**
 * @name Music 音频播放器
 */
const Music = () => {
  return (
    <Container hover={false} backgroundColor="transparent">
      <div className={styles.layout}>
        <div className={styles.title}>
          <img src={IMG} alt="" />
          <div>
            <p>回到故去</p>
            <p>周杰伦</p>
          </div>
        </div>
        <MediaController audio>
          <video muted slot="media" preload="auto" src={URL} />
          <MediaControlBar>
            <div className={styles.progress}>
              <MediaTimeRange />
              <MediaTimeDisplay showDuration />
            </div>
            <div className={styles.tools}>
              <img src={ICON_PRE} style={{ width: 19 }} />
              <MediaPlayButton />
              <img src={ICON_NEXT} style={{ width: 18 }} />
              <MediaMuteButton />
              <MediaVolumeRange />
            </div>
          </MediaControlBar>
        </MediaController>
        <Item />
        <Item />
        <Item />
        <Item />
      </div>
    </Container>
  );
};

export default Music;
