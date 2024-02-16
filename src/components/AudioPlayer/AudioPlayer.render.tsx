import { useRenderer, useSources } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';

import { IAudioPlayerProps } from './AudioPlayer.config';
//icons
import {
  BsFillPlayFill,
  BsPauseFill,
  BsFillVolumeMuteFill,
  BsFillVolumeDownFill,
  BsFillVolumeUpFill,
} from 'react-icons/bs';

const AudioPlayer: FC<IAudioPlayerProps> = ({
  autoPlay,
  muted,
  loop,
  audioSource,
  style,
  className,
  classNames = [],
}) => {
  const { connect } = useRenderer();
  const [value, setValue] = useState<string>(audioSource);
  const {
    sources: { datasource: ds },
  } = useSources();

  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [prevVolume, setPrevVolume] = useState<number>(60); //get the previous audio volume
  const [volume, setVolume] = useState<number>(muted ? 0 : 60);
  const [muteVolume, setMuteVolume] = useState<boolean>(muted);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [duration, setDuration] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  //to set the source of the audio player
  useEffect(() => {
    if (!ds) return;
    const listener = async (/* event */) => {
      const v = await ds.getValue<string>();
      setValue(v || audioSource);
      if (autoPlay)
        //in case autoplay is checked, display the pause button :)
        setIsPlaying(true);
    };
    listener();
    ds.addListener('changed', listener);
    return () => {
      ds.removeListener('changed', listener);
    };
  }, [ds]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        // Update duration in state once metadata is loaded
        if (audioRef.current.duration) {
          setDuration(audioRef.current.duration);
        }
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, []);

  useEffect(() => {
    if (volume > 0) setMuteVolume(false);
    if (audioRef.current)
      if (audioRef.current.currentTime === audioRef.current.duration) setIsPlaying(false);
  });

  //handle button click: play/pause
  const playPauseAudio = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
    setIsPlaying(!isPlaying);
    // console.log('The audio is ' + isPlaying);
  };

  //handle time update current time + progress bar line
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    if (progressBarRef.current) {
      progressBarRef.current.value = String(audioRef.current?.currentTime);
    }
  };

  //playPause button
  const AudioPlayPauseButton = () => {
    return (
      <button
        className={cn(
          'player-start',
          'p-2 m-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
        )}
        onClick={playPauseAudio}
      >
        {isPlaying ? <BsPauseFill /> : <BsFillPlayFill />}
      </button>
    );
  };

  const formatTime = (audioDuration: number) => {
    if (audioDuration >= 0) {
      const hours = Math.floor(audioDuration / 3600);
      const minutes = Math.floor((audioDuration % 3600) / 60);
      const seconds = Math.floor(audioDuration % 60);

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

  //duration div
  const DurationDiv = () => {
    return (
      <div className={cn('player-duration-container', 'p-2 w-50')}>
        {formatTime(Math.floor(currentTime))} / {formatTime(Math.floor(duration))}
      </div>
    );
  };

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = parseFloat(progressBarRef.current.value);
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
    }
  };

  const handleMouseDown = (event: any) => {
    event.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
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
          max={audioRef.current?.duration}
        />
      </div>
    );
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume, audioRef]);

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
          'flex justify-center items-center group w-fit rounded',
        )}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(
            'player-volume-button',
            'cursor-pointer relative w-12 h-12 flex justify-center items-center p-2',
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
          onClick={handleMouseMove}
          ref={inputRef}
          onMouseDown={handleMouseDown}
          className={cn('player-volume-range mr-2', { hidden: !isInputVisible })}
        />
      </div>
    );
  };

  return (
    <div ref={connect} className={cn(className, classNames)}>
      <audio
        ref={audioRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muteVolume}
        onTimeUpdate={handleTimeUpdate}
      >
        {/* include the types mpeg + mp4+ ogg */}
        <source src={value} type="audio/wav"></source>
        <source src={value} type="audio/mp4"></source>
        <source src={value} type="audio/ogg"></source>
        Your browser does not support the audio element.
      </audio>
      <div
        style={style}
        className={cn('player-container', 'flex rounded bg-gray-600 text-white text-lg')}
      >
        <AudioPlayPauseButton />
        <div className={cn('player-content', 'flex grow items-center justify-center gap-2 p-2')}>
          <ProgressBar />
          <DurationDiv />
        </div>
        <VolumeInput />
      </div>
    </div>
  );
};

export default AudioPlayer;
