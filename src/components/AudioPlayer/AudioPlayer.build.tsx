import { useEnhancedNode } from '@ws-ui/webform-editor';
import cn from 'classnames';
import { FC, useState } from 'react';

import { IAudioPlayerProps } from './AudioPlayer.config';
import { BsFillPlayFill, BsFillVolumeUpFill } from 'react-icons/bs';
import { TbRewindBackward10, TbRewindForward10 } from 'react-icons/tb';

const AudioPlayer: FC<IAudioPlayerProps> = ({
  autoPlay,
  loop,
  muted,
  style,
  className,
  fastBackForward,
  classNames = [],
}) => {
  const {
    connectors: { connect },
  } = useEnhancedNode();
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setIsInputVisible(true);
  };

  const handleMouseLeave = () => {
    setIsInputVisible(false);
  };

  //playPause button
  const AudioPlayPauseButton = () => {
    return (
      <button
        className={cn(
          'player-start',
          'p-2 m-1 rounded-full hover:bg-gray-400 flex justify-center items-center w-12 h-12',
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
      <div
        onMouseLeave={handleMouseLeave}
        className={cn(
          'player-volume-container ',
          'flex justify-center items-center group w-fit rounded pr-4',
        )}
      >
        <button
          onMouseEnter={handleMouseEnter}
          className={cn(
            'player-volume-button',
            'cursor-pointer relative w-12 h-12 flex justify-center items-center p-2 m-1',
          )}
        >
          <BsFillVolumeUpFill />
        </button>
        <input
          type="range"
          min={0}
          max={100}
          className={isInputVisible ? 'player-volume-range pr-4' : 'player-volume-range hidden'}
        />
      </div>
    );
  };

  //duration div
  const DurationDiv = () => {
    const dur = '00:00 / 00:00';
    return <div className={cn('player-duration-container', 'p-2 w-50')}>{dur}</div>;
  };

  return (
    <div ref={connect} style={style} className={cn(className, classNames)}>
      <audio autoPlay={autoPlay} loop={loop} muted={muted} />
      <div
        style={style}
        className={cn('player-container', 'flex rounded bg-gray-600 text-white text-xl')}
      >
         <>
            {fastBackForward && (
              <button className={cn(
                'player-fast',
                'p-2 my-1 rounded-full flex justify-center items-center w-12 h-12',
              )}>
                <TbRewindBackward10 />
              </button>
            )}
          </>
          <AudioPlayPauseButton />
          <>
            {fastBackForward && (
              <button className={cn(
                'player-fast',
                'p-2 my-1 rounded-full flex justify-center items-center w-12 h-12',
              )}>
                <TbRewindForward10 />
              </button>
            )}
          </>
        <div className={cn('player-container', 'flex grow items-center justify-center gap-2 p-2')}>
          <ProgressBar />
          <DurationDiv />
        </div>
        <VolumeInput />
      </div>
    </div>
  );
};

export default AudioPlayer;
