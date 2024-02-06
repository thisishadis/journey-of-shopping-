import React from 'react';
import { useEffect, useState } from "react"
import axios from "axios";
import {Link, useParams} from "react-router-dom";
function Product(props) {
    const [product, setProduct] = useState({});
    const [error, setError] = useState('');
    const {productId}  = useParams();
    const lala = Number(productId);

    useEffect(() => {
        axios
            .get(`https://core.basalam.com/api_v2/product/${lala}`,
                )
            .then((res) => setProduct(res.data))
            .catch(err => {
                setError(err.message);
            });
    }, [lala]);
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
            );
            document.getElementById('my_modal_3').showModal()

        } catch (error) {
            console.error("Error adding item to basket:", error.message);
        }
    };
    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className=" flex flex-col justify-center items-center p-10">
            {error && <p className="text-danger">{error}</p>}
            <div className="w-[50%] mockup-browser border bg-base-300 px-8 py-8">
                <div className="flex gap-2">
                    <img className="rounded-box" src={product?.photo?.small}/>
                    <div className="flex flex-col gap-4 justify-center items-center px-4 py-16 bg-base-200">
                        <h1> {product.title}🛒</h1>
                        <div className="flex gap-3">
                            <p>تومان</p>
                            <p> {product.price} </p>
                        </div>
                        <p>{product.description}</p>
                        <div className="w-full flex justify-center gap-10 items-center">
                            <Link to={"/"} className="btn btn-outline btn-primary">بازگشت</Link>
                            <button className="btn btn-primary" onClick={() => {
                                addToBasket(product);
                            }}>افزودن به سبد
                            </button>
                        </div>

                    </div>
                </div>
            </div>
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
}


export default Product;