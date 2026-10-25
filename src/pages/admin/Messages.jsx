import React, { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { MdOutlineEmail, MdDateRange, MdPhone } from "react-icons/md";
import { MessageSquareText } from "lucide-react";
import CustomColumnMenu from "../../components/CustomColumnMenu";
import Loading from "../../components/Loading";
import moment from "moment";

export const messageColumns = (handleCloseMessage) => [
  {
  field: "createdAt",
  headerName: "Created At",
  headerAlign: "center",
  flex: 1,
  minWidth: 220,
  editable: false,
  headerClassName: "text-black font-semibold",
  cellClassName: "text-slate-700 font-normal",
  align: "center",
  renderHeader: () => <span>Created At</span>,
  renderCell: (params) => {
    const formattedDate = params.row.createdAt
      ? moment(params.row.created_at).format("MMMM DD, YYYY")
      : "";

    return (
      <div className="flex justify-center items-center gap-1">
        <MdDateRange className="text-slate-700 text-lg" />
        <span>{formattedDate}</span>
      </div>
    );
  },
},
  {
    field: "name",
    headerName: "Name",
    minWidth: 150,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold",
    cellClassName: "text-slate-700 font-normal",
    renderHeader: () => <span>Name</span>,
  },
  {
    field: "email",
    headerName: "Email",
    minWidth: 220,
    flex: 1.2,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold",
    cellClassName: "text-slate-700 font-normal",
    renderHeader: () => <span>Email</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <MdOutlineEmail className="text-slate-700 text-lg shrink-0" />
        <span>{params.row.email}</span>
      </div>
    ),
  },
  {
    field: "mobileNumber",
    headerName: "Mobile #",
    minWidth: 150,
    flex: 0.8,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold",
    cellClassName: "text-slate-700 font-normal",
    renderHeader: () => <span>Mobile #</span>,
    renderCell: (params) => (
      <div className="flex items-center justify-center gap-1">
        <span>
          {params.row.countryCode} {params.row.mobileNumber}
        </span>
      </div>
    ),
  },
  {
    field: "message",
    headerName: "Message",
    minWidth: 280,
    flex: 1.8,
    headerAlign: "center",
    align: "left",
    editable: false,
    sortable: false,
    headerClassName: "text-black font-semibold",
    cellClassName: "text-slate-700 font-normal",
    renderHeader: () => <span>Message</span>,
    renderCell: (params) => (
      <div
        className="w-full whitespace-normal break-words py-2"
        title={params.row.message}
      >
        {params.row.message}
      </div>
    ),
  },
  {
    field: "action",
    headerName: "Action",
    minWidth: 120,
    flex: 0.6,
    headerAlign: "center",
    align: "center",
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerClassName: "text-black font-semibold",
    renderHeader: () => <span>Action</span>,
    renderCell: (params) => (
      <button
        type="button"
        onClick={() => handleCloseMessage(params.row.contactId)}
        className="bg-[#1e5146] text-white text-sm px-4 py-1.5 rounded-md hover:bg-[#18453c]
                        hover:scale-95 transition"
      >
        Close
      </button>
    ),
  },
];

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/admin/messages");
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error(
        error.response?.data?.errorMessage ||
          error.message ||
          "Failed to fetch messages. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleCloseMessage = async (contactId) => {
    try {
      await api.patch(`/admin/messages/${contactId}/close`);
      toast.success("Message Closed");
      await loadMessages();
    } catch (error) {
      toast.error(
        error.response?.data?.errorMessage ||
          error.message ||
          "Failed to close message",
      );
    }
  };

  const rows = messages.map((message) => ({
    createdAt: message.createdAt,
    id: message.contactId,
    contactId: message.contactId,
    name: message.name,
    email: message.email,
    mobileNumber: message.countryCode + " " + message.mobileNumber,
    message: message.message,
  }));

  const columns = messageColumns(handleCloseMessage);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="py-4">
        <h2 className="text-center text-2xl font-bold text-slate-800 uppercase">
          Contact Messages
        </h2>
      </div>

      {rows.length === 0 ? (
        <p className="text-center text-xl text-slate-700 mt-8">
          No open messages found.
        </p>
      ) : (
        <div className="overflow-x-auto w-full mx-auto pb-6">
          <DataGrid
            className="transparent-grid w-full max-w-6xl mx-auto shadow-lg shadow-gray-300 rounded-xl"
            rows={rows}
            columns={columns}
            slots={{
              columnMenu: CustomColumnMenu,
            }}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            disableRowSelectionOnClick
            pageSizeOptions={[10]}
            disableColumnResize
            getRowHeight={() => "auto"}
            sx={{
              "& .MuiDataGrid-row": {
                transition: "background-color .2s ease",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#e5e7eb !important",
              },
              "& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
                py: 1,
              },
              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                {
                  outline: "none",
                },
            }}
          />
        </div>
      )}
    </div>
  );
}
