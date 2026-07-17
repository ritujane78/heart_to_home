import { useEffect, useState } from "react";
import { Package, User, Mail, Phone, Heart, CreditCard } from "lucide-react";
import './UpdateOrderStatus.css'
import api from "../../services/api";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {BallTriangle} from "react-loader-spinner"

const STATUS_OPTIONS = [
  "IN_PROCESS",
  "READY_FOR_CLINIC",
  "DELIVERED",
  "CANCELED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [updateMessages, setUpdateMessages] = useState({});
  const [updatingOrders, setUpdatingOrders] = useState({});
  const [page, setPage] = useState(1);
  const ordersPerPage = 3;

  useEffect(() => {
    fetchOrders();
  }, []);

const fetchOrders = async () => {
  try {
    const response = await api.get("/orders");

    setOrders(response.data);

    const statuses = {};
    response.data.forEach((order) => {
      statuses[order.id] = order.orderStatus;
    });
    setSelectedStatuses(statuses);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const updateStatus = async (orderId) => {
  setUpdatingOrders((prev) => ({
    ...prev,
    [orderId]: true,
  }));

  try {
    const newStatus = selectedStatuses[orderId];

    await api.put(`/orders/${orderId}/status`, {
      orderStatus: newStatus,
    });

    const updatedOrder = orders.find((order) => order.id === orderId);

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, orderStatus: newStatus }
          : order
      )
    );

    setUpdateMessages((prev) => ({
      ...prev,
      [orderId]: updatedOrder?.senderEmail
        ? `✅ Status updated successfully. Email sent to ${updatedOrder.senderEmail}.`
        : "✅ Status updated successfully.",
    }));

  } catch (err) {
    console.error(err);

    setUpdateMessages((prev) => ({
      ...prev,
      [orderId]: "❌ Unable to update status.",
    }));
  } finally {
    setUpdatingOrders((prev) => ({
      ...prev,
      [orderId]: false,
    }));
  }
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
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#1e5146"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
        <span className="mt-4 text-lg text-gray-600">
          Please wait...
        </span>
      </div>
    );
  }

  return (
  <div className="admin-orders max-w-6xl mx-auto px-6 py-8">

    <h2 className="text-3xl font-bold mb-8 text-center">
      Gift Orders
    </h2>

    {orders.length === 0 ? (
  <div className="bg-white rounded-xl shadow-md border border-gray-200 py-16 px-8 text-center">
    <Package className="mx-auto mb-4 h-14 w-14 text-gray-400" />

    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
      No orders yet
    </h3>

    <p className="text-gray-600">
      There are currently no gift orders.
    </p>
  </div>
) : (
  paginatedOrders.map((order) => (
      <div
        key={order.id}
        className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200"
      >

        <div className="flex items-center gap-3 mb-6">
          <Package size={22} />
          <h3 className="text-xl font-semibold">
            Order #{order.id}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div>
            <h4 className="font-semibold mb-3">Recipient</h4>

            <p className="flex items-center gap-2 mb-2">
              <User size={16} />
              {order.recipientName}
            </p>

            <p className="flex items-center gap-2 mb-2">
              <Phone size={16} />
              {order.recipientPhone}
            </p>

            <p className="flex items-center gap-2 mb-2">
              <Mail size={16} />
              {order.recipientEmail}
            </p>

            <p className="flex items-center gap-2">
              <Heart size={16} />
              {order.relationship}
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Sender</h4>

            <p className="mb-2">{order.senderName}</p>
            <p className="mb-2">{order.senderEmail}</p>
            <p>{order.message}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Payment</h4>

            <p className="flex items-center gap-2 mb-2">
              <CreditCard size={16} />
              {order.totalPrice}
            </p>

            <p>
              Ordered:
              <br />
              {moment(order.orderedAt).format(
                    "MMMM DD, YYYY")}
            </p>
          </div>

        </div>

        <div className="mt-8">
          <h4 className="font-semibold mb-2">Services</h4>

          <ul className="list-disc list-inside space-y-1">
            {order.serviceIds.map((service) => (
              <li key={service.id}>{service.title}</li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t pt-6">

          <div className="flex items-center gap-4">

            <label className="font-semibold">
              Status
            </label>

            <select
              className="border rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatuses[order.id] || order.orderStatus}
              onChange={(e) =>
                setSelectedStatuses((prev) => ({
                  ...prev,
                  [order.id]: e.target.value,
                }))
              }
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>

          </div>

          {updateMessages[order.id] && (
            <div
              className={`text-sm font-medium text-center ${
                updateMessages[order.id].startsWith("✅")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {updateMessages[order.id]}
            </div>
          )}

          <button
            className={`font-medium px-8 py-2 rounded-md transition ${
              updatingOrders[order.id]
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1e5146] hover:bg-blue-700 text-white"
            }`}
            disabled={updatingOrders[order.id]}
            onClick={() => updateStatus(order.id)}
          >
            {updatingOrders[order.id] ? "Updating..." : "Update Status"}
          </button>

        </div>
      </div>
    ))
  )}
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
);
}