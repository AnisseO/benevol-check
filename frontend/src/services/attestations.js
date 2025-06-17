import api from './api';

export const createAttestation = async (data) => {
  const response = await api.post('/attestation', data);
  return response.data;
};

export const getAttestations = async () => {
  const response = await api.get('/attestation');
  return response.data;
};

export const getDemandesEnAttente = async () => {
  const res = await api.get('/attestation/demandes');
  return res.data;
};

export const validerAttestation = async (id) => {
  const res = await api.patch(`/attestation/${id}/valider`);
  return res.data;
};

export const refuserAttestation = async (id) => {
  const res = await api.delete(`/attestation/${id}`);
  return res.data;
};

export const getAttestationsBenevole = async (benevoleId) => {
  const res = await api.get(`/attestation/benevole/${benevoleId}`);
  return res.data;
};
