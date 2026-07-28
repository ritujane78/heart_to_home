import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import { BallTriangle } from "react-loader-spinner";
// import Errors from "../Errors.js";
import moment from "moment";
import { useNavigate, Routes, Route } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { FileX } from "lucide-react";
import CustomColumnMenu from "../../components/CustomColumnMenu";

//Material ui data grid has used for the table
//initialize the columns for the tables and (field) value is used to show data in a specific column dynamically
export const userListsColumns = [
  {
    field: "username",
    headerName: "UserName",
    minWidth: 200,
    flex: 1,
    headerAlign: "center",
    align: "center",
    editable: false,
    headerClassName: "text-black font-semibold" ,
    cellClassName: "text-slate-700 font-normal ",
    renderHeader: (params) => <span className="text-center">UserName</span>,
  },

  {
    field: "email",
    headerName: "Email",
    aligh: "center",
    flex: 1.3,
    minWidth: 240,
    editable: false,
    headerAlign: "center",
    headerClassName: "text-black font-semibold text-center  ",
    cellClassName: "text-slate-700 font-normal  text-center ",
    align: "center",
    renderHeader: (params) => <span>Email</span>,
    renderCell: (params) => {
      return (
        <div className=" flex  items-center justify-center  gap-1 ">
          <span>
            <MdOutlineEmail className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.email}</span>
        </div>
      );
    },
  },
  {
    field: "created",
    headerName: "Created At",
    headerAlign: "center",
    flex: 1,
    minWidth: 220,
    editable: false,
    headerClassName: "text-black font-semibold ",
    cellClassName: "text-slate-700 font-normal ",
    align: "center",
    renderHeader: (params) => <span>Created At</span>,
    renderCell: (params) => {
      return (
        <div className=" flex justify-center  items-center  gap-1 ">
          <span>
            <MdDateRange className="text-slate-700 text-lg" />
          </span>
          <span>{params?.row?.created}</span>
        </div>
      );
    },
  },
];

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/getusers");
        const usersData = Array.isArray(response.data) ? response.data : [];
        setUsers(usersData);
      } catch (err) {
        setError(err?.response?.data?.message);

        toast.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const rows = users.map((item) => {
    const formattedDate = moment(item.createdDate).format(
      "MMMM DD, YYYY"
    );

    return {
      id: item.id,
      username: item.username,
      email: item.email,
      created: formattedDate,
      user: item,
    };
  });
  return (
    <div className="p-4">
      <div className="py-4">
        <h2 className="text-center text-2xl font-bold text-slate-800 uppercase ">
          All Users
        </h2>
      </div>
      <div className="overflow-x-auto w-full mx-auto pb-6">
        {loading ? (
          <>
            <div className="flex flex-col justify-center items-center h-72">
              <span>
                <BallTriangle
                  height={100}
                  width={100}
                  radius={5}
                  color="#4fa94d"
                  ariaLabel="ball-triangle-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  />
              </span>
              <span>Please wait...</span>
            </div>
          </>
        ) : (
          <>
            {" "}
            <DataGrid
              className="transparent-grid w-full max-w-6xl mx-auto shadow-lg shadow-gray-300 rounded-xl"
              rows={rows}
              columns={userListsColumns}
              onRowClick={(params) =>
                navigate(`/admin/users/${params.id}`, {
                  state: { user: params.row.user },
                })
              }
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

                "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
                  outline: "none",
                },
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
