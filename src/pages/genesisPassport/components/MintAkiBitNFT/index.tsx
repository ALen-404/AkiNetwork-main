import { connect, FormattedMessage, FormattedHTMLMessage } from "umi";
import { providers, Contract, utils } from 'ethers'
import "./index.less";
import task_icon1 from '@/assets/genesisPassport/task_icon1.svg'
import task_icon2 from '@/assets/genesisPassport/task_icon2.svg'
import task_icon3 from '@/assets/genesisPassport/task_icon3.svg'
// import checkIcon from '@/assets/check-icon.svg'
import akiTokenAbi from '@/assets/abi/akiToken.json'
import akiMintAbi from '@/assets/abi/akiMint.json'
import { useEffect, useMemo, useState } from "react";
import { notification, Spin } from 'antd';
import { getBRC20BalancesByAddress } from "@/services/http/api/mintApi";
import { getEvmAddress, switchEvmNeowork } from "@/services/okx";

const option = {
  shareTwitterLink: '',
  shareTwitterComment: `🪂First of many $AKI airdrops arrived!
✅Just found mine here: https://akiprotocol.io
🎁Check your share with Aki Network @aki_protocol

Discover its many utilities & spread the great news!
#AkiNetwork #Akichan #AkiAirdrop`,
  providerLink: 'https://rpc-mumbai.maticvigil.com', //https://polygon-rpc.com
  AkiTokenContract: '0x45F5889adD98fFF4B8cCC1362cA6894860467466', //'0x1A7e49125a6595588c9556f07a4c006461b24545',
  UsdtTokenContract: '0xB829F9F66B8D6750288996dc659813404033c310',
  AkiNftMintContract: '0x516CB90EeEC08affFEFcE5Aec049a932A3D1Ba98'
}

