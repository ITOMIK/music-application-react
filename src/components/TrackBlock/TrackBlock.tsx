import {JSX} from "react";
import {actions, TrackInfo} from "../../store/slices/tracksSlice.ts";
import {useDispatch} from "react-redux";
import {useTypedSelector} from "../../hooks/useTypedSelector.ts";
import {actions as barActions, TrackBar} from "../../store/slices/trackBarSlice.ts";

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
        <div>
            <h2> {track.artistName} - {track.trackName}</h2>
            <button onClick={() => {
                dispatch(actions.toggleTracksInfo(track))
            }}>
                {favoriteTracks.some(t => t.id === track.id) ? "Убрать" : "Добавить"} в Избранное
            </button>
            <button onClick={() => {
                dispatch(barActions.setTrackBar(obj))
            }}>
               Воспроизвести
            </button>
        </div>
    )
};

export default TrackBlock;