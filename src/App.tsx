import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {actions, TrackInfo} from "./store/slices/libaryTracks";
import { useTypedSelector } from "./hooks/useTypedSelector";
import TrackBlock from "./components/TrackBlock/TrackBlock";
import styles from "./App.module.css";
import TrackBar from "./components/TrackBar/TrackBar";

function App() {
    const dispatch = useDispatch();
    const favoriteTracks = useTypedSelector((state) => state.tracksInfo);
    const libary = useTypedSelector((state) => state.libaryTracks);
    const [query, setQuery] = useState("");
    const [watchFavorites, setWatchFavorites] = useState(true);
    const [currentTracks, setCurrentTracks] = useState<TrackInfo[]>(libary);
    const [selectedValue, setSelectedValue] = useState("");
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        const confirmExit = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = ""; // Для браузеров, поддерживающих свойство returnValue
            const confirmationMessage = "Вы уверены, что хотите покинуть страницу?";
            event.returnValue = confirmationMessage; // Для старых браузеров

            return confirmationMessage;
        };

        window.addEventListener("beforeunload", confirmExit);

        return () => {
            window.removeEventListener("beforeunload", confirmExit);
        };
    }, []);
    const SelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(selectedValue==="")
            alert("Сначала выберетите что хотите добавить")
        setIsLoading(true)
        if(selectedValue==="song"){
        axios.get(`http://127.0.0.1:8000/GetTrackInfo/${query}`).then((r) => {
            if (!r.data) return;
            let obj = {
                trackName: r.data.name,
                artistName: r.data.artist,
                time: 0,
                src: r.data.url,
                id: r.data.id,
            };
            dispatch(actions.toggleTracksInfo(obj));
        }).catch(e=> {console.log(e); alert("cannot find track")});
        }
        else{
        let _o = {
            radio: `GetTopTracks/${query}`,
            album: `GetAlbumTracks/${query}`,
            chart: `GetChart`
        }
            // @ts-ignore
            axios.get(`http://127.0.0.1:8000/${_o[selectedValue]}`).then((r) => {
                if (!r.data) return;
                r.data.forEach((s: { name: any; artist: any; url: any; id: any; }) => {
                    let obj = {
                        trackName: s.name,
                        artistName: s.artist,
                        time: 0,
                        src: s.url,
                        id: s.id,
                    };
                    dispatch(actions.toggleTracksInfo(obj));
                })


            }).catch(e=> {console.log(e); alert("cannot find tracks")}).finally(()=> {setIsLoading(false); setQuery('')});
        }
    };

    const changeCurrentTracks = () => {
        setWatchFavorites((prev) => !prev);
    };

    useEffect(() => {
        setCurrentTracks(watchFavorites ?  libary: favoriteTracks);
    }, [favoriteTracks, libary, watchFavorites]);

    return (
        <>{isLoading && <span style={{margin: '50px', position: 'absolute'}}>Загрузка...</span>}
        <div className={styles.playerContainer}>

            <div className={styles.additionalControls}>

                <select
                    name="type-of-find"
                    className={styles.selectData}
                    id={"type-o"}
                    onChange={SelectChange}
                    value={selectedValue}
                    defaultValue={"song"}
                >
                    <option value="song">Песня</option>
                    <option value="album">Альбом</option>
                    <option value="radio">Радио(введите username)</option>
                    <option value="chart">Популярные треки</option>
                </select>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <input
                        type="text"
                        placeholder="Поиск..."
                        value={query}
                        onChange={handleChange}
                        className={styles.inputField}
                    />
                    <button type="submit" disabled={isLoading} >Добавить в очередь</button>
                </form>
                <button
                    onClick={changeCurrentTracks}
                    className={styles.favoriteButton}
                    data-count={watchFavorites ? favoriteTracks.length : libary.length}
                >
                    {watchFavorites ? "Смотреть избранное" : "Смотреть очередь"}
                </button>
                <button className={styles.selectData} onClick={() => {
                    dispatch(actions.cleanLibrary())
                }}>Очистить очередь
                </button>
            </div>
            <div className={styles.trackBlocksContainer}>
                {currentTracks != null  ? (
                    currentTracks.map((t) => (
                        <TrackBlock track={t} key={t.id} currentFlag={watchFavorites}/>
                    ))
                ) : null}
            </div>

            <div className={styles.trackBarContainer}>
                <TrackBar />
            </div>
        </div>
        </>
    );
}

export default App;