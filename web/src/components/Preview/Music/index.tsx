import {
  MediaTimeRange,
  MediaController,
  MediaControlBar,
  MediaMuteButton,
  MediaPlayButton,
  MediaVolumeRange,
  MediaTimeDisplay,
  MediaPlaybackRateButton,
} from "media-chrome/react";
import Container from "../Container";
import WaveSurfer from "wavesurfer.js";
import styles from "./index.module.sass";
import { useEffect, useRef } from "react";
import { API_PROXY_EXPLORER_URL } from "@/config/request";

import { TypeResource } from "@/interface/resource";

interface TypeMusicProps {
  data?: TypeResource.DTO;
}

/**
 * @name Music 音频播放器
 */
const Music: React.FC<TypeMusicProps> = ({ data }) => {
  const api = useRef<WaveSurfer>(null!);
  const view = useRef<HTMLDivElement>(null);
  const audio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    api.current = WaveSurfer.create({
      container: view.current!,
      backend: "MediaElement",
      media: audio.current!,
      interact: false,
      height: "auto",
      waveColor: "#4F4A85",
      progressColor: "#383351",
      cursorWidth: 2,
    });
    return () => {
      api.current.destroy();
    };
  }, []);

  return (
    <Container
      hover
      data={data}
      type="audios"
      defaultWidth={500}
      defaultHeight={260}
      backgroundColor="transparent"
    >
      <div className={styles.layout}>
        <div ref={view} className={styles.view} />
        <MediaController audio>
          <audio
            slot="media"
            ref={audio}
            src={`${API_PROXY_EXPLORER_URL}resource/${data!.path}`}
          />
          <MediaControlBar>
            <MediaPlayButton />
            <MediaTimeDisplay showduration />
            <MediaTimeRange />
            <MediaPlaybackRateButton />
            <MediaMuteButton />
            <MediaVolumeRange />
          </MediaControlBar>
        </MediaController>
      </div>
    </Container>
  );
};

export default Music;
