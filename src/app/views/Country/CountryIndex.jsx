import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import { observer } from "mobx-react";
import { useStore } from "../../stores";
import { Formik, Form, Field } from 'formik';
import Pagination from '@material-ui/lab/Pagination';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
const CountryIndex = observer(() => {
    const { countryStore } = useStore();
    useEffect(() => {
        countryStore.loadCountries();
    }, []);

    return (
        <div>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10px',
                padding: '10px',
                backgroundColor: 'white',
                zIndex: 10 // Đảm bảo nó hiển thị phía trên
            }}>
                <input
                    type="text"
                    value={countryStore.searchTerm}
                    onChange={(e) => countryStore.setSearchTerm(e.target.value)}
                    placeholder="Nhập từ khóa tìm kiếm"
                    style={{
                        flex: 1,
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px 0px 0px 4px',
                        width: '100px', // Đảm bảo có chiều rộng đủ để nhìn thấy
                        
                    }}
                />
                <button
                    onClick={() => countryStore.handleSearchClick()}
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '0px 4px 4px 0px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        backgroundColor: '#007bff',
                    }}>
                    🔍
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <MaterialTable
                    title="Danh sách Quốc Gia"
                    columns={[
                        { title: 'STT', render: (rowData) => ((rowData.tableData.id + 1) + ((countryStore.pageIndex === 0 ? 0 : countryStore.pageIndex - 1) * countryStore.pageSize)) },
                        { title: 'Tên Quốc Gia', field: 'name' },
                        { title: 'Code', field: 'code' },
                        { title: 'Mô tả', field: 'description' },
                    ]}
                    data={countryStore.countryList}
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
                            onClick: () => countryStore.handleAddClick(),
                        },
                        {
                            icon: 'visibility',
                            tooltip: 'View Details',
                            onClick: (event, rowData) => countryStore.handleViewDetails(rowData.id),
                            iconProps: { style: { color: '#2196F3' } },
                        },
                        {
                            icon: 'edit',
                            tooltip: 'Edit Country',
                            onClick: (event, rowData) => countryStore.handleEditClick(rowData),
                            iconProps: { style: { color: '#4CAF50' } },
                        },
                        {
                            icon: 'delete',
                            tooltip: 'Delete Country',
                            onClick: (event, rowData) => countryStore.handleDelete(rowData.id),
                            iconProps: { style: { color: '#f44336' } },
                        },
                    ]}
                />
            </div>
            <div style={{ display: 'flex', marginRight: '10px', marginLeft: '40%', marginTop: '10px' }}>
                <div >
                    <p >Số hàng mỗi trang: </p>
                </div>
                <FormControl variant="outlined" size="small" style={{ marginRight: '10px' }}>

                    <Select value={countryStore.pageSize}
                        onChange={(event) => countryStore.handlePageSizeChange(event)} >
                        {[5, 10, 25, 50, 100].map((size) => (
                            <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Pagination
                    count={Math.ceil(countryStore.totalRecords / countryStore.pageSize)}
                    page={countryStore.pageIndex}
                    onChange={(event, newPage) => countryStore.handlePageChange(event, newPage)}
                    color="primary"
                    showFirstButton
                    showLastButton
                />
            </div>


            {countryStore.isPopupOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.header}>Edit Country</h3>
                        <Formik
                            initialValues={countryStore.selectedCountry || { name: '', code: '', description: '' }}
                            onSubmit={(values) => {
                                countryStore.selectedCountry
                                    ? countryStore.editCountry(values)
                                    : countryStore.addCountry(values);
                            }}
                        >
                            <Form>
                                <Field style={styles.input} type="text" name="name" placeholder="Name" />
                                <Field style={styles.input} type="text" name="code" placeholder="Code" />
                                <Field style={styles.input} type="text" name="description" placeholder="Description" />
                                <div style={styles.buttonContainer}>
                                    <button style={styles.closeButton} type="button" onClick={() => countryStore.closePopup()}>Cancel</button>
                                    <button style={styles.saveButton} type="submit">Save</button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
            )}

            {countryStore.isDetailPopupOpen && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.header}>Chi tiết Quốc Gia</h3>
                        {countryStore.selectedCountry ? (
                            <div>
                                <p><strong>Tên Quốc Gia:</strong> {countryStore.selectedCountry.name}</p>
                                <p><strong>Code:</strong> {countryStore.selectedCountry.code}</p>
                                <p><strong>Mô tả:</strong> {countryStore.selectedCountry.description}</p>
                            </div>
                        ) : (
                            <p>Đang tải dữ liệu...</p>
                        )}
                        <div style={styles.buttonContainer}>
                            <button style={styles.closeButton} onClick={() => countryStore.closeDetailPopup()}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
})

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
        textAlign: 'left',
    },
    header: {
        marginBottom: '20px',
        textAlign: 'center',

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
export default CountryIndex;
