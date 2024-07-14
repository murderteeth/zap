import { useWriteContract as _useWriteContract } from 'wagmi'

export function useWriteContract() {
  const write = _useWriteContract({
		mutation: {
			onError(error) {

			},
			onSuccess(hash) {
        // confirming..
			}
    }
  })
  return { write }
}