function MintAkiBitNFT({
  dispatch,
  address,
  loginStatus
}: any) {
  const [api, contextHolder] = notification.useNotification();

  const [mintLoading, setMintLoading] = useState(false)
  const [mintUSDTLoading, setMintUSDTLoading] = useState(false)
  const [evmAddress, setEvmAddress] = useState('')

  const [taskOneComplete, setTaskOneComplete] = useState(false)
  const [taskOneIsChecking, setTaskOneIsChecking] = useState(false)
  const [taskTwoComplete, setTaskTwoComplete] = useState(false)
  const [taskTwoIsChecking, setTaskTwoIsChecking] = useState(false)
  const [taskThreeComplete, setTaskThreeComplete] = useState(localStorage.getItem('taskThreeComplete') ?? false)

  const getBRC20BalancesByAddressFun = () => {
    setTaskOneIsChecking(true)
    getBRC20BalancesByAddress({ address }).then((res: any) => {
      console.log(res)
      if (res?.status === 200) {
        const data = res?.data?.results ?? []

        data?.forEach((brc20: any) => {
          if (['ordi', 'sats', 'rats'].includes(brc20?.ticker)) {
            setTaskOneComplete(true)
          }
        });
      }
      setTaskOneIsChecking(false)
    }).catch((err) => {
      console.error(err);
      setTaskOneIsChecking(false)
    })
  }

  const getAkiHoldFun = async () => {
    setTaskTwoIsChecking(true)
    await switchEvmNeowork()
    const EvmAddress = await getEvmAddress() as any
    if (!EvmAddress?.address) return
    const provider = new providers.JsonRpcProvider(option.providerLink)
    const contract = new Contract(
      option.AkiTokenContract,
      akiTokenAbi,
      provider
    )
    const result = await contract.balanceOf(EvmAddress?.address)
    const akiHoldNum = utils.formatEther(result)
    console.log(EvmAddress.address, akiHoldNum, 'akiHoldNum');

    if (parseFloat(akiHoldNum) >= 1500) {
      setTaskTwoComplete(true)
    }
    setTaskTwoIsChecking(false)

  }


  useEffect(()=>{
    setTaskOneComplete(false)
    setTaskTwoComplete(false)
    setTaskThreeComplete(false)
    // localStorage.setItem('taskThreeComplete','false')
  },[address])

  const twitterLinkFun = () => {
    if (taskThreeComplete) return
    window.open(
      `https://twitter.com/intent/tweet?&text=${encodeURIComponent(option.shareTwitterComment)
      } ${option.shareTwitterLink}`,
      "_black"
    )
    localStorage.setItem('taskThreeComplete', 'true')
    setTaskThreeComplete(true)
  }

  const mintNFTByAki = async () => {
    if (mintLoading) return
    setMintLoading(true)

    let point = 0
    if (taskOneComplete) point += 10
    if (taskTwoComplete) point += 5
    if (taskThreeComplete) point += 5

    if (point < 10) {
      setMintLoading(false)
      api.error({ message: 'Points do not meet the conditions!' })
      return
    }

    const approveNumber = utils.parseEther({ 10: '1500', 15: '600', 20: '200' }[point] ?? '1500')

    const provider = new providers.Web3Provider((window as any).okxwallet)

    const signer = provider.getSigner()
    const akiTokenContract = new Contract(
      option.AkiTokenContract,
      akiTokenAbi,
      signer
    )

    try {
      const approve = await akiTokenContract.approve(
        option.AkiNftMintContract,
        approveNumber
      )

      provider.waitForTransaction(approve.hash).then(async (receipt) => {
        console.log(receipt)

        const akiNftMintContract = new Contract(
          option.AkiNftMintContract,
          akiMintAbi,
          signer
        )
        try {
          const result = await akiNftMintContract.mintWithAKI(
            address,
            approveNumber
          )
          provider.waitForTransaction(result.hash)
            .then(async (receipt2) => {
              setMintLoading(false)
              api.success({ message: 'contract mint success!' })

              console.log(receipt2)
            }).catch((error) => {
              setMintLoading(false)
              api.warning({ message: 'contract mint fail' })

              console.log(error)
            })
        } catch (e) {
          setMintLoading(false)
          api.warning({ message: 'contract mint fail!' })

          console.log(e)
          return
        }

      }).catch((error) => {
        setMintLoading(false)
        api.warning({ message: 'contract approve fail' })

        console.log(error)
        return
      })
    } catch (e) {
      setMintLoading(false)
      api.warning({ message: 'contract approve fail!' })

      console.log(e)
      return
    }
  }

  const mintNFTByUSDT = async () => {
    if (mintUSDTLoading) return
    setMintUSDTLoading(true)

    const provider = new providers.Web3Provider((window as any).okxwallet)

    const signer = provider.getSigner()
    const UsdtTokenContract = new Contract(
      option.UsdtTokenContract,
      akiTokenAbi,
      signer
    )
    try {
      const approve = await UsdtTokenContract.approve(
        option.AkiNftMintContract,
        utils.parseUnits('200', 6)
      )
      provider.waitForTransaction(approve.hash).then(async (receipt) => {
        console.log(receipt)

        const akiNftMintContract = new Contract(
          option.AkiNftMintContract,
          akiMintAbi,
          signer
        )

        try {
          const result = await akiNftMintContract.mintWithUSDT(
            address
          )
          provider.waitForTransaction(result.hash).then(async (receipt2) => {
            setMintUSDTLoading(false)
            api.success({ message: 'contract mint success!' })

            console.log(receipt2)
          }).catch((error) => {
            setMintUSDTLoading(false)
            api.warning({ message: 'contract mint fail' })

            console.log(error)
          })
        } catch (e) {
          setMintUSDTLoading(false)
          api.warning({ message: 'contract mint fail!' })

          console.log(e)
          return
        }
      }).catch((error) => {
        setMintUSDTLoading(false)
        api.warning({ message: 'contract approve fail' })

        console.log(error)
        return
      })
    } catch (e) {
      setMintUSDTLoading(false)
      api.warning({ message: 'contract approve fail!' })

      console.log(e)
      return
    }
  }

  const checkOneTask = () => {
    if (!taskOneComplete&&!taskOneIsChecking && address && address?.startsWith('bc')) {
      getBRC20BalancesByAddressFun()
    }
  }

  const checkTwoTask = () => {
    if (!taskTwoComplete&&!taskTwoIsChecking) {
      getAkiHoldFun()
    }
  }

  return <>
    {contextHolder}
    <div className="mintAkiBitNFTBox">
      <div className="title">
        <FormattedMessage id="GenesisPassport.MintAkiBitNFT.title" />
      </div>
      <div className="content">
        <div className="taskBox">
          <div className="taskList">
            <div className="taskItemBox">
              <div className="taskTitleBox">
                <img className="taskIcon" src={task_icon1} />
                <div>
                  <div className="taskTitle">
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.1.title" />
                  </div>
                  <div className="taskTitlePoint">
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.10Pont" />
                  </div>
                </div>
                
              </div>
              {
                <div className="taskButton taskButtonPointer" data-complete={taskOneComplete} onClick={checkOneTask}>
                  {taskOneIsChecking && <Spin />}
                  {
                    taskOneComplete ? <>
                      +<FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.10Pont" />
                      {/* <img className="icon" src={checkIcon} /> */}
                    </> : <>
                      <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.check" />
                    </>
                  }
                </div>
              }
            </div>
            <div className="taskItemBox">
              <div className="taskTitleBox">
                <img className="taskIcon" src={task_icon2} />
                <div>
                  <div className="taskTitle">
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.2.title" />
                  </div>
                    <div className="taskTitlePoint">
                      <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.5Pont" />
                    </div>
                  </div>
                </div>
              {
                <div className="taskButton taskButtonPointer" data-complete={taskTwoComplete} onClick={checkTwoTask}>
                  {taskTwoIsChecking && <Spin />}
                  {
                    taskTwoComplete ? <>
                      +<FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.5Pont" />
                      {/* <img className="icon" src={checkIcon} /> */}
                    </> : <>
                      <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.check" />
                    </>
                  }
                </div>
              }
            </div>
            <div className="taskItemBox">
              <div className="taskTitleBox">
                <img className="taskIcon" src={task_icon3} />
                <div>
                  <div className="taskTitle">
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.3.title" />
                  </div>
                  <div className="taskTitlePoint">
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.5Pont" />
                  </div>
                </div>
              </div>
              <div className="taskButton taskButtonPointer" data-complete={taskThreeComplete} onClick={twitterLinkFun}>
                {
                  taskThreeComplete ? <>
                    +<FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.5Pont" />
                    {/* <img className="icon" src={checkIcon} /> */}
                  </> : <>
                    <FormattedMessage id="GenesisPassport.MintAkiBitNFT.task.share" />

                  </>
                }
              </div>
            </div>
          </div>
          <div className="pointTextBox">
            <div className="pointNumber">
              <div className="xy">
                {(taskOneComplete?10:0)+(taskTwoComplete?5:0)+(taskThreeComplete?5:0)}
              </div>
              <div className="pointText">
                <FormattedMessage id="GenesisPassport.MintAkiBitNFT.pointText.text" />
              </div>
            </div>
            <div className="pointUl">
              <div>
                <FormattedHTMLMessage id="GenesisPassport.MintAkiBitNFT.pointText.li.1" />
              </div>
              <div>
                <FormattedHTMLMessage id="GenesisPassport.MintAkiBitNFT.pointText.li.2" />
              </div>
              <div>
                <FormattedHTMLMessage id="GenesisPassport.MintAkiBitNFT.pointText.li.3" />
              </div>
            </div>
          </div>
        </div>

        <div className="payNFTBox">
          <div className="payNFTBoxNumber">
            200
          </div>
          <div className="payNFTBoxText">
            <FormattedMessage id="GenesisPassport.MintAkiBitNFT.payNFTBoxText" />
          </div>
          <div className="payNFTButtonList">
            <button onClick={mintNFTByAki} disabled={mintLoading}>
              {mintLoading && <Spin />}
              <FormattedHTMLMessage id="GenesisPassport.MintAkiBitNFT.payNFTByAki" />
            </button>
            <div className="textOr"><FormattedMessage id="GenesisPassport.MintAkiBitNFT.or"/></div>
            <button onClick={mintNFTByUSDT} disabled={mintUSDTLoading}>
              {mintUSDTLoading && <Spin />}
              <FormattedMessage id="GenesisPassport.MintAkiBitNFT.payNFTByUSDT" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default connect(({ props, aki }: any) => ({
  props,
  address: aki.address,
  loginStatus: aki.loginStatus
}))(MintAkiBitNFT);