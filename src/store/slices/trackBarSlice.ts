import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { TrackInfo } from './tracksSlice.ts';
import axios from "axios";
import { Dispatch } from 'redux';

export interface TrackBar {
    track: TrackInfo | null
    currentTime?: number,
    isPlaying?: boolean,
    voulme?: number,
    src?: string,
}

const initialTrack = localStorage.getItem('track') ? JSON.parse(localStorage.getItem('track')!) : null;
const initialCurrentTime = localStorage.getItem('currentTime') ? JSON.parse(localStorage.getItem('currentTime')!) : 0;
const initialIsPlaying = false;
const initialVoulme = localStorage.getItem('voulme') ? JSON.parse(localStorage.getItem('voulme')!) : 1;
document.title = localStorage.getItem('documentname') ? JSON.parse(localStorage.getItem('documentname')!) : "Music Player";

const initialState: TrackBar = {
    track: initialTrack,
    currentTime: initialCurrentTime,
    isPlaying: initialIsPlaying,
    voulme:initialVoulme,
    src: '',
};

export const counterSlice = createSlice({
    initialState,
    name: 'TrackBar',
    reducers: {
        setTrackBar: (state: TrackBar, action: PayloadAction<TrackBar>) => {
            console.log(state.currentTime)
            if(action.payload.track)
            {
            localStorage.setItem('documentname', JSON.stringify(action.payload.track?.trackName+" - "+action.payload.track?.artistName));
            document.title =action.payload.track?.trackName+" - "+action.payload.track?.artistName;
            state.currentTime = 0;
            state.track = action.payload.track;
            state.isPlaying = true;
            state.voulme = localStorage.getItem('voulme') ? JSON.parse(localStorage.getItem('voulme')!) : 1;
            localStorage.setItem('currentTime', JSON.stringify(state.currentTime));
            localStorage.setItem('track', JSON.stringify(state.track));
            localStorage.setItem('isPlaying', JSON.stringify(state.isPlaying));
            }
        },
        togglePlay: (state) => {
            state.isPlaying = !state.isPlaying;
            localStorage.setItem('isPlaying', JSON.stringify(state.isPlaying));
        },
        toggleTime: (state, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
            localStorage.setItem('currentTime', JSON.stringify(state.currentTime));
        },
        toggleVoulme:(state, action:PayloadAction<number>)=>{
            state.voulme= action.payload
            localStorage.setItem('voulme', JSON.stringify(state.voulme));
        },
        setSrcSuccess: (state, action: PayloadAction<string>) => {
                // @ts-ignore
            state.src = action.payload
        }
    },
})

export const { actions, reducer } = counterSlice

const cache: { [key: string]: { url: string} } = {};

export const fetchMP3Link = (trackSrc: string | null, cTime: number) => async (dispatch: Dispatch) :Promise<void>=> {

    console.log(trackSrc, cTime)

    if (!trackSrc || trackSrc.length>25) {
        return;
    }


    const cachedData = cache[trackSrc];
    if (cachedData) {
        dispatch(actions.setSrcSuccess(cachedData.url));
        return;
    }
    let retryCount = 0;
    const maxRetries = 10;
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    while (retryCount < maxRetries) {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/GetMp3Link/${trackSrc}`);
            dispatch(actions.setSrcSuccess(response.data.url));
            cache[trackSrc] = { url: response.data.url};
            console.log(response.data.url)
            return; // Выходим из цикла, если запрос выполнен успешно
        } catch (error) {
            console.error("Error fetching MP3 link:", error);
            retryCount++;
            await delay(100);
        }
    }

    console.error("Max retry attempts reached. Failed to fetch MP3 link.");
};
