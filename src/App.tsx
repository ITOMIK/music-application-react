//import { useState } from 'react'
import {useEffect} from "react";
import {TrackInfo} from "./store/slices/tracksSlice.ts";
import TrackBlock from "./components/TrackBlock/TrackBlock.tsx";
import styles from "./App.module.css";
import {useTypedSelector} from "./hooks/useTypedSelector.ts";
import TrackBar from "./components/TrackBar/TrackBar.tsx";
function App() {

    useEffect(() => {
        const confirmationMessage = 'Are you sure you want to leave? All your changes will be lost.';

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

   const favoriteTracks = useTypedSelector(state=> state.tracksInfo)
    const tracks: Array<TrackInfo> = [{
        trackName: "Nothing Else Matters",
        artistName: "Metallica",
        time: 600,
        src: "/data/Metallica - Nothing Else Matters.mp3",
        id:0
    },
        {
            trackName: "Enter Sandman",
            artistName: "Metallica",
            time: 600,
            src: "/data/Metallica - Enter Sandman.mp3",
            id:1
        },
        {
            trackName: "The Unforgiven",
            artistName: "Metallica",
            time: 600,
            src: "/data/Metallica - The Unforgiven.mp3",
            id:2
        }
        ]
  return (
      <div className={styles.playerContainer}>
          <div className={styles.trackBlocksContainer}>
              <span className={styles.favoriteCount}>{favoriteTracks.length}</span>
              {tracks.map((t) => (
                  <TrackBlock track={t} key={t.id}/>
              ))}
          </div>
          <div className={styles.trackBarContainer}>
              <TrackBar/>
          </div>
      </div>

  )
}

export default App
