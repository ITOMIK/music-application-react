import React, {JSX, useRef, useState, useEffect} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {useDispatch} from "react-redux";
import {actions, TrackBar, fetchMP3Link} from "../../store/slices/trackBarSlice.ts";
import styles from "./TrackBar.module.css";
import {
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeDown,
    FaVolumeOff,
    FaAngleDoubleLeft, FaAngleDoubleRight, FaHeartBroken, FaHeart
} from 'react-icons/fa';
import {actions as favActions} from "../../store/slices/tracksSlice.ts";

function _TrackBar():JSX.Element{
    const currentTrack = useTypedSelector(state=> state.trackBarInfo)

    const dispatch = useDispatch()
    const Libary = useTypedSelector(state=>state.libaryTracks)
    const favoriteTracks = useTypedSelector(state => state.tracksInfo)
    const audioRef = useRef<HTMLAudioElement>(null);
    const [maxTime, setMaxTime] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(false)
    const getNextTrack = (): TrackBar => {
        const song = currentTrack.track!;
        let nextIndex = Libary.findIndex(s => s.id === song.id) + 1;
        if (nextIndex >= Libary.length) {
            // Если текущий трек - последний в списке, переключаемся на первый трек в списке
            nextIndex = 0;
        }
        const track: TrackBar = {
            track: Libary[nextIndex],
            currentTime: 0,
            voulme: 0,
            isPlaying: true,
        };
        return track;
    };

    const getPreviousTrack = (): TrackBar => {
        const song = currentTrack.track!;
        let prevIndex = Libary.findIndex(s => s.id === song.id) - 1;
        if (prevIndex < 0) {
            // Если текущий трек - первый в списке, переключаемся на последний трек в списке
            prevIndex = Libary.length - 1;
        }
        const track: TrackBar = {
            track: Libary[prevIndex],
            currentTime: 0,
            voulme: 0,
            isPlaying: true,
        };
        return track;
    };
    useEffect(()=>{
        if(currentTrack.isPlaying && audioRef.current){
        audioRef.current.play()
        }
    },[currentTrack.isPlaying && audioRef.current])
    useEffect(() => {
        if (audioRef.current!=null) {
            audioRef.current.onloadedmetadata = () => {
                const dur = audioRef.current!.duration.toFixed(0);
                setMaxTime(parseInt(dur, 10))
                //getNextTrack(currentTrack.track!)

                if (audioRef.current && typeof currentTrack.voulme === 'number') {
                    audioRef.current.volume = currentTrack.voulme;
                }
            };
        }
    }, [audioRef.current, audioRef]);
    const togglePlay = () => {
        if(currentTrack!.track!.src.length<25){
            // @ts-ignore
            dispatch(fetchMP3Link(currentTrack.track!.src, setIsLoading));
        }
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
        return `${Math.floor(min)}:${seconds<10? `0${seconds}`: seconds}`
    }

    if(currentTrack.track){
        const tittle= `${currentTrack.track.trackName} - ${currentTrack.track.artistName}`
    return (
        <>
        <div className={styles.playerContainer}>
            <div className={styles.player}>


                <div className={styles.nameBlock}>

                    <h3>
                        {isLoading ? "Загрузка..." : tittle.length > 30 ? tittle.slice(0, 27) + "..." : tittle}
                    </h3>

                </div>
                <button
                    style={{
                        "marginLeft": "20px",
                        "backgroundColor": favoriteTracks.some(s => s.id == currentTrack.track!.id) ? "#ED4926" : "#007bff"
                    }}
                    onClick={() => {
                        dispatch(favActions.toggleTracksInfo(currentTrack.track!));
                    }}
                >
                    {favoriteTracks.some(s => s.id == currentTrack.track!.id)
                        ? < FaHeartBroken/>
                        : <FaHeart/>}{" "}


                </button>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    const song = getPreviousTrack()
                    dispatch(actions.setSrcSuccess(""))
                    dispatch(actions.setTrackBar(song));
                    // @ts-ignore
                    dispatch(fetchMP3Link(song.track?.src));
                }}><FaAngleDoubleLeft/></button>
                <button style={{marginLeft: "15px"}} onClick={togglePlay}>{currentTrack.isPlaying ? <FaPause/> :
                    <FaPlay/>}</button>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    const song = getNextTrack()
                    dispatch(actions.setSrcSuccess(""))
                    dispatch(actions.setTrackBar(song));
                    // @ts-ignore
                    dispatch(fetchMP3Link(song.track?.src));
                }}><FaAngleDoubleRight/></button>
                <audio
                    ref={audioRef}
                    autoPlay={currentTrack.isPlaying}
                    src={currentTrack.src}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        const song = getNextTrack()
                        dispatch(actions.setTrackBar(song));
                        // @ts-ignore
                        dispatch(fetchMP3Link(song.track?.src));
                    }}
                ></audio>
                <input
                    type="range"
                    min="0"
                    max={`${audioRef.current && audioRef.current.duration}`}
                    value={currentTrack.currentTime}
                    onChange={handleSeek}
                    className={styles.seekBar}
                />


                {currentTrack.currentTime ? getRightTime(parseInt(currentTrack.currentTime.toFixed(0), 10)) : "0:00"} : {getRightTime(maxTime)}
                {currentTrack.voulme! > 0.5 ? <FaVolumeUp style={{marginLeft: "15px"}}/> : currentTrack.voulme ?
                    <FaVolumeDown style={{marginLeft: "15px"}}/> : <FaVolumeOff style={{marginLeft: "15px"}}/>}
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.005"
                    value={`${currentTrack.voulme}`}
                    onChange={handleVoulme}
                    className={styles.volumeBar}
                />
            </div>
        </div>
        </>
    )
    } else {
        return (<></>);
    }
};

export default _TrackBar;