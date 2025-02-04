import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { setIsCallAccepted, setIsCallActive, setToken } from '../../redux/reducers/misc';


function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

export function getUrlParams(
  url = window.location.href
) {
  let urlStr = url.split('?')[1];
  return new URLSearchParams(urlStr);
}

function VideoCall() {
  const {user} = useSelector((state) => state.auth)

  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const roomID = getUrlParams().get('roomID') || randomID(5);
  let myMeeting = (element) => {
    const initialize = async() => {
      const {data} = await axios.get(`http://localhost:5000/api/v1/auth/generate-token/${user._id}`, {withCredentials: true});
      const token = data.zego_token;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(data.appId, token, roomID, user._id, user.username);
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      console.log("zp",zp);
      zp.joinRoom({
        container: element,
        sharedLinks: [
          {
            name: 'Personal link',
            url:
              window.location.protocol + '//' + 
              window.location.host + window.location.pathname +
              '?roomID=' +
              roomID,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall, // To implement 1-on-1 calls, modify the parameter here to [ZegoUIKitPrebuilt.OneONoneCall].
        },
        onLeaveRoom: () => {
          // dispatch(setToken(undefined));
          // dispatch(setIsCallAccepted(false));
          // dispatch(setIsCallActive(false));
          navigate('/');
        }
      });
    }
    initialize();
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}

export default (VideoCall)
