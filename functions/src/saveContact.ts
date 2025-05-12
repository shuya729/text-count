import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

const lineChannelAccessToken = defineSecret("LINE_CHANNEL_ACCESS_TOKEN");
const db = getFirestore();

interface ContactInput {
  name: string;
  mail: string;
  content: string;
}

interface ContactOutput {
  state: number; // 0: 成功, 1: エラー
  message: string;
}

interface ContactLog {
  type: "functionLog";
  function: string;
  input: { name: string; mail: string; content: string };
  output: { state: number; message: string };
  position: number;
}

const isContactInput = (data: unknown): boolean => {
  return (
    data !== null &&
    typeof data === "object" &&
    "name" in data &&
    "mail" in data &&
    "content" in data &&
    typeof data.name === "string" &&
    typeof data.mail === "string" &&
    typeof data.content === "string" &&
    data.name.length <= 40 &&
    data.mail.length <= 400 &&
    data.content.length >= 1 &&
    data.content.length <= 2000
  );
};

export const saveContact = onCall(
  { secrets: [lineChannelAccessToken] },
  async (req) => {
    const functionName = "saveContact";
    const input = req.data;

    if (!isContactInput(input)) {
      const ret: ContactOutput = {
        state: 1,
        message: "不正な入力です。",
      };
      logger.info({
        type: "functionLog",
        function: functionName,
        input: input,
        output: ret,
        position: 1,
      });
      return ret;
    }

    const { name, mail, content } = input as ContactInput;

    let docId = "";
    try {
      const docRef = db.collection("contacts").doc();
      docId = docRef.id;
      await docRef.set({
        id: docId,
        name: name,
        mail: mail,
        content: content,
        createdAt: Timestamp.now(),
      });
    } catch (e) {
      const ret: ContactOutput = {
        state: 1,
        message: "送信に失敗しました。",
      };
      if (e instanceof Error) {
        logger.error(e);
      }
      logger.info({
        type: "functionLog",
        function: functionName,
        input: input,
        output: ret,
        position: 2,
      });
      return ret;
    }

    try {
      const userId = "U4a98564f54715db1129d0db57e423878";
      const post = {
        "to": userId,
        "messages": [
          {
            "type": "text",
            "text": `AI文字数調整くん問い合わせ\n\n名前: ${name}\nメール: ${mail}\n内容: ${content}\nId: ${docId}`,
          },
        ],
      };

      const lineUrl = "https://api.line.me/v2/bot/message/push";
      await axios.post(lineUrl, post, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${lineChannelAccessToken.value()}`,
        },
      });
    } catch (e) {
      const ret: ContactOutput = {
        state: 1,
        message: "送信に失敗しました。",
      };
      if (e instanceof Error) {
        logger.error(e);
      }
      logger.info({
        type: "functionLog",
        function: functionName,
        input: input,
        output: ret,
        position: 3,
      });
      return ret;
    }

    const ret: ContactOutput = {
      state: 0,
      message: "送信に成功しました。",
    };
    const log: ContactLog = {
      type: "functionLog",
      function: functionName,
      input: input,
      output: ret,
      position: 4,
    };
    logger.info(log);
    return ret;
  }
);
