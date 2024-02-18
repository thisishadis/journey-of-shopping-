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

// const response = ('https://search.basalam.com/ai-engine/api/v2.0/product/search?from=0&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=48&adsImpressionDisable=false' );
// const filter2=(
//     `https://search.basalam.com/ai-engine/api/v2.0/product/search?from=0&f.freeShipping=${isFreeDeliveryEnabled}&f.vendorScore=${isBestSellerEnabled}&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=48&adsImpressionDisable=false&userCityId=1722`)