// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error lottery__NotEnoughtETHEntered();
error lottery__TransactionFailed();
error lottery__LotterycNotOpen();
error lottery__UpkeepNotNeeded(uint256 currentBalance, uint256 numPlayer, uint256 lotteryState);

contract lottery is VRFConsumerBaseV2, KeeperCompatibleInterface {
    enum LotteryState {
        OPEN,
        CALCULATING
    }

    uint256 private immutable entranceFee;
    address payable[] private players;
    VRFCoordinatorV2Interface private immutable vrfCoordinator;
    bytes32 private immutable gasLimit;
    uint64 private immutable subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint16 private constant NUM_WORDS = 1;
    uint32 private immutable callbackGasLimit;

    address private recentWinner;
    LotteryState private lotteryState;
    uint256 private lastTimestamp;
    uint256 private immutable interval;

    event LotteryEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        uint256 _entranceFee,
        address _vrfCoordinator,
        bytes32 _gasLimit,
        uint64 _subscriptionId,
        uint32 _callbackGasLimit,
        uint256 _interval
    ) VRFConsumerBaseV2(_vrfCoordinator) {
        entranceFee = _entranceFee;
        vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        gasLimit = _gasLimit;
        subscriptionId = _subscriptionId;
        callbackGasLimit = _callbackGasLimit;
        lotteryState = LotteryState.OPEN;
        lastTimestamp = block.timestamp;
        interval = _interval;
    }

    function enterLottery() public payable {
        require(msg.value >= entranceFee, "Not enough ETH entered!");
        require(lotteryState == LotteryState.OPEN, "Lottery not open!");

        players.push(payable(msg.sender));
        emit LotteryEnter(msg.sender);
    }

    function getEntranceFee() public view returns (uint256) {
        return entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return players[index];
    }

    function checkUpkeep(bytes memory /* checkData */) public override returns (bool, bytes memory) {
        bool isOpen = (lotteryState == LotteryState.OPEN);
        bool timePassed = (block.timestamp - lastTimestamp) > interval;
        bool hasPlayers = (players.length > 0);
        bool hasBalance = address(this).balance > 0;

        return (isOpen && timePassed && hasPlayers && hasBalance, "");
    }

    function performUpkeep(bytes memory /* performData */) public override {
        (bool upkeepNeeded, ) = checkUpkeep("");

        if (!upkeepNeeded) {
            revert lottery__UpkeepNotNeeded(address(this).balance, players.length, uint256(lotteryState));
        }

        lotteryState = LotteryState.CALCULATING;

        uint256 requestId = vrfCoordinator.requestRandomWords(
            gasLimit,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % players.length;
        address payable winner = players[indexOfWinner];
        recentWinner = winner;
        lotteryState = LotteryState.OPEN;

        players = new address payable[](0);
        lastTimestamp = block.timestamp;

        (bool success, ) = winner.call{value: address(this).balance}("");
        if (!success) {
            revert lottery__TransactionFailed();
        }

        emit WinnerPicked(winner);
    }

    function getRecentWinner() public view returns (address) {
        return recentWinner;
    }

    function getLotteryState() public view returns (LotteryState) {
        return lotteryState;
    }

    function getNumWords() public pure returns (uint256) {
        return NUM_WORDS;
    }

    function getNumOfPlayers() public view returns (uint256){
        return players.length;
    }

    function getLastestTimeStamp() public view  returns (uint256) {
        return lastTimestamp;
    }

    function getRequestionConfirmations() public pure  returns (uint256) {
        return REQUEST_CONFIRMATIONS;
    }
}
