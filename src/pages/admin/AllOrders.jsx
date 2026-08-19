import { useState, useEffect } from "react";
import {
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import api from "../../services/api";

import moment from "moment";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import CustomColumnMenu from "../../components/CustomColumnMenu";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { Package } from "lucide-react";
import { handleApiError } from "../../utils/errorHandler";
import Loading from "../../components/Loading";

const AllOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = searchParams.get("p");

  let page = pageParam === null ? 1 : Number(pageParam);

  const isValidPage = Number.isInteger(page) && page > 0;

  const totalPages = Math.ceil(orders.length / 10);

  const pageExists = totalPages === 0 || page <= totalPages;

  useEffect(() => {
    if (!loading && (!isValidPage || !pageExists)) {
      navigate("/not-found", { replace: true });
    }
  }, [loading, isValidPage, pageExists, navigate]);

  useEffect(() => {
    if (!searchParams.has("p")) {
      setSearchParams(
        (params) => {
          params.set("p", "1");
          return params;
        },
        { replace: true },
      );
    }
  }, []);

  useEffect(() => {
    if (!isValidPage) {
      navigate("/not-found", { replace: true });
    }
  }, [isValidPage, navigate]);

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
      handleApiError(error, "Unable to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const [filterModel, setFilterModel] = useState(() => {
    const field = searchParams.get("field");
    const operator = searchParams.get("op");
    const value = searchParams.get("value");

    if (!field || !operator || value == null) {
      return { items: [] };
    }

    return {
      items: [
        {
          field,
          operator,
          value,
        },
      ],
    };
  });

  const handleFilterModelChange = (newModel) => {
    setFilterModel(newModel);

    const params = new URLSearchParams(searchParams);

    params.delete("field");
    params.delete("op");
    params.delete("value");

    if (newModel.items.length > 0) {
      const { field, operator, value } = newModel.items[0];

      if (value) {
        params.set("field", field);
        params.set("op", operator);
        params.set("value", value);
      }
    }

    setSearchParams(params, { replace: true });
  };
  const columns = [
    {
      field: "id",
      headerName: "Order #",
      minWidth: 70,
      flex: 0.6,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-black font-semibold ",
      cellClassName: "text-slate-700 font-normal ",
      renderHeader: (params) => <span className="text-center">Order #</span>,
    },
    {
      field: "senderEmail",
      headerName: "Sender Email",
      minWidth: 200,
      flex: 1.4,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-black font-semibold text-center  ",
      cellClassName: "text-slate-700 font-normal ",
      renderHeader: (params) => (
        <span className="text-center">Sender Email</span>
      ),
      renderCell: (params) => {
        return (
          <div className=" flex  items-center justify-center  gap-1 ">
            <span>
              <MdOutlineEmail className="text-slate-700 text-lg" />
            </span>
            <span>{params?.row?.senderEmail}</span>
          </div>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.8,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-black font-semibold text-center  ",
      cellClassName: "text-slate-700 font-normal ",
      renderHeader: (params) => <span className="text-center">Status</span>,
      renderCell: (params) => {
        const colors = {
          DELIVERED: "bg-[#1e5146]",
          CANCELED: "bg-red-500",
          "IN PROCESS": "bg-yellow-500 text-black",
          "READY FOR CLINIC": "bg-lime-500",
          "PENDING": "bg-yellow-800 text-black",
        };

        return (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
              colors[params.value] || "bg-gray-500"
            }`}
          >
            {params.value}
          </span>
        );
      },
    },
    {
      field: "orderedAt",
      headerName: "Ordered",
      minWidth: 220,
      flex: 1,
      align: "center",
      headerAlign: "center",
      headerClassName: "text-black font-semibold text-center  ",
      cellClassName: "text-slate-700 font-normal ",
      renderHeader: (params) => <span className="text-center">Ordered</span>,
      renderCell: (params) => {
        return (
          <div className=" flex justify-center  items-center  gap-1 ">
            <span>
              <MdDateRange className="text-slate-700 text-lg" />
            </span>
            <span>{params?.row?.orderedAt}</span>
          </div>
        );
      },
    },
  ];
  const rows = orders.map((order) => ({
    id: order.id,
    senderEmail: order.senderEmail,
    status: order.orderStatus.replaceAll("_", " "),
    orderedAt: moment(order.orderedAt).format("MMMM DD, YYYY"),
  }));
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4">
        <Loading />
      </div>
    );
  }
  return (
    <div className="py-4">
      <div className="py-4">
        <h2 className="text-center text-2xl font-bold text-slate-800 uppercase ">
          All Orders
        </h2>
      </div>
      <div className="overflow-x-auto w-full mx-auto pb-6">
        {rows.length > 0 ? (
          <DataGrid
            className="transparent-grid w-full max-w-6xl mx-auto shadow-lg shadow-gray-300 rounded-xl"
            rows={rows}
            columns={columns}
            sx={{
              "& .MuiDataGrid-row": {
                cursor: "pointer",
                transition: "background-color .2s ease",
              },

              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#e5e7eb !important",
              },

              "& .MuiDataGrid-row:focus, & .MuiDataGrid-row:focus-within": {
                outline: "none",
              },

              "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
                outline: "none",
              },

              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
                {
                  outline: "none",
                },
            }}
            pagination
            paginationModel={{
              page: page - 1,
              pageSize: 10,
            }}
            onPaginationModelChange={(model) => {
              setSearchParams((params) => {
                params.set("p", String(model.page + 1));
                return params;
              });
            }}
            onRowClick={(params) =>
              navigate(`/admin/orders/${params.id}${location.search}`)
            }
            slots={{
              columnMenu: CustomColumnMenu,
            }}
            filterModel={filterModel}
            onFilterModelChange={handleFilterModelChange}
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
          />
        ) : (
          <div className="rounded-xl bg-white p-12 text-center shadow">
            <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-lg text-gray-500">No orders, yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
