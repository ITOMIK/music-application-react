import {JSX, useState} from "react";
import {actions, TrackInfo} from "../../store/slices/tracksSlice.ts";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {actions as barActions, fetchMP3Link, TrackBar} from "../../store/slices/trackBarSlice.ts";
import {actions as LibaryActions} from "../../store/slices/libaryTracks.ts"
import styles from "./TrackBlock.module.css";
import { FaPlay, FaHeart, FaHeartBroken, FaTrashAlt , FaPlus    }  from 'react-icons/fa';


interface TrackBlockProps {
    track: TrackInfo;
    currentFlag: boolean;
}

function TrackBlock({track, currentFlag}:TrackBlockProps):JSX.Element{
    const dispatch = useDispatch()
    const favoriteTracks = useTypedSelector(state=> state.tracksInfo)
    const LibaryTracks = useTypedSelector(state=> state.libaryTracks)
    const favFlag = LibaryTracks.some(x=> x.id===track.id)
    const visFlagFav = favoriteTracks.some((t) => t.src === track.src)
    const [isVisible, setIsVisible] = useState(true)

    const obj:TrackBar={
        track:track,
    }

    return (
        <>
            {isVisible?
        <div className={styles.trackBlock}>
            <div className={styles.trackFlex}>
                <div className={styles.trackInfo}>
                    <h2>
                        {track.artistName} - {track.trackName}
                    </h2>
                    <button
                        style={{"marginLeft": "20px", "backgroundColor": visFlagFav?"#ED4926":"#007bff"}}
                        className={styles.button}
                        onClick={() => {
                            dispatch(actions.toggleTracksInfo(track));
                            !currentFlag? setIsVisible(false):null
                        }}
                    >
                        {visFlagFav
                            ? < FaHeartBroken/>
                            : <FaHeart />}{" "}


                    </button>

                        <button
                            className={styles.button}
                            style={{"marginLeft": "20px", "backgroundColor": favFlag?"#ED4926":"#007bff"}}
                            onClick={() => {
                                dispatch(LibaryActions.toggleTracksInfo(track))
                                currentFlag? setIsVisible(false):null
                            }}
                        >
                            {favFlag? <FaTrashAlt />: <FaPlus    />}

                        </button>
                </div>

                    <button
                        className={styles.playButton}
                        onClick={() => {
                            dispatch(barActions.setSrcSuccess(""))
                            console.log(obj)
                            dispatch(barActions.setTrackBar(obj));
                            // @ts-ignore
                            dispatch(fetchMP3Link(obj.track!.src));
                        }}
                    >
                        <FaPlay/>
                    </button>


            </div>

        </div> : null
            }
        </>
    )
};

export default TrackBlock;