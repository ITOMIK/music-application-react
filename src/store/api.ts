import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import data from "../../data.json";


const ApI_URl = data.api;

type Url={
    url: string
}
export const api = createApi({
        reducerPath: 'api',
        baseQuery: fetchBaseQuery({
            baseUrl: ApI_URl,
        }),
        endpoints: build => ({
            fetchMp3ByLink: build.query<Url, string>({
                query: (link)=> {console.log("here:",link); return `/GetMp3Link/${link}`},
            }),
        })
        },
    )

export const {useFetchMp3ByLinkQuery} = api