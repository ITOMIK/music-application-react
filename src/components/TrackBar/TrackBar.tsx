import React, {JSX, useRef, useState, useEffect} from "react";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {useDispatch} from "react-redux";
import {actions, TrackBar} from "../../store/slices/trackBarSlice.ts";
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
import {useFetchMp3ByLinkQuery} from "../../store/api.ts";


function _TrackBar():JSX.Element{
    const currentTrack = useTypedSelector(state=> state.trackBarInfo)

    const dispatch = useDispatch()
    const Libary = useTypedSelector(state=>state.libaryTracks)
    const favoriteTracks = useTypedSelector(state => state.tracksInfo)
    const audioRef = useRef<HTMLAudioElement>(null);
    const [maxTime, setMaxTime] = useState<number>(0);
    const [loadingUrlFlag, setLoadingUrlFlag] = useState<boolean>(true);



    const { data, isLoading,  } =  useFetchMp3ByLinkQuery(currentTrack.track?.src!, {skip:!(loadingUrlFlag && currentTrack.track!=null)})

    useEffect(() => {

            if(currentTrack.isOnPause){
                audioRef.current!.pause()
            }

    }, [currentTrack.isOnPause]);

    useEffect(()=>{
        if(currentTrack.isPlaying && audioRef.current){
            audioRef.current!.play();

            audioRef.current.currentTime =currentTrack.currentTime!
        }
    },[currentTrack.isPlaying && audioRef.current]);

    useEffect(() => {
        if (audioRef.current!=null) {
            audioRef.current.onloadedmetadata = () => {
                const dur = audioRef.current!.duration.toFixed(0);
                setMaxTime(parseInt(dur, 10))
                //getNextTrack(currentTrack.track!)

                if (audioRef.current) {
                    audioRef.current.volume = currentTrack.voulme;
                }
            };
        }
    }, [audioRef.current, audioRef]);



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
            isPlaying: currentTrack.isPlaying
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
            isPlaying: currentTrack.isPlaying
        };
        return track;
    };


    const togglePlay = () => {
        try{
        // Проверяем, есть ли у нас сохраненное текущее время
        const currentTime = currentTrack.currentTime || 0;

        // Вызываем экшен для загрузки MP3-ссылки, если трек уже не загружен
        // @ts-ignore
       // dispatch(fetchMP3Link(currentTrack.track!.src));

        if (audioRef.current) {
            if (currentTrack.isPlaying) {
                // Если трек играет, ставим его на паузу и сохраняем текущее время
                audioRef.current.pause();
                dispatch(actions.togglePlay());
                dispatch(actions.toggleTime(audioRef.current.currentTime));
            } else {
                // Если трек на паузе, включаем его и устанавливаем сохраненное текущее время
                audioRef.current.currentTime = currentTime;
                audioRef.current.play();
                dispatch(actions.togglePlay());
            }
        }
        }
        catch (e){
            console.error(e);
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
                    {isLoading?
                        "Загрузка..."
                        :
                    <h3>
                        {tittle.length > 40 ? tittle.slice(0, 37) + "..." : tittle}
                    </h3>
                    }

                </div>
                <button
                    style={{
                        "marginLeft": "20px",
                        "backgroundColor": favoriteTracks.some(s => s.src == currentTrack.track!.src) ? "#ED4926" : "#007bff"
                    }}
                    onClick={() => {
                        dispatch(favActions.toggleTracksInfo(currentTrack.track!));
                    }}
                >
                    {favoriteTracks.some(s => s.src == currentTrack.track!.src)
                        ? < FaHeartBroken/>
                        : <FaHeart/>}{" "}


                </button>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    setLoadingUrlFlag(false);
                    if(currentTrack.isPlaying)
                        audioRef.current!.pause();
                    const previousCurrentId = currentTrack.track?.id;
                    dispatch(actions.setTrackBar(getPreviousTrack()));
                    setTimeout(() => {
                        if (currentTrack.track?.id === previousCurrentId) {
                            setLoadingUrlFlag(true);
                        }
                    }, 500);
                }}><FaAngleDoubleLeft/></button>
                <button style={{marginLeft: "15px"}} onClick={togglePlay}>{currentTrack.isPlaying ? <FaPause/> :
                    <FaPlay/>}</button>
                <button style={{marginLeft: "15px"}} onClick={() => {
                    setLoadingUrlFlag(false);
                    if(currentTrack.isPlaying)
                        audioRef.current!.pause();
                    const previousCurrentId = currentTrack.track?.id;
                    dispatch(actions.setTrackBar(getNextTrack()));
                    setTimeout(() => {
                        if (currentTrack.track?.id === previousCurrentId) {
                            setLoadingUrlFlag(true);
                        }
                    }, 500);
                }}><FaAngleDoubleRight/></button>
                <audio
                    ref={audioRef}
                    autoPlay={currentTrack.isPlaying}
                    src={data?.url}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        dispatch(actions.setTrackBar(getNextTrack()));
                        if(Libary.length===1){
                            audioRef.current!.play();
                    }}}
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