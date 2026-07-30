import { useEffect, useState } from "react";
import api from "../services/api";
import {
  Package,
  Calendar,
  MapPin,
  Phone,
  User,
  CreditCard,
  LeafyGreen,
  Heart,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

function MyOrdersPage({
  exchangeRates,
  selectedCurrency
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ordersPerPage = 3;


  useEffect(() => {
    fetchOrders();
}, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/my-orders`);
      setOrders(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount, sCurrency, exchangeRate = 1) => {
    const convertedAmount = amount * exchangeRate;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: sCurrency,
    }).format(convertedAmount);
  };
  const totalPages = Math.ceil(orders.length / ordersPerPage);

const paginatedOrders = orders.slice(
  (page - 1) * ordersPerPage,
  page * ordersPerPage
);
const handlePageChange = (event, value) => {
  setPage(value);
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="mb-8 text-3xl font-bold text-gray-800 text-center">
        My Orders
      </h2>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-96 bg-white rounded-xl shadow">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#1e5146"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
          <span className="mt-3 text-gray-600 text-lg">
            Please wait...
          </span>
        </div>
      ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500">
              No orders, yet! Buy healthcare services for your loved ones{" "}
              <NavLink
                to="/services"
                className="text-[#1e5146] font-semibold hover:underline"
              > 
                here
              </NavLink>.
            </p>
          </div>
        ) : (
          <div className="space-y-8">          
          {paginatedOrders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl bg-white shadow transition hover:shadow-lg"
              >
                {/* Header */}
                <div
                  className={`flex items-center justify-between ${
                    order.orderStatus === "DELIVERED"
                      ? "bg-[#1e5146]"
                      : order.orderStatus === "CANCELED"
                      ? "bg-red-500"
                      : order.orderStatus === "IN_PROCESS"
                      ? "bg-yellow-500" 
                      : "bg-lime-500"
                  } px-6 py-4 text-white`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={22} />
                    <h3 className="text-xl font-semibold">
                      Order #{order.id}
                    </h3>
                  </div>
                  <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-semibold backdrop-blur-sm">
                    {order.orderStatus}
                  </span>
                </div>

                {/* Order Details */}
                <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">

                  <div className="flex gap-3">
                    <User className="mt-1 text-[#1e5146]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Recipient</p>
                      <p className="font-medium">
                        {order.recipientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="mt-1 text-[#1e5146]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{order.recipientPhone}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Heart className="mt-1 text-[#1e5146]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Relationship</p>
                      <p>{order.relationship}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Calendar className="mt-1 text-[#1e5146]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Ordered At</p>
                      <p>
                        {moment(order.orderedAt).format("MMMM DD, YYYY")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <CreditCard className="mt-1 text-[#1e5146]" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-lg font-bold text-green-600">
                        {order.totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Message */}
<div className="border-t  px-6 py-5">

  <div className="rounded-lg border border-emerald-200 bg-white p-4">
    {order.message?.trim() ? (
      <p className="whitespace-pre-wrap text-gray-700">
        {order.message}
      </p>
    ) : (
      <p className="italic text-gray-500">
        No personal message was included with this order.
      </p>
    )}
  </div>
</div>

                {/* Services */}
                <div className="border-t bg-gray-50 px-6 py-5">
                  <h4 className="mb-4 text-lg font-semibold text-gray-700">
                    Services
                  </h4>

                  {order.services?.length > 0 ? (
                    <div className="space-y-3">
                      {order.services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between rounded-lg bg-white px-4 py-3"
                        >
                          <span className="font-medium text-gray-700">
                            {service.title}
                          </span>

                          <span className="font-semibold text-[#1e5146]">
                            {formatMoney(service.price, order.currency, order.exchangeRate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No services available.
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div className="flex justify-end mt-8">
              <Stack spacing={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  shape="rounded"
                  siblingCount={1}
                  boundaryCount={1}
                />
              </Stack>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;