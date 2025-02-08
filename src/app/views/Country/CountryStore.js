import { makeAutoObservable } from "mobx";
import { pagingCountries, getCountry, createCountry, editCountry, deleteCountry } from "../services/CountryService";

class CountryStore {
    countryList = [];
    totalRecords = 0;
    pageIndex = 0;
    pageSize = 10;
    searchTerm = "";
    selectedCountry = null;

    constructor() {
        makeAutoObservable(this);
    }

    async loadCountries(search = '') {
        this.searchTerm = search;
        try {
            const searchObject = {
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                keyword: this.searchTerm
            };
            const response = await pagingCountries(searchObject);
            this.countryList = response.data.content;
            this.totalRecords = response.data.totalElements;
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu quốc gia:', error);
        }
    }

    async fetchCountryById(countryId) {
        try {
            const response = await getCountry(countryId);
            this.selectedCountry = response.data;
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu quốc gia:", error);
        }
    }

    async addCountry(country) {
        try {
            const response = await createCountry(country);
            this.countryList = [response.data, ...this.countryList];
        } catch (error) {
            console.error("Lỗi khi thêm quốc gia:", error);
        }
    }

    async editCountry(country) {
        try {
            const response = await editCountry(country);
            this.countryList = this.countryList.map(c => (c.id === country.id ? response.data : c));
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa quốc gia:", error);
        }
    }

    async deleteCountry(countryId) {
        try {
            await deleteCountry(countryId);
            this.countryList = this.countryList.filter(c => c.id !== countryId);
        } catch (error) {
            console.error("Lỗi khi xóa quốc gia:", error);
        }
    }

    setPageIndex(newPage) {
        this.pageIndex = newPage;
        this.loadCountries(this.searchTerm);
    }

    setPageSize(newSize) {
        this.pageSize = newSize;
        this.pageIndex = 0;
        this.loadCountries(this.searchTerm);
    }
}

export default new CountryStore();
