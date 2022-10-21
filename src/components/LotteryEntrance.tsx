import { MouseEventHandler, useState } from "react"
import useLottery from "../hooks/useLottery"

export default () => {
    const { lotteryState, isLoading, openBets, closeBets } = useLottery()

    const [duration, setDuration] = useState<string>("")

    const handleOpenBets: MouseEventHandler = () => {
        if (duration) {
            openBets(duration)
        }
    }

    return (
        <div className="p-5">
            <h3 className="py-2 text-2xl font-medium text-gray-900">Lottery state:</h3>
            <p className="py-2 font-medium text-gray-900">
                {lotteryState.betsOpen ? "Lottery is opened" : "Lottery is closed"}
            </p>
            <p className="py-2 font-medium text-gray-900">
                Bet closing time: {lotteryState.betsClosingTime}
            </p>
            <p className="py-2 font-medium text-gray-900">Bet fee: {lotteryState.betFee}</p>
            <p className="py-2 font-medium text-gray-900">Bet price: {lotteryState.betPrice}</p>
            <p className="py-2 font-medium text-gray-900">
                Purchase ratio: {lotteryState.purchaseRatio}
            </p>
            <label htmlFor="duration" className="block mb-2 text-sm font-medium text-gray-900">
                Enter lottery duration
            </label>
            <input
                type="text"
                id="duration"
                onChange={(e) => setDuration(e.target.value)}
                value={duration}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Duration"
            />
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded ml-auto disabled:bg-gray-400"
                onClick={handleOpenBets}
                disabled={isLoading || !duration}
            >
                Open Bets
            </button>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded ml-auto disabled:bg-gray-400"
                onClick={closeBets}
                disabled={isLoading}
            >
                Close Bets
            </button>
        </div>
    )
}
