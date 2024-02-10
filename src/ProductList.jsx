// ProductList.js
import React, {useEffect, useState} from 'react';
import {useMutation, useQuery} from "@tanstack/react-query";
import {Link} from "react-router-dom";
import axios from "axios";
import Switch from '@mui/material/Switch';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import {addToBasket, useFilterBasedOnBestSeller, useFilterBasedOnDelivery, useGetAllProduct} from "./api.js";

const ProductList = () => {
    const [displayedProduct , setDisplayedProduct] = useState([])
    const [originalProductList, setOriginalProductList ]=useState([])
    const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = useState(localStorage.getItem("freeTravel "));
    const [isBestSellerEnabled, setIsBestSellerEnabled] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    //fetch data and get items
    const { isLoading, error, data: productss } = useGetAllProduct(setOriginalProductList,setDisplayedProduct)
    //add to basket
    const handleAddToBasket = (product) => {
        addToBasket(product);
    };

    // const {mutate} = usePostCard()
    // const handelAdd =(card)=>{
    //     const payload = {
    //         quantity: 1, // You can adjust the quantity as needed
    //         product_id: card.id,
    //         variation_id: null,
    //     };
    //     mutate(payload)
    // }

    // filter based on free delivery
    const { isLoading: delivery, error: deliveryError, data: freeDeliveryProducts} = useFilterBasedOnDelivery(isFreeDeliveryEnabled);
    // filter based on bestseller
    const {isLoading:bestSeller, error:bestSellerError, data: bestSellerProducts}=useFilterBasedOnBestSeller(isFreeDeliveryEnabled,isBestSellerEnabled)

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
                            }}/>
                            <p>ارسال رایگان</p>
                        </div>
                        <div className="w-full border-2 rounded-box flex justify-between items-center p-2">
                            <Switch {...label} onChange={() => {
                                setIsBestSellerEnabled(!isBestSellerEnabled);
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
                                // <ProductCard product={product} key={product.id}/>
                                <div className="card w-72 bg-base-100 shadow-xl image-full" key={product?.id}>
                                    <figure><img src={product?.photo?.MEDIUM} alt="Shoes"/></figure>

                                    <div className="card-body items-center justify-between py-16  text-center">
                                        <h2 className="card-title">{product?.name}</h2>
                                        <div className="flex gap-3">
                                            <p>تومان</p>
                                            <p> {product?.price} </p>
                                        </div>

                                        <div className="card-actions justify-end">
                                            <button className="btn btn-primary btn-sm" onClick={() => {
                                                handleAddToBasket(product)
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

