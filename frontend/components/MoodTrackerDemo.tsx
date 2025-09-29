"use client";

import { useEffect, useState } from "react";
import { useMoodTracker } from "../hooks/useMoodTracker";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { useMetaMaskEthersSigner } from "../hooks/metamask/useMetaMaskEthersSigner";
import { errorNotDeployed } from "./ErrorNotDeployed";
import { useFhevm } from "../fhevm/useFhevm";

export const MoodTrackerDemo = () => {
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();
  const {
    provider,
    chainId,
    accounts,
    isConnected,
    connect,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
    initialMockChains,
  } = useMetaMaskEthersSigner();

  //////////////////////////////////////////////////////////////////////////////
  // FHEVM instance
  //////////////////////////////////////////////////////////////////////////////

  const {
    instance: fhevmInstance,
    status: fhevmStatus,
  } = useFhevm({
    provider,
    chainId,
    initialMockChains,
    enabled: true,
  });

  //////////////////////////////////////////////////////////////////////////////
  // MoodTracker hook
  //////////////////////////////////////////////////////////////////////////////

  const moodTracker = useMoodTracker({
    instance: fhevmInstance,
    fhevmDecryptionSignatureStorage,
    eip1193Provider: provider,
    chainId,
    ethersSigner,
    ethersReadonlyProvider,
    sameChain,
    sameSigner,
  });

  //////////////////////////////////////////////////////////////////////////////
  // Local state
  //////////////////////////////////////////////////////////////////////////////

  const [selectedEmoji, setSelectedEmoji] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [showAlreadyRecordedModal, setShowAlreadyRecordedModal] = useState<boolean>(false);
  const [hasRecordedToday, setHasRecordedToday] = useState<boolean>(false);
  const [localMoodHistory, setLocalMoodHistory] = useState<Map<number, { emoji: number; message: string; timestamp: number }>>(new Map());

  //////////////////////////////////////////////////////////////////////////////
  // Local Storage Helpers
  //////////////////////////////////////////////////////////////////////////////

  const MOOD_HISTORY_KEY = 'moodTracker_history';

  const loadMoodHistoryFromStorage = (): Map<number, { emoji: number; message: string; timestamp: number }> => {
    try {
      const stored = localStorage.getItem(MOOD_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert back to Map
        const map = new Map<number, { emoji: number; message: string; timestamp: number }>();
        Object.entries(parsed).forEach(([key, value]) => {
          map.set(parseInt(key), value as { emoji: number; message: string; timestamp: number });
        });
        return map;
      }
    } catch (error) {
      console.error('Failed to load mood history from storage:', error);
    }
    return new Map();
  };

  const saveMoodHistoryToStorage = (history: Map<number, { emoji: number; message: string; timestamp: number }>) => {
    try {
      // Convert Map to object for storage
      const obj: Record<string, { emoji: number; message: string; timestamp: number }> = {};
      history.forEach((value, key) => {
        obj[key.toString()] = value;
      });
      localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(obj));
    } catch (error) {
      console.error('Failed to save mood history to storage:', error);
    }
  };

  //////////////////////////////////////////////////////////////////////////////
  // Effects
  //////////////////////////////////////////////////////////////////////////////

  // Load mood history from localStorage on component mount
  useEffect(() => {
    const history = loadMoodHistoryFromStorage();
    setLocalMoodHistory(history);
  }, []);

  useEffect(() => {
    if (moodTracker.contractAddress && ethersSigner) {
      moodTracker.loadUserMoods(ethersSigner.address);
      moodTracker.hasRecordedToday().then(setHasRecordedToday);
    }
  }, [moodTracker.contractAddress, ethersSigner, moodTracker]);

  //////////////////////////////////////////////////////////////////////////////
  // Handlers
  //////////////////////////////////////////////////////////////////////////////

  const handleRecordMood = async () => {
    if (!message.trim()) {
      alert("Please enter a message for your mood!");
      return;
    }

    try {
      const todayTimestamp = Math.floor(Date.now() / (1000 * 86400));

      await moodTracker.recordMood(selectedEmoji, message);

      // Save to local storage
      const newHistory = new Map(localMoodHistory);
      newHistory.set(todayTimestamp, {
        emoji: selectedEmoji,
        message: message,
        timestamp: Date.now()
      });
      setLocalMoodHistory(newHistory);
      saveMoodHistoryToStorage(newHistory);

      setMessage("");

      // Refresh data
      if (ethersSigner) {
        await moodTracker.loadUserMoods(ethersSigner.address);
        const recorded = await moodTracker.hasRecordedToday();
        setHasRecordedToday(recorded);
      }
    } catch (error: unknown) {
      console.log("Error object:", error); // 调试用

      // Check if it's the "Already recorded mood today" error
      // 检查多种可能的错误格式
      const err = error as any; // Type assertion for error handling
      const isAlreadyRecordedError =
        err?.reason === "Already recorded mood today" ||
        err?.message?.includes("Already recorded mood today") ||
        err?.revert?.args?.[0] === "Already recorded mood today" ||
        (err?.data && typeof err.data === 'string' &&
         err.data.includes("416c7265616479207265636f72646564206d6f6f6420746f646179")); // hex编码的错误消息

      if (isAlreadyRecordedError) {
        setShowAlreadyRecordedModal(true);
        return;
      }

      // For other errors, show generic alert
      alert(`Failed to record mood: ${err?.message || String(error)}`);
    }
  };

  const handleDecryptMood = async (dayTimestamp: number) => {
    await moodTracker.decryptMood(dayTimestamp);
  };

  //////////////////////////////////////////////////////////////////////////////
  // UI Components
  //////////////////////////////////////////////////////////////////////////////

  const buttonClass =
    "inline-flex items-center justify-center rounded-xl px-4 py-3 font-semibold text-white shadow-sm transition-colors duration-200 hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const cardClass =
    "rounded-2xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl transition-shadow duration-200";

  const titleClass = "text-2xl font-bold text-gray-800 mb-2";
  const subtitleClass = "text-gray-600 mb-4";

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-4xl">😊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Chain Mood Tracker</h1>
          <p className="text-gray-600 mb-8">Record your daily moods on the blockchain with privacy</p>
          <button
            className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-xl px-8 py-4`}
            onClick={connect}
          >
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  if (moodTracker.isDeployed === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        {errorNotDeployed(chainId)}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Chain Mood Tracker
              </h1>
              <p className="text-gray-600 mt-1">Your private mood diary on the blockchain</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Chain ID: {chainId}</p>
              <p className="text-sm text-gray-500 font-mono">
                {accounts?.[0]?.slice(0, 6)}...{accounts?.[0]?.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Record Mood Card */}
          <div className="lg:col-span-1">
            <div className={cardClass}>
              <div className="p-6">
                <h2 className={titleClass}>Record Today's Mood</h2>
                <p className={subtitleClass}>
                  {hasRecordedToday ? "You&apos;ve already recorded today! ✨" : "How are you feeling today?"}
                </p>

                {/* Emoji Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose your mood
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {moodTracker.emojiOptions.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedEmoji(index)}
                        className={`text-3xl p-3 rounded-xl transition-all duration-200 ${
                          selectedEmoji === index
                            ? "bg-blue-100 border-2 border-blue-300 scale-110"
                            : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:scale-105"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What&apos;s on your mind?
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                    disabled={hasRecordedToday}
                  />
                </div>

                {/* Record Button */}
                <button
                  onClick={handleRecordMood}
                  disabled={!moodTracker.canRecord || hasRecordedToday || !message.trim()}
                  className={`${buttonClass} w-full bg-gradient-to-r from-blue-500 to-purple-500 text-lg py-4 ${
                    hasRecordedToday ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {moodTracker.isRecording ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Recording...
                    </div>
                  ) : hasRecordedToday ? (
                    "Already Recorded Today ✨"
                  ) : (
                    "Record My Mood"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mood History */}
          <div className="lg:col-span-2">
            <div className={cardClass}>
              <div className="p-6">
                <h2 className={titleClass}>Your Mood History</h2>
                <p className={subtitleClass}>Your recent mood records</p>

                {/* Loading State */}
                {moodTracker.isLoadingMoods && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">Loading your moods...</span>
                  </div>
                )}

                {/* Mood List */}
                {!moodTracker.isLoadingMoods && (
                  <div className="space-y-4">
                    {Array.from(moodTracker.userMoods.entries())
                      .sort(([a], [b]) => b - a)
                      .map(([dayTimestamp, mood]) => {
                        const date = new Date(dayTimestamp * 86400 * 1000);
                        const isToday = dayTimestamp === Math.floor(Date.now() / (1000 * 86400));
                        const localMood = localMoodHistory.get(dayTimestamp);

                        return (
                          <div
                            key={dayTimestamp}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                              mood.exists
                                ? (localMood || mood.isDecrypted)
                                  ? "bg-green-50 border-green-200"
                                  : "bg-blue-50 border-blue-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-4xl">
                                  {localMood ? moodTracker.emojiOptions[localMood.emoji] || "🔒" :
                                   mood.isDecrypted ? mood.clearEmoji : "🔒"}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {isToday ? "Today" : date.toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {localMood ? localMood.message :
                                     mood.isDecrypted ? mood.clearMessage : "Encrypted message"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {mood.exists && !mood.isDecrypted && (
                                  <button
                                    onClick={() => handleDecryptMood(dayTimestamp)}
                                    disabled={!moodTracker.canDecrypt}
                                    className={`${buttonClass} bg-green-500 hover:bg-green-600 px-4 py-2 text-sm`}
                                  >
                                    Decrypt
                                  </button>
                                )}
                                {mood.isDecrypted && (
                                  <span className="text-green-600 font-semibold">Decrypted ✓</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}

                    {moodTracker.userMoods.size === 0 && !moodTracker.isLoadingMoods && (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500">No mood records yet. Start recording your first mood!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {moodTracker.message && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800">{moodTracker.message}</p>
          </div>
        )}

        {/* FHEVM Status */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">FHEVM Status</h3>
            <p className={`text-sm ${fhevmStatus === 'ready' ? 'text-green-600' : 'text-orange-600'}`}>
              {fhevmStatus}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Contract</h3>
            <p className="text-sm text-gray-600 font-mono break-all">
              {moodTracker.contractAddress || "Not deployed"}
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Network</h3>
            <p className="text-sm text-gray-600">
              {chainId === 31337 ? "Local Hardhat" : `Chain ${chainId}`}
            </p>
          </div>
        </div>
      </div>

      {/* Already Recorded Today Modal */}
      {showAlreadyRecordedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                今日已记录
              </h2>
              <p className="text-gray-600 mb-6">
                您今天已经记录过心情了！<br />
                明天再来分享您的感受吧 🌟
              </p>
              <button
                onClick={() => setShowAlreadyRecordedModal(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                知道了
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
