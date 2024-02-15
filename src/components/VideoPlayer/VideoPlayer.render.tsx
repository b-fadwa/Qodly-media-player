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
  BsFullscreen,
  BsFullscreenExit,
} from 'react-icons/bs';

import { RiPictureInPicture2Fill, RiSpeedUpFill } from 'react-icons/ri';

const VideoPlayer: FC<IVideoPlayerProps> = ({
  autoPlay,
  muted,
  loop,
  videoSource,
  miniPlayer,
  fullScreen,
  speed,
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
  const [value, setValue] = useState<string>(videoSource);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(60); //get the previous audio volume
  const [volume, setVolume] = useState(muted ? 0 : 60);
  const [muteVolume, setMuteVolume] = useState(muted);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!ds) return;

    const listener = async (/* event */) => {
      const v = await ds.getValue<string>();
      setValue(v || videoSource);
    };

    listener();

    ds.addListener('changed', listener);

    return () => {
      ds.removeListener('changed', listener);
    };
  }, [ds]);

  useEffect(() => {
    if (volume > 0) setMuteVolume(false);
    if (videoRef.current)
      if (videoRef.current.currentTime === videoRef.current.duration) setIsPlaying(false);
  });

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setCurrentTime(videoRef.current.currentTime);
        // Update duration in state once metadata is loaded
        if (videoRef.current.duration) {
          setDuration(videoRef.current.duration);
        }
      }
    };

    if (videoRef.current) {
      videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

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
        <input
          className={cn('player-input', 'w-full')}
          type="range"
          ref={progressBarRef}
          defaultValue={currentTime}
          onChange={handleProgressChange}
          step="0.01"
          min="0"
          max={videoRef.current?.duration}
        />
      </div>
    );
  };

  const handleProgressChange = () => {
    if (videoRef.current && progressBarRef.current) {
      const newTime = parseFloat(progressBarRef.current.value);
      setCurrentTime(newTime);
      videoRef.current.currentTime = newTime;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
    if (progressBarRef.current) {
      progressBarRef.current.value = String(videoRef.current?.currentTime);
    }
  };

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (event: any) => {
    if (inputRef.current) {
      const inputRect = inputRef.current?.getBoundingClientRect();
      const percentage = (event.clientX - inputRect.left) / inputRect.width;
      const newVolume = Math.floor(Math.min(Math.max(percentage * 100, 0), 100));
      setVolume(newVolume);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('click', handleMouseMove);
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

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      toggleDropdown();
    }
  };

  //volume slider component
  const VolumeInput = () => {
    return (
      <div
        className={cn(
          'player-volume-container ',
          'flex justify-center items-center group w-fit rounded',
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
          defaultValue={volume}
          ref={inputRef}
          onMouseDown={handleMouseDown}
          className={isInputVisible ? 'player-volume-range pr-4' : 'player-volume-range hidden'}
        />
      </div>
    );
  };

  const formatTime = (videoDuration: number) => {
    if (videoDuration >= 0) {
      const hours = Math.floor(videoDuration / 3600);
      const minutes = Math.floor((videoDuration % 3600) / 60);
      const seconds = Math.floor(videoDuration % 60);

      // Add leading zeros to ensure two-digit format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      if (hours > 0) {
        return `${hours}:${formattedMinutes}:${formattedSeconds}`;
      } else {
        return `${formattedMinutes}:${formattedSeconds}`;
      }
    } else {
      return '00:00';
    }
  };
  const toggleFullScreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullScreen(false);
        }
      }
    }
  };

  const togglePictureInPicture = () => {
    if (videoRef.current) {
      videoRef.current.requestPictureInPicture();
    }
  };

  //duration div
  const DurationDiv = () => {
    return (
      <div className={cn('duration-container', 'p-2 w-50')}>
        {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
      </div>
    );
  };

  const FullScreenButton = () => {
    return (
      <>
        {fullScreen && (
          <button
            className={cn(
              'player-fullscreen',
              'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
            )}
            onClick={toggleFullScreen}
          >
            {isFullScreen ? <BsFullscreenExit /> : <BsFullscreen />}
          </button>
        )}
      </>
    );
  };

  const PictureInPictureButton = () => {
    return (
      <>
        {miniPlayer && (
          <button
            className={cn(
              'player-miniPlayer',
              'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
            )}
            onClick={togglePictureInPicture}
          >
            <RiPictureInPicture2Fill />
          </button>
        )}
      </>
    );
  };

  const SpeedButton = () => {
    return (
      <>
        {speed && (
          <div className="relative">
            <button
              className={cn(
                'player-speed',
                'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
              )}
              onClick={toggleDropdown}
            >
              <RiSpeedUpFill />
            </button>
            {showDropdown && (
              <div
                className={cn(
                  'player-speed-options',
                  'absolute bottom-full left-1/2 transform -translate-x-1/2  z-10 opacity-50 bg-black rounded shadow mb-2',
                )}
              >
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-300"
                  onClick={() => handleSpeedChange(0.25)}
                >
                  0.25x
                </button>
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-300"
                  onClick={() => handleSpeedChange(0.5)}
                >
                  0.5x
                </button>
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-300"
                  onClick={() => handleSpeedChange(1)}
                >
                  1x
                </button>
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-300"
                  onClick={() => handleSpeedChange(1.5)}
                >
                  1.5x
                </button>
                <button
                  className="block w-full py-2 px-4 text-left hover:bg-gray-300"
                  onClick={() => handleSpeedChange(2)}
                >
                  2x
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <div ref={containerRef} className={cn('video-player-container', 'w-full h-full')}>
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          loop={loop}
          muted={muteVolume}
          className={cn(
            'video-screen',
            'w-full bg-slate-400 rounded-t-lg hover:cursor-pointer',
          )}
          style={{ height: isFullScreen ? '90%' : 'auto' }}
          onTimeUpdate={handleTimeUpdate}
          onClick={playPauseVideo}
        >
          <source src={value} type="video/mp4" />
          <source src={value} type="video/ogg" />
          Your browser does not support the video element.
        </video>
        <div
          className={cn(
            'video-container',
            'w-full',
            'flex rounded-b-lg bg-gray-600 text-white text-xl px-1',
          )}
        >
          <VideoPlayPauseButton />
          <div
            className={cn('player-container', 'flex grow items-center justify-center gap-2 p-1')}
          >
            <ProgressBar />
            <DurationDiv />
          </div>
          <VolumeInput />
          <SpeedButton />
          <FullScreenButton />
          <PictureInPictureButton />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
