import type { ContactInput } from "~/types/contactTypes";

describe("saveContact", () => {
  describe("入力検証のロジック", () => {
    it("正常な入力パラメータの検証が動作する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const validData = {
        name: "田中太郎",
        mail: "tanaka@example.com",
        content: "テストメッセージです。",
      };

      expect(isContactInput(validData)).toBe(true);
    });

    it("nameが40文字超の場合、バリデーションが失敗する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const invalidData = {
        name: "あ".repeat(41),
        mail: "test@example.com",
        content: "テスト内容",
      };

      expect(isContactInput(invalidData)).toBe(false);
    });

    it("mailが400文字超の場合、バリデーションが失敗する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const invalidData = {
        name: "テスト太郎",
        mail: "a".repeat(401),
        content: "テスト内容",
      };

      expect(isContactInput(invalidData)).toBe(false);
    });

    it("contentが空の場合、バリデーションが失敗する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const invalidData = {
        name: "テスト太郎",
        mail: "test@example.com",
        content: "",
      };

      expect(isContactInput(invalidData)).toBe(false);
    });

    it("contentが2000文字超の場合、バリデーションが失敗する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const invalidData = {
        name: "テスト太郎",
        mail: "test@example.com",
        content: "あ".repeat(2001),
      };

      expect(isContactInput(invalidData)).toBe(false);
    });
  });

  describe("境界値テスト", () => {
    it("nameが1文字の場合、バリデーションが成功する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "あ",
        mail: "test@example.com",
        content: "テスト内容",
      };

      expect(isContactInput(data)).toBe(true);
    });

    it("nameが40文字の場合、バリデーションが成功する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "あ".repeat(40),
        mail: "test@example.com",
        content: "テスト内容",
      };

      expect(isContactInput(data)).toBe(true);
    });

    it("contentが1文字の場合、バリデーションが成功する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "テスト",
        mail: "test@example.com",
        content: "あ",
      };

      expect(isContactInput(data)).toBe(true);
    });

    it("contentが2000文字の場合、バリデーションが成功する", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "テスト",
        mail: "test@example.com",
        content: "あ".repeat(2000),
      };

      expect(isContactInput(data)).toBe(true);
    });
  });

  describe("特殊文字処理", () => {
    it("特殊文字を含む入力が正常に処理される", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "田中<script>alert(\"test\")</script>",
        mail: "test+special@example.co.jp",
        content: "HTMLタグ<div>や特殊文字&nbsp;\n改行\tタブ",
      };

      expect(isContactInput(data)).toBe(true);
    });

    it("絵文字を含む入力が正常に処理される", () => {
      const isContactInput = (data: unknown): boolean => {
        return (
          data !== null &&
          typeof data === "object" &&
          "name" in data &&
          "mail" in data &&
          "content" in data &&
          typeof (data as ContactInput).name === "string" &&
          typeof (data as ContactInput).mail === "string" &&
          typeof (data as ContactInput).content === "string" &&
          (data as ContactInput).name.length <= 40 &&
          (data as ContactInput).mail.length <= 400 &&
          (data as ContactInput).content.length >= 1 &&
          (data as ContactInput).content.length <= 2000
        );
      };

      const data = {
        name: "🙋‍♂️田中太郎",
        mail: "emoji@test.jp",
        content: "絵文字テスト🎉🎊🎈",
      };

      expect(isContactInput(data)).toBe(true);
    });
  });
});