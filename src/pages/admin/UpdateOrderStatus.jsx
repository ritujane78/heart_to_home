import { useEffect, useState } from "react";
import { Package, User, Mail, Phone, Heart, CreditCard } from "lucide-react";
import './UpdateOrderStatus.css'
import api from "../../services/api";
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
  try {
    const newStatus = selectedStatuses[orderId];

    await api.put(`/orders/${orderId}/status`, {
      orderStatus: newStatus,
    });

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, orderStatus: newStatus }
          : order
      )
    );

    alert("Status updated successfully!");

  } catch (err) {
    console.error(err);
    alert("Unable to update status.");
  }
};

  if (loading) return <h2>Loading orders...</h2>;

  return (
  <div className="admin-orders max-w-6xl mx-auto px-6 py-8">

    <h2 className="text-3xl font-bold mb-8 text-center">
      Gift Orders
    </h2>

    {orders.map((order) => (
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
              {order.currency} {Number(order.totalPrice).toFixed(2)}
            </p>

            <p>
              Ordered:
              <br />
              {new Date(order.orderedAt).toLocaleString()}
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

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md transition"
            onClick={() => updateStatus(order.id)}
          >
            Update Status
          </button>

        </div>

      </div>
    ))}

  </div>
  );
}