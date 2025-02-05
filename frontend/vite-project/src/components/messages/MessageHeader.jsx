import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "../../socket";
import { setCallId, setIsCallActive } from "../../redux/reducers/misc";

function MessageHeader({ conversationUser }) {
  const socket = getSocket();
  console.log("socket",socket);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const initiateCall = async (targetUserId) => {
    console.log("Initiating call...");

    const generatedCallId = Date.now().toString();
    dispatch(setCallId(generatedCallId));
    dispatch(setIsCallActive(true));

    socket.emit("call-user", { targetUserId, userId: user._id, callId: generatedCallId });
  };

  return (
    <div className="w-full bg-slate-100 sticky top-0 z-20 h-[15%]">
      <div className="w-full h-full bg-slate-200 flex p-4 items-center">
        <div className="avatar rounded-full w-[50px] h-[50px]">
          <img src={conversationUser[0].profile.url} className="rounded-full" alt="profile" />
        </div>
        <div className="flex flex-1">
          <p className="text-md ms-4">{conversationUser[0].fullName}</p>
        </div>
        <button
          onClick={() => initiateCall(conversationUser[0]._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Call
        </button>
      </div>
    </div>
  );
}

export default MessageHeader;
