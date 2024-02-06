import {useMutation} from "@tanstack/react-query";
import axios from "axios";

const addCard = (product) => {
    return axios.post('https://order.basalam.com/basket/item?light=true', product,{
        headers: {
            'Authorization': `Bearer ${basalamApiToken}`,
        },
    })
}
export const usePostCard = () => {
    return useMutation(addCard)
}