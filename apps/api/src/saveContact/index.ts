import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { defineSecret } from "firebase-functions/params";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import axios from "axios";

import { ContactInput, ContactOutput, ContactState } from "~/types/contactTypes";

const lineChannelAccessToken = defineSecret("LINE_CHANNEL_ACCESS_TOKEN");
const db = getFirestore();

const getRequiredEnv = (key: "LINE_PUSH_USER_ID"): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`環境変数 ${key} が設定されていません。apps/api/.env を確認してください。`);
  }

  return value;
};

const getLineChannelAccessToken = (): string => {
  const value = process.env.LINE_CHANNEL_ACCESS_TOKEN ?? lineChannelAccessToken.value();

  if (!value) {
    throw new Error(
      "LINE_CHANNEL_ACCESS_TOKEN が設定されていません。apps/api/.env または Firebase Secret を確認してください。"
    );
  }

  return value;
};

interface ContactLog {
  type: "functionLog";
  function: string;
  input: { name: string; mail: string; content: string };
  output: { state: ContactState; message: string };
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
        state: ContactState.error,
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
        state: ContactState.error,
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
      const userId = getRequiredEnv("LINE_PUSH_USER_ID");
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
          "Authorization": `Bearer ${getLineChannelAccessToken()}`,
        },
      });
    } catch (e) {
      const ret: ContactOutput = {
        state: ContactState.error,
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
      state: ContactState.success,
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
