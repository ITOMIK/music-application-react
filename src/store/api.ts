import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";



const ApI_URl = 'https://terpilafastapiapplication-5.onrender.com';

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