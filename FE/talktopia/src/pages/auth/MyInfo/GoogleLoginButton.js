import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
// import axios from "axios";
// import { useEffect } from "react";

const clientId = ''

//  GoogleButton = () => {
//     useEffect(() => {
//         const start = () => {
//             gapi.client.init({
//                 clientId,
//                 scope: 'email',
//             });
//         }
//         gapi.load('client:auth2',start);

//     }, []);

//     const onSuccess = (response) => {
//         console.log(response.xc.id_token);

//         const headers = {
//             'Content-Type' : 'application/json'
//         }

//         const requestBody = {
//             accessToken: response.xc.id_token
//         };

//         const requestBodyJSON = JSON.stringify(requestBody);
//         axios.post("https://localhost:8000/api/v1/social/google", requestBodyJSON, {headers})
//         .then(function (response) {
//             console.log(response);
//         }).catch(function (error) {
//             console.log(error);
//         })
//     };

//     const onFail = (response) => {
//         console.log(response);
//     };


//     return (
//         <div>
//             <GoogleLogin
//                 clientId={clientId}
//                  buttonText="구글 로그인"
//                  onSuccess={onSuccess}
//                  onFailure={onFail}
//              />
//         </div>
//     );
// };



const GoogleLoginButton = () => {
    
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);
                    }}
                    onFailure={(err) => {
                        console.log("안되니?");
                        console.log(err);
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton;