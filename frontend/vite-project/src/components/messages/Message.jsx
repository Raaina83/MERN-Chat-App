import { extractTime } from '../../utils/extractTime';
import { useSelector } from 'react-redux';
import {Box, Stack, Typography} from '@mui/material'
import { fileFormat } from '../../lib/features';
import RenderAttachment from '../shared/RenderAttachment';

function Message({message}) {
    const {user} = useSelector(state => state.auth)
    const formattedTime = extractTime(message.createdAt)
    const fromMe = user._id === message.senderId._id
    const isGroupChat = message.chat.groupChat
    const chatClassName = fromMe ? "chat-end" : "chat-start"

  return (
    <>
    <div className={`chat ${chatClassName}`}
    style={{
        backgroundColor: "#F9F8F8",
        alignSelf: fromMe ? "flex-end" : "flex-start",
        display: "flex",
        flexDirection: "row",
        margin: "1rem 1rem 0 0",
        padding: "0.5rem 0.5rem",
        borderRadius: "8px",
        width: "fit-content",
        maxWidth: "50%",
        alignItems: "flex-end"
    }}
    // initial={{opacity: 0, x: "-100%"}}
    // whileInView={{opacity: 1, x: 0}}
    >
        <Stack sx={{display: 'flex'}}>
            {isGroupChat && <Typography sx={{fontSize: 13}}>{message.senderId.fullName}</Typography>}
            <Typography variant='h6'>{message.message}</Typography>
        </Stack>
         

        {message.attachments?.length > 0 && (message.attachments.map((attachment, index) => {
            const url = attachment.url
            const file = fileFormat(url)

            return (
                <Box key={index}>
                     <a href={url} target='_blank' download>
                        {RenderAttachment(file, url)}
                     </a>
                </Box>
            )
        }))}

        <Typography variant='caption'>{formattedTime}</Typography>
    </div>

</>
  )
}

export default Message