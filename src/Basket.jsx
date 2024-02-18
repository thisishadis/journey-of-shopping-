import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";
import {deleteFromBasket, deleteItem, incrementInBasket} from "./api.js";

export default function Basket(props) {
    const basalamApiToken ="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6ImU0MTJlNzE0OGFkOGNmMmU4YjgwYjUyNDZmMWVlNTEzMjBjZjM5YWE3NzZlMDlmZDYwZTUzYjM4M2E2NTQ3YmQ0OTU3YWY5OTNkZmI3NGFiIiwiaWF0IjoxNzA1MzIwNzQ0LjA3Mjk4MywibmJmIjoxNzA1MzIwNzQ0LjA3Mjk4OCwiZXhwIjoxNzM2OTQzMTQ0LjA1MDg0Mywic3ViIjoiMTMxNjYzMTEiLCJzY29wZXMiOltdLCJ1c2VyX2lkIjoxMzE2NjMxMX0.HrQlsuod1BsfsHy_ML5reebKHdCsZD8SPhNnAYuZm8MgeXhyrAOHuhN45TdDAiXTT4s5Jqye2A1bc4OBdiq3-zGDKMj5tULGvLRZY02lVl-D55Vs_1KCxkGTcwMW_Blf7sAIrNgZVkMEIheB9GwfdS7H5s4P7LOlKzBtZVDymxWbiJDwAB4o0pjYb5XMzFsnGeIkPrfJcLvdOsKO-eEJG_KMVmcfk2Fu-NETUI0LOjs7CLZYJd96VbAO4JPfunsqBUUGFcV4WYd3ymAveK4u71kdj1Y0d_o-CNRWCCn8J92ROOPtsI7Ro3SQcI5z47SEnHh2K4ghNLS87lhycFMfI12ZR1fvuRRnEXBhVTWNMOdKQlD7flvMRWUJJE8-Os9ALz4Q_n87qVDr1HWUdau2KYApwxZuWo9VPXNTiUW6Y4I-V49C-KE3I9rYxORr_BRj5YmbvxPISKQNxK-HLN3KZiJGl3N8uZXRjqXZQTbgn7FyVicn_DoW6XyhU3j37h76LDQaLpbF3ICHJKhrKo10g-4um2ouKIJGeo5kPD5EQOs0Fkm4__NZjuK90U1a1V09fK-kGmDx6p2qgCru3OBK4YcEzQLmzU7lzWM_oHpwNSaUOxgROaocMGOrl2M7TaU8ol0kMnD--s9Ogt9PU1O_BMD_ziOwsUTpXoHX4QKQtho"
    const [basket, setBasket] = useState([]);
    const [loading, setLoading] = useState(true);

    if (!basalamApiToken) {
        console.error("basalamApiToken is missing or undefined");
        return;
    }
    useEffect(() => {
        axios
            .get("https://order.basalam.com/basket?refresh=true",
            )
            .then((res) => {
                setBasket(prevBasket => ({ ...prevBasket, ...res.data }));
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });

    }, [basket]);


    const incrementInBasketHandler=(product)=>{
        incrementInBasket(product)
    }

    const deleteFromBasketHandler  =(product, setBasket)=>{
        deleteFromBasket(product, setBasket)
    }
    return (
        <div className="w-full flex items-center flex-col justify-center gap-10 my-10">
            {loading ? (
                <span className="loading loading-dots loading-lg"></span>

            ) : (
                <div className="w-full flex flex-col">
                    <Link to={"/"} className="w-16 mx-2">
                        ⬅️</Link>
                    {basket.vendors && basket.vendors.map((vendor, index) => (
                        <div key={index} className="flex flex-col gap-10 p-2 m-2 px-32">
                            <h2 className="badge badge-primary badge-outline p-2">غرفه ی {vendor.title}</h2>
                            {vendor.items && vendor.items.map((item, itemIndex) => {
                                return (
                                    <div className="flex  justify-between px-32" key={itemIndex}>
                                        <div className="flex  gap-4">
                                            <div className="join">
                                                <button className="btn join-item" onClick={() => {
                                                    deleteFromBasketHandler(item?.product);
                                                }}> -
                                                </button>
                                                <button className="btn join-item">{item.quantity}</button>
                                                <button className="btn join-item" onClick={() => {
                                                    incrementInBasketHandler(item?.product);
                                                }}> +
                                                </button>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="btn" onClick={() => deleteItem(item.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16"
                                                         height="16"
                                                         viewBox="0 0 24 24">
                                                        <path
                                                            d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p> {item.title}</p>
                                        <div className="flex gap-2">
                                            <p>تومان</p>
                                            <p>{item.price}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            )}
            <div className="stats shadow">
                <div className="stat">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">تخفیف</div>
                    <div className="stat-value text-primary">{basket?.costs?.total?.discount}</div>
                    <div className="stat-desc">ریال</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                             className="inline-block w-8 h-8 stroke-current">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                    </div>
                    <div className="stat-title">مبلغ قابل پرداخت</div>
                    <div className="stat-value text-secondary">{basket?.costs?.total?.grand}</div>
                    <div className="stat-desc">ریال</div>
                </div>

                <div className="stat">
                    <div className="stat-figure text-secondary">

                    </div>
                    <div className="stat-value"></div>
                    <div className="stat-title btn btn-sm">تایید و ادامه</div>
                    <div className="stat-desc text-secondary">
                        تسویه با غرفه‌دار فقط بعد از رضایت مشتری</div>
                </div>

            </div>
        </div>
    );
}


