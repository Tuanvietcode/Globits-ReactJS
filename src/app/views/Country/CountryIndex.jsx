import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import CountryForm from "./CountryForm";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import { Icon } from "@material-ui/core";
import TableCustom from "../../common/Custom/TableCustom";
import PaginationCustom from "app/common/Custom/PaginationCustom";

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(2), marginLeft: theme.spacing(2), marginRight: theme.spacing(2),
    }, table: {
        minWidth: 650,
    }, numericalOrder: {
        paddingLeft: theme.spacing(2),
    }, pagination: {
        "& > *": {
            marginTop: theme.spacing(2),
        }, display: "flex", justifyContent: "end",
    }, delete: {
        border: "1px solid",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.paper,
        textAlign: "center",
    }, popper: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 1300,
    }, search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        border: "1px solid gray",
        width: "200px",
        display: "flex",
        alignItems: "center",
        justifyContent: "between",
    }, searchIcon: {
        display: "flex",
        alignItems: "center",
        height: "100%",
        padding: theme.spacing(0, 1),
        backgroundColor: "#64b5f6",
        borderTopRightRadius: theme.shape.borderRadius,
        borderBottomRightRadius: theme.shape.borderRadius,
    }, inputInput: {
        paddingLeft: "10px",
    }, nav: {
        display: "flex", justifyContent: "space-between", marginBottom: theme.spacing(2),
    },

}));

const MaterialButton = ({ item, setSelected, onEdit, onDelete }) => (<>
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
</>);
export default observer(function CountryIndex() {
    const { countryStore } = useStore();
    const {
        search,
        updatePageData,
        setKeyword,
        keyword,
        setShouldOpenEditorDialog,
        setSelectedCountry,
        countryList,
        setShouldOpenConfirmationDialog,
        rowsPerPage,
        setRowsPerPage,
        totalPages,
        page,
        handleChangePage,
        selectedCountry,
        shouldOpenEditorDialog,
        updateCountry,
        saveCountry,
        shouldOpenConfirmationDialog,
        handleConfirmDelete
    } = countryStore;
    useEffect(() => {
        search();
    }, []);

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
    const columns = [
        {
            title: 'STT', render: (rowData) => rowData.tableData.id + 1,
            cellStyle: {
                paddingLeft: "10px",
            },
            headerStyle: {
                paddingLeft: "10px",
            }
        },
        { title: 'Mã quốc gia', field: 'code' },
        { title: 'Tên quốc gia', field: 'name' },
        { title: 'Mô tả', field: 'description' }, {
            title: "Hành động", render: (rowData) => (<MaterialButton
                item={rowData}
                onEdit={setShouldOpenEditorDialog}
                onDelete={setShouldOpenConfirmationDialog}
                setSelected={setSelectedCountry}
            />),
        },]

    return (<div className={classes.root}>
        <div className={classes.nav}>
            <Button
                variant="contained"
                color="primary"
                disableElevation
                className={classes.button}
                onClick={() => {
                    setShouldOpenEditorDialog(true)
                    setSelectedCountry(null)

                }}
                style={{ backgroundColor: "#90caf9", color: "#000" }}
            >
                Thêm
            </Button>
            <div className={classes.search}>
                <InputBase
                    placeholder="search…"
                    classes={{
                        root: classes.inputRoot, input: classes.inputInput,
                    }}
                    onChange={(e) => handleKeyDown(e)}
                    onKeyPress={handleKeyDown}
                    inputProps={{ "aria-label": "search" }}
                />
                <div className={classes.searchIcon} onClick={handleIconClick}>
                    <SearchIcon />
                </div>
            </div>
        </div>
        <div className={classes.tableContainer}>
            <TableCustom
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalPages={totalPages}
                page={page}
                handleChangePage={handleChangePage}
                title={"Danh sách quốc gia"}
                datas={countryList}
                columns={columns} />
        </div>
        <div className={classes.pagination}>
            <PaginationCustom
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalPages={totalPages}
                page={page}
                handleChangePage={handleChangePage}
                store={countryStore}
            />
        </div>
        <CountryForm
            data={selectedCountry}
            isOpen={shouldOpenEditorDialog}
            setClose={setShouldOpenEditorDialog}
            updateCountry={updateCountry}
            createCountry={saveCountry}
        />
        {shouldOpenConfirmationDialog && (<Dialog
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
                <Button onClick={() => handleConfirmDelete()} color="primary" autoFocus>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>)}
    </div>

    );
});