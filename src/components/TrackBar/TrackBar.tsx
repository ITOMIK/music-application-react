import {JSX, useRef, useState, useEffect} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {useDispatch} from "react-redux";
import {actions} from "../../store/slices/trackBarSlice.ts";
import styles from "./TrackBar.module.css";
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

function TrackBar():JSX.Element{
    const currentTrack = useTypedSelector(state=> state.trackBarInfo)
    const dispatch = useDispatch()
    const audioRef = useRef<HTMLAudioElement>(null);
    const [maxTime, setMaxTime] = useState<number>(0)
    useEffect(() => {
        if (audioRef.current!=null) {
            audioRef.current.onloadedmetadata = () => {
                const dur = audioRef.current!.duration.toFixed(0);
                setMaxTime(parseInt(dur, 10))
                if (audioRef.current && typeof currentTrack.voulme === 'number') {
                    audioRef.current.volume = currentTrack.voulme;
                }
            };
        }
    }, [audioRef.current]);
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

    const getRightTime= (sec:number):string=>{
        const min = sec/60;
        const seconds = sec%60
        return `${min.toFixed(0)}:${seconds<10? `0${seconds}`: seconds}`
    }

    if(currentTrack.track)
    return (
        <div className={styles.playerContainer}>
            <div className={styles.player}>
                <div className={styles.nameBlock}>
                    <h1>{currentTrack.track.trackName} - {currentTrack.track.artistName}</h1>
                </div>
            <audio ref={audioRef} autoPlay={currentTrack.isPlaying} src={currentTrack.track.src}
                   onTimeUpdate={handleTimeUpdate}></audio>
            <button onClick={togglePlay}>{currentTrack.isPlaying ? <FaPause /> : <FaPlay />}</button>
            <input
                type="range"
                min="0"
                max={`${audioRef.current && audioRef.current.duration}`}
                value={currentTrack.currentTime}
                onChange={handleSeek}
                className={styles.seekBar}
            />
            {currentTrack.currentTime? getRightTime(parseInt( currentTrack.currentTime.toFixed(0),10)): 0} : {getRightTime(maxTime)}
                <FaVolumeUp style={{ marginLeft: "15px" }}/>
            <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={`${currentTrack.voulme}`}
                onChange={handleVoulme}
                className={styles.volumeBar}
            />
            </div>
        </div>
    )
    else {
        return (<></>);
    }
};

export default TrackBar;