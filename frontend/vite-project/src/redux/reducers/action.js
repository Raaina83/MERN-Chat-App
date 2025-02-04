export const SET_PEER_CONNECTION = 'SET_PEER_CONNECTION';
export const SET_CALL_ACTIVE = 'SET_CALL_ACTIVE';

export const setPeerConnection = (peerConnection) => ({
  type: SET_PEER_CONNECTION,
  payload: peerConnection,
});

export const setCallActive = (isActive) => ({
  type: SET_CALL_ACTIVE,
  payload: isActive,
});
