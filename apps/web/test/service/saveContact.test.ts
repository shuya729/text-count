import { describe, it, expect, vi, beforeEach } from 'vitest'
import { saveContact } from '@/service/saveContact'
import type { ContactInput, ContactOutput } from '~/types/contactTypes'

// Firebase関連のモック
vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn()
}))

vi.mock('@/firebase', () => ({
  functions: {}
}))

// モック関数の型定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHttpsCallable = vi.fn() as any

// モックのセットアップ
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mocked(await import('firebase/functions')).httpsCallable.mockReturnValue(mockHttpsCallable as any)

describe('saveContact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系テスト', () => {
    it('正常なContactInputでFirebase Functionsから成功レスポンスが返される場合', async () => {
      // Arrange
      const input: ContactInput = {
        name: '田中太郎',
        mail: 'tanaka@example.com',
        content: 'お問い合わせテストです。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: 'お問い合わせを受け付けました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })

    it('必要なContactInputフィールドすべてが正しく渡される場合', async () => {
      // Arrange
      const input: ContactInput = {
        name: '山田花子',
        mail: 'yamada.hanako@test.co.jp',
        content: '詳細なお問い合わせ内容をここに記載します。製品についての質問です。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '正常に処理されました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledTimes(1)
      expect(mockHttpsCallable).toHaveBeenCalledWith({
        name: input.name,
        mail: input.mail,
        content: input.content
      })
    })
  })

  describe('エラー系テスト', () => {
    it('Firebase Functionsでエラーが発生した場合、固定のエラーレスポンスが返される', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'エラーテスト',
        mail: 'error@test.com',
        content: 'エラーが発生するお問い合わせです。'
      }

      mockHttpsCallable.mockRejectedValue(new Error('Firebase Functions Error'))

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual({
        state: 1,
        message: 'エラーが発生しました。'
      } as ContactOutput)
    })

    it('Firebase Functionsで例外が発生した場合もエラーハンドリングされる', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'ネットワークエラー',
        mail: 'network@error.com',
        content: 'ネットワークエラーのテストです。'
      }

      mockHttpsCallable.mockRejectedValue('Network error')

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual({
        state: 1,
        message: 'エラーが発生しました。'
      } as ContactOutput)
    })

    it('Firebase Functionsがundefinedやnullを返した場合もエラーハンドリングされる', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'Nullテスト',
        mail: 'null@test.com',
        content: 'Nullレスポンスのテストです。'
      }

      mockHttpsCallable.mockRejectedValue(null)

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual({
        state: 1,
        message: 'エラーが発生しました。'
      } as ContactOutput)
    })
  })

  describe('境界値テスト', () => {
    it('name: 1文字の場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'あ',
        mail: 'a@example.com',
        content: '名前1文字のテストです。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('name: 40文字の場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん',
        mail: 'longname@example.com',
        content: '名前40文字のテストです。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('mail: 1文字の場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'テスト',
        mail: 'a',
        content: 'メール1文字のテストです。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('mail: 400文字の場合で正常に処理される', async () => {
      // Arrange
      const longEmail = 'a'.repeat(390) + '@test.com'
      const input: ContactInput = {
        name: 'テスト',
        mail: longEmail,
        content: 'メール400文字のテストです。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('content: 1文字の場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: 'テスト',
        mail: 'test@example.com',
        content: 'あ'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('content: 2000文字の場合で正常に処理される', async () => {
      // Arrange
      const longContent = 'あ'.repeat(2000)
      const input: ContactInput = {
        name: 'テスト',
        mail: 'test@example.com',
        content: longContent
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
    })

    it('特殊文字が含まれる場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: '田中<script>alert("test")</script>',
        mail: 'test+special@example.co.jp',
        content: 'HTMLタグや特殊文字: <>&"\'\n改行\tタブ\r\n\0NULL文字のテスト'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '特殊文字も正常に処理されました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })

    it('絵文字や多バイト文字が含まれる場合で正常に処理される', async () => {
      // Arrange
      const input: ContactInput = {
        name: '🙋‍♂️田中太郎👨‍💼',
        mail: '絵文字テスト@例え.テスト',
        content: '絵文字テスト🎉🎊データです。日本語、English、한글、中文、العربية、русский'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '多言語対応成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await saveContact(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })
  })

  describe('特殊文字テスト', () => {
    it('HTMLタグや特殊文字が含まれる入力', async () => {
      const input: ContactInput = {
        name: '田中<script>alert("test")</script>',
        mail: 'test+special@example.co.jp',
        content: 'HTMLタグや特殊文字: <>&"\'\'\n改行\tタブ\r\n\0NULL文字のテスト'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '特殊文字も正常に処理されました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      const result = await saveContact(input)

      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })

    it('絵文字や多バイト文字が含まれる入力', async () => {
      const input: ContactInput = {
        name: '🙋‍♂️田中太郎👨‍💼',
        mail: '絵文字テスト@例え.テスト',
        content: '絵文字テスト🎉🎊データです。日本語、English、한글、中文、العربية、русский'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '多言語対応成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      const result = await saveContact(input)

      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })
  })

  describe('Firebase連携テスト', () => {
    it('必要なフィールドが正しく渡される', async () => {
      const input: ContactInput = {
        name: '山田花子',
        mail: 'yamada.hanako@test.co.jp',
        content: '詳細なお問い合わせ内容をここに記載します。製品についての質問です。'
      }
      const expectedOutput: ContactOutput = {
        state: 0,
        message: '正常に処理されました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      const result = await saveContact(input)

      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledTimes(1)
      expect(mockHttpsCallable).toHaveBeenCalledWith({
        name: input.name,
        mail: input.mail,
        content: input.content
      })
    })
  })
})