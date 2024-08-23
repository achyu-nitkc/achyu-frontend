import Head from "next/head"
import {useRef, useState} from "react";
import {useRouter} from "next/router";

export default function Verify() {
    const inputRefs = useRef([])
    const [inputValues, setInputValues] = useState(Array(8).fill(''))

    const router = useRouter()

    const handleChange = (e, index) => {
        const value = e.target.value
        if (!/^[0-9]$/.test(value)) {
            e.target.value = ''
            return
        }
        const newInputValues = [...inputValues]
        newInputValues[index] = value
        setInputValues(newInputValues)
        if (index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if ((e.key === 'Backspace' || e.key === 'Delete') && index >= 0) {
            e.target.value = ''
            const newInputValues = [...inputValues]
            newInputValues[index] = ''
            if (index > 0) {
                newInputValues[index - 1] = ''
                inputRefs.current[index - 1].focus()
            }
            setInputValues(newInputValues)
        }
    }

    const getCookie = (name) => {
        const value = `;${document.cookie}`
        const parts = value.split(`;${name}=`)
        if (parts.length === 2) {
            return parts.pop().split(';').shift()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const verifyCode = inputValues.join('')
        const jwtData = getCookie('token')
        try {
            const jsonData = {
                Token: jwtData,
                Code: verifyCode
            }
            console.log(JSON.stringify(jsonData))

            const response = await fetch("http://localhost:8080/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(jsonData)
            })
            if (response.ok) {
                const jwt = await response.text()
                const expires = new Date()
                expires.setMonth(expires.getMonth() + 3)
                document.cookie = `token=${jwt};expires=${expires.toUTCString()};path=/`
                await router.push("/home")
            } else if (response.status === 401) {
                console.log("verify failed")
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={"flex flex-col items-center justify-center min-h-screen py-2"}>
            <Head>
                <title>Verify</title>
                <link rel={"icon"} href={"/public/favicon.ico"}/>
            </Head>
            <main className={"flex flex-col items-center justify-center w-full flex-1 px-20 text-center"}>
                <div className={"flex-col bg-white rounded-2xl shadow-2xl flex w-1/4 min-w-min max-w-4xl p-5"}>
                    <div className={"text-left font-bold"}>
                        Achy<span className={"text-blue-600"}>U</span>
                    </div>
                    <div className={"py-10"}>
                        <h2 className={"text-3xl font-bold text-blue-600"}>
                            Verify your account
                        </h2>
                        <div className={"border-2 w-10 border-white inline-block mb-2"}></div>
                        <p className={"mb-2"}>Enter the 8-digit code we sent to you.</p>
                    </div>
                    <form onSubmit={handleSubmit} className={"flex flex-col items-center"}>
                        <div className={"w-100 p-2 flex items-start mb-3"}>
                            {Array.from({length: 8}).map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    className="w-10 h-10 rounded-lg border-2 m-0.5 border-blue-600 text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                        </div>

                        <div className={"border-2 w-10 border-white inline-block mb-2"}></div>
                        <button
                            type={"submit"}
                            className={"border-2 border-blue-600 rounded-full text-blue-600 px-12 py-2 inline-block font-semibold hover:text-white hover:bg-blue-600"}>
                            confirm
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}