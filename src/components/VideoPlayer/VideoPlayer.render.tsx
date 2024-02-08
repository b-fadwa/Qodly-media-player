import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';

import { IVideoPlayerProps } from './VideoPlayer.config';
import {
  BsFillPlayFill,
  BsFillVolumeUpFill,
  BsPauseFill,
  BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
} from 'react-icons/bs';

const VideoPlayer: FC<IVideoPlayerProps> = ({
  autoPlay,
  muted,
  loop,
  style,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const {
    sources: { datasource: ds },
  } = useSources();

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(60); //get the previous audio volume
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  useEffect(() => {
    if (!ds) return;

    const listener = async (/* event */) => {
      const v = await ds.getValue<string>();
      setValue(v);
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };
  }, [ds]);

  //playPause button
  const playPauseVideo = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const VideoPlayPauseButton = () => {
    return (
      <button
        className={cn(
          'player-start',
          'p-2 m-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
        )}
        onClick={playPauseVideo}
      >
        {isPlaying ? <BsPauseFill /> : <BsFillPlayFill />}
      </button>
    );
  };
  //progress bar
  const ProgressBar = () => {
    return (
      <div className={cn('player-progress', 'grow gap-1')}>
        <input className={cn('player-input', 'w-full')} type="range" min="0" max="100" />
      </div>
    );
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    if (progressBarRef.current) {
      progressBarRef.current.value = String(videoRef.current?.currentTime);
    }
  };

  const handleVolumeChange = (e: any) => {
    //set the volume of the audio
    // console.log('volume ' + e.target.value);
    if (!muteVolume) {
      setVolume(e.target.value);
    }
    if (muteVolume) {
      // Unmute the volume when changing manually
      setMuteVolume(false);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, videoRef]);

  const muteUpVolume = () => {
    setIsInputVisible(!isInputVisible);
    if (!muteVolume) {
      setPrevVolume(volume); //save the current volume
      setVolume(0); //mute
    } else {
      setVolume(prevVolume); //if mute, I want the old volume back
    }
    setMuteVolume((prev) => !prev); //mute
  };

  //to manage the hover on range
  const handleMouseEnter = () => {
    setIsInputVisible(true);
  };

  const handleMouseLeave = () => {
    setIsInputVisible(false);
  };

  //volume slider component
  const VolumeInput = () => {
    return (
      <div
        className={cn(
          'player-volume-container ',
          'flex justify-center items-center group w-fit rounded pr-4',
        )}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(
            'player-volume-button',
            'cursor-pointer relative w-12 h-12 flex justify-center items-center p-2 m-1',
          )}
          onClick={muteUpVolume}
          onMouseEnter={handleMouseEnter}
        >
          {muteVolume || volume < 5 ? (
            <BsFillVolumeMuteFill />
          ) : volume < 50 ? (
            <BsFillVolumeDownFill />
          ) : (
            <BsFillVolumeUpFill />
          )}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          onInput={handleVolumeChange}
          value={volume}
          className={isInputVisible ? 'player-volume-range pr-4' : 'player-volume-range hidden'}
        />
      </div>
    );
  };

  function formatTime(videoDuration: number) {
    if (videoDuration) {
      const hours = Math.floor(videoDuration / 3600);
      const minutes = Math.floor((videoDuration % 3600) / 60);
      const seconds = Math.floor(videoDuration % 60);
      if (minutes === 0 && hours === 0) return `${seconds}s`;
      if (minutes === 0 && seconds === 0) return `${hours}h`;
      if (hours === 0) return `${minutes}min ${seconds}s`;
      if (minutes === 0) return `${seconds}s`;
      if (seconds === 0) return `${hours}h ${minutes}min`;
    }
  }

  //duration div
  const DurationDiv = () => {
    return (
      <div className={cn('duration-container', 'p-2 w-50')}>
        {/* {videoRef? formatTime(Math.floor(currentTime))/videoRef.current ? formatTime(videoRef.current?.duration):'00:00'} */}
        {formatTime(Math.floor(currentTime))} /{videoRef.current ? formatTime(videoRef.current?.duration) : '00:00'}
      </div>
    );
  };

  // console.log(videoRef);
  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className={cn('video-screen', 'w-full bg-slate-400 max-w-full max-h-full rounded-t-lg')}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={value} type="video/mp4" />
        <source src={value} type="video/ogg" />
        Your browser does not support the video element.
      </video>
      <div
        style={style}
        className={cn(
          'player-container',
          'flex rounded bg-gray-600 text-white text-xl rounded-b-lg',
        )}
      >
        <VideoPlayPauseButton />
        <div className={cn('player-container', 'flex grow items-center justify-center gap-2 p-2')}>
          <ProgressBar />
          <DurationDiv />
        </div>
        <VolumeInput />
      </div>
    </div>
  );
};

export default VideoPlayer;
