import TonWeb from "tonweb";
import { Bot } from "grammy";
import { dodo, prepareWhaleAlertMessage, } from "./src/Query/index.ts";
const BOT_TOKEN = "6589202546:AAHzEWpJccRNR8bZkvnHdKqw33sUVr-Fiqk";
const subscribedGroupIds = new Array();
const bot = new Bot(BOT_TOKEN);
export const TON_THRESHOLD = 100;
export const BalanceThreshold = 10000;
export const TransactionLimit = 100;
const TON_API_KEY = "939c374180ae5d9e8323cb800e6e92e5c8101e25cb77fe8a69a7842d46bbc1ca";
bot.command("start", (ctx) => ctx.reply("Wel"));
const addgroup = async (groupId) => {
    if (containsGroupId(groupId))
        return;
    else {
        subscribedGroupIds.push(groupId);
        await bot.api.sendMessage(groupId, `Welcome 
This bot will run every 10secs getting transcations from ton dex(currently stonfi) and detects Gem💎

TON_SWAP_INPUT_THRESHOLD :${TON_THRESHOLD} TON
WHALE_BALANCE_THRESHOLD:${BalanceThreshold} TON`);
        console.log("new group added");
    }
};
function containsGroupId(groupId) {
    for (var i = 0; i < subscribedGroupIds.length; i++) {
        if (subscribedGroupIds[i] === groupId) {
            return true;
        }
    }
    return false;
}
bot.start();
console.log("Starting Bot...");
dodo();
// const checkForConnectedGroups = async () => {
//   console.log("Checking for new groups");
//   const chatIds = await RequestClient.get<any>(
//     `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`
//   );
//   if (chatIds.result.length === 0) return;
//   chatIds.result.forEach((element) => {
//     const messageObj = element.message.chat;
//     if (messageObj.type === "superchat") {
//       addgroup(messageObj.id);
//     }
//   });
// };
bot.on("my_chat_member", (ctx) => {
    const updateObj = ctx.myChatMember.new_chat_member;
    if (updateObj.status === "left") {
        removeSubscribedUser(updateObj.user);
        return;
    }
    const chatObj = ctx.chat;
    if (updateObj.status === "administrator") {
        addgroup(chatObj.id);
    }
});
function removeSubscribedUser(value) {
    var index = subscribedGroupIds.indexOf(value);
    if (index > -1) {
        subscribedGroupIds.splice(index, 1);
    }
    return;
}
// setInterval(() => {
//   //checkForConnectedGroups();
//   console.log("current connected groups:", subscribedGroupIds);
// }, 5000);
export const postMessage = async (message) => {
    await bot.api.sendMessage(-1002032186545, message);
};
export const postAlertMessage = async (alertMessage) => {
    subscribedGroupIds.forEach(async (id) => {
        await bot.api.sendMessage(id, alertMessage, {
            parse_mode: "HTML",
            link_preview_options: {
                is_disabled: true,
                url: "",
                show_above_text: false,
            },
        });
    });
};
const testMessage = async () => {
    const test = await prepareWhaleAlertMessage();
    await bot.api.sendMessage(-1002032186545, test, {
        parse_mode: "HTML",
    });
};
//testMessage();
export const sendWhaleGet = async (gemInfo) => {
    const message = prepareListMessage(gemInfo);
    subscribedGroupIds.forEach(async (id) => {
        await bot.api.sendMessage(id, message, {
            parse_mode: "HTML",
            link_preview_options: { is_disabled: true },
        });
    });
};
const prepareListMessage = (gems) => {
    let messageString = `<b>Gem List</b>`;
    gems.forEach((value, key) => {
        const tokenAddress = new TonWeb.Address(value.address).toString(true, true, true);
        messageString = `${messageString} 
<a href = "https://tonscan.org/address/${tokenAddress}"> ${key}       </a>| ${value.totalWhales}`;
    });
    return messageString;
};
//prepareWhaleAlertMessage();
// .Token Symbol: TonPepe / TON
// DEX: Ston.Fi
// Contract: EQCFFiMw3bbVJZmaMaZB8jC95MMla2ezlO9beKRebCERimS8
// 💴MarketCap: $73.9k
// 💧Liquidity: $21.7k
// LP Lock: 100% burnt 🔥
// Revoke: ✅
// 👨Holders: 210
// 1H: Volume: $105.2 Buys: 2 Sells: 2
// 24H: Volume: $15.8k Buys: 189 Sells: 28
// 💹Chart | Buy
// 👩‍👩‍👦‍👦Socials: Telegram | Twitter |
// -------------------------------------------------------------------------------
// PROMO
// $SLERF, Dev burned LP tokens and need help!!
//  💹Chart | Telegram | Twitter
