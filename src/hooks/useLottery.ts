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
    accountBalance: string
    tokenSymbol: string
    tokenName: string
    betsOpen: boolean
}

const useLottery = () => {
    const dispatch = useNotification()
    const [lotteryContract, setLotteryContract] = useState<Contract>()
    const [tokenContract, setTokenContract] = useState<Contract>()
    const [provider, setProvider] = useState<ethers.providers.Provider>()
    const [signer, setSigner] = useState<ethers.Signer>()
    const [accountAddress, setAccountAddress] = useState<string>()
    const [lotteryState, setLotteryState] = useState<lotteryStateType>({
        betsClosingTime: "",
        ownerPool: "",
        prizePool: "",
        purchaseRatio: "",
        betPrice: "",
        betFee: "",
        betsOpen: false,
        accountPrize: "",
        accountBalance: "",
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
        const address = await signer.getAddress()

        const lotteryContract = new ethers.Contract(
            contractAddresses.lotteryContract,
            abi.abi,
            signer
        )
        const paymentToken = await lotteryContract.paymentToken()
        const tokenContract = new ethers.Contract(paymentToken, tokenAbi.abi, signer)

        setSigner(signer)
        setProvider(provider)
        setLotteryContract(lotteryContract)
        setTokenContract(tokenContract)
        setAccountAddress(address)
        const tokenName = await tokenContract.name()
        const tokenSymbol = await tokenContract.symbol()
        const accountBalance = await tokenContract.balanceOf(address)
        const betPrice = await lotteryContract.betPrice()
        const betFee = await lotteryContract.betFee()
        const purchaseRatio = await lotteryContract.purchaseRatio()
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
            betsClosingTime: date.toString().slice(0, 24),
            accountPrize: ethers.utils.formatEther(accountPrize),
            accountBalance: ethers.utils.formatEther(accountBalance),
            prizePool: ethers.utils.formatEther(prizePool),
            ownerPool: ethers.utils.formatEther(ownerPool),
            tokenSymbol,
            tokenName,
        })
        setIsLoading(false)
    }

    const updateDynamicState = async () => {
        if (lotteryContract && tokenContract) {
            const betsClosingTime = await lotteryContract.betsClosingTime()
            const accountBalance = await tokenContract.balanceOf(accountAddress)
            const date = new Date(0)
            date.setUTCSeconds(Number(betsClosingTime))
            setLotteryState({
                ...lotteryState,
                betsClosingTime: date.toDateString().slice(0, 24),
                accountBalance: ethers.utils.formatEther(accountBalance),
            })
        }
    }

    const openBets = async (duration: string) => {
        if (provider && lotteryContract) {
            setIsLoading(true)
            try {
                const tx = await lotteryContract.openBets(Date.now() + Number(duration))
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
                console.log(err)
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
        if (lotteryContract) {
            setIsLoading(true)
            try {
                const tx = await lotteryContract.closeLottery()
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
                console.log(err)
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

    const buyTokens = async (amount: string) => {
        if (lotteryContract && amount) {
            setIsLoading(true)
            try {
                const value = ethers.utils.parseEther(amount)
                const tx = await lotteryContract.purchaseTokens({
                    value,
                })
                const receipt = await tx.wait()
                await updateDynamicState()
                dispatch({
                    type: "info",
                    message: `Tokens bought: ${receipt.transactionHash}`,
                    title: "Tx Notification",
                    position: "topR",
                })
            } catch (err) {
                console.log(err)
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
        if (lotteryContract && tokenContract && amount) {
            setIsLoading(true)
            try {
                const allowTx = await tokenContract.approve(
                    accountAddress,
                    ethers.constants.MaxUint256
                )
                console.log(allowTx)
                const rec = await allowTx.wait()
                console.log(allowTx)
                console.log(rec)

                const tx = await lotteryContract.betMany(amount)
                const receipt = await tx.wait()
                console.log(`Bets placed (${receipt.transactionHash})\n`)

                await updateDynamicState()
                dispatch({
                    type: "info",
                    message: `Bet placed: ${receipt.transactionHash}`,
                    title: "Tx Notification",
                    position: "topR",
                })
            } catch (err) {
                console.log(err)
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

    return { lotteryState, openBets, isLoading, closeBets, bet, buyTokens }
}

export default useLottery
