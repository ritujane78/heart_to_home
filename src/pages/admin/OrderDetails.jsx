import { useEffect, useState } from "react";
import { Package, User, Mail, Phone, Heart, CreditCard, ArrowLeft } from "lucide-react";
import './UpdateOrderStatus.css'
import api from "../../services/api";
import moment from "moment";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {BallTriangle} from "react-loader-spinner"
import { useLocation, Navigate, useNavigate } from "react-router-dom";

const STATUS_OPTIONS = [
  "IN_PROCESS",
  "READY_FOR_CLINIC",
  "DELIVERED",
  "CANCELED",
];

export default function AdminOrders() {
const { state } = useLocation();
const navigate = useNavigate();

const order = state?.order;

const [selectedStatus, setSelectedStatus] = useState(
  order?.orderStatus ?? ""
);
const [updating, setUpdating] = useState(false);
const [updateMessage, setUpdateMessage] = useState("");

if (!order) {
  return <Navigate to="/admin/all-orders" replace />;
}

const updateStatus = async () => {
    setUpdating(true);

    try {
        await api.put(`/orders/${order.id}/status`, {
            orderStatus: selectedStatus,
        });


        setUpdateMessage(
            order.senderEmail
                ? `✅ Status updated successfully. Email sent to ${order.senderEmail}.`
                : "✅ Status updated successfully."
        );
    } catch (err) {
        console.error(err);
        setUpdateMessage("❌ Unable to update status.");
    } finally {
        setUpdating(false);
    }
};

  return (
   <div className="max-w-6xl mx-auto px-6">

  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 rounded-md px-4 py-2"
    >
      <ArrowLeft size={18} />
      Back
    </button>

    <h2 className="flex-1 text-center text-2xl font-bold">
      Gift Order #{order.id}
    </h2>

    {/* Spacer so title stays centered */}
    <div className="w-24" />
  </div>

  {/* White card */}
  <div
    className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
  >
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

            {/* <p className="flex items-center gap-2 mb-2">
              <Mail size={16} />
              {order.recipientEmail}
            </p> */}

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

