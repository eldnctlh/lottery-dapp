import { Contract, ethers } from "ethers"
import { Provider, useEffect, useState } from "react"
import { Lottery } from "../types/Lottery"
import abi from "../constants/abi"
import contractAddresses from "../constants/contractAddresses"
import { useMoralis } from "react-moralis"
import { useNotification } from "@web3uikit/core"

type lotteryStateType = {
    betsClosingTime: string
    ownerPool: string
    prizePool: string
    purchaseRatio: string
    betPrice: string
    betFee: string
    betsOpen: boolean
}

const useLottery = () => {
    const { account, ...rest } = useMoralis()
    const dispatch = useNotification()
    const [contract, setContract] = useState<Contract>()
    const [provider, setProvider] = useState<ethers.providers.Provider>()
    const [signer, setSigner] = useState<ethers.Signer>()
    const [lotteryState, setLotteryState] = useState<lotteryStateType>({
        betsClosingTime: "",
        ownerPool: "",
        prizePool: "",
        purchaseRatio: "",
        betPrice: "",
        betFee: "",
        betsOpen: false,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        initContracts()
    }, [])

    const initContracts = async () => {
        setIsLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const lotteryContract = new ethers.Contract(
            contractAddresses.lotteryContract,
            abi.abi,
            signer
        )

        setSigner(signer)
        setProvider(provider)
        setContract(lotteryContract)
        const betPrice = await lotteryContract.betPrice()
        const betFee = await lotteryContract.betFee()
        const purchaseRatio = await lotteryContract.purchaseRatio()
        const betsClosingTime = await lotteryContract.betsClosingTime()

        const date = new Date(0)
        date.setUTCSeconds(Number(betsClosingTime))
        setLotteryState({
            ...lotteryState,
            betFee: ethers.utils.formatEther(betFee),
            betPrice: ethers.utils.formatEther(betPrice),
            purchaseRatio: String(purchaseRatio),
            betsClosingTime: date.toString(),
        })
        setIsLoading(false)
    }

    const updateDynamicState = async () => {
        if (contract) {
            const betsClosingTime = await contract.betsClosingTime()
            const date = new Date(0)
            date.setUTCSeconds(Number(betsClosingTime))
            setLotteryState({
                ...lotteryState,
                betsClosingTime: date.toDateString(),
            })
        }
    }

    const openBets = async (duration: string) => {
        if (provider && contract) {
            setIsLoading(true)
            try {
                const currentBlock = await provider.getBlock("latest")
                const tx = await contract.openBets(currentBlock.timestamp + Number(duration))
                const receipt = await tx.wait()
                await updateDynamicState()
                setLotteryState({
                    ...lotteryState,
                    betsOpen: true,
                })
                dispatch({
                    type: "info",
                    message: `Bets opened: ${receipt.transactionHash}`,
                    title: "Tx Notification",
                    position: "topR",
                })
            } catch (err) {
                dispatch({
                    type: "error",
                    message: `Error message: ${err.message}`,
                    title: "Error",
                    position: "topR",
                })
            }
            setIsLoading(false)
        }
    }

    const closeBets = async () => {
        if (contract) {
            setIsLoading(true)
            try {
                const tx = await contract.closeLottery()
                const receipt = await tx.wait()
                await updateDynamicState()
                setLotteryState({
                    ...lotteryState,
                    betsOpen: false,
                })
                dispatch({
                    type: "info",
                    message: `Bets closed: ${receipt.transactionHash}`,
                    title: "Tx Notification",
                    position: "topR",
                })
            } catch (err) {
                dispatch({
                    type: "error",
                    message: `Error message: ${err.message}`,
                    title: "Error",
                    position: "topR",
                })
            }

            setIsLoading(false)
        }
    }

    const bet = async (amount: string) => {
        //TODO: bet {amount} times
    }

    return { lotteryState, openBets, isLoading, closeBets, bet }
}

export default useLottery
