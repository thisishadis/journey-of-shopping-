import axios from "axios";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {useState} from "react";
const basalamApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6ImU0MTJlNzE0OGFkOGNmMmU4YjgwYjUyNDZmMWVlNTEzMjBjZjM5YWE3NzZlMDlmZDYwZTUzYjM4M2E2NTQ3YmQ0OTU3YWY5OTNkZmI3NGFiIiwiaWF0IjoxNzA1MzIwNzQ0LjA3Mjk4MywibmJmIjoxNzA1MzIwNzQ0LjA3Mjk4OCwiZXhwIjoxNzM2OTQzMTQ0LjA1MDg0Mywic3ViIjoiMTMxNjYzMTEiLCJzY29wZXMiOltdLCJ1c2VyX2lkIjoxMzE2NjMxMX0.HrQlsuod1BsfsHy_ML5reebKHdCsZD8SPhNnAYuZm8MgeXhyrAOHuhN45TdDAiXTT4s5Jqye2A1bc4OBdiq3-zGDKMj5tULGvLRZY02lVl-D55Vs_1KCxkGTcwMW_Blf7sAIrNgZVkMEIheB9GwfdS7H5s4P7LOlKzBtZVDymxWbiJDwAB4o0pjYb5XMzFsnGeIkPrfJcLvdOsKO-eEJG_KMVmcfk2Fu-NETUI0LOjs7CLZYJd96VbAO4JPfunsqBUUGFcV4WYd3ymAveK4u71kdj1Y0d_o-CNRWCCn8J92ROOPtsI7Ro3SQcI5z47SEnHh2K4ghNLS87lhycFMfI12ZR1fvuRRnEXBhVTWNMOdKQlD7flvMRWUJJE8-Os9ALz4Q_n87qVDr1HWUdau2KYApwxZuWo9VPXNTiUW6Y4I-V49C-KE3I9rYxORr_BRj5YmbvxPISKQNxK-HLN3KZiJGl3N8uZXRjqXZQTbgn7FyVicn_DoW6XyhU3j37h76LDQaLpbF3ICHJKhrKo10g-4um2ouKIJGeo5kPD5EQOs0Fkm4__NZjuK90U1a1V09fK-kGmDx6p2qgCru3OBK4YcEzQLmzU7lzWM_oHpwNSaUOxgROaocMGOrl2M7TaU8ol0kMnD--s9Ogt9PU1O_BMD_ziOwsUTpXoHX4QKQtho"
axios.defaults.headers.common['Authorization'] = `Bearer ${basalamApiToken}`;

export const addToBasket = async (product) => {
    try {
        const payload = {
            quantity: 1, // You can adjust the quantity as needed
            product_id: product.id,
            variation_id: null,
        };

        const response = await axios.post(
            'https://order.basalam.com/basket/item?light=true',
            payload
        );
        document.getElementById('my_modal_3').showModal()

    }
    catch (error) {
        console.error("Error adding item to basket:", error.message);
    }
};

export const deleteItem = (itemId) => {
    axios.delete(`https://order.basalam.com/basket/item/${itemId}`)
        .then(response => {
            // Handle successful deletion, if needed
        })
        .catch(error => {
            setError(error.message);
            // Handle error, if needed
        });
};

export const incrementInBasket = (product,setBasket,setError) => {
    axios.post("https://order.basalam.com/basket/item?light=false", {
            product_id: product?.id,
            quantity: product?.quantity,
            variation_id: null
        },
    )
        .then(response => {
            // Fetch the updated basket summary after successfully adding an item
            axios.get("https://order.basalam.com/basket/summary",
            )
                .then(res => {
                    setBasket(prevBasket => ({ ...prevBasket, ...res.data }));
                })
                .catch(err => {
                    console.log(err.message)
                    // setError(err.message);
                });
        })
        .catch(error => {
            setError(error.message);
        });
};

export const deleteFromBasket = (product,setBasket,setError) => {
    axios.post("https://order.basalam.com/basket/item?light=false", {
            product_id: product?.id,
            quantity: -1,
            variation_id: null
        },
    )
        .then(response => {
            // Fetch the updated basket summary after successfully adding an item
            axios.get("https://order.basalam.com/basket/summary",
            )
                .then(res => {
                    setBasket(prevBasket => ({ ...prevBasket, ...res.data }));
                })
                .catch(err => {
                    console.log(err.message)
                });
        })
        .catch(error => {
            setError(error.message);
        });
};
const SIZE = 48;


export const fetchProductList = async ({ pageParam, isBestSellerEnabled, isFreeDeliveryEnabled }) => {
    try {
      const response = await axios.get(
        "https://search.basalam.com/ai-engine/api/v2.0/product/search",
        {
          params: {
            from: pageParam * SIZE,
            "f.vendorScore": isBestSellerEnabled,
            "f.freeShipping": isFreeDeliveryEnabled,
            "filters.slug": "handmade-leather-accessory",
            dynamicFacets: true,
            size: SIZE,
            adsImpressionDisable: false,
            userCityId: 1722,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  