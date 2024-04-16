import NavLink from "@/components/NavLink";

export default function Sidebar() {
  return (
    <nav className="bg-gray-900 w-64 min-h-[100vh]">
      <div className="flex items-center justify-center mt-10">
        <span className="text-white text-2xl font-semibold">Admin</span>
      </div>
      <ul className="mt-10">
        <li>
          <NavLink href={{ pathname: "/admin/products" }}>Products</NavLink>
        </li>
        <li>
          <NavLink href={{ pathname: "/admin/orders" }}>Orders</NavLink>
        </li>
        <li>
          <NavLink href={{ pathname: "/admin/customers" }}>Customers</NavLink>
        </li>
      </ul>
    </nav>
  );
}
