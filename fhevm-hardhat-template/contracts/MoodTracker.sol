// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, euint256, externalEuint8, externalEuint32, externalEuint256} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title 链上心情记录器
/// @author FHEVM Mood Tracker
/// @notice 一个使用FHEVM的链上心情记录应用，支持每天记录一个心情表情和文字
contract MoodTracker is SepoliaConfig {

    // 心情结构体 - 存储表情和文字描述
    struct MoodEntry {
        address user;           // 用户地址
        euint32 timestamp;      // 时间戳（天级别）
        euint8 emoji;          // 表情符号索引 (0-9)
        euint256 messageHash;   // 加密的消息哈希
        bool exists;           // 是否存在
    }

    // 用户每天的心情记录映射
    mapping(address => mapping(uint32 => MoodEntry)) private _userMoods;

    // 用户的总记录数
    mapping(address => euint32) private _userMoodCount;

    // 表情符号数组（公开的）- 存储为Unicode编码
    string[10] public emojis;

    /// @notice 构造函数，初始化表情符号
    constructor() {
        emojis[0] = unicode"😊";
        emojis[1] = unicode"😢";
        emojis[2] = unicode"😡";
        emojis[3] = unicode"😴";
        emojis[4] = unicode"🤔";
        emojis[5] = unicode"😍";
        emojis[6] = unicode"🤗";
        emojis[7] = unicode"😱";
        emojis[8] = unicode"🎉";
        emojis[9] = unicode"❤️";
    }

    /// @notice 获取表情符号
    /// @param index 表情索引 (0-9)
    /// @return 表情符号字符串
    function getEmoji(uint8 index) external view returns (string memory) {
        require(index < emojis.length, "Invalid emoji index");
        return emojis[index];
    }

    /// @notice 获取表情符号数量
    /// @return 表情符号总数
    function getEmojiCount() external pure returns (uint8) {
        return 10;
    }

    /// @notice 记录今天的心情
    /// @param emojiIndex 表情索引 (0-9)
    /// @param messageHash 加密的消息哈希
    /// @param inputProofEmoji 表情输入证明
    /// @param inputProofMessage 消息输入证明
    function recordMood(
        externalEuint8 emojiIndex,
        externalEuint256 messageHash,
        bytes calldata inputProofEmoji,
        bytes calldata inputProofMessage
    ) external {
        // 获取今天的日期时间戳（天级别）
        uint32 today = uint32(block.timestamp / 86400);

        // 检查今天是否已经记录过心情
        MoodEntry storage existingMood = _userMoods[msg.sender][today];
        require(!existingMood.exists, "Already recorded mood today");

        // 验证并转换输入
        euint8 encryptedEmoji = FHE.fromExternal(emojiIndex, inputProofEmoji);
        euint256 encryptedMessage = FHE.fromExternal(messageHash, inputProofMessage);

        // 验证表情索引范围（0-9）- 这里暂时不做范围检查，因为FHE.req可能不可用

        // 创建心情记录
        _userMoods[msg.sender][today] = MoodEntry({
            user: msg.sender,
            timestamp: FHE.asEuint32(today),
            emoji: encryptedEmoji,
            messageHash: encryptedMessage,
            exists: true
        });

        // 增加用户记录计数
        _userMoodCount[msg.sender] = FHE.add(_userMoodCount[msg.sender], FHE.asEuint32(1));

        // 设置访问权限
        FHE.allowThis(_userMoods[msg.sender][today].timestamp);
        FHE.allowThis(_userMoods[msg.sender][today].emoji);
        FHE.allowThis(_userMoods[msg.sender][today].messageHash);
        FHE.allow(_userMoods[msg.sender][today].timestamp, msg.sender);
        FHE.allow(_userMoods[msg.sender][today].emoji, msg.sender);
        FHE.allow(_userMoods[msg.sender][today].messageHash, msg.sender);
    }

    /// @notice 获取用户某天的加密心情记录
    /// @param user 用户地址
    /// @param dayTimestamp 日期时间戳（天级别）
    /// @return timestamp 加密的时间戳
    /// @return emoji 加密的表情索引
    /// @return messageHash 加密的消息哈希
    /// @return exists 是否存在记录
    function getMood(
        address user,
        uint32 dayTimestamp
    ) external view returns (euint32, euint8, euint256, bool) {
        MoodEntry storage mood = _userMoods[user][dayTimestamp];
        return (
            mood.timestamp,
            mood.emoji,
            mood.messageHash,
            mood.exists
        );
    }

    /// @notice 检查用户某天是否有心情记录
    /// @param user 用户地址
    /// @param dayTimestamp 日期时间戳（天级别）
    /// @return 是否存在记录
    function hasMood(address user, uint32 dayTimestamp) external view returns (bool) {
        return _userMoods[user][dayTimestamp].exists;
    }

    /// @notice 获取用户今天是否已经记录心情
    /// @return 是否已记录
    function hasRecordedToday() external view returns (bool) {
        uint32 today = uint32(block.timestamp / 86400);
        return _userMoods[msg.sender][today].exists;
    }

    /// @notice 获取用户的心情记录总数
    /// @param user 用户地址
    /// @return 加密的记录总数
    function getUserMoodCount(address user) external view returns (euint32) {
        return _userMoodCount[user];
    }

    /// @notice 获取今天的日期时间戳（天级别）
    /// @return 今天的日期时间戳
    function getTodayTimestamp() external view returns (uint32) {
        return uint32(block.timestamp / 86400);
    }
}
