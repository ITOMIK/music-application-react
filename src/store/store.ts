import { configureStore } from '@reduxjs/toolkit'
import {reducer as TrackReducer}  from "./slices/tracksSlice.ts";
import {reducer as TrackBarReducer} from "./slices/trackBarSlice.ts";
import {reducer as TrackLibrary} from "./slices/libaryTracks.ts";
import {api} from "./api.ts";

export const store = configureStore({
    reducer: {
        tracksInfo: TrackReducer,
        trackBarInfo:TrackBarReducer,
        libaryTracks: TrackLibrary,
        [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch