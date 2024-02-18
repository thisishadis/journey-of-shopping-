// ProductList.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Switch from "@mui/material/Switch";
const label = { inputProps: { "aria-label": "Switch demo" } };
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ProductCard from "./ProductCard.jsx";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import { fetchProductList } from "./api.js";
const ProductList = () => {
  const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = useState(false);
  const [isBestSellerEnabled, setIsBestSellerEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { ref, inView } = useInView();

  const SIZE = 48;
  const LIMIT = 6366;
  //new
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    data,
    isSuccess,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["key", isBestSellerEnabled, isFreeDeliveryEnabled],
    queryFn: ({ pageParam }) =>
      fetchProductList({
        pageParam,
        isBestSellerEnabled,
        isFreeDeliveryEnabled,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? false,
  });
  // console.log("data", data);

  //new
  const content =
    isSuccess &&
    data.pages.map((page, j) =>
      page.products.map((product, i) => {
        // console.log(data.pages.length, page.products.length, i, j);
        if (data.pages.length * page.products.length === (i + 1) * (1 + j)) {
          // return <div ref={ref}>{product.name}</div>;
          return <ProductCard ref={ref} product={product} key={product.id} />;
        }
        return <ProductCard product={product} key={product.id} />;
      })
    );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-2 sticky top-0 bg-white">
        <div className="flex  gap-2 border items-center w-[10rem]">
          <Switch
            {...label}
            onChange={() => {
              return setIsFreeDeliveryEnabled(!isFreeDeliveryEnabled);
            }}
          />
          ارسال رایگان
        </div>
        <div className="flex  gap-2 border items-center w-[10rem]">
          <Switch
            {...label}
            onChange={() => {
              return setIsBestSellerEnabled(!isBestSellerEnabled);
            }}
          />
          غرفه برتر
        </div>
        <Link to="/basket" className="btn">
          سبد خرید →
        </Link>
      </div>

      {content}
      {isFetchingNextPage && (
        <h3 className="bg-red-100 h-[100px]">Loading...</h3>
      )}
      {isLoading && <h3 className="bg-red-100 h-[100px]">Loading...</h3>}
    </div>
  );
};

export default ProductList;
