import React from 'react';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ProductList from "./ProductList";
import Product from "./components/Product.jsx";
import Basket from "./Basket.jsx";
const queryClient = new QueryClient()
export default function App(props) {

    return (
        <QueryClientProvider client={queryClient}>
            <ProductList/>
        </QueryClientProvider>
    );
}