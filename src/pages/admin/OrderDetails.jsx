import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import "../../styles/pages/UpdateOrderStatus.css";
import api from "../../services/api";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { Navigate, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { handleApiError } from "../../utils/errorHandler";
import Loading from "../../components/Loading";

const STATUS_OPTIONS = [
  "PENDING",
  "IN_PROCESS",
  "READY_FOR_CLINIC",
  "DELIVERED",
  "CANCELED",
];
import { formatMoney } from "../../utils/currencyUtils";

export default function AdminOrders() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/orders/${id}`);
        setOrder(response.data);
        setSelectedStatus(response.data.orderStatus);
      } catch (err) {
        console.error(err);
        handleApiError(error, "Unable to fetch  the order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const [selectedStatus, setSelectedStatus] = useState(
    order?.orderStatus ?? "",
  );

  const updateStatus = async () => {
    setUpdating(true);

    try {
      const response = await api.put(`/orders/${order.id}/status`, {
        orderStatus: selectedStatus,
      });

      setOrder(response.data.order);

      setUpdateMessage(
        response.data.emailSent
          ? `✅ ${response.data.message}`
          : `⚠️ ${response.data.message}`,
      );
    } catch (error) {
      handleApiError(error, "Unable to update the order status.");

      setUpdateMessage(
        `❌ ${
          error.response?.data?.message || "Unable to update the order status."
        }`,
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return <Navigate to="/admin/all-orders" replace />;
  }

  return (
    <div className="max-w-8xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-md px-4 py-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h2 className=" text-center text-xs sm:text-2xl font-bold">
          Gift Order #{order.id}
        </h2>

        {/* Spacer so title stays centered */}
        <div className="w-24" />
      </div>

      {/* White card */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-8 md:p-12 border border-gray-200">
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left">
            <tbody>
              <tr className="border-b bg-gray-50">
                <th colSpan={2} className="px-4 py-3 font-bold text-gray-800">
                  Recipient
                </th>
              </tr>
              <tr>
                <th
                  scope="row"
                  className="w-1/3 px-4 py-3 font-medium text-gray-600"
                >
                  Name
                </th>
                <td className="break-words px-4 py-3">{order.recipientName}</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-600">
                  Phone
                </th>
                <td className="break-words px-4 py-3">
                  {order.recipientPhone}
                </td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-600">
                  Relationship
                </th>
                <td className="break-words px-4 py-3">{order.relationship}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <th colSpan={2} className="px-4 py-3 font-bold text-gray-800">
                  Sender
                </th>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-600">
                  Name
                </th>
                <td className="break-words px-4 py-3">{order.senderName}</td>
              </tr>
              <tr>
                <th scope="row" className="px-4 py-3 font-medium text-gray-600">
                  Email
                </th>
                <td className="break-words px-4 py-3">{order.senderEmail}</td>
              </tr>
              <tr className="border-b bg-gray-50">
                <th scope="row" className="px-4 py-3 font-bold text-gray-600">
                  Total
                </th>
                <td className="break-words px-4 py-3">
                  {formatMoney(order.totalPrice, order.currency, 1)}
                </td>
              </tr>
              <tr className="border-b bg-gray-50">
                <th scope="row" className="px-4 py-3 font-bold text-gray-600">
                  Ordered Date
                </th>
                <td className="break-words px-4 py-3">
                  {order.createdAt
                    ? moment(order.createdAt).format("MMMM DD, YYYY")
                    : "Invalid Date"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Services */}
        <div className="mt-8 ml-2 mr-2 text-left">
          <h4 className="mb-3 font-bold underline">Services</h4>

          <ul className="space-y-2">
            {order.services.map((service) => (
              <li
                key={service.id}
                className="grid grid-cols-1 sm:grid-cols-3 gap-2 rounded-lg bg-white p-3"
              >
                <span className="font-bold text-gray-700">{service.title}</span>

                <span className="text-sm text-gray-600">
                  {service.description}
                </span>

                <span className="font-semibold text-[#1e5146] text-right">
                  {formatMoney(
                    service.price,
                    order.currency,
                    order.exchangeRate,
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <label className="font-bold">Status</label>

            <select
              className="border rounded-md px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>
          {updateMessage && (
            <div
              className={`text-sm font-medium text-center ${
                updateMessage.startsWith("✅")
                  ? "text-green-600"
                  : updateMessage.startsWith("⚠️")
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {updateMessage}
            </div>
          )}
          <button
            className={`font-medium px-8 py-2 rounded-md transition ${
              updating
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#1e5146] text-white transition active:scale-[0.95]"
            }`}
            disabled={updating}
            onClick={updateStatus}
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
