import { ListItemText, Menu, MenuItem, MenuList } from '@mui/material'
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc'
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import toast from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';


const FileMenu = ({ anchorE1, chatId}) => {
  const dispatch = useDispatch()
  const {isFileMenu} = useSelector((state) => state.misc)
  const [sendAttachments] = useSendAttachmentsMutation()

  const imageRef = useRef(null)
  const audioRef = useRef(null)
  const videoRef = useRef(null)
  const fileRef = useRef(null)

  const closeHandler = () => {
    dispatch(setIsFileMenu(false))
  }

  const selectRef = (ref) => {
    ref.current.click()
  }

  const fileChangeHandler = async(e, key) => {
    const files = Array.from(e.target.files);

    if(files.length <= 0) return;

    if(files.length > 5) 
      return toast.error(`You can only send 5 ${key} at a time.`)

    dispatch(setUploadingLoader(true))

    const toastId = toast.loading(`Sending ${key}...`)
    closeHandler()

    try {
      const formData = new FormData()
      formData.append("chatId", chatId)
      files.forEach((file) => formData.append("files", file))

      const res = await sendAttachments(formData)

      if(res.data) toast.success(`${key} sent successfully!`, {id: toastId})
      else toast.error(`Failed to send ${key}.`, {id: toastId})
    } catch (error) {
      toast.error(error, {id: toastId})
    } finally {
      dispatch(setUploadingLoader(false))
    }

  }

  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeHandler}>
      <div style={{
        width: "10rem"
      }}>
      <MenuList>
        <MenuItem onClick={() => selectRef(imageRef)}>
            <ImageIcon/>
          <ListItemText style={{
            marginLeft: "1rem",
          }}>Image</ListItemText>
          <input 
            type="file"
            multiple
            accept="image/png, img/jpeg, img/gif"
            style={{
              display: "none"
            }}
            ref={imageRef}
            onChange={(e) => fileChangeHandler(e, "Images")}/>
        </MenuItem>
    
        <MenuItem onClick={() => selectRef(videoRef)}>
            <VideoFileIcon/>
          <ListItemText style={{
            marginLeft: "1rem",
          }}>Video</ListItemText>
          <input 
            type="file"
            multiple
            accept="video/mp4, video/webm, video/ogg"
            style={{
              display: "none"
            }}
            ref={videoRef}
            onChange={(e) => fileChangeHandler(e, "Videos")}/>
        </MenuItem>
      
        <MenuItem onClick={() => selectRef(audioRef)}>
            <AudioFileIcon/>
          <ListItemText style={{
            marginLeft: "1rem",
          }}>Audio</ListItemText>
          <input 
            type="file"
            multiple
            accept="audio/mpeg, audio/wav, audio/ogg"
            style={{
              display: "none"
            }}
            ref={audioRef}
            onChange={(e) => fileChangeHandler(e, "Audios")}/>
        </MenuItem>

        <MenuItem onClick={() => selectRef(fileRef)}>
            <UploadFileIcon/>
          <ListItemText style={{
            marginLeft: "1rem",
          }}>File</ListItemText>
          <input 
            type="file"
            multiple
            accept="*"
            style={{
              display: "none"
            }}
            ref={fileRef}
            onChange={(e) => fileChangeHandler(e, "Files")}/>
        </MenuItem>
      </MenuList>

      </div>
    </Menu>
  )
}

export default FileMenu