import {makeAutoObservable, runInAction} from "mobx";
import {
    pagingReligions,
    getReligion,
    createReligion,
    editReligion,
    deleteReligion,
    getAllReligions,
    checkCode
} from "./ReligionService";
import {toast} from "react-toastify";

export default class ReligionStore {
    religionList = [];
    selectedReligion = null;
    totalElements = 0;
    totalPages = 0;
    page = 1;
    rowsPerPage = 10;
    keyword = "";
    loadingInitial = false;
    shouldOpenEditorDialog = false;
    shouldOpenConfirmationDialog = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoadingInitial = (state) => {
        this.loadingInitial = state;
    };

    setKeyword = (value) => {
        this.keyword = value;
    };

    search = async () => {
        this.loadingInitial = true;

        const searchObject = {
            keyword: this.keyword,
            pageIndex: this.page,
            pageSize: this.rowsPerPage,
        };

        try {
            let res = await pagingReligions(searchObject);

            runInAction(() => {
                this.religionList = res?.data?.content || [];
                this.totalElements = res?.data?.totalElements;
                this.totalPages = res?.data?.totalPages;
                this.loadingInitial = false;
            });
        } catch (error) {
            toast.warning("Failed to load religions.");
            this.loadingInitial = false;
        }
    };

    getAll = async () => {
        this.loadingInitial = true;
        try {
            let res = await getAllReligions();

            runInAction(() => {
                this.religionList = res?.data || [];
                this.loadingInitial = false;
            });
        } catch (error) {
            toast.warning("Failed to load religions.");
            this.loadingInitial = false;
        }
    };

    setShouldOpenConfirmationDialog = (state) => {
        this.shouldOpenConfirmationDialog = state;
    };

    setShouldOpenEditorDialog = (state) => {
        this.shouldOpenEditorDialog = state;
    };

    handleClose = () => {
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
    };

    updatePageData = (keyword) => {
        if (keyword) {
            this.page = 1;
            this.keyword = keyword;
        }
        this.search();
    };

    setSelectedReligion = (religion) => {
        this.selectedReligion = religion;
    };

    setPage = (page) => {
        this.page = page;
        this.updatePageData();
    };

    setRowsPerPage = (event) => {
        this.rowsPerPage = Number(event.target.value) || 10;
        this.page = 1;
        this.updatePageData();
    };

    handleChangePage = (event, newPage) => {
        this.setPage(newPage);
    };

    handleConfirmDelete = async () => {
        try {
            const res = await deleteReligion(this.selectedReligion.id);
            if (res?.data) {
                this.handleClose();
                toast.success("Deleted successfully.");
                this.search();
            } else {
                toast.warning("Deleted failure.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        }
    };

    getReligion = async (id) => {
        if (id != null) {
            try {
                const data = await getReligion(id);
                this.setSelectedReligion(data?.data);
            } catch (error) {
                console.log(error);
            }
        } else {
            this.setSelectedReligion(null);
        }
    };

    updateReligion = async (religion) => {
        try {
            const res = await editReligion(religion);
            this.handleClose();
            toast.success("Updated successfully!");
            return res?.data;
        } catch (error) {
            toast.warning("An error occurred while saving.");
        }
    };

    saveReligion = async (religion) => {
        try {
            const res = await createReligion(religion);
            this.handleClose();
            toast.success("Created successfully!");
            return res?.data;
        } catch (error) {
            toast.warning("An error occurred while saving.");
        }
    };

    resetReligionStore = () => {
        this.religionList = [];
        this.totalElements = 0;
        this.totalPages = 0;
        this.selectedReligion = null;
        this.page = 1;
        this.rowsPerPage = 10;
        this.keyword = "";
        this.loadingInitial = false;
        this.shouldOpenEditorDialog = false;
        this.shouldOpenConfirmationDialog = false;
    };
}
