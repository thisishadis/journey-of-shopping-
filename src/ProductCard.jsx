import React from "react";
import { addToBasket } from "./api";
import { Link } from "react-router-dom";

const ProductCard = React.forwardRef(({ product }, ref) => {
  const handleAddToBasket = () => {
    addToBasket(product);
  };
  const productContent = (
    <div className="p-2 border flex flex-row gap-4 items-center">
      <h2>{product.name}</h2>
      <Link to={`/products/${product.id}`} className="btn">مشاهده </Link>
      <button className="btn" onClick={handleAddToBasket}>
        افزودن به سبد
      </button>
      {/*dialog*/}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">تبریک میگم!</h3>
          <p className="py-4">خریدت به سبد اضافه شد:)</p>
        </div>
      </dialog>
    </div>
  );
  const content = ref ? (
    <article className="article" ref={ref}>
      {productContent}
    </article>
  ) : (
    <article className="article">{productContent}</article>
  );
  return content;
});

export default ProductCard;
