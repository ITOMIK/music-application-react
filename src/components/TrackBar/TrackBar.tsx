import {JSX, useRef, useState} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {useDispatch} from "react-redux";
import {actions} from "../../store/slices/trackBarSlice.ts";


function TrackBar():JSX.Element{
    const currentTrack = useTypedSelector(state=> state.trackBarInfo)
    const dispatch = useDispatch()
    const audioRef = useRef<HTMLAudioElement>(null);
    const [maxTime, setMaxTime] = useState<number>(0)
    setTimeout(() => {
        if (audioRef.current) {
            const durationInSeconds = +audioRef.current.duration.toFixed(0);
            setMaxTime(durationInSeconds);
        }
    }, 50);
    const togglePlay = () => {
        dispatch(actions.togglePlay())
        const t = currentTrack.currentTime;
        if (audioRef.current) {
            if (currentTrack.isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
                if (audioRef.current) {
                    const audioElement = audioRef.current;
                    audioElement.currentTime = t!;
                }

            }
        }
    };
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseInt(e.target.value, 10);
        if (audioRef != null && audioRef.current != null) {
            audioRef.current.currentTime = newTime;
        }
        dispatch(actions.toggleTime(newTime))
    };
    const handleVoulme = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
        dispatch(actions.toggleVoulme(newVolume))
    };
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            dispatch(actions.toggleTime(audioRef.current.currentTime))
        }
    };

    if(currentTrack.track)
    return (
        <div>
            <h1>{currentTrack.track.trackName} - {currentTrack.track.artistName} </h1>
            <audio ref={audioRef} autoPlay={currentTrack.isPlaying} src={currentTrack.track.src}
                   onTimeUpdate={handleTimeUpdate}></audio>
            <button onClick={togglePlay}>{currentTrack.isPlaying ? 'Pause' : 'Play'}</button>
            <input
                type="range"
                min="0"
                max={`${audioRef.current && audioRef.current.duration}`}
                value={currentTrack.currentTime}
                onChange={handleSeek}
            />
            {currentTrack.currentTime? currentTrack.currentTime.toFixed(0): 0} : {maxTime}
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={`${currentTrack.voulme}`}
                onChange={handleVoulme}
            />
        </div>
    )
    else {
        return (<></>);
    }
};

export default TrackBar;