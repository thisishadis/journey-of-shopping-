// ProductList.js
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import axios from "axios";
import Switch from '@mui/material/Switch';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const ProductList = () => {
    const [displayedProduct , setDisplayedProduct] = useState([])
    const [originalProductList, setOriginalProductList ]=useState([])
    const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = useState(false);
    const [isBestSellerEnabled, setIsBestSellerEnabled] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");

    const basalamApiToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6ImU0MTJlNzE0OGFkOGNmMmU4YjgwYjUyNDZmMWVlNTEzMjBjZjM5YWE3NzZlMDlmZDYwZTUzYjM4M2E2NTQ3YmQ0OTU3YWY5OTNkZmI3NGFiIiwiaWF0IjoxNzA1MzIwNzQ0LjA3Mjk4MywibmJmIjoxNzA1MzIwNzQ0LjA3Mjk4OCwiZXhwIjoxNzM2OTQzMTQ0LjA1MDg0Mywic3ViIjoiMTMxNjYzMTEiLCJzY29wZXMiOltdLCJ1c2VyX2lkIjoxMzE2NjMxMX0.HrQlsuod1BsfsHy_ML5reebKHdCsZD8SPhNnAYuZm8MgeXhyrAOHuhN45TdDAiXTT4s5Jqye2A1bc4OBdiq3-zGDKMj5tULGvLRZY02lVl-D55Vs_1KCxkGTcwMW_Blf7sAIrNgZVkMEIheB9GwfdS7H5s4P7LOlKzBtZVDymxWbiJDwAB4o0pjYb5XMzFsnGeIkPrfJcLvdOsKO-eEJG_KMVmcfk2Fu-NETUI0LOjs7CLZYJd96VbAO4JPfunsqBUUGFcV4WYd3ymAveK4u71kdj1Y0d_o-CNRWCCn8J92ROOPtsI7Ro3SQcI5z47SEnHh2K4ghNLS87lhycFMfI12ZR1fvuRRnEXBhVTWNMOdKQlD7flvMRWUJJE8-Os9ALz4Q_n87qVDr1HWUdau2KYApwxZuWo9VPXNTiUW6Y4I-V49C-KE3I9rYxORr_BRj5YmbvxPISKQNxK-HLN3KZiJGl3N8uZXRjqXZQTbgn7FyVicn_DoW6XyhU3j37h76LDQaLpbF3ICHJKhrKo10g-4um2ouKIJGeo5kPD5EQOs0Fkm4__NZjuK90U1a1V09fK-kGmDx6p2qgCru3OBK4YcEzQLmzU7lzWM_oHpwNSaUOxgROaocMGOrl2M7TaU8ol0kMnD--s9Ogt9PU1O_BMD_ziOwsUTpXoHX4QKQtho"

    //fetch data and get items
    const { isLoading, error, data: productss } = useQuery({
        queryKey: ['myData'],
        queryFn: async () => {
           try {
        const response = await axios.get('https://search.basalam.com/ai-engine/api/v2.0/product/search?from=0&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=48&adsImpressionDisable=false', {
            headers: {
                'Authorization': `Bearer ${basalamApiToken}`,
            }
        });
        console.log("API response:", response.data);
        setOriginalProductList(response.data)
        setDisplayedProduct(response.data); // Update state
        return response.data; // Return data for the query
    } catch (error) {
        throw new Error(`Error fetching data: ${error.message}`);
    }
        },
        select: (res) => res.data,
    });

    //add to basket query and axios
    //post item
    const addToBasket = async (product) => {
        try {
            const payload = {
                quantity: 1, // You can adjust the quantity as needed
                product_id: product.id,
                variation_id: null,
            };

            const response = await axios.post(
                'https://order.basalam.com/basket/item?light=true',
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${basalamApiToken}`,
                    },
                }
            );
            document.getElementById('my_modal_3').showModal()

        } catch (error) {
            console.error("Error adding item to basket:", error.message);
        }
    };
    // filter based on free delivery
    const {isLoading:delivery, error:deliveryError, data: freeDeliveryProducts} = useQuery({
        queryKey: ['freeDeliveryProducts'],
        queryFn: () =>
            axios.get(
                'https://search.basalam.com/ai-engine/api/v2.0/product/search?from=0&f.freeShipping=true&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=48&adsImpressionDisable=false&userCityId=1722',
                {
                    headers: {
                        // 'Origin': 'https://basalam.com',
                        'Authorization': `Bearer ${basalamApiToken}`,
                    }
                }
            ),
        select:(res)=>res.data
    })
    // flter based on bestseller
    const {isLoading:bestSeller, error:bestSellerError, data: bestSellerProducts} = useQuery({
        queryKey: ['freeDeliveryProducts'],
        queryFn: () =>
            axios.get(
                'https://search.basalam.com/ai-engine/api/v2.0/product/search?from=0&f.freeShipping=false&f.vendorScore=true&filters.slug=handmade-leather-accessory&dynamicFacets=true&size=48&adsImpressionDisable=false&userCityId=1722',
                {
                    headers: {
                        // 'Origin': 'https://basalam.com',
                        'Authorization': `Bearer ${basalamApiToken}`,
                    }
                }
            ),
        select:(res)=>res.data
    })
    useEffect(() => {
        // Function to update displayed products based on filters
        const updateDisplayedProducts = () => {
            let updatedProducts;
            if (isFreeDeliveryEnabled && isBestSellerEnabled){
                updatedProducts = freeDeliveryProducts || bestSellerProducts
            }
            else if (isFreeDeliveryEnabled) {
                updatedProducts = freeDeliveryProducts;
            } else if (isBestSellerEnabled) {
                updatedProducts = bestSellerProducts;
            } else {
                updatedProducts = productss;
                updatedProducts = originalProductList
            }

            setDisplayedProduct(updatedProducts?.products);
        };

        updateDisplayedProducts();
    }, [isFreeDeliveryEnabled, isBestSellerEnabled, searchQuery, originalProductList, freeDeliveryProducts, bestSellerProducts]);

    useEffect(() => {
        let updatedProducts;
        // Filter products based on the search query
        if (originalProductList) {
            updatedProducts = originalProductList?.products?.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setDisplayedProduct(updatedProducts);
        console.log(updatedProducts, "displayed in search");
    }, [searchQuery, originalProductList]);

    // if (isLoading) return <span className="loading loading-dots loading-lg"></span>
    if (error) return 'An error has occurred: ' + error.message

    return (

        <div className="flex flex-col items-center gap-10 justify-center w-full ">
            <div className="flex items-center justify-center items-center gap-60 pt-10 ">
                <h2 className="text-lg font-bold">لیست محصولات</h2>
                <Link to="/basket" className="btn">سبد خرید →
                    <div className="badge badge-secondary">+99 کالا</div>
                </Link>
            </div>
            {isLoading ? (
                <div className="w-[80%] mt-36 flex items-center justify-center">
                    {/*<span className="loading loading-dots loading-lg"></span>*/}
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress />
                    </Box>
                </div>
            ) : (
                <div className="grid grid-cols-5 gap-4">
                    <div className="h-screen sticky top-0 flex flex-col gap-2">
                        <div className="w-full border-2 rounded-box flex justify-between items-center p-2">
                            <Switch {...label} onChange={() => {
                                setIsFreeDeliveryEnabled(!isFreeDeliveryEnabled);
                                defaultChecked = {isFreeDeliveryEnabled}

                            }}/>
                            <p>ارسال رایگان</p>
                        </div>
                        <div className="w-full border-2 rounded-box flex justify-between items-center p-2">
                            <Switch {...label} onChange={() => {
                                setIsBestSellerEnabled(!isBestSellerEnabled);
                                defaultChecked = {isBestSellerEnabled}
                            }}/>
                            <p>غرفه ی برتر</p>
                        </div>
                        {/* Search input */}
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="p-2 border rounded"
                        />
                    </div>
                    {Array.isArray(displayedProduct) && displayedProduct.length > 0 ? (
                        <div className="col-span-4 grid md:grid-cols-4 gap-4 grid-cols-2">
                            {displayedProduct.map((product) => (
                                <div key={product.id} className="card w-72 bg-base-100 shadow-xl image-full">
                                    <figure><img src={product.photo.MEDIUM} alt="Shoes"/></figure>

                                    <div className="card-body items-center justify-between py-16  text-center">
                                        <h2 className="card-title">{product.name}</h2>
                                        <div className="flex gap-3">
                                            <p>تومان</p>
                                            <p> {product.price} </p>
                                        </div>

                                        <div className="card-actions justify-end">
                                            <button className="btn btn-primary btn-sm" onClick={() => {
                                                addToBasket(product);
                                                // postOneProduct.mutate(product)
                                                // addToBasket(product)
                                            }}> افزودن به سبد
                                            </button>
                                            <Link to={`/products/${product.id}`} className="btn btn-sm">مشاهده </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center mt-10 col-span-4 grid md:grid-cols-4 gap-4 grid-cols-2">
                            <p className="text-xl font-bold">کالایی یافت نشد.</p>
                        </div>
                    )}


                </div>
            )}
            {/*dialog*/}
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="font-bold text-lg">تبریک میگم!</h3>
                    <p className="py-4">خریدت به سبد اضافه شد:)</p>
                </div>
            </dialog>
        </div>
    );
};

export default ProductList;

