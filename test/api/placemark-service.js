/* eslint-disable dot-notation */
import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
  placemarkUrl: serviceUrl,

  // user creation function
  async createUser(user) {
    const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
    return res.data;
  },

  // user retrieval function
  async getUser(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  // user update function
  async updateUser(id) {
    const res = await axios.put(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  // user authentification function
  async authenticate(user) {
    const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
    // eslint-disable-next-line prefer-template
    // axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    axios.defaults.headers.common["Authorization"] = response.data.token;
    return response.data;
  },

  // function to clear all authorisation
  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  },

  // function to retrieve all users
  async getAllUsers() {
    const res = await axios.get(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  // function to delete all users
  async deleteAllUsers() {
    const res = await axios.delete(`${this.placemarkUrl}/api/users`);
    return res.data;
  },

  // function to delete a placemark
  async deleteUser(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/users/${id}`);
    return res.data;
  },

  // function to create a placemark
  async createPlacemark(placemark) {
    const res = await axios.post(`${this.placemarkUrl}/api/users/placemarks`, placemark);
    return res.data;
  },

  // function to retrieve a placemark by id
  async getPlacemark(id) {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res.data;
  },

  // function to update a placemark
  async updatePlacemark(id, updatedPlacemark) {
    const res = await axios.put(`${this.placemarkUrl}/api/placemarks/${id}`, updatedPlacemark);
    return res.data;
  },

  // function to retrieve all placemarks
  async getAllPlacemarks() {
    const res = await axios.get(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },

  // function to delete a placemark
  async deletePlacemark(id) {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks/${id}`);
    return res.data;
  },

  // function to delete all placemarks
  async deleteAllPlacemarks() {
    const res = await axios.delete(`${this.placemarkUrl}/api/placemarks`);
    return res.data;
  },
};