import React, { useState } from "react";
import Heading from "../components/Heading";
import SubHeading from "../components/SubHeading";
import InputBox from "../components/InputBox";
import { BottomWarning } from "../components/BottomWarning";
import Button from "../components/ButtonComponent";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign in"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox placeholder="harkirat@gmail.com" label={"Email"} value={email} onChange={e => setEmail(e.target.value)} />
                    <InputBox placeholder={"123456"} label={"Password"} value={password} onChange={e => setPassword(e.target.value)} />
                    <div className="pt-4">
                        <Button onClick={async () => {
                            const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
                                username : email,
                                password : password
                            }).catch(function (error) {
                                if (error.response) {
                                  console.log('Server responded with status code:', error.response.status);
                                  console.log('Response data:', error.response.data);
                                } else if (error.request) {
                                  console.log('No response received:', error.request);
                                } else {
                                  console.log('Error creating request:', error.message);
                                }
                              });
                            if (response && response.data && response.data.token) {
                                localStorage.setItem("token", response.data.token);
                                navigate("/dashboard");
                            }
                        }} label={"Sign in"} />
                    </div>
                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
                </div>
            </div>
        </div>
    )
}
