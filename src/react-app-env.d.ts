/// <reference types="react-scripts" />
interface Window {
  ethereum?: {
    isMetaMask: true
    providers: any[]
    chainId: string
    autoRefreshOnNetworkChange: boolean
    request: (...args: any[]) => Promise<any>
    sendAsync: (...args: any) => Promise<any>
    enable: () => Promise
    on: (name: string, callback: (...args: any[]) => void) => void
    removeListener: (...args: any[]) => void | undefined
  }
}