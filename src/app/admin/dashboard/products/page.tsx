// import Action from "@/components/Action";
// import { Card } from "../../_components/ui/Card";
// import Image from "next/image";
import { Metadata } from "next";
import PageTitle from "../../_components/PageTitle";

export const metadata: Metadata = {
  title: "Products",
};

// const dummyProducts = [
//   {
//     id: 1,
//     name: "Product 1",
//     description: "Lorem ipsum",
//     price: 100,
//   },
//   {
//     id: 2,
//     name: "Product 2",
//     description: "Lorem ipsum",
//     price: 200,
//   },
// ];

export default function ProductsPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex justify-between gap-4 mb-4">
        <PageTitle>Products</PageTitle>

        {/* <Action
          actiontype="link"
          href={{ pathname: "/admin/dashboard/products/new" }}
          variant="primary"
        >
          Add Product
        </Action> */}
      </div>

      {/* <Products /> */}
    </div>
  );
}

// function Products() {
//   return (
//     <Card>
//       <div className="grid grid-cols-[2fr_2fr_1fr] border-b border-b-slate-100 px-6 py-2">
//         <span className="text">Product</span>
//         <span className="text">Description</span>
//         <span className="text">Price</span>
//       </div>
//       <div className="flex flex-col gap-5 py-5 px-6">
//         {dummyProducts.map((product) => (
//           <div
//             key={product.id}
//             className="grid grid-cols-[2fr_2fr_1fr] items-center"
//           >
//             <div className="flex items-center gap-2">
//               <Image
//                 src="/images/placeholder-image.jpg"
//                 alt={product.name}
//                 width={80}
//                 height={80}
//               />
//               <h3>{product.name}</h3>
//             </div>
//             <p>{product.description}</p>
//             <p>{product.price}</p>
//             {/* <Action
//               actiontype="link"
//               href={{
//                 pathname: `/admin/dashboard/products/edit/${product.id}`,
//               }}
//               variant="primary"
//               className="text-sm mr-auto"
//             >
//               Edit
//             </Action> */}
//           </div>
//         ))}
//       </div>
//     </Card>
//   );
// }
