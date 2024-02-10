import React from 'react';
import {addToBasket} from "./api.js";
import {Link} from "react-router-dom";
import axios from "axios";

function ProductCard(product) {
    const addToBasket = async (product) => {
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

        } catch (error) {
            console.error("Error adding item to basket:", error.message);
        }
    };
    let id = product?.id
    console.log(id , "id")
    return (
        <div className="card w-72 bg-base-100 shadow-xl image-full">
            <figure><img src={product?.photo?.MEDIUM} alt="Shoes"/></figure>

            <div className="card-body items-center justify-between py-16  text-center">
                <h2 className="card-title">{product?.name}</h2>
                <div className="flex gap-3">
                    <p>تومان</p>
                    <p> {product?.price} </p>
                </div>

                <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm" onClick={() => {
                        addToBasket(product)
                    }}> افزودن به سبد
                    </button>
                    <Link to={`/products/${product.id}`} className="btn btn-sm">مشاهده </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;