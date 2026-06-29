import api from './api';

export const vehicleService = {
  async getMyVehicle() {
    return await api.get('/vehicles');
  },

  async updateMyVehicle(vehicleData) {
    return await api.put('/vehicles', vehicleData);
  }
};
export default vehicleService;
