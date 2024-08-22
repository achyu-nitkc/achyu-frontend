import {FaGoogle, FaRegEnvelope} from "react-icons/fa";
import Head from "next/head"
import {MdLockOutline} from "react-icons/md";
import Link from "next/link"
import {useState} from "react";
import {useRouter} from "next/router";

export default function Login() {
    const [formData,setFormData] = useState({
        Email:"",
        Password: "",
    })
    const router = useRouter()

    const handleChange = (e) => {
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            console.log(formData)
            const response = await fetch("http://localhost:8080/login",{
                method: "POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(formData)
            })
            if (response.ok) {
                const jwt = await response.text()
                const expires = new Date()
                expires.setMonth(expires.getMonth()+3)
                document.cookie = `token=${jwt};expires=${expires.toUTCString()};path=/login`
                //router.push("#")
            } else if (response.status == 401) {
                console.log("login failed")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Login</title>
                <link rel={"icon"} href={"/public/favicon.ico"} />
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl"}>
                    <div className={"w-3/5 p-5"}>
                        <div className={"text-left font-bold"}>
                            Achy<span className={"text-blue-600"}>U</span>
                        </div>
                        <div className={"py-10"} >
                            <h2 className={"text-3xl font-bold text-blue-600"}>
                                Sign in to Account
                            </h2>
                            <div className={"border-2 w-10 border-blue-600 inline-block mb-2"}></div>
                            <div className={"flex justify-center my-2"}>
                                <a href={"http://localhost:8080/Oauth"}
                                   className={"border-2 border-gray-200 rounded-full p-3 mx-1"}>
                                    <FaGoogle className={"text-sm"}/>
                                </a>
                            </div>
                            <p className={"text-gray-600 my-3"}>use your email account</p>
                            <form onSubmit={handleSubmit} className={"flex flex-col items-center"}>
                                <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                                    <FaRegEnvelope className={"text-gray-400 mr-2"}/>
                                    <input type={"email"} name={"Email"} onChange={handleChange} placeholder={"Email"}
                                           required className={"bg-gray-100 outline-none text-sm flex-1"}/>
                                </div>
                                <div className={"bg-gray-100 w-64 p-2 flex items-center mb-3"}>
                                    <MdLockOutline className={"text-gray-400 mr-2"}/>
                                    <input type={"password"} name={"Password"} onChange={handleChange}
                                           placeholder={"Password"} required
                                           className={"bg-gray-100 outline-none text-sm flex-1"}/>
                                </div>
                                <button type={"submit"}
                                        className={"border-2 border-blue-600 rounded-full text-blue-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-blue-600"}>
                                    Sign in
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className={"w-2/5 p-5 bg-blue-600 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12"}>
                        <h2 className={"text-3xl font-bold mb-2"}>Get started!</h2>
                        <div className={"border-2 w-10 border-white inline-block mb-2"}></div>
                        <p className={"mb-2"}>Share your region state.</p>
                        <Link href={"#"}
                              className={"border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-blue-600"}>Sign
                            Up</Link>
                    </div>
                </div>
            </main>
        </div>
    )
}