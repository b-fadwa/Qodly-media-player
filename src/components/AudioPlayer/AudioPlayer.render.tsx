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
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [prevVolume, setPrevVolume] = useState<number>(60); //get the previous audio volume

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);

  //to set the source of the audio player
  useEffect(() => {
    // debugger
    // debugger
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

  function formatTime(audioDuration: number) {
    if (audioDuration) {
      // debugger
      const hours = Math.floor(audioDuration / 3600);
      const minutes = Math.floor((audioDuration % 3600) / 60);
      const seconds = Math.floor(audioDuration % 60);
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
        {formatTime(Math.floor(currentTime))} /{' '}
        {audioRef.current ? formatTime(audioRef.current?.duration) : '00:00'}
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
          min="0"
          max={audioRef.current ? Math.floor(audioRef.current?.duration)||0 : 0}
        />
      </div>
    );
  };

  const handleVolumeChange = (e: any) => {
    //set the volume of the audio
    if (!muteVolume) {
      setVolume(e.target.value);
    }
    if (muteVolume) {
      // Unmute the volume when changing manually
      setMuteVolume(false);
    }
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

  return (
    <div ref={connect} className={cn(className, classNames)}>
      <audio
        ref={audioRef}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
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
        <div className={cn('player-content', 'flex grow items-center justify-center gap-2  p-2')}>
          <ProgressBar />
          <DurationDiv />
        </div>
        <VolumeInput />
      </div>
    </div>
  );
};

export default AudioPlayer;
