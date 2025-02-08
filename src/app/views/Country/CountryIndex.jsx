import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { pagingCountries, getCountry, createCountry, editCountry, deleteCountry } from './CountryService';
import { Formik, Form, Field } from 'formik';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
export default function CountryIndex() {
    const [countries, setCountries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    useEffect(() => {
        loadCountries();
    }, [pageIndex, pageSize]);

    async function loadCountries(search = '') {
        let searchObject = {
            pageIndex,
            pageSize,
            keyword: search
        };
        try {
            const response = await pagingCountries(searchObject);
            setCountries(response.data.content);
            setTotalRecords(response.data.totalElements);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu quốc gia:', error);
        }
    }
    const handleViewDetails = async (country) => {
        try {
            const response = await getCountry(country.id);
            setSelectedCountry(response.data);
            setIsDetailPopupOpen(true);
        } catch (error) {
            console.error("Lỗi khi lấy thông tin chi tiết quốc gia:", error);
            alert("Không thể lấy thông tin chi tiết!");
        }
    };

    const handleSave = async (newData) => {
        console.log('Dữ liệu cập nhật:', newData);
        try {
            if (newData.id) {

                const response = await editCountry(newData);
                setCountries((prev) =>
                    prev.map((c) => (c.id === newData.id ? response.data : c))
                );
            } else {

                const response = await createCountry(newData);
                setCountries((prev) => [response.data, ...prev]);
            }
            handleClosePopup();
        } catch (error) {
            console.error('Lỗi khi lưu quốc gia:', error);
            alert('Thao tác thất bại! Vui lòng thử lại.');
        }
    };
    const handleDelete = async (country) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa quốc gia: ${country.name}?`)) {
            try {
                await deleteCountry(country.id);
                setCountries((prev) => prev.filter((c) => c.id !== country.id));
            } catch (error) {
                console.error('Lỗi khi xóa quốc gia:', error);
                alert('Xóa thất bại! Vui lòng thử lại.');
            }
        }
    };


    const handleSearchClick = () => {
        setSearchTerm(searchTerm);
        loadCountries(searchTerm);
    };
    const handlePageChange = (event, newPage) => {
        setPageIndex(newPage);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setPageIndex(0);
    };
    const handleEditClick = (country) => {
        setSelectedCountry(country);
        setIsPopupOpen(true);
    };
    const handleAddClick = () => {
        setSelectedCountry({
            name: '',
            code: '',
            description: '',
        });
        setIsPopupOpen(true);
    };


    const handleCloseDetailPopup = () => {
        setIsDetailPopupOpen(false);
    };


    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedCountry(null);
    };


    return (
        <div>
            <div style={{ display: 'flex', marginLeft: '60%', marginRight: '10px' }}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                    style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px 0px 0px 4px' }}
                />
                <button onClick={handleSearchClick} style={{ border: '1px solid #ccc', borderRadius: '0px 4px 4px 0px', padding: '8px 12px', cursor: 'pointer' }}>
                    🔍
                </button>
            </div>
            <MaterialTable
                title="Danh sách Quốc Gia"
                columns={[
                    { title: 'STT', render: (rowData) => ((rowData.tableData.id + 1) + (pageIndex * pageSize)) },
                    { title: 'Tên Quốc Gia', field: 'name' },
                    { title: 'Code', field: 'code' },
                    { title: 'Mô tả', field: 'description' },
                ]}
                data={countries}
                options={{
                    search: false,
                    paging: false,
                    actionsColumnIndex: -1,
                    maxBodyHeight: 300,
                    headerStyle: {
                        backgroundColor: '#e3f2fd',
                        position: 'sticky',
                    },
                    toolbar: true,
                }}


                actions={[
                    {
                        icon: 'add',
                        tooltip: 'Add Country',
                        isFreeAction: true,
                        onClick: () => handleAddClick(),
                    },
                    {
                        icon: 'visibility',
                        tooltip: 'View Details',
                        onClick: (event, rowData) => handleViewDetails(rowData),
                        iconProps: { style: { color: '#2196F3' } },
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Edit Country',
                        onClick: (event, rowData) => handleEditClick(rowData),
                        iconProps: { style: { color: '#4CAF50' } },
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete Country',
                        onClick: (event, rowData) => handleDelete(rowData),
                        iconProps: { style: { color: '#f44336' } },
                    },
                ]}
            />
            <div style={{ display: 'flex', marginRight: '10px', marginLeft: '40%', marginTop: '10px' }}>
                <div >
                    <p >Số hàng mỗi trang: </p>
                </div>
                <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>

                    <Select value={pageSize} onChange={handlePageSizeChange} >
                        {[5, 10, 25, 50, 100].map((size) => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Pagination
                    count={Math.ceil((totalRecords / pageSize) + 1)}
                    page={pageIndex + 1}
                    onChange={(event, value) => handlePageChange(event, value - 1)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </div>


            {isDetailPopupOpen && selectedCountry && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.header}>Country Details</h3>
                        <div style={{ textAlign: 'left', padding: '10px' }}>
                            <p><strong>ID:</strong> {selectedCountry.id}</p>
                            <p><strong>Name:</strong> {selectedCountry.name}</p>
                            <p><strong>Code:</strong> {selectedCountry.code}</p>
                            <p><strong>Description:</strong> {selectedCountry.description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCloseDetailPopup}
                            style={styles.closeButton}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}


            {isPopupOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.header}>Edit Country</h3>

                        <Formik
                            initialValues={{
                                name: selectedCountry.name,
                                code: selectedCountry.code,
                                description: selectedCountry.description,
                            }}
                            onSubmit={(values) => {
                                const newData = { ...selectedCountry, ...values };
                                handleSave(newData);
                            }}
                        >
                            {({ values, handleChange }) => (
                                <Form>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                    <Field
                                        type="text"
                                        name="code"
                                        placeholder="Code"
                                        value={values.code}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                    <Field
                                        type="text"
                                        name="description"
                                        placeholder="Description"
                                        value={values.description}
                                        onChange={handleChange}
                                        style={styles.input}
                                    />
                                    <div style={styles.buttonContainer}>
                                        <button
                                            type="button"
                                            onClick={handleClosePopup}
                                            style={styles.closeButton}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            style={styles.saveButton}
                                        >
                                            Save
                                        </button>

                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '20px',
        width: '80%',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
    header: {
        marginBottom: '20px',
    },
    input: {
        width: '80%',
        padding: '10px',
        margin: '10px 0px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'end',
        marginTop: '20px',
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        marginLeft: '10px',
        cursor: 'pointer',
    },
    closeButton: {
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};
