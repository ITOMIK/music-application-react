import { configureStore } from '@reduxjs/toolkit'
import {reducer as TrackReducer}  from "./slices/tracksSlice.ts";
import {reducer as TrackBarReducer} from "./slices/trackBarSlice.ts";
export const store = configureStore({
    reducer: {
        tracksInfo: TrackReducer,
        trackBarInfo:TrackBarReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch