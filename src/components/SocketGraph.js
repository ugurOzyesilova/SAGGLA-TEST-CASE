import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import { TbRefresh } from "react-icons/tb"
import { AiOutlineExclamationCircle } from "react-icons/ai"

const SocketGraph = ({theme}) => {
    const [tradeData, setTradeData] = useState([]);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);
    const [chartWidth, setChartWidth] = useState(620);
    const [chartHeight, setChartHeight] = useState(280);

    const connectWebSocket = () => {
        const socket = new WebSocket('wss://stream-testnet.bybit.com/v5/public/linear');
        socket.onopen = () => {
            console.log('WebSocket opened');
            socket.send(JSON.stringify({ op: 'subscribe', args: ['publicTrade.BTCUSDT'] }));

            setTimeout(() => {
                socket.close(); 
                setIsWebSocketConnected(false);
            }, 10000); 
        };

        socket.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);
            if (data.topic === 'publicTrade.BTCUSDT') {
                setTradeData((prevData) => [
                    ...prevData,
                    { T: data.data[0].T, p: data.data[0].p },
                ]);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsWebSocketConnected(false);
        };

        socket.onclose = (event) => {
            console.log('WebSocket closed:', event);
            setIsWebSocketConnected(false);
        };
    };

    const handleRefresh = () => {
        setTradeData([]);
        setIsWebSocketConnected(true);
        connectWebSocket();
    };

    useEffect(() => {
        connectWebSocket();

    }, []);


    const chartData = tradeData
        .map((data) => ({
            time: new Date(data.T).toLocaleTimeString(),
            p: data.p,
        }))
        .filter((data, index, self) => {
         
            return self.findIndex((d) => d.time === data.time) === index;
        });

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            let newChartWidth = 620;
            let newChartHeight = 280;

            if (screenWidth <= 768) {
                newChartWidth = 400;
                newChartHeight = 200;
            }

            setChartWidth(newChartWidth);
            setChartHeight(newChartHeight);
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    return (
        <div className='Graph'>
            <div className='Graph__info-socket'>
                <h2>Socket Results<span>15 Seconds</span></h2>
                <TbRefresh className="Graph__info-socket-refresh" onClick={handleRefresh} />
            </div>

            {isWebSocketConnected ? (
                <p className='warning'>Collecting the last 15 seconds of data...</p>
            ) : (
                <div className='Graph__container'>
                    <LineChart width={chartWidth} height={chartHeight} data={chartData} className="Graph__line-chart">
                        <CartesianGrid strokeDasharray="5 5" />
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#efefef', fontSize: 14, dy: 15 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                        />
                        <YAxis
                            dataKey="p"
                            domain={["auto", "auto"]}

                            tick={{ fill: '#efefef', fontSize: 14 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                            interval={1}
                        />
                        <Tooltip />
                        <Line
                            connectNulls type="monotone"

                            dataKey="p"
                            stroke={theme === 'app-dark' ? '#ffc424' : '#efefef'}
                            strokeWidth={2}
                            dot={theme === 'app-dark' ? { r: 2, fill: 'yellow' } : { r: 2, fill: 'white' }} // Corrected dot syntax
                        />
                          
                    </LineChart>
                </div>
            )}
            {!isWebSocketConnected && <div className='warning'> <AiOutlineExclamationCircle className="warning-icon" /> <p>Data collection stopped.</p> </div>}
        </div>
    );
};
export default SocketGraph;


