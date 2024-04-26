import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../header/Header'
import { Grid, Drawer } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useMyChatsQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hooks'
import { setIsMobileMenu } from '../../redux/reducers/misc'
import ConversationBox from '../sidebar/ConversationBox'

const AppLayout = () => (WrappedComponent) => {
    return (props) => {
        const params = useParams()
        const chatId = params.chatId

        const {isMobileMenu} = useSelector((state) => state.misc)
        const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
        const dispatch = useDispatch()

        const handleMobileClose = () => dispatch(setIsMobileMenu(false))

        useErrors([{isError, error}])

        return (
        <div className='w-[100vw] h-[100vh] flex flex-col relative'>
            <div className='w-[100vw] h-[10vh] bg-slate-300 static top-0'>
                <Header></Header>
            </div>

            <Grid>
                <Grid height={"90vh"}>
                    <Drawer open={isMobileMenu} onClose={handleMobileClose}>
                        {isLoading ? (
                        <span className=' loading loading-spinner'></span>
                        ) :( 
                        <ConversationBox chats={data?.chats}></ConversationBox>
                        )}
                    </Drawer>
                </Grid>

                <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
                    <WrappedComponent {...props} chatId={chatId}  />
                </Grid>
                

                {/* <div className='w-[100vw] h-[90vh] bg-white flex' >
                    <Sidebar className='hidden sm:flex' />
                    <MessageContainer/>
                </div> */}
            </Grid>
            
        </div>
        )
    }
}

export default AppLayout