import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DepartmentForm from "./DepartmentForm";
import TableCustom from "../../common/Custom/TableCustom";
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@material-ui/core";
import PaginationCustom from "app/common/Custom/PaginationCustom";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  numericalOrder: {
    paddingLeft: theme.spacing(2),
  },
  pagination: {
    "& > *": {
      marginTop: theme.spacing(2),
    },
    display: "flex",
    justifyContent: "end",
  },
  delete: {
    border: "1px solid",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    textAlign: "center",
  },
  popper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 1300,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    border: "1px solid gray",
    width: "200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchIcon: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    padding: theme.spacing(0, 1),
    backgroundColor: "#64b5f6",
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
  },
  inputInput: {
    paddingLeft: "10px",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
}));

const MaterialButton = ({ item, setSelected, onEdit, onDelete }) => (
  <>
    <IconButton onClick={() => {
      onEdit(true);
      setSelected(item)
    }}
      aria-label="edit">
      <Icon color="primary">edit</Icon>
    </IconButton>
    <IconButton onClick={() => {
      onDelete(true);
      setSelected(item)
    }} aria-label="delete">
      <Icon color="error">delete</Icon>
    </IconButton>
  </>
);

export default observer(function DepartmentIndex() {
  const { departmentStore } = useStore();
  const {
    search,
    updatePageData,
    setKeyword,
    keyword,
    setShouldOpenEditorDialog,
    setSelectedDepartment,
    departmentList,
    setShouldOpenConfirmationDialog,
    rowsPerPage,
    setRowsPerPage,
    totalPages,
    page,
    handleChangePage,
    shouldOpenConfirmationDialog,
    handleConfirmDelete,
    setSelectedList
  } = departmentStore;

  useEffect(() => {
    search();
  }, [search]);

  const classes = useStyles();

  const handleIconClick = () => {
    updatePageData(keyword);
  };

  const handleKeyDown = (e) => {
    setKeyword(e.target.value);
    if (e.key === "Enter") {
      updatePageData(keyword);
    }
  };

  const formatDateTime = (timestamp, includeTime = true) => {
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      title: 'Phòng ban trực thuộc',
      render: (rowData) => rowData?.parent?.name ? rowData?.parent?.name : "Không có"

    },
    { title: 'Tên Phòng ban', field: 'name' },
    { title: 'Mã phòng ban', field: 'code' },
    { title: 'Mô tả', field: 'description' },
    { title: 'Chức năng', field: 'func' },
    { title: 'Khối công nghiệp', field: 'industryBlock' },
    { title: 'Số thành lập', field: 'foundedNumber' },
    {
      title: 'Ngày thành lập',
      field: 'foundedDate',
      render: rowData => formatDateTime(rowData.foundedDate, false)
    },
    { title: 'Thứ tự', field: 'displayOrder' },
    {
      title: "Hành động",
      render: (rowData) => (
        <MaterialButton
          item={rowData}
          onEdit={setShouldOpenEditorDialog}
          onDelete={setShouldOpenConfirmationDialog}
          setSelected={setSelectedDepartment}
        />
      ),
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.nav}>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          className={classes.button}
          onClick={() => {
            setShouldOpenEditorDialog(true);
            setSelectedDepartment(null);
          }}
          style={{ backgroundColor: "#90caf9", color: "#000" }}

        >
          Thêm
        </Button>
        <div className={classes.search}>
          <InputBase
            placeholder="TÌm kiếm ...."
            classes={{
              root: classes.inputRoot, input: classes.inputInput,
            }}
            onChange={handleKeyDown}
            onKeyPress={handleKeyDown}
            inputProps={{ "aria-label": "search" }}
          />
          <div className={classes.searchIcon} onClick={handleIconClick}>
            <SearchIcon />
          </div>
        </div>
      </div>
      <TableCustom
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalPages={totalPages}
        page={page}
        handleChangePage={handleChangePage}
        title={"Danh sách phòng ban"}
        datas={departmentList}
        columns={columns}
        checkbox={true}
        setSelectedList={setSelectedList}
      />
      <div className={classes.pagination}>
        <PaginationCustom
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalPages={totalPages}
          page={page}
          handleChangePage={handleChangePage}
          store={departmentStore}
        />
      </div>
      <DepartmentForm />
      {shouldOpenConfirmationDialog && (
        <Dialog
          open={shouldOpenConfirmationDialog}
          onClose={() => setShouldOpenConfirmationDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Bạn có muốn xóa không?"}</DialogTitle>
          <DialogActions>
            <Button onClick={() => setShouldOpenConfirmationDialog(false)} color="primary">
              Hủy
            </Button>
            <Button onClick={handleConfirmDelete} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
});
