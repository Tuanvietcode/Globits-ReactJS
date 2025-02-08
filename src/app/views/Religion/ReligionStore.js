import { makeAutoObservable } from "mobx";

export default class ReligionStore {
  constructor() {
    makeAutoObservable(this);
  }
}
