import Head from "next/head"
import Link from "next/link"
import {FaRegEnvelope} from "react-icons/fa";
import {MdLockOutline,MdDriveFileRenameOutline} from "react-icons/md";
import {useState} from "react";
import {useRouter} from "next/router";

export default function Signup() {
    const [formData,setFormData] = useState({
        Email:"",
        Password:"",
        DisplayName:""
    })
    const router = useRouter()

    const handleChange = (e) => {
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]:value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            const response = await fetch(
                "http://localhost:8080/create",{
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(formData)
                }
            )
            if (response.ok) {
                const jwt = await response.text()
                const expires = new Date()
                expires.setMinutes(expires.getMinutes() + 5)
                document.cookie = `token=${jwt};expires=${expires.toUTCString()};path=/signup`
                await router.push("/verify")
            } else if (response.status == 401) {
                console.log("signup failed")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Signup</title>
                <link rel={"icon"} href={"/public/favicon.ico"}/>
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"flex-col bg-white rounded-2xl min-w-min shadow-2xl flex w-1/4 max-w-4xl p-5"}>
                    <div className={"text-left font-bold"}>
                        Achy<span className={"text-blue-600"}>U</span>
                    </div>
                    <div className={"py-10"}>
                        <h2 className={"text-3xl font-bold text-blue-600"}>
                            Sign up the Account
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className={"flex flex-col items-center"}>
                        <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                            <FaRegEnvelope className={"text-gray-400 mr-2"}/>
                            <input type={"email"} name={"Email"}
                                   placeholder={"Email"}
                                   onChange={handleChange}
                                   required className={"bg-gray-100 outline-none text-sm flex-1"}/>
                        </div>

                        <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                            <MdLockOutline className={"text-gray-400 mr-2"}/>
                            <input type={"password"} name={"Password"}
                                   placeholder={"Password"} required
                                   onChange={handleChange}
                                   className={"bg-gray-100 outline-none text-sm flex-1"}/>
                        </div>
                        <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                            <MdDriveFileRenameOutline className={"text-gray-400 mr-2"}/>
                            <input type={"text"} name={"DisplayName"}
                                   placeholder={"DisplayName"}
                                   onChange={handleChange}
                                   required className={"bg-gray-100 outline-none text-sm flex-1"}/>
                        </div>
                        <div className={"border-2 w-10 border-white inline-block mb-2"} />
                        <button type={"submit"}
                                className={"border-2 border-blue-600 rounded-full text-blue-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-blue-600"}>
                            Sign up!
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}