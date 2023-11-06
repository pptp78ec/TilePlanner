import { useGoogleLogin } from '@react-oauth/google';
import React from 'react'
import styles from './CustomGoogleButton.module.css'
import axios from 'axios';
import { UserService } from '../../../../../../services/user.service';
import { useNavigate } from 'react-router-dom';
export default function CustomGoogleButtonDesktop() {
  const navigate = useNavigate(); // Получаем функцию для навигации
    const googleLogin = useGoogleLogin({
        onSuccess: async tokenResponse => {
          // console.log(tokenResponse);
          // fetching userinfo can be done on the client or the server
          const userInfo = await axios
            .get('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            })
            .then(res => res.data);
            let data={};
            data.login=userInfo.sub;
            data.password=userInfo.sub;
            data.name=userInfo.given_name;
            data.email=userInfo.email;
            data.isGoogle=true;
            
            data.userImageId=userInfo.picture;
            UserService.googleAuth(data,navigate);
          // console.log(userInfo);
        },
        // flow: 'implicit', // implicit is the default
        });
    return (
       
            <div className={styles.auth_google} onClick={googleLogin}>
                <div className={styles.google} >
                    Вхід з
                </div>
                <div className={styles.google_icon}>
                    <img src="./login_google_icon.svg" />
                </div>
            </div>
    )
}
