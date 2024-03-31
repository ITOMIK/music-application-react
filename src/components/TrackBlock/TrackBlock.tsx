import {JSX} from "react";
import {actions, TrackInfo} from "../../store/slices/tracksSlice.ts";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {actions as barActions, TrackBar} from "../../store/slices/trackBarSlice.ts";
import styles from "./TrackBlock.module.css";
import { FaPlay } from 'react-icons/fa';
interface TrackBlockProps {
    track: TrackInfo;
}

function TrackBlock({track}:TrackBlockProps):JSX.Element{
    const dispatch = useDispatch()
    const favoriteTracks = useTypedSelector(state=> state.tracksInfo)
    const obj:TrackBar={
        track:track
    }
    return (
        <div className={styles.trackBlock}>
            <div className={styles.trackFlex}>
                <div className={styles.trackInfo}>
                    <h2>
                        {track.artistName} - {track.trackName}
                    </h2>
                    <button
                        className={styles.button}
                        onClick={() => {
                            dispatch(actions.toggleTracksInfo(track));
                        }}
                    >
                        {favoriteTracks.some((t) => t.id === track.id)
                            ? "Убрать"
                            : "Добавить"}{" "}
                        в Избранное
                    </button>
                </div>


                <button
                    className={styles.playButton}
                    onClick={() => {
                        dispatch(barActions.setTrackBar(obj));
                    }}
                >
                    <FaPlay />
                </button>
            </div>

        </div>
    )
};

export default TrackBlock;