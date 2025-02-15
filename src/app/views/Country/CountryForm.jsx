import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { observer } from "mobx-react";
import { useStore } from "../../stores";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        width: "500px", 
        padding: theme.spacing(3),
    },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        alignItems: "center",
        width: "100%",
    },
    inputField: {
        width: "100%",
        "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            transition: "0.3s",
            "&:hover": {
                backgroundColor: "#f0f0f0",
            },
            "&.Mui-focused": {
                backgroundColor: "#fff",
                borderColor: theme.palette.primary.main,
            },
        },
    },
    buttonWrapper: {
        display: "flex",
        justifyContent: "center",
        gap: theme.spacing(2),
        marginTop: theme.spacing(4),
    },
    cancelButton: {
        backgroundColor: "#ccc",
        color: "#333",
        fontSize: "16px", 
        padding: theme.spacing(1.5, 3),
        "&:hover": {
            backgroundColor: "#e0e0e0",
        },
    },
    submitButton: {
        backgroundColor: '#90caf9',
        color: "#000",
        fontSize: "16px", 
        padding: theme.spacing(1.5, 3),
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}));

export default observer(function CountryForm() {
    const classes = useStyles();
    const { countryStore } = useStore();
    const { selectedCountry, shouldOpenEditorDialog, updateCountry, saveCountry, setShouldOpenEditorDialog } = countryStore;

    const formik = useFormik({
        initialValues: {
            id: selectedCountry?.id || "",
            name: selectedCountry?.name || "",
            code: selectedCountry?.code || "",
            description: selectedCountry?.description || "",
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().min(2, "Ít nhất 2 ký tự").max(15, "Nhiều nhất 15 ký tự").required("Không được bỏ trống!"),
            code: Yup.string().min(2, "Ít nhất 2 ký tự").max(20, "Nhiều nhất 20 ký tự").required("Không được bỏ trống!"),
            description: Yup.string().min(10, "Ít nhất 10 ký tự").max(500, "Nhiều nhất 500 ký tự").required("Không được bỏ trống!"),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                if (selectedCountry?.id) {
                    updateCountry(values);
                } else {
                    saveCountry(values);
                }
                resetForm();
            } catch (error) {
                console.error("Lỗi form", error);
            }
        },
    });

    return (
        <Dialog open={shouldOpenEditorDialog} onClose={() => setShouldOpenEditorDialog(false)} aria-labelledby="dialog-title">
            <DialogTitle id="dialog-title">
                {selectedCountry?.id ? "Sửa quốc gia" : "Thêm quốc gia"}
            </DialogTitle>
            <DialogContent className={classes.dialogContent}>
                <form onSubmit={formik.handleSubmit} className={classes.wrapper}>
                    <TextField
                        className={classes.inputField}
                        label="Tên"
                        variant="outlined"
                        color="secondary"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        className={classes.inputField}
                        label="Mã"
                        variant="outlined"
                        color="secondary"
                        name="code"
                        value={formik.values.code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.code && Boolean(formik.errors.code)}
                        helperText={formik.touched.code && formik.errors.code}
                    />
                    <TextField
                        className={classes.inputField}
                        label="Mô tả"
                        variant="outlined"
                        color="secondary"
                        name="description"
                        multiline
                        rows={4} // 📌 Tăng chiều cao của ô nhập mô tả
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.description && Boolean(formik.errors.description)}
                        helperText={formik.touched.description && formik.errors.description}
                    />
                    <div className={classes.buttonWrapper}>
                        <Button variant="contained" className={classes.cancelButton} onClick={() => setShouldOpenEditorDialog(false)}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" className={classes.submitButton}>
                            {selectedCountry?.id ? "Cập nhật" : "Thêm"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
});
