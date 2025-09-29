# Chain Mood Tracker - FHEVM 链上心情记录DApp

一个基于FHEVM的全同态加密链上心情记录应用，让用户可以安全、私密地记录每天的心情。

## 🎯 功能特性

- **隐私保护**: 使用FHEVM全同态加密，保护用户心情数据的隐私
- **每日记录**: 支持每天记录一个心情表情和文字描述
- **心情链**: 形成用户个人的心情时间线
- **美观界面**: 现代化的渐变设计和卡片式布局
- **实时解密**: 支持对加密心情数据的实时解密查看

## 🏗️ 技术架构

### 智能合约 (FHEVM)
- **MoodTracker.sol**: 主要合约，处理心情记录存储和加密
- **支持的加密类型**: euint8 (表情索引), euint256 (消息哈希)
- **访问控制**: 使用FHEVM ACL控制数据访问权限

### 前端技术栈
- **Next.js 15**: React框架
- **TypeScript**: 类型安全
- **Tailwind CSS**: 现代化样式
- **@zama-fhe/relayer-sdk**: FHEVM Relayer SDK
- **@fhevm/mock-utils**: 本地开发Mock工具

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn
- MetaMask钱包

### 1. 启动本地Hardhat节点

```bash
cd fhevm-hardhat-template
npm install
npx hardhat node --verbose
```

### 2. 部署合约

在新终端窗口：
```bash
cd fhevm-hardhat-template
npx hardhat deploy --network localhost
```

### 3. 启动前端应用

在新终端窗口：
```bash
cd frontend
npm install
npm run dev:mock
```

### 4. 连接并使用

1. 打开浏览器访问 `http://localhost:3000`
2. 连接MetaMask钱包
3. 选择心情表情并输入文字描述
4. 点击"Record My Mood"记录心情
5. 查看心情历史记录

## 📋 使用说明

### 记录心情
1. 选择一个表情符号 (😊😢😡😴🤔😍🤗😱🎉❤️)
2. 输入心情描述文字
3. 点击记录按钮
4. 每天只能记录一次心情

### 查看历史
- 应用会自动加载最近7天的记录
- 加密的心情数据显示为🔒图标
- 点击"Decrypt"按钮可以解密查看具体内容

### 隐私保护
- 所有心情数据都经过FHEVM加密存储
- 只有数据所有者可以解密查看
- 区块链上只能看到加密后的密文

## 🔧 项目结构

```
├── fhevm-hardhat-template/     # 智能合约项目
│   ├── contracts/
│   │   └── MoodTracker.sol     # 心情记录合约
│   ├── deploy/
│   │   └── deploy.ts           # 部署脚本
│   └── test/                   # 合约测试
├── frontend/                   # Next.js前端项目
│   ├── abi/                    # 合约ABI文件
│   ├── components/
│   │   └── MoodTrackerDemo.tsx # 主UI组件
│   ├── fhevm/                  # FHEVM集成代码
│   ├── hooks/
│   │   └── useMoodTracker.tsx  # 心情记录Hook
│   └── app/
│       └── page.tsx            # 主页面
└── README_MoodTracker.md       # 项目说明
```

## 🔐 FHEVM集成详解

### 合约设计
```solidity
contract MoodTracker is SepoliaConfig {
    struct MoodEntry {
        address user;
        euint32 timestamp;      // 加密时间戳
        euint8 emoji;          // 加密表情索引
        euint256 messageHash;   // 加密消息哈希
        bool exists;
    }

    mapping(address => mapping(uint32 => MoodEntry)) private _userMoods;
}
```

### 前端集成
```typescript
// 加密输入创建
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add8(emojiIndex);
input.add256(messageHash);
const enc = await input.encrypt();

// 合约调用
await contract.recordMood(enc.handles[0], enc.handles[1], enc.inputProof, enc.inputProof);
```

## 🧪 Mock模式开发

项目支持本地Mock模式，无需真实FHEVM网络即可开发：

```bash
npm run dev:mock  # 自动启动hardhat节点并部署合约
```

Mock模式特点：
- 本地模拟FHEVM功能
- 开发时无需网络连接
- 生产构建时自动排除Mock代码

## 🎨 界面设计

### 设计理念
- **渐变背景**: 从蓝色到紫色的优雅渐变
- **卡片布局**: 现代化的圆角卡片设计
- **表情选择**: 大尺寸的表情符号选择器
- **状态指示**: 清晰的操作状态反馈
- **响应式设计**: 支持桌面和移动设备

### 颜色方案
- 主色调: 蓝色到紫色渐变 (#3B82F6 → #8B5CF6)
- 成功状态: 绿色 (#10B981)
- 警告状态: 橙色 (#F59E0B)
- 错误状态: 红色 (#EF4444)

## 🔄 工作流程

1. **连接钱包** → 用户连接MetaMask
2. **初始化FHEVM** → 加载Relayer SDK
3. **选择表情** → 用户选择心情表情
4. **输入文字** → 用户输入心情描述
5. **加密处理** → 前端生成加密输入
6. **链上存储** → 调用合约记录心情
7. **查看历史** → 加载并显示心情记录
8. **解密查看** → 用户可以解密自己的记录

## 🚀 部署到测试网

### Sepolia测试网部署

1. 设置环境变量：
```bash
export MNEMONIC="your mnemonic here"
export INFURA_API_KEY="your infura key"
```

2. 部署到Sepolia：
```bash
npx hardhat deploy --network sepolia
```

3. 更新地址文件：
```typescript
// frontend/abi/MoodTrackerAddresses.ts
export const MoodTrackerAddresses = {
  "11155111": { address: "0x...", chainId: 11155111, chainName: "sepolia" },
  "31337": { address: "0x...", chainId: 31337, chainName: "hardhat" },
};
```

## 🔧 开发命令

```bash
# 合约开发
npm run compile          # 编译合约
npm run test            # 运行测试
npm run deploy:localhost # 本地部署
npm run deploy:sepolia   # Sepolia部署

# 前端开发
npm run dev             # 开发模式
npm run dev:mock        # Mock模式
npm run build           # 生产构建
npm run lint            # 代码检查
```

## 📈 扩展功能

未来可以添加的功能：
- 心情统计分析
- 社交功能（分享匿名心情统计）
- 多链支持
- 高级加密选项
- 心情预测AI
- NFT心情徽章

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

BSD-3-Clause-Clear License

## 🙏 致谢

- [Zama](https://www.zama.ai/) - FHEVM技术提供者
- [Hardhat](https://hardhat.org/) - 以太坊开发环境
- [Next.js](https://nextjs.org/) - React框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
