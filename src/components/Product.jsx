import React from 'react';
import { useEffect, useState } from "react"
import axios from "axios";
import {Link, useParams} from "react-router-dom";
function Product(props) {
    const [product, setProduct] = useState({});
    const [error, setError] = useState('');
    const {productId}  = useParams();
    const lala = Number(productId);
    const basalamApiToken ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6ImU0MTJlNzE0OGFkOGNmMmU4YjgwYjUyNDZmMWVlNTEzMjBjZjM5YWE3NzZlMDlmZDYwZTUzYjM4M2E2NTQ3YmQ0OTU3YWY5OTNkZmI3NGFiIiwiaWF0IjoxNzA1MzIwNzQ0LjA3Mjk4MywibmJmIjoxNzA1MzIwNzQ0LjA3Mjk4OCwiZXhwIjoxNzM2OTQzMTQ0LjA1MDg0Mywic3ViIjoiMTMxNjYzMTEiLCJzY29wZXMiOltdLCJ1c2VyX2lkIjoxMzE2NjMxMX0.HrQlsuod1BsfsHy_ML5reebKHdCsZD8SPhNnAYuZm8MgeXhyrAOHuhN45TdDAiXTT4s5Jqye2A1bc4OBdiq3-zGDKMj5tULGvLRZY02lVl-D55Vs_1KCxkGTcwMW_Blf7sAIrNgZVkMEIheB9GwfdS7H5s4P7LOlKzBtZVDymxWbiJDwAB4o0pjYb5XMzFsnGeIkPrfJcLvdOsKO-eEJG_KMVmcfk2Fu-NETUI0LOjs7CLZYJd96VbAO4JPfunsqBUUGFcV4WYd3ymAveK4u71kdj1Y0d_o-CNRWCCn8J92ROOPtsI7Ro3SQcI5z47SEnHh2K4ghNLS87lhycFMfI12ZR1fvuRRnEXBhVTWNMOdKQlD7flvMRWUJJE8-Os9ALz4Q_n87qVDr1HWUdau2KYApwxZuWo9VPXNTiUW6Y4I-V49C-KE3I9rYxORr_BRj5YmbvxPISKQNxK-HLN3KZiJGl3N8uZXRjqXZQTbgn7FyVicn_DoW6XyhU3j37h76LDQaLpbF3ICHJKhrKo10g-4um2ouKIJGeo5kPD5EQOs0Fkm4__NZjuK90U1a1V09fK-kGmDx6p2qgCru3OBK4YcEzQLmzU7lzWM_oHpwNSaUOxgROaocMGOrl2M7TaU8ol0kMnD--s9Ogt9PU1O_BMD_ziOwsUTpXoHX4QKQtho"

    useEffect(() => {
        axios
            .get(`https://core.basalam.com/api_v2/product/${lala}`,
                {
                    headers: {
                        'Authorization': `Bearer ${basalamApiToken}`,
                    },
                }
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