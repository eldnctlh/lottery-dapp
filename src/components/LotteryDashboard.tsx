import { MouseEventHandler, useState } from "react"
import useLottery from "../hooks/useLottery"

export default () => {
    const { lotteryState, isLoading, openBets, closeBets, bet, buyTokens } = useLottery()

    const [duration, setDuration] = useState<string>("")
    const [betAmount, setBetAmount] = useState<string>("1")
    const [burnAmount, setBurnAmount] = useState<string>("")
    const [tokensAmount, setTokensAmount] = useState<string>("")
    const [withdrawPrizeAmount, setWithdrawPrizeAmount] = useState<string>("")
    const [withdrawOwnerPrizeAmount, setWithdrawOwnerPrizeAmount] = useState<string>("")

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

    const handleBuyTokens: MouseEventHandler = () => {
        if (tokensAmount) {
            buyTokens(tokensAmount)
        }
    }

    const handleBurnTokens: MouseEventHandler = () => {}

    return (
        <div className="pt-10 flex justify-center">
            {/* Lottery state */}
            <div className="max-w-sm rounded overflow-hidden shadow-lg p-5 mx-3 min-w-max">
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
                <p className="py-2 font-medium text-gray-900">
                    Bet fee: {Number(lotteryState.betFee).toFixed(2)} {lotteryState.tokenSymbol}
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Bet price: {lotteryState.betPrice} ETH
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Purchase ratio: {lotteryState.purchaseRatio}
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Prize pool: {Number(lotteryState.prizePool).toFixed(2)}{" "}
                    {lotteryState.tokenSymbol}
                </p>
                <p className="py-2 font-medium text-gray-900">
                    Owner pool: {Number(lotteryState.ownerPool).toFixed(2)}{" "}
                    {lotteryState.tokenSymbol}
                </p>
            </div>
            <div className="flex flex-wrap">
                {/* Manage Lottery state */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3">
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
                {/* Buy tokens */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Buy {lotteryState.tokenName}
                    </h3>
                    <label
                        htmlFor="tokensAmount"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Amount of {lotteryState.tokenSymbol} to buy
                    </label>
                    <p className="py-2 font-medium text-sm text-gray-600">
                        1 ETH = {1 * Number(lotteryState.purchaseRatio)} {lotteryState.tokenSymbol}
                    </p>
                    <input
                        type="text"
                        id="tokensAmount"
                        onChange={(e) => setTokensAmount(e.target.value)}
                        value={tokensAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                        onClick={handleBuyTokens}
                        disabled={isLoading || !tokensAmount}
                    >
                        Buy {Number(tokensAmount) * Number(lotteryState.purchaseRatio)}{" "}
                        {lotteryState.tokenSymbol}
                    </button>
                </div>
                {/* Manage bets */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Manage bets
                    </h3>
                    <label
                        htmlFor="betAmount"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        How many times to bet with {lotteryState.betPrice}{" "}
                        {lotteryState.tokenSymbol} + {Number(lotteryState.betFee).toFixed(2)}{" "}
                        {lotteryState.tokenSymbol} fees
                    </label>
                    <input
                        type="text"
                        id="betAmount"
                        onChange={(e) => setBetAmount(e.target.value)}
                        value={betAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                        onClick={handleBet}
                        disabled={isLoading || !betAmount}
                    >
                        Bet
                    </button>
                </div>
                {/* Withdraw */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Withdraw
                    </h3>
                    <label
                        htmlFor="withdrawPrizeAmount"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Prize withdraw amount
                    </label>
                    <p className="py-2 font-medium text-sm text-gray-600">
                        Your account's prize: {lotteryState.accountPrize} {lotteryState.tokenSymbol}
                    </p>
                    <input
                        type="text"
                        id="withdrawPrizeAmount"
                        onChange={(e) => setWithdrawPrizeAmount(e.target.value)}
                        value={withdrawPrizeAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                        onClick={handleOpenBets}
                        disabled={isLoading || !withdrawPrizeAmount}
                    >
                        Withdraw prize
                    </button>
                </div>
                {/* Withdraw as owner */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Withdraw as owner
                    </h3>
                    <label
                        htmlFor="withdrawOwnerPrizeAmount"
                        className="mt-5 block mb-2 text-sm font-medium text-gray-900"
                    >
                        Owners prize withdraw amount
                    </label>
                    <input
                        type="text"
                        id="withdrawOwnerPrizeAmount"
                        onChange={(e) => setWithdrawOwnerPrizeAmount(e.target.value)}
                        value={withdrawOwnerPrizeAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                        onClick={handleOpenBets}
                        disabled={isLoading || !withdrawOwnerPrizeAmount}
                    >
                        Withdraw owner's prize
                    </button>
                </div>
                {/* Burn */}
                <div className="w-2/5 rounded overflow-hidden shadow-lg p-5 mx-3 mt-5">
                    <h3 className="py-2 text-xl font-medium text-gray-900 text-center border-b-2 mb-5">
                        Burn tokens
                    </h3>
                    <label
                        htmlFor="burnAmount"
                        className="block mb-2 text-sm font-medium text-gray-900"
                    >
                        Tokens amount
                    </label>
                    <p className="py-2 font-medium text-sm text-gray-600">
                        Your account's balance: {Number(lotteryState.accountBalance).toFixed(2)}{" "}
                        {lotteryState.tokenSymbol}
                    </p>
                    <input
                        type="text"
                        id="burnAmount"
                        onChange={(e) => setBurnAmount(e.target.value)}
                        value={burnAmount}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Amount"
                    />
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 my-2 rounded disabled:bg-gray-400"
                        onClick={handleBurnTokens}
                        disabled={isLoading || !burnAmount}
                    >
                        Burn tokens
                    </button>
                </div>
            </div>
        </div>
    )
}
