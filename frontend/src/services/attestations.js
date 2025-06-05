import api from './api';

export const createAttestation = async (data) => {
  const response = await api.post('/attestations', data);
  return response.data;
};

export const getAttestations = async () => {
  const response = await api.get('/attestations');
  return response.data;
};

export const getDemandesEnAttente = async () => {
  const res = await api.get('/attestation/demandes');
  return res.data;
};

export const validateAttestation = async (id) => {
    await api.patch(`/attestations/${id}/validate`);
  };