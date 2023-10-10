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




/*



import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "../styles/SocketGraph.css"

const SocketGraph = () => {
    const [tradeData, setTradeData] = useState([]);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);
   

    // Public, do not need authentication for this process.

    const connectWebSocket = () => {
        const socket = new WebSocket('wss://stream-testnet.bybit.com/v5/public/linear');

        socket.onopen = () => {
            console.log('WebSocket opened');
            socket.send(JSON.stringify({ op: 'subscribe', args: ['publicTrade.BTCUSDT'] }));

            setTimeout(() => {
                socket.close(); // Close the WebSocket after a fixed duration (e.g., 30 seconds)
                setIsWebSocketConnected(false);
            }, 60000); // 30 seconds
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
            // Filter out data points with duplicate timestamps
            return self.findIndex((d) => d.time === data.time) === index;
        });

    const minP = Math.min(...chartData.map((data) => data.p));
    const maxP = Math.max(...chartData.map((data) => data.p));


    return (
        <div className='SocketGraph'>
            <button onClick={handleRefresh}>Refresh</button>
            <h1>Trade Data Chart</h1>
            {isWebSocketConnected ? (
                <p>Collecting the last 30 seconds of data...</p>
            ) : (
                    <LineChart width={700} height={400} data={chartData} className="chart-container">
                        <XAxis dataKey="time"
                            tick={{ fill: 'white', fontSize: 14, dy:15   }}
                            tickLine={{ stroke: 'white' }}
                            axisLine={{ stroke: 'white' }} // Change X-axis line color
                            

                        />
                        <YAxis dataKey="p"
                            domain={[minP, maxP]}
                            tick={{
                                fill: 'white', fontSize: 14, dx: -15  }}
                            tickLine={{ stroke: 'white' }}
                            axisLine={{ stroke: 'white' }} // Change Y-axis line color
                            
                            interval={1}
                            
                        />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="p"
                            stroke="#ffc424"
                            strokeWidth={2}
                            dot={{ r: 4, fill: 'yellow' }}
                           
                        />
                      
                    </LineChart>

            )}
            {!isWebSocketConnected && <div><p>Data collection stopped. Subscribe for live data.</p> 
            <button>Subscribe</button></div>}
        </div>
    );
};
export default SocketGraph;



*/

/*



import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import "../styles/SocketGraph.css"

const SocketGraph = () => {
    const [tradeData, setTradeData] = useState([]);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

   

    // Public, do not need authentication for this process.

    const connectWebSocket = () => {
        const socket = new WebSocket('wss://stream-testnet.bybit.com/v5/public/linear');

        socket.onopen = () => {
            console.log('WebSocket opened');
            socket.send(JSON.stringify({ op: 'subscribe', args: ['publicTrade.BTCUSDT'] }));

            setTimeout(() => {
                socket.close(); // Close the WebSocket after a fixed duration (e.g., 30 seconds)
                setIsWebSocketConnected(false);
            }, 10000); // 30 seconds
        };

        socket.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);
            if (data.topic === 'publicTrade.BTCUSDT') {
                const newPrice = data.data[0].p;
                setTradeData((prevData) => [
                    ...prevData,
                    { T: data.data[0].T, p: newPrice },
                ]);

                if (newPrice < minPrice) {
                    setMinPrice(newPrice);
                }

                if (newPrice > maxPrice) {
                    setMaxPrice(newPrice);      
                }
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
            // Filter out data points with duplicate timestamps
            return self.findIndex((d) => d.time === data.time) === index;
        });


    return (
        <div className='SocketGraph'>
            <button onClick={handleRefresh}>Refresh</button>
            <h1>Trade Data Chart</h1>
            {isWebSocketConnected ? (
                <p>Collecting the last 30 seconds of data...</p>
            ) : (
                <LineChart width={700} height={400} data={chartData} className="chart-container">
                    <XAxis dataKey="time"
                        tick={{ fill: 'white', fontSize: 14, dy: 15 }}
                        tickLine={{ stroke: 'white' }}
                        axisLine={{ stroke: 'white' }}
                    />
                    <YAxis
                            dataKey="p"
                            domain={[minPrice, maxPrice]}
                            ticks={[minPrice, maxPrice]} // Set ticks to an array with minPrice and maxPrice
                            tick={{ fill: 'white', fontSize: 14, dx: -15 }}
                            tickLine={{ stroke: 'white' }}
                            axisLine={{ stroke: 'white' }}
                            interval={1}
                    />
                    <Tooltip />
                    
                    <Line
                        type="monotone"
                        dataKey="p"
                        stroke="#ffc424"
                        strokeWidth={2}
                        dot={{ r: 4, fill: 'yellow' }}
                    />
                </LineChart>
            )}
            {!isWebSocketConnected && <div><p>Data collection stopped. Subscribe for live data.</p>
                <button>Subscribe</button></div>}
        </div>
    );
};
export default SocketGraph;

*/

