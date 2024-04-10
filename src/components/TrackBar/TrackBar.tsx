import React, {JSX, useRef, useState, useEffect} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {useDispatch} from "react-redux";
import {actions, TrackBar, fetchMP3Link} from "../../store/slices/trackBarSlice.ts";
import styles from "./TrackBar.module.css";
import {FaPlay, FaPause, FaVolumeUp, FaVolumeDown, FaVolumeOff, FaArrowLeft, FaArrowRight} from 'react-icons/fa';

function _TrackBar():JSX.Element{
    const currentTrack = useTypedSelector(state=> state.trackBarInfo)

    const dispatch = useDispatch()
    const Libary = useTypedSelector(state=>state.libaryTracks)
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
            isPlaying: true
        };
        if (currentTrack.track!.src) {
            dispatch<any>(fetchMP3Link(currentTrack.track!.src));
        }
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
            isPlaying: true
        };
        if (currentTrack.track!.src) {
            dispatch<any>(fetchMP3Link(currentTrack.track!.src));
        }
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
    }, [audioRef.current]);
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

    //const getSrc = async ()=>{axios.get(`http://127.0.0.1:8000/GetMp3Link/${currentTrack.track!.src}`).then(r=> {currentTrack.track!.src=r.data.url; return r.data.url})}

    if(currentTrack.track){
        const tittle= `${currentTrack.track.trackName} - ${currentTrack.track.artistName}`
    return (
        <>
        <div className={styles.playerContainer}>
            <div className={styles.player}>


                <div className={styles.nameBlock}>

                    <h2>
                    {isLoading? "Загрузка...": tittle.length>80? tittle.slice(0, 77)+"...": tittle}
                    </h2>
                </div>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    dispatch(actions.setTrackBar(getPreviousTrack()));
                    dispatch<any>(fetchMP3Link(currentTrack.track!.src));
                }}><FaArrowLeft /></button>
                <button style={{marginLeft: "15px"}} onClick={togglePlay}>{currentTrack.isPlaying ? <FaPause/> : <FaPlay/>}</button>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    dispatch(actions.setTrackBar(getNextTrack()));
                    dispatch<any>(fetchMP3Link(currentTrack.track!.src));
                }}><FaArrowRight /></button>

                <audio
                    ref={audioRef}
                    autoPlay={currentTrack.isPlaying}
                    src={currentTrack.track.src}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        dispatch(actions.setTrackBar(getNextTrack()));


                        dispatch<any>(fetchMP3Link(currentTrack.track!.src));
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
    }
    else {
        return (<></>);
    }
};

export default _TrackBar;