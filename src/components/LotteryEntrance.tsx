import { MouseEventHandler, useState } from "react"
import useLottery from "../hooks/useLottery"

export default () => {
    const { lotteryState, isLoading, openBets, closeBets, bet } = useLottery()

    const [duration, setDuration] = useState<string>("")
    const [betAmount, setBetAmount] = useState<string>("1")

    const handleOpenBets: MouseEventHandler = () => {
        if (duration) {
            openBets(duration)
        }
    }

    const handleBet: MouseEventHandler = () => {
        if (betAmount) {
            bet(betAmount)
        }
    }

    return (
        <div className="pt-10 flex justify-center">
            <div className="max-w-sm rounded overflow-hidden shadow-lg p-5 mx-3">
                <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                    Lottery state
                </h3>
                <p
                    className={`py-2 font-medium ${
                        lotteryState.betsOpen ? "text-emerald-500" : "text-red-500"
                    }`}
                >
                    {lotteryState.betsOpen ? "Lottery is opened" : "Lottery is closed"}
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Bet closing time: {lotteryState.betsClosingTime}
                </p>
                <p className="py-2 font-medium text-gray-900">Bet fee: {lotteryState.betFee} ETH</p>
                <p className="py-2 font-medium text-gray-900">
                    Bet price: {lotteryState.betPrice} ETH
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Purchase ratio: {lotteryState.purchaseRatio}
                </p>
            </div>
            <div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg p-5 mx-3">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Manage lottery state
                    </h3>
                    <label
                        htmlFor="duration"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Enter lottery duration in seconds
                    </label>
                    <input
                        type="text"
                        id="duration"
                        onChange={(e) => setDuration(e.target.value)}
                        value={duration}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Duration"
                    />
                    <div className="flex justify-start">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                            onClick={handleOpenBets}
                            disabled={isLoading || !duration}
                        >
                            Open Bets
                        </button>
                        <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 ml-2 px-4 my-2 rounded disabled:bg-gray-400"
                            onClick={closeBets}
                            disabled={isLoading}
                        >
                            Close Bets
                        </button>
                    </div>
                </div>
                <div className="max-w-sm rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Manage bets
                    </h3>
                    <label
                        htmlFor="betAmount"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        How many times to bet with {lotteryState.betPrice} ETH +{" "}
                        {Number(lotteryState.betFee).toFixed(2)} ETH fees
                    </label>
                    <input
                        type="text"
                        id="betAmount"
                        onChange={(e) => setBetAmount(e.target.value)}
                        value={betAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <div className="flex justify-start">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                            onClick={handleOpenBets}
                            disabled={isLoading || !betAmount}
                        >
                            Bet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
