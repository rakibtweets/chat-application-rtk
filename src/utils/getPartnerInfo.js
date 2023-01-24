const getPartnerInfo = (participants, email) => {
  return participants.find((participants) => participants.email !== email);
};

export default getPartnerInfo;
