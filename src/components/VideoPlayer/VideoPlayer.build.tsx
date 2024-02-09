import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC } from 'react';

import { IVideoPlayerProps } from './VideoPlayer.config';
import { BsFillPlayFill, BsFillVolumeUpFill, BsFullscreen } from 'react-icons/bs';

import { RiPictureInPicture2Fill, RiSpeedUpFill } from 'react-icons/ri';

const VideoPlayer: FC<IVideoPlayerProps> = ({
  autoPlay,
  loop,
  muted,
  miniPlayer,
  fullScreen,
  speed,
  style,
  className,
  classNames = [],
}) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();

  //playPause button
  const VideoPlayPauseButton = () => {
    return (
      <button
        className={cn(
          'player-start',
          'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
        )}
      >
        {' '}
        {<BsFillPlayFill />}
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
  //volume slider
  const VolumeInput = () => {
    return (
      <div className={cn('player-volume-container', 'flex group w-fit')}>
        <button
          className={cn(
            'player-volume-button',
            'items-center justify-center p-2 hover:bg-gray-400 block cursor-pointer relative',
          )}
        >
          <BsFillVolumeUpFill />
        </button>
        <input type="range" min={0} max={100} className={cn('player-volume-range', 'w-fit')} />
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
          >
            <BsFullscreen />
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
              'player-fullscreen',
              'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
            )}
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
                'player-fullscreen',
                'p-2 my-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
              )}
            >
              <RiSpeedUpFill />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2  z-10 opacity-50 bg-black rounded shadow mb-2">
              <button className="block w-full py-2 px-4 text-left hover:bg-gray-300">0.25x</button>
              <button className="block w-full py-2 px-4 text-left hover:bg-gray-300">0.5x</button>
              <button className="block w-full py-2 px-4 text-left hover:bg-gray-300">1x</button>
              <button className="block w-full py-2 px-4 text-left hover:bg-gray-300">1.5x</button>
              <button className="block w-full py-2 px-4 text-left hover:bg-gray-300">2x</button>
            </div>
          </div>
        )}
      </>
    );
  };

  //duration div
  const DurationDiv = () => {
    const dur = '00:00 / 00:00';
    return <div className={cn('duration-container', 'p-2 w-50')}>{dur}</div>;
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <video
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        className={cn('video-screen', 'w-full bg-slate-400 rounded-t-lg')}
      >
        <source src="" type="video/mp4" />
        <source src="" type="video/ogg" />
        Your browser does not support the video element.
      </video>
      <div
        className={cn('player-container', 'flex rounded-b-lg bg-gray-600 text-white text-xl px-1')}
      >
        <VideoPlayPauseButton />
        <div className={cn('player-container', 'flex grow items-center justify-center gap-2 p-1')}>
          <ProgressBar />
          <DurationDiv />
        </div>
        <VolumeInput />
        <SpeedButton />
        <FullScreenButton />
        <PictureInPictureButton />
      </div>
    </div>
  );
};

export default VideoPlayer;
