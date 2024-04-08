import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface TrackInfo {
    trackName: string,
    artistName: string,
    time: number,
    src: string,
    id: string
}


const initialArray = localStorage.getItem('library') ? JSON.parse(localStorage.getItem('library')!) : [];
const initialState: Array<TrackInfo> = initialArray

export const counterSlice = createSlice({
    name: 'library',
    initialState,
    reducers: {
        setLibrary: (_state, action: PayloadAction<TrackInfo[]>) => {
            return action.payload;
        },
        toggleTracksInfo: (state, action: PayloadAction<TrackInfo>) => {
            const index = state.findIndex(t => t.id === action.payload.id);
            if (index !== -1) {
                state.splice(index, 1);
            } else {
                state.push(action.payload);
            }
            localStorage.setItem('library', JSON.stringify(state));
        }
    },
});


export const { actions, reducer } = counterSlice
