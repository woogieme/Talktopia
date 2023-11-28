import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import axios from "axios";
import jwtDecode from "jwt-decode";

const GoogleLoginButton = () => {
    const clientId = '489570255387-1e0n394ptqvja97m2sl6rpf3bta0hjb0.apps.googleusercontent.com'
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);
                        const decodeJwt = jwtDecode(res.credential);

                        const headers = {
                            'Content-Type': 'application/json'
                          };
                      
                          const requestBody = {
                            userEmail: decodeJwt.email,
                            userName: decodeJwt.name,
                            userId: decodeJwt.sub
                          };
                      
                          const requestBodyJSON = JSON.stringify(requestBody);
                          console.log(requestBodyJSON);
                      
                          axios.post(`https://talktopia.site:10001/api/v1/social/google`, requestBodyJSON, { headers })
                            .then(function (response) {
                              console.log(response);
                            }).catch(function (error) {
                              console.log(error);
                            });
                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton