
import { useState } from 'react';
import { ConnectWallet, Web3Provider, useweb3Context, useConnectCalls, TxModal, TxModelProp } from '../web3';
import './main.scss';
import { Row, Col, Container, Button } from "react-bootstrap";

import { LoopCZF, LoopModal, PoolProps, CZActionProps, FastForwardModal } from './loopCZF';
import { ChronoPools, ExoticFarms, PoolsProvider } from '../pools';
import { IAsyncResult, ShowError } from '../utils';

import { ChronoPoolService } from '../../typechain/ChronoPoolService';
import ChronoPoolService_JSON from '../../typechain/ChronoPoolService.json';

import { ExoticMaster } from '../../typechain/ExoticMaster';
import ExoticMaster_JSON from '../../typechain/ExoticMaster.json';


import { CZFarm } from '../../typechain/CZFarm';
import CZFarm_JSON from '../../typechain/CZFarm.json';

import CZFView from './czfView';

export default function MainContent() {
    //const web3Ctx = useweb3Context();
    const [loopAction, setLoopAction] = useState<CZActionProps>();

    const { connect, invalidDateBalance } = useConnectCalls();
    const [sumbitted, setSubmitted] = useState<IAsyncResult<TxModelProp>>();

    const [showFFwarning, setShowFFwarning] = useState(true);

    const onCZAction = (p: CZActionProps) => {
        setLoopAction(p);

        (async () => {

            try {

                switch (p.type) {

                    case 'ff75-lp':
                    case 'ff75-lp-confirmed':
                        {
                            if ('ff75-lp' == p.type && showFFwarning) {
                                break;
                            }

                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const exoticMaster: ExoticMaster = new web3.eth.Contract(ExoticMaster_JSON.abi as any, chainInfo.contracts.exoticMaster) as any;

                            const tx = await exoticMaster.methods.claimAndFastForward(p.pId).send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;

                    case 'ff75':
                    case 'ff75Confirmed':
                        {
                            if ('ff75' == p.type && showFFwarning) {
                                break;
                            }

                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const chronoPoolService: ChronoPoolService = new web3.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                            const tx = await chronoPoolService.methods.claimAndFastForward(p.pId).send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;


                    case 'harvestCZF-lp':
                        {
                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const exoticMaster: ExoticMaster = new web3.eth.Contract(ExoticMaster_JSON.abi as any, chainInfo.contracts.exoticMaster) as any;

                            const tx = await exoticMaster.methods.claimFarm(p.pId).send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;

                    case 'buyCZF':
                        window.open('https://app.1inch.io/#/56/swap/BNB/0x7c1608C004F20c3520f70b924E2BfeF092dA0043');
                        break;


                    case 'harvestAll':
                        {
                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const chronoPoolService: ChronoPoolService = new web3.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                            const tx = await chronoPoolService.methods.claimAll().send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;
                    case 'harvestCZF':
                        {
                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const chronoPoolService: ChronoPoolService = new web3.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                            const tx = await chronoPoolService.methods.claimPool(p.pId).send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;

                    case 'reloopCZF':
                        {
                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();
                            const chronoPoolService: ChronoPoolService = new web3.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;

                            const tx = await chronoPoolService.methods.reinvest(p.pId).send({
                                from: account
                            });

                            setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                        }
                        break;

                    case 'approveLP': {
                        setSubmitted({ isLoading: true });
                        const { web3, chainInfo, account } = await connect();

                        const bep20: CZFarm = new web3.eth.Contract(CZFarm_JSON.abi as any, p.exoticLp) as any;

                        //we are approving the max amount
                        const tx = await bep20.methods.approve(chainInfo.contracts.exoticMaster, 
                            '115792089237316195423570985008687907853269984665640564039457584007913129639935').send({
                            from: account
                        });

                        setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                    }
                        break;

                    case 'depositLP': {
                        setSubmitted({ isLoading: true });
                        const { web3, chainInfo, account } = await connect();

                        const exoticMaster: ExoticMaster = new web3.eth.Contract(ExoticMaster_JSON.abi as any, chainInfo.contracts.exoticMaster) as any;

                        /*
                        const tx = await exoticMaster.methods.deposit(p.pId, web3.utils.toWei(p.amountEth, 'ether')).send({
                            from: account
                        });*/

                        console.log(`depositing :${p.amount_Wei}`);
                        const tx = await exoticMaster.methods.deposit(p.pId, p.amount_Wei).send({
                            from: account
                        });

                        setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                    }
                        break;
                    case 'loopCZFConfirmed':
                        {
                            setSubmitted({ isLoading: true });
                            const { web3, chainInfo, account } = await connect();


                            if (undefined === p.percentage && undefined === p.amountEth) {
                                throw new Error('amount or percentage is required');
                            }



                            if (!!p.exotic) {

                                if (undefined === p.percentage) {
                                    throw new Error('percentage is required');
                                }

                                let depositAmount = p.exotic.lpBalance_Wei;

                                if (p.percentage <= 99.9) {
                                    const wadEther = (p.exotic.lpBalance_eth * p.percentage / 100.0);
                                    depositAmount = web3.utils.toWei(wadEther.toString(), 'ether');
                                }

                                const bep20: CZFarm = new web3.eth.Contract(CZFarm_JSON.abi as any, p.exotic.lp) as any;

                                const tx = await bep20.methods.approve(chainInfo.contracts.exoticMaster, depositAmount).send({
                                    from: account
                                });


                                setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                            } else {
                                let wad_wei: string;

                                if (undefined !== p.percentage) {

                                    const czFarm: CZFarm = new web3.eth.Contract(CZFarm_JSON.abi as any, chainInfo.contracts.czFarm) as any;
                                    const currBalance_Wei = await czFarm.methods.balanceOf(account).call();

                                    if (p.percentage >= 99.9) {
                                        wad_wei = currBalance_Wei;
                                    } else {
                                        let wad = Number.parseFloat(web3.utils.fromWei(currBalance_Wei));
                                        if (0 == wad) {
                                            throw new Error('There is no CZF balance');
                                        }

                                        console.debug(`CZF Balance is ${currBalance_Wei} wei -> ${wad}`);
                                        wad = (wad * p.percentage / 100.0);

                                        wad_wei = web3.utils.toWei(wad.toString(), 'ether');
                                    }

                                } else {
                                    if (!p.amountEth) {
                                        throw new Error('amount is required');
                                    }
                                    wad_wei = web3.utils.toWei(p.amountEth, 'ether');
                                }

                                const chronoPoolService: ChronoPoolService = new web3.eth.Contract(ChronoPoolService_JSON.abi as any, chainInfo.contracts.chronoPoolService) as any;
                                const tx = await chronoPoolService.methods.deposit(p.pId, wad_wei).send({
                                    from: account
                                });

                                setSubmitted({ result: { txHash: tx.transactionHash, chainInfo } });

                            }


                        }
                        break;
                }

                invalidDateBalance();



            } catch (error: any) {
                setSubmitted({ error });
            }



        })();
    }

    return <PoolsProvider><Container className="mainContent">

        {sumbitted && <TxModal txResult={sumbitted} onClose={() => setSubmitted(undefined)} />}

        {loopAction?.type == 'loopCZF' && <LoopModal
            onClose={() => setLoopAction(undefined)}
            onConfirm={percentage => onCZAction({
                type: 'loopCZFConfirmed',
                percentage,
                pId: loopAction.pId,
                exotic: loopAction.exotic,

            })}
        />}

        {loopAction?.type == 'ff75' && showFFwarning && <FastForwardModal
            percentage={loopAction.percentage}
            onClose={() => setLoopAction(undefined)}
            onConfirm={(showff) => {
                setShowFFwarning(showff);
                onCZAction({ type: 'ff75Confirmed', pId: loopAction.pId });
            }}
        />}

        {loopAction?.type == 'ff75-lp' && showFFwarning && <FastForwardModal
            percentage={loopAction.percentage}
            onClose={() => setLoopAction(undefined)}
            onConfirm={(showff) => {
                setShowFFwarning(showff);
                onCZAction({ type: 'ff75-lp-confirmed', pId: loopAction.pId });
            }}
        />}

        <CZFView />

        <Row className="gap-3 my-5">
            <Col md className="high-yield-left"></Col>
            <Col md>
                <div>
                    <h3 className="mb-3">Loop CZF For High Yield</h3>
                    <LoopCZF {...{ onCZAction }} />
                </div>
            </Col>
        </Row>

        <Row className="gap-3 my-5">
            <Col md >
                <h5>How to Play</h5>
                <p>
                    The Chrono Farmer Loops CZF with his Time Machine. <br />
                    The Farmer is more powerful and earns CZF every second. <br />
                    Does he Harvest his CZF, or re-Loop it? You decide. <br />
                    Or perhaps he becomes impatient, and orders the Machine to Fast Forward. <br />
                    If he Fast Forwards, he must make a great sacrifice.
                </p>

                <div className="d-flex flex-row gap-1 social-how">
                    <Button variant='link' onClick={() => window.open('https://czodiac.gitbook.io/czodiac-litepapper/')}>
                        <div className="icon-how btn-how-copy"></div>
                    </Button>
                    <Button variant='link' onClick={() => window.open('https://t.me/CZodiacofficial')}>
                        <div className="icon-how btn-how-tele"></div>
                    </Button>
                    <Button variant='link' onClick={() => window.open('https://discord.gg/FEpu3xF2Hb')}>
                        <div className="icon-how btn-how-discord"></div>
                    </Button>
                </div>
            </Col>

            <Col md>
                <h5>Security</h5>
                <p>
                    The Contracts for CZF are scanned by automated testing bots to seek and destroy bugs. These automatic scripts protect the inner workings of the Time Machine for the safety of the Chrono Farmer.<br />
                    You can view the code on <a target="_blank" href="https://github.com/chinese-zodiac/czodiac">Github here</a>.<br />
                    The Contracts are audited by <a target="_blank" href="https://audits.finance/Audits/CZFarmAudit.pdf">audits.finance here</a>.<br />
                    You may view the verified source code on <a target="_blank" href="https://bscscan.com/token/0x7c1608C004F20c3520f70b924E2BfeF092dA0043">BSCscan here</a>.
                </p>
            </Col>
        </Row>

        <ChronoPools onCZAction={onCZAction} />

        <div className="my-5"></div>

        <ExoticFarms onCZAction={onCZAction} />

    </Container></PoolsProvider>;

}
