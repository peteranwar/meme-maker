import axios from "axios";


// import { useUserData } from "../context/UserDataState";


// const BASE_URL = 'http://meme-maker.io/api/';
const BASE_URL = process.env.NEXT_PUBLIC_MAIN_API;

// export const ENDPIONTS = {
//     ALLPRODUCTS: "products",
//     CART: "cart",
// }


export const createAPIEndpoint = (endpoint, lang, token) => {
    let url = BASE_URL + endpoint;
 
    const options = {
        headers: {
            'content-type': "application/json",
            // 'Authorization': `Barear ${token}`,
            'lang': lang,
            "token": token
        },
    }
    return {
        fetchAll: () => axios.get(url, options),
        fetchById: id => axios.get(url + id, options),
        create: newRecord => axios.post(url, newRecord, options),
        delete: (id) => axios.delete(url + id),
        update: (id, updatedRecord) => axios.put(url + id, updatedRecord, options),
    }
}