import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {TrackInfo} from "./tracksSlice.ts";

export interface TrackBar {
    track: TrackInfo | null
    currentTime?: number,
    isPlaying?: boolean,
    voulme?: number,
}

const initialTrack = localStorage.getItem('track') ? JSON.parse(localStorage.getItem('track')!) : null;
const initialCurrentTime = localStorage.getItem('currentTime') ? JSON.parse(localStorage.getItem('currentTime')!) : 0;
const initialIsPlaying = false;
const initialVoulme = localStorage.getItem('voulme') ? JSON.parse(localStorage.getItem('voulme')!) : 1;

const initialState: TrackBar = {
    track: initialTrack,
    currentTime: initialCurrentTime,
    isPlaying: initialIsPlaying,
    voulme:initialVoulme,
};

export const counterSlice = createSlice({
    initialState,
    name: 'TrackBar',
    reducers: {
        setTrackBar: (state: TrackBar, action: PayloadAction<TrackBar>) => {
            state.currentTime = 0;
            state.track = action.payload.track;
            state.isPlaying = true;
            localStorage.setItem('currentTime', JSON.stringify(state.currentTime));
            localStorage.setItem('track', JSON.stringify(state.track));
            localStorage.setItem('isPlaying', JSON.stringify(state.isPlaying));
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
    },
})

export const { actions, reducer } = counterSlice
