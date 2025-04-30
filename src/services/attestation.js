import api from './api'; // Votre instance Axios configurée

export const createAttestation = async (data) => {
  const response = await api.post('/attestations', data);
  return response.data;
};

export const getAttestations = async () => {
  const response = await api.get('/attestations');
  return response.data;
};

export const validateAttestation = async (id) => {
    await api.patch(`/attestations/${id}/validate`);
  };