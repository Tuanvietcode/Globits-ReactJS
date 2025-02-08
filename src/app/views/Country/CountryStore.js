import { makeAutoObservable } from "mobx";
import {
  pagingCountries,
  getCountry,
  createCountry,
  editCountry,
  deleteCountry,
} from "./CountryService";

class CountryStore {
  countryList = [];
  totalRecords = 0;
  pageIndex = 0;
  pageSize = 10;
  searchTerm = "";
  selectedCountry = null;
  isPopupOpen = false;
  isDetailPopupOpen = false;
    
  constructor() {
    makeAutoObservable(this);
  }

  async loadCountries(search = "") {
    this.searchTerm = search;
    try {
      const searchObject = {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        keyword: this.searchTerm,
      };
      const response = await pagingCountries(searchObject);
      this.countryList = response.data.content;
      this.totalRecords = response.data.totalElements;
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu quốc gia:", error);
    }
  }

  handleSearchClick() {
    this.loadCountries(this.searchTerm);
  }
  setSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
}


  handlePageChange(event, newPage) {
    this.pageIndex = newPage;
    this.loadCountries(this.searchTerm);
  }

  handlePageSizeChange(event) {
    this.pageSize = parseInt(event.target.value, 10);
    this.pageIndex = 0;
    this.loadCountries(this.searchTerm);
  }
  closeDetailPopup = () => {
    this.isDetailPopupOpen = false;
    this.selectedCountry = null;
};

  closePopup = () => {
    this.isPopupOpen = false;
    this.selectedCountry = null;
  };


  async handleViewDetails(countryId) {
    try {
      const response = await getCountry(countryId);
      this.selectedCountry = response.data;
      this.isDetailPopupOpen = true;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu quốc gia:", error);
    }
  }

  async addCountry(country) {
    try {
      const response = await createCountry(country);
      this.countryList = [response.data, ...this.countryList];
      this.isPopupOpen = false;
    } catch (error) {
      console.error("Lỗi khi thêm quốc gia:", error);
    }
  }

  async editCountry(country) {
    try {
      const response = await editCountry(country);
      this.countryList = this.countryList.map((c) =>
        c.id === country.id ? response.data : c
      );
      this.isPopupOpen = false;
    } catch (error) {
      console.error("Lỗi khi chỉnh sửa quốc gia:", error);
    }
  }

  
  handleAddClick = () => {
    this.selectedCountry = null;
    this.isPopupOpen = true;
  };
  handleEditClick = (country) => {
    this.selectedCountry = country;
    this.isPopupOpen = true;
  };

  // Khi bấm nút xóa
  handleDelete = async (countryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa quốc gia này?")) {
      try {
        await deleteCountry(countryId);
        this.countryList = this.countryList.filter((c) => c.id !== countryId);
      } catch (error) {
        console.error("Lỗi khi xóa quốc gia:", error);
      }
    }
  };
}

export default CountryStore;