/*
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TbRefresh } from "react-icons/tb"
import { AiOutlineExclamationCircle } from "react-icons/ai"

const SocketGraph = () => {
    const [tradeData, setTradeData] = useState([]);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(true);



    // Public, do not need authentication for this process.

    const connectWebSocket = () => {
        const socket = new WebSocket('wss://stream-testnet.bybit.com/v5/public/linear');

        socket.onopen = () => {
            console.log('WebSocket opened');
            socket.send(JSON.stringify({ op: 'subscribe', args: ['publicTrade.BTCUSDT'] }));

            setTimeout(() => {
                socket.close(); // Close the WebSocket after a fixed duration (e.g., 30 seconds)
                setIsWebSocketConnected(false);
            }, 10000); // 30 seconds
        };

        socket.onmessage = (event) => {
            console.log('WebSocket message received:', event.data);
            const data = JSON.parse(event.data);
            if (data.topic === 'publicTrade.BTCUSDT') {
                const newPrice = parseFloat(data.data[0].p); // Parse the price as a float

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


    const minPrice = Math.min(...tradeData.map(data => data.price));
    const maxPrice = Math.max(...tradeData.map(data => data.price));

    const chartData = tradeData
        .map((data) => ({
            time: new Date(data.T).toLocaleTimeString(),
            p: data.p,
        }))
        .filter((data, index, self) => {
            // Filter out data points with duplicate timestamps
            return self.findIndex((d) => d.time === data.time) === index;
        });


    return (
        <div className='Graph'>
            <div className='Graph__info-socket'>
                <h2>Socket Results</h2>
                <TbRefresh className="Graph__info-socket-refresh" onClick={handleRefresh} />
            </div>

            {isWebSocketConnected ? (
                <p className='warning'>Collecting the last 30 seconds of data...</p>
            ) : (
                <div className='Graph__container'>
                        <LineChart width={620} height={280} data={chartData} className="Graph__line-chart">
                        <XAxis
                            dataKey="time"
                            tick={{ fill: '#efefef', fontSize: 14, dy: 15 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                        />
                        <YAxis
                            dataKey="p"
                            domain={[minPrice, maxPrice]}

                            tick={{ fill: '#efefef', fontSize: 14 }}
                            tickLine={{ stroke: 'gray', strokeWidth: 2 }}
                            axisLine={{ stroke: 'gray', strokeWidth: 2 }}
                            interval={1}
                        />
                        <Tooltip />

                        <Line
                            connectNulls type="monotone"
                            type="monotone"
                            dataKey="p"
                            stroke="#ffc424"
                            strokeWidth={2}
                            dot={{ r: 2, fill: 'yellow' }}
                        />
                    </LineChart>
                </div>

            )}
            {!isWebSocketConnected && <div className='warning'> <AiOutlineExclamationCircle className="warning-icon" /> <p>Data collection stopped. Open Live Data.</p> </div>}
        </div>
    );
};
export default SocketGraph;

*/