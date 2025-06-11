import { describe, it, expect, vi, beforeEach } from 'vitest'
import { adjustText } from '@/service/adjustText'
import type { AdjustTextInput, AdjustTextOutput } from '~/types/adjustTextTypes'

// Firebase関連のモック
vi.mock('firebase/functions', () => ({
  httpsCallable: vi.fn()
}))

vi.mock('firebase/analytics', () => ({
  logEvent: vi.fn()
}))

vi.mock('@/firebase', () => ({
  analytics: {},
  functions: {}
}))

// モック関数の型定義
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockHttpsCallable = vi.fn() as any
const mockLogEvent = vi.mocked(vi.fn())

// モックのセットアップ
// eslint-disable-next-line @typescript-eslint/no-explicit-any
vi.mocked(await import('firebase/functions')).httpsCallable.mockReturnValue(mockHttpsCallable as any)
vi.mocked(await import('firebase/analytics')).logEvent = mockLogEvent

describe('adjustText', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('正常系テスト', () => {
    it('正常な入力でFirebase Functionsから成功レスポンスが返される場合', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: 'テストテキストです。',
        count: 20
      }
      const expectedOutput: AdjustTextOutput = {
        text: '調整されたテストテキストです。',
        state: 0,
        message: '成功しました。'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })

    it('Firebase Analyticsイベントが正しく記録される', async () => {
      const input: AdjustTextInput = {
        text: '  テストテキスト  ',
        count: 15
      }
      const expectedOutput: AdjustTextOutput = {
        text: '調整されたテキスト',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      await adjustText(input)

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: input.text.trim().length,
          tgt_count: input.count
        }
      )
    })
  })

  describe('エラー系テスト', () => {
    it('Firebase Functionsでエラーが発生した場合、固定のエラーレスポンスが返される', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: 'エラーが発生するテキスト',
        count: 10
      }

      mockHttpsCallable.mockRejectedValue(new Error('Firebase Functions Error'))

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual({
        text: input.text,
        state: 2,
        message: 'エラーが発生しました。'
      } as AdjustTextOutput)
    })

    it('Firebase Functionsで例外が発生した場合もエラーハンドリングされる', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: 'ネットワークエラーテスト',
        count: 25
      }

      mockHttpsCallable.mockRejectedValue('Network error')

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual({
        text: input.text,
        state: 2,
        message: 'エラーが発生しました。'
      } as AdjustTextOutput)
      expect(mockLogEvent).toHaveBeenCalled() // Analyticsは正常に記録される
    })
  })

  describe('境界値テスト', () => {
    it('空文字列の入力で正常に処理される', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: '',
        count: 10
      }
      const expectedOutput: AdjustTextOutput = {
        text: '調整されたテキスト',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: 0, // 空文字列のtrim()は0文字
          tgt_count: input.count
        }
      )
    })

    it('空白のみの文字列の入力で正常に処理される', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: '   \n\t  ',
        count: 5
      }
      const expectedOutput: AdjustTextOutput = {
        text: 'トリムされた結果',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: 0, // 空白のみの文字列のtrim()は0文字
          tgt_count: input.count
        }
      )
    })

    it('非常に長いテキストの入力で正常に処理される', async () => {
      // Arrange
      const longText = 'あ'.repeat(1000)
      const input: AdjustTextInput = {
        text: longText,
        count: 500
      }
      const expectedOutput: AdjustTextOutput = {
        text: '調整された長いテキスト',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: 1000,
          tgt_count: input.count
        }
      )
    })

    it('カウントが0の場合で正常に処理される', async () => {
      // Arrange
      const input: AdjustTextInput = {
        text: '削除されるテキスト',
        count: 0
      }
      const expectedOutput: AdjustTextOutput = {
        text: '',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      // Act
      const result = await adjustText(input)

      // Assert
      expect(result).toEqual(expectedOutput)
      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: input.text.trim().length,
          tgt_count: 0
        }
      )
    })
  })

  describe('Analytics記録テスト', () => {
    it('テキストのトリム処理が正しく反映される', async () => {
      const input: AdjustTextInput = {
        text: '  \n\t これはテストです。 \n\t  ',
        count: 12
      }
      const expectedOutput: AdjustTextOutput = {
        text: 'これはテストです。',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      await adjustText(input)

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: 'これはテストです。'.length,
          tgt_count: 12
        }
      )
    })

    it('エラー時でもAnalyticsイベントが記録される', async () => {
      const input: AdjustTextInput = {
        text: 'テストテキスト',
        count: 15
      }

      mockHttpsCallable.mockRejectedValue(new Error('Test Error'))

      await adjustText(input)

      expect(mockLogEvent).toHaveBeenCalledWith(
        expect.any(Object),
        'adjust_text',
        {
          input_count: input.text.trim().length,
          tgt_count: 15
        }
      )
    })
  })

  describe('Firebase連携テスト', () => {
    it('httpsCallableが正しいパラメータで呼び出される', async () => {
      const input: AdjustTextInput = {
        text: 'テストテキスト',
        count: 100
      }
      const expectedOutput: AdjustTextOutput = {
        text: '調整結果',
        state: 0,
        message: '成功'
      }

      mockHttpsCallable.mockResolvedValue({ data: expectedOutput })

      await adjustText(input)

      expect(mockHttpsCallable).toHaveBeenCalledTimes(1)
      expect(mockHttpsCallable).toHaveBeenCalledWith(input)
    })
  })
})