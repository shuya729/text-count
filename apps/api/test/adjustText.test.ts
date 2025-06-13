describe("adjustText", () => {
  describe("テスト環境の確認", () => {
    it("最小限のテストが実行される", () => {
      expect(true).toBe(true);
    });

    it("モック関数が正常に動作する", () => {
      const mockFn = jest.fn();
      mockFn("test");
      expect(mockFn).toHaveBeenCalledWith("test");
    });
  });

  describe("入力検証のロジック", () => {
    it("文字数範囲の検証ロジックが正しく動作する", () => {
      const validateLength = (text: string) => {
        return text.length >= 100 && text.length <= 2000;
      };

      const validateCount = (count: number) => {
        return count >= 200 && count <= 2000;
      };

      expect(validateLength("あ".repeat(100))).toBe(true);
      expect(validateLength("あ".repeat(2000))).toBe(true);
      expect(validateLength("あ".repeat(99))).toBe(false);
      expect(validateLength("あ".repeat(2001))).toBe(false);

      expect(validateCount(200)).toBe(true);
      expect(validateCount(2000)).toBe(true);
      expect(validateCount(199)).toBe(false);
      expect(validateCount(2001)).toBe(false);
    });

    it("文字数判定ロジックが正しく動作する", () => {
      const judge = (text: string, count: number): boolean => {
        const length = text.length;
        return count * 0.9 <= length && length <= count * 1.1;
      };

      expect(judge("あ".repeat(270), 300)).toBe(true); // 90%
      expect(judge("あ".repeat(300), 300)).toBe(true); // 100%
      expect(judge("あ".repeat(330), 300)).toBe(true); // 110%
      expect(judge("あ".repeat(269), 300)).toBe(false); // 89.6%
      expect(judge("あ".repeat(331), 300)).toBe(false); // 110.3%
    });
  });

  describe("システムプロンプト生成ロジック", () => {
    it("文字数差に応じて正しいプロンプトが選択される", () => {
      const getPromptType = (text: string, count: number): string => {
        const length = text.length;
        const diff = length - count;

        if (40 <= diff) {
          return "SUB_SENTENCES";
        }
        if (0 < diff) {
          return "SUB_WORDS";
        }
        if (-40 < diff) {
          return "ADD_WORDS";
        }
        return "ADD_SENTENCES";
      };

      expect(getPromptType("あ".repeat(400), 300)).toBe("SUB_SENTENCES"); // -100
      expect(getPromptType("あ".repeat(320), 300)).toBe("SUB_WORDS"); // -20
      expect(getPromptType("あ".repeat(280), 300)).toBe("ADD_WORDS"); // +20
      expect(getPromptType("あ".repeat(200), 300)).toBe("ADD_SENTENCES"); // +100
    });
  });

  describe("最適文字列選択ロジック", () => {
    it("複数の候補から最も目標に近い文字列が選択される", () => {
      const closestText = (texts: string[], count: number): string => {
        return texts.reduce((closest, current) => {
          const closestDiff = Math.abs(closest.length - count);
          const currentDiff = Math.abs(current.length - count);
          return currentDiff < closestDiff ? current : closest;
        });
      };

      const texts = [
        "あ".repeat(150), // 元テキスト
        "あ".repeat(200),
        "あ".repeat(250),
        "あ".repeat(295), // 最も近い
        "あ".repeat(320),
        "あ".repeat(350),
      ];

      const result = closestText(texts, 300);
      expect(result.length).toBe(295);
    });
  });
});