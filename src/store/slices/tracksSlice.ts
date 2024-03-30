import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TrackInfo {
    trackName: string,
    artistName: string,
    time: number,
    src: string,
    id: number
}

const initialArray = localStorage.getItem('tracks') ? JSON.parse(localStorage.getItem('tracks')!) : [];
console.log(initialArray);
const initialState: Array<TrackInfo> = initialArray

export const counterSlice = createSlice({
    name: 'tracks',
    initialState,
    reducers: {
        toggleTracksInfo: (state, action: PayloadAction<TrackInfo>) => {
            const index = state.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            } else {
                state.push(action.payload);
            }
            localStorage.setItem('tracks', JSON.stringify(state));
        },
    },
});


export const { actions, reducer } = counterSlice
