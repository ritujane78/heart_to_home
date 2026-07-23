import React from "react";
import {
  GridColumnMenu,
  GridColumnMenuFilterItem,
} from "@mui/x-data-grid";

const CustomColumnMenu = (props) => {
  return (
    <GridColumnMenu
      {...props}
      slots={{
        columnMenuFilterItem: GridColumnMenuFilterItem,
        columnMenuSortItem: null,
        columnMenuColumnsItem: null,
        columnMenuHideItem: null,
        columnMenuManageColumnsItem: null,
      }}
    />
  );
};

export default CustomColumnMenu;