import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { refreshPosts } from "../layouts/StipePage";

const SOCKET_SERVER_URL = 'http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/notifications';


const Notification = ({ children }: {children: React.ReactNode}) => {
    const [notifications, setNotifications] = useState<{ data: string; user: string } | null>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            extraHeaders: {
                Authorization: `Bearer `,
            }
        });

        socket.on('newPost', (data) => {
            setNotifications({
                data: data.message,
                user: data.user,
            });
            console.log('Нове повідомлення: ', data.message, data.user);
            refreshPosts();
            setOpen(true);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Snackbar open={open} autoHideDuration={10000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
                    {notifications ? `New post by ${notifications.user}: ${notifications.data}` : ""}
                </Alert>
            </Snackbar>
            {children}
        </>
    );
};

export default Notification;