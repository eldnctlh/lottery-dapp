import { Contract, ethers } from "ethers"
import { Provider, useEffect, useState } from "react"
import { Lottery } from "../types/Lottery"
import abi from "../constants/abi"
import contractAddresses from "../constants/contractAddresses"
import { useMoralis } from "react-moralis"
import { useNotification } from "@web3uikit/core"
import tokenAbi from "../constants/tokenAbi"

type lotteryStateType = {
    betsClosingTime: string
    ownerPool: string
    prizePool: string
    purchaseRatio: string
    betPrice: string
    betFee: string
    accountPrize: string
    tokenSymbol: string
    tokenName: string
    betsOpen: boolean
}

const useLottery = () => {
    const { account, ...rest } = useMoralis()
    const dispatch = useNotification()
    const [contract, setContract] = useState<Contract>()
    const [tokenContract, setTokenContract] = useState<Contract>()
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
        accountPrize: "",
        tokenSymbol: "",
        tokenName: "",
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
        const paymentToken = await lotteryContract.paymentToken()
        const tokenContract = new ethers.Contract(paymentToken, tokenAbi.abi, signer)

        setSigner(signer)
        setProvider(provider)
        setContract(lotteryContract)
        setTokenContract(paymentToken)
        const tokenName = await tokenContract.name()
        const tokenSymbol = await tokenContract.symbol()
        const betPrice = await lotteryContract.betPrice()
        const betFee = await lotteryContract.betFee()
        const purchaseRatio = await lotteryContract.purchaseRatio()
        const address = await signer.getAddress()
        const accountPrize = await lotteryContract.prize(address)
        const prizePool = await lotteryContract.prizePool()
        const ownerPool = await lotteryContract.ownerPool()
        const betsClosingTime = await lotteryContract.betsClosingTime()

        const date = new Date(0)
        date.setUTCSeconds(Number(betsClosingTime))
        setLotteryState({
            ...lotteryState,
            betFee: ethers.utils.formatEther(betFee),
            betPrice: ethers.utils.formatEther(betPrice),
            purchaseRatio: String(purchaseRatio),
            betsClosingTime: date.toString(),
            accountPrize: ethers.utils.formatEther(accountPrize),
            prizePool: ethers.utils.formatEther(prizePool),
            ownerPool: ethers.utils.formatEther(ownerPool),
            tokenSymbol,
            tokenName,
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
